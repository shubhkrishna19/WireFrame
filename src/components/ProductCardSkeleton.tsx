import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ProductCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-creative overflow-hidden shadow-card animate-pulse-slow relative"
      style={{
        backgroundColor: theme.colors.cardBackground,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: theme.colors.borderPrimary,
      }}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer-overlay pointer-events-none" />

      {/* Image skeleton */}
      <div
        className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
        style={{ backgroundColor: theme.colors.backgroundSecondary }}
      />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"
          style={{ backgroundColor: theme.colors.backgroundSecondary }}
        />

        {/* Price */}
        <div
          className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
          style={{ backgroundColor: theme.colors.backgroundSecondary }}
        />

        {/* Rating */}
        <div className="flex gap-2">
          <div
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"
            style={{ backgroundColor: theme.colors.backgroundSecondary }}
          />
          <div
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-12"
            style={{ backgroundColor: theme.colors.backgroundSecondary }}
          />
        </div>

        {/* Button */}
        <div
          className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-creative"
          style={{ backgroundColor: theme.colors.backgroundSecondary }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .shimmer-overlay {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

