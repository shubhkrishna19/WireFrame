import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { mockProducts } from '../data/mockData';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: any[];
}

interface UserPreferences {
  style: string[];
  colors: string[];
  occasions: string[];
  budget: string;
  bodyType?: string;
}

export const StylingAssistant: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: "👋 Hi! I'm your personal styling assistant. I can help you find the perfect outfit, answer styling questions, and recommend products from our collection. What are you looking for today?",
      timestamp: new Date(),
      suggestions: [
        "Recommend an outfit for a date",
        "What goes well with blue jeans?",
        "Help me style this t-shirt",
        "Show me sustainable options"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    style: [],
    colors: [],
    occasions: [],
    budget: 'medium'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateResponse = async (userMessage: string): Promise<Message> => {
    const message = userMessage.toLowerCase();

    // Analyze user preferences from message
    const newPreferences = { ...userPreferences };

    // Style detection
    if (message.includes('casual') || message.includes('everyday')) {
      newPreferences.style.push('casual');
    }
    if (message.includes('formal') || message.includes('business') || message.includes('office')) {
      newPreferences.style.push('formal');
    }
    if (message.includes('street') || message.includes('urban')) {
      newPreferences.style.push('street');
    }

    // Occasion detection
    if (message.includes('date') || message.includes('dinner')) {
      newPreferences.occasions.push('date');
    }
    if (message.includes('party') || message.includes('night out')) {
      newPreferences.occasions.push('party');
    }
    if (message.includes('work') || message.includes('office')) {
      newPreferences.occasions.push('work');
    }

    // Color preferences
    const colors = ['black', 'white', 'blue', 'red', 'green', 'gray', 'navy', 'brown'];
    colors.forEach(color => {
      if (message.includes(color)) {
        newPreferences.colors.push(color);
      }
    });

    setUserPreferences(newPreferences);

    // Generate contextual response
    let response = '';
    let suggestions: string[] = [];
    let products: any[] = [];

    if (message.includes('outfit') || message.includes('recommend')) {
      if (message.includes('date')) {
        response = "For a romantic date night, I'd recommend our Premium Merino Wool T-Shirt paired with slim-fit jeans. The merino wool is breathable and luxurious, perfect for making a great impression. Add our leather sneakers for a sophisticated yet comfortable look.";
        products = mockProducts.filter(p =>
          p.name.includes('Merino') ||
          p.name.includes('Slim Fit') ||
          p.name.includes('Leather')
        ).slice(0, 3);
        suggestions = ["Show me more date outfits", "What accessories would match?", "Any sustainable options?"];
      } else if (message.includes('casual')) {
        response = "For a casual everyday look, our Bamboo Cotton T-Shirt with relaxed cargo pants creates the perfect balance of comfort and style. The bamboo fabric is incredibly soft and sustainable.";
        products = mockProducts.filter(p =>
          p.name.includes('Bamboo') ||
          p.name.includes('Cargo') ||
          p.name.includes('Canvas')
        ).slice(0, 3);
        suggestions = ["Show me athletic options", "What about hoodies?", "Sustainable materials only"];
      } else {
        response = "I'd love to help you create the perfect outfit! Could you tell me more about the occasion or your style preferences? For example: 'casual Friday', 'date night', 'business meeting', or 'weekend outing'?";
        suggestions = ["Casual everyday wear", "Date night outfit", "Office appropriate", "Street style"];
      }
    } else if (message.includes('color') || message.includes('match')) {
      if (message.includes('blue') || message.includes('jeans')) {
        response = "Blue jeans are incredibly versatile! They pair beautifully with:\n\n• White or light-colored t-shirts for a clean, classic look\n• Gray or navy hoodies for a cool, urban vibe\n• White sneakers for casual comfort\n• Brown leather shoes for a more polished appearance\n\nOur denim collection features premium stretch fabric for all-day comfort.";
        products = mockProducts.filter(p =>
          p.name.includes('Jeans') ||
          p.name.includes('T-Shirt') ||
          p.name.includes('Hoodie')
        ).slice(0, 4);
        suggestions = ["Show me denim outfits", "What tops match jeans?", "Sustainable denim options"];
      } else {
        response = "Color matching is all about balance and contrast! Here are some general rules:\n\n• Monochromatic: Stick to shades of the same color family\n• Complementary: Pair opposite colors on the color wheel\n• Neutral base: White, black, gray, navy work with everything\n• Earth tones: Beige, olive, brown create natural harmony\n\nWhat colors are you working with?";
        suggestions = ["Help with color theory", "Show monochromatic outfits", "Earth tone combinations"];
      }
    } else if (message.includes('sustainable') || message.includes('eco')) {
      response = "🌱 I'm passionate about sustainable fashion! Our eco-friendly collection features:\n\n• Bamboo Cotton blends (ultra-soft, biodegradable)\n• Organic Merino Wool (renewable, naturally antimicrobial)\n• Recycled materials in select pieces\n• Fair trade certified production\n\nAll our products are made with the planet in mind, using water-saving dyes and low-impact manufacturing.";
      products = mockProducts.filter(p =>
        p.name.includes('Bamboo') ||
        p.name.includes('Merino') ||
        p.tags.includes('Eco-Friendly') ||
        p.tags.includes('Sustainable')
      ).slice(0, 4);
      suggestions = ["Show me bamboo products", "Organic wool collection", "Fair trade items"];
    } else if (message.includes('size') || message.includes('fit')) {
      response = "Great question about sizing! We offer:\n\n• Regular Fit: Classic, comfortable sizing\n• Slim Fit: Modern, tailored look\n• Oversized: Relaxed, trendy style\n• Athletic Fit: Performance-oriented\n\nOur AI size recommendation tool can analyze your measurements for personalized suggestions. Would you like me to guide you through that?";
      suggestions = ["Use size recommendation tool", "Explain fit types", "Help with measurements"];
    } else if (message.includes('help') || message.includes('what can you do')) {
      response = "I'm here to help with:\n\n🎨 **Styling Advice**: Outfit recommendations, color matching, occasion-appropriate looks\n\n🛍️ **Product Recommendations**: Find items from our collection that match your style\n\n📏 **Size & Fit Guidance**: Help with sizing, measurements, and our AI recommendation tool\n\n🌱 **Sustainable Fashion**: Eco-friendly options and sustainable material education\n\n💬 **General Fashion Chat**: Answer questions about trends, care instructions, and styling tips\n\nWhat would you like to explore?";
      suggestions = ["Styling recommendations", "Product search help", "Size and fit advice", "Sustainable options"];
    } else {
      // Generic response with contextual suggestions
      response = "That's an interesting question! While I'm focused on fashion and styling, I can definitely help you find the perfect pieces from our collection. Would you like recommendations for:\n\n• Casual everyday wear\n• Date night outfits\n• Office appropriate attire\n• Street style looks\n\nOr tell me more about what you're looking for!";
      suggestions = ["Casual recommendations", "Date outfits", "Office wear", "Street style"];
    }

    return {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions,
      products
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(async () => {
      const response = await generateResponse(inputValue);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  };

  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(async () => {
      const response = await generateResponse(suggestion);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
          boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 0 4px ${theme.colors.cardBackground}`,
        }}
        aria-label="Open styling assistant"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl border-2 overflow-hidden"
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.borderPrimary,
            boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${theme.colors.borderPrimary}`,
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b-2 flex items-center justify-between"
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderPrimary,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.colors.buttonPrimary }}
                aria-label="Styling assistant avatar"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3
                  className="font-bold text-lg"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Style Assistant
                </h3>
                <p
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Your fashion advisor
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:opacity-80 transition-opacity"
              style={{ color: theme.colors.textSecondary }}
              aria-label="Close styling assistant"
              title="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[450px]">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'rounded-br-md'
                      : 'rounded-bl-md'
                  }`}
                  style={{
                    backgroundColor: message.type === 'user'
                      ? theme.colors.buttonPrimary
                      : theme.colors.backgroundSecondary,
                    color: message.type === 'user'
                      ? '#FFFFFF'
                      : theme.colors.textPrimary,
                  }}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>

                  {/* Product Recommendations */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold opacity-80">Recommended Products:</p>
                      {message.products.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: theme.colors.cardBackground }}
                          onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                        >
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{product.name}</p>
                            <p className="text-xs opacity-70">₹{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs px-3 py-1 rounded-full transition-all hover:scale-105"
                          style={{
                            backgroundColor: message.type === 'user'
                              ? 'rgba(255,255,255,0.2)'
                              : theme.colors.backgroundTertiary,
                            color: message.type === 'user'
                              ? '#FFFFFF'
                              : theme.colors.textSecondary,
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]"
                  style={{ backgroundColor: theme.colors.backgroundSecondary }}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs ml-2" style={{ color: theme.colors.textSecondary }}>
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="p-4 border-t-2"
            style={{ borderColor: theme.colors.borderPrimary }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about styling, outfits, or products..."
                className="flex-1 px-4 py-3 rounded-2xl border-2 text-sm"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-6 py-3 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                style={{
                  backgroundColor: theme.colors.buttonPrimary,
                  color: '#FFFFFF',
                }}
                aria-label="Send message"
                title="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
