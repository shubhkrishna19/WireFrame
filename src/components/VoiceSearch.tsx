import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onSearch,
  placeholder = "Search for products...",
  className = ""
}) => {
  const { theme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN'; // Indian English

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          onSearch(transcript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSearch, transcript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return null; // Don't show voice search if not supported
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border-2 rounded-creative text-lg"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.borderPrimary,
            color: theme.colors.textPrimary,
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && transcript.trim()) {
              onSearch(transcript.trim());
            }
          }}
        />

        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-3 border-2 rounded-creative transition-all duration-300 ${
            isListening
              ? 'animate-pulse border-red-500 bg-red-500'
              : 'hover:scale-105 border-gray-300 hover:border-gray-400'
          }`}
          style={{
            backgroundColor: isListening ? '#EF4444' : theme.colors.backgroundSecondary,
            borderColor: isListening ? '#EF4444' : theme.colors.borderPrimary,
          }}
          title={isListening ? 'Stop listening' : 'Start voice search'}
          aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
        >
          {isListening ? (
            <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" style={{ color: theme.colors.textPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {transcript && (
          <button
            onClick={() => onSearch(transcript.trim())}
            className="px-6 py-3 font-semibold rounded-creative transition-all hover:scale-105"
            style={{
              backgroundColor: theme.colors.buttonPrimary,
              color: '#FFFFFF',
            }}
          >
            Search
          </button>
        )}
      </div>

      {/* Voice Search Status */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 border-2 rounded-creative z-10"
             style={{
               backgroundColor: theme.colors.cardBackground,
               borderColor: theme.colors.borderPrimary,
             }}>
          <div className="flex items-center gap-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
              Listening... Speak now or click the microphone to stop
            </span>
          </div>
        </div>
      )}

      {/* Voice Search Instructions */}
      {!isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 border-2 rounded-creative opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
             style={{
               backgroundColor: theme.colors.cardBackground,
               borderColor: theme.colors.borderPrimary,
             }}>
          <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
            💡 Try voice search: "Show me black t-shirts" or "Find running shoes under 5000 rupees"
          </p>
        </div>
      )}
    </div>
  );
};
