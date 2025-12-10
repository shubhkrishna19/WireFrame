import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <Link
      to="/"
      className={`flex items-center gap-2 group ${className}`}
    >
      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <h1
            className={`
              ${sizeClasses[size]} 
              font-black 
              tracking-wide
              leading-none
              transition-all duration-300
              text-blue-600
            `}
            style={{
              fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            BLUEWUD
          </h1>
          {showTagline && (
            <p
              className={`${taglineSizes[size]} mt-0.5 leading-tight`}
              style={{
                color: '#2C2C2C',
                fontFamily: '"Dancing Script", "Brush Script MT", cursive',
                fontStyle: 'italic',
                letterSpacing: '0.03em',
              }}
            >
              every home's a story
            </p>
          )}
        </div>
      )}
    </Link>
  );
};
