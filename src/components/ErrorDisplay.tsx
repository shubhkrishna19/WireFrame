import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AppError } from '../utils/errorHandler';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
  title?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  title = 'Error',
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="border-2 rounded-creative p-6 mb-6"
      style={{
        backgroundColor: '#EF444420',
        borderColor: '#EF4444',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: '#EF4444' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: '#EF4444' }}
          >
            {title}
          </h3>
          <p
            className="text-sm mb-4"
            style={{ color: theme.colors.textPrimary }}
          >
            {error.message}
          </p>
          {error.code && (
            <p
              className="text-xs mb-4 font-mono"
              style={{ color: theme.colors.textTertiary }}
            >
              Error Code: {error.code}
            </p>
          )}
          <div className="flex gap-3">
            {error.retryable && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all"
                style={{
                  backgroundColor: theme.colors.buttonPrimary,
                  color: '#FFFFFF',
                  borderColor: theme.colors.buttonPrimary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.buttonHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.buttonPrimary;
                }}
              >
                Retry
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all"
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.borderPrimary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

