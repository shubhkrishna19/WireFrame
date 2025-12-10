import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeColors {
  // Background Colors
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // Accent Colors
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;

  // Border Colors
  borderPrimary: string;
  borderSecondary: string;

  // Card/Container Colors
  cardBackground: string;
  cardBorder: string;

  // Button Colors
  buttonPrimary: string;
  buttonSecondary: string;
  buttonHover: string;

  // Core Brand Colors (Legacy & New)
  primary: string;        // Added for compatibility (Mapped to brandPrimary)

  // Furniture/Brand Colors
  brandPrimary: string;   // Was: brandPrimary (Main Brand)
  brandSecondary: string; // Was: brandSecondary (Secondary Brand)
  brandDark: string;      // Was: brandDark (Deep contrast)

  // State/Functional Colors
  stateSuccess: string;   // Was: stateSuccess
  stateWarning: string;   // Was: stateWarning

  // Furniture Accents
  accentWarm: string;     // Was: accentWarm (Wood tones)
  accentCool: string;     // Was: accentCool (Modern accents)
}

export interface Theme {
  name: string;
  mode: 'light' | 'dark';
  colors: ThemeColors;
}

const DEFAULT_DARK_THEME: Theme = {
  name: 'Dark',
  mode: 'dark',
  colors: {
    backgroundPrimary: '#0F1419',
    backgroundSecondary: '#1A2332',
    backgroundTertiary: '#252F3E',
    textPrimary: '#E8ECF0',
    textSecondary: '#B8C4D0',
    textTertiary: '#8894A0',
    accentPrimary: '#3B82F6',
    accentSecondary: '#2563EB',
    accentTertiary: '#1D4ED8',
    borderPrimary: '#3A4454',
    borderSecondary: '#2A3444',
    cardBackground: '#1F2937',
    cardBorder: '#374151',
    buttonPrimary: '#0B2545',
    buttonSecondary: '#134074',
    buttonHover: '#1565A8',

    // Core
    primary: '#0B2545',

    // Brand/Furniture
    brandPrimary: '#0B2545',    // Navy Blue
    brandSecondary: '#134074',  // Mid Blue
    brandDark: '#051224',       // Deep Navy

    // State
    stateSuccess: '#10B981',    // Emerald
    stateWarning: '#F59E0B',    // Amber

    // Accents
    accentWarm: '#8B7355',      // Wood/Terracotta
    accentCool: '#6366F1',      // Violet-ish
  },
};

const DEFAULT_LIGHT_THEME: Theme = {
  name: 'Light',
  mode: 'light',
  colors: {
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textTertiary: '#6B7280',
    accentPrimary: '#3B82F6',
    accentSecondary: '#2563EB',
    accentTertiary: '#1D4ED8',
    borderPrimary: '#E5E7EB',
    borderSecondary: '#D1D5DB',
    cardBackground: '#FFFFFF',
    cardBorder: '#E5E7EB',
    buttonPrimary: '#0B2545',
    buttonSecondary: '#134074',
    buttonHover: '#1565A8',

    // Core
    primary: '#0B2545',

    // Brand/Furniture
    brandPrimary: '#0B2545',    // Navy
    brandSecondary: '#134074',  // Mid Blue
    brandDark: '#051224',       // Deep Navy

    // State
    stateSuccess: '#10B981',    // Emerald Green
    stateWarning: '#F59E0B',    // Amber

    // Accents
    accentWarm: '#8B7355',      // Wood/Earth
    accentCool: '#6366F1',      // Modern Violet
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleMode: () => void;
  updateColors: (colors: Partial<ThemeColors>) => void;
  resetTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'bluewud_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Load from localStorage or use default
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DARK_THEME;
      }
    }
    return DEFAULT_DARK_THEME;
  });

  // Save to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));

    // Apply theme to document root for CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssKey = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssKey, value);
    });

    // Set data attribute for mode
    root.setAttribute('data-theme', theme.mode);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleMode = () => {
    setThemeState((current) => {
      const newMode = current.mode === 'dark' ? 'light' : 'dark';
      const baseTheme = newMode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;

      // Preserve custom colors but switch base theme
      return {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          // Optionally preserve some custom colors
          // Optionally preserve some custom colors
          ...(current.colors.brandPrimary !== DEFAULT_DARK_THEME.colors.brandPrimary && {
            brandPrimary: current.colors.brandPrimary,
            brandSecondary: current.colors.brandSecondary,
            stateSuccess: current.colors.stateSuccess,
            brandDark: current.colors.brandDark,
            accentWarm: current.colors.accentWarm,
            accentCool: current.colors.accentCool,
            stateWarning: current.colors.stateWarning,
          }),
        },
      };
    });
  };

  const updateColors = (newColors: Partial<ThemeColors>) => {
    setThemeState((current) => ({
      ...current,
      colors: {
        ...current.colors,
        ...newColors,
      },
    }));
  };

  const resetTheme = () => {
    const defaultTheme = theme.mode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
    setThemeState(defaultTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleMode,
        updateColors,
        resetTheme,
        isDark: theme.mode === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};


