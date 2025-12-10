import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SocialProofBadgeProps {
  type: 'recent' | 'popular' | 'trending' | 'limited';
  text?: string;
  count?: number;
}

export const SocialProofBadge: React.FC<SocialProofBadgeProps> = ({ 
  type, 
  text,
  count 
}) => {
  const { theme } = useTheme();

  const badgeConfig = {
    recent: {
      text: text || 'Recently Viewed',
      icon: '👁️',
      color: theme.colors.buttonPrimary,
    },
    popular: {
      text: text || `Bought by ${count || 1000}+ people`,
      icon: '🔥',
      color: '#EF4444',
    },
    trending: {
      text: text || 'Trending Now',
      icon: '📈',
      color: '#10B981',
    },
    limited: {
      text: text || 'Limited Stock',
      icon: '⚡',
      color: '#F59E0B',
    },
  };

  const config = badgeConfig[type];

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-creative font-semibold text-sm shadow-md"
      style={{
        backgroundColor: `${config.color}15`,
        border: `2px solid ${config.color}`,
        color: config.color,
      }}
    >
      <span>{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
};

