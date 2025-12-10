import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { analytics } from '../utils/analytics';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { toggleMode, isDark, theme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={() => {
        analytics.buttonClick('Theme Toggle', 'Theme Toggle');
        toggleMode();
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-neutral-700 rounded-creative shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group`}
      style={{
        backgroundColor: theme.colors.cardBackground,
        borderColor: theme.colors.borderPrimary,
      }}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <svg 
          className={`${iconSizes[size]} transition-transform group-hover:rotate-180`}
          style={{ color: theme.colors.stateWarning }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg 
          className={`${iconSizes[size]} transition-transform group-hover:rotate-180`}
          style={{ color: theme.colors.textPrimary }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};


