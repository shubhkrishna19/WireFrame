import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface ThemeSettings {
  background: string;
  backgroundAlt: string;
  heading: string;
  text: string;
  card: string;
  border: string;
  accentPrimary: string;
  accentSecondary: string;
  buttonPrimary: string;
  buttonSecondary: string;
}

const THEME_STORAGE_KEY = 'mulary.theme.settings';

const defaultTheme: ThemeSettings = {
  background: '#0F0F0D',
  backgroundAlt: '#1A1A16',
  heading: '#F5F2EB',
  text: '#DCD7CF',
  card: 'rgba(18, 18, 18, 0.92)',
  border: 'rgba(90, 90, 90, 0.45)',
  accentPrimary: '#8B2E3D',
  accentSecondary: '#2D5F4A',
  buttonPrimary: '#8B2E3D',
  buttonSecondary: '#2D5F4A',
};

interface ThemeContextValue {
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  updateTheme: () => undefined,
  resetTheme: () => undefined,
});

const applyThemeToDocument = (theme: ThemeSettings) => {
  const root = document.documentElement;
  root.style.setProperty('--color-background', theme.background);
  root.style.setProperty('--color-background-alt', theme.backgroundAlt);
  root.style.setProperty('--color-heading', theme.heading);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-card', theme.card);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--color-accent-primary', theme.accentPrimary);
  root.style.setProperty('--color-accent-secondary', theme.accentSecondary);
  root.style.setProperty('--color-button-primary', theme.buttonPrimary);
  root.style.setProperty('--color-button-secondary', theme.buttonSecondary);
};

const loadInitialTheme = (): ThemeSettings => {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) {
      return defaultTheme;
    }
    const parsed = JSON.parse(stored) as ThemeSettings;
    return { ...defaultTheme, ...parsed };
  } catch {
    return defaultTheme;
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(() => loadInitialTheme());

  useEffect(() => {
    applyThemeToDocument(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      updateTheme: (updates: Partial<ThemeSettings>) => {
        setTheme((prev) => ({ ...prev, ...updates }));
      },
      resetTheme: () => setTheme(defaultTheme),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);

export const getDefaultTheme = (): ThemeSettings => defaultTheme;

