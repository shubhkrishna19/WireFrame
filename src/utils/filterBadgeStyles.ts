import type { ThemeColors } from '../contexts/ThemeContext';

/**
 * Helper function to generate consistent filter badge styles
 * Returns style object and hover handlers for filter badges
 */
export const getFilterBadgeStyle = (
  theme: { colors: ThemeColors },
  colorKey: 'brandPrimary' | 'brandSecondary' | 'stateSuccess' | 'brandDark' | 'accentWarm' | 'accentCool' | 'stateWarning'
) => {
  const color = theme.colors[colorKey];

  return {
    style: {
      background: `linear-gradient(135deg, ${color}33 0%, ${color}1A 100%)`,
      color: color,
      borderColor: `${color}66`,
    } as React.CSSProperties,
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = `linear-gradient(135deg, ${color}4D 0%, ${color}33 100%)`;
      e.currentTarget.style.borderColor = `${color}99`;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = `linear-gradient(135deg, ${color}33 0%, ${color}1A 100%)`;
      e.currentTarget.style.borderColor = `${color}66`;
    },
  };
};

