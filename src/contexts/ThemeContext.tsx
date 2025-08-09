'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeName, themes, getTheme, applyTheme, defaultTheme } from '@/styles/theme';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeName?: ThemeName;
}

export function ThemeProvider({ children, defaultThemeName = 'default' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultThemeName);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app-theme') as ThemeName;
      if (savedTheme && themes[savedTheme]) {
        setThemeName(savedTheme);
        setCurrentTheme(getTheme(savedTheme));
      }
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    const theme = getTheme(themeName);
    setCurrentTheme(theme);
    applyTheme(theme);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme', themeName);
    }
  }, [themeName]);

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  const toggleTheme = () => {
    const themeNames = Object.keys(themes) as ThemeName[];
    const currentIndex = themeNames.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setTheme(themeNames[nextIndex]);
  };

  const availableThemes = Object.keys(themes) as ThemeName[];

  const value: ThemeContextType = {
    currentTheme,
    themeName,
    setTheme,
    toggleTheme,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for getting theme-aware styles
export function useThemeStyles() {
  const { currentTheme } = useTheme();
  
  return {
    // Color utilities
    colors: currentTheme.colors,
    
    // Common style combinations
    cardStyle: {
      backgroundColor: currentTheme.colors.cardBg,
      borderColor: currentTheme.colors.borderSecondary,
      color: currentTheme.colors.textPrimary,
    },
    
    inputStyle: {
      backgroundColor: currentTheme.colors.inputBg,
      borderColor: currentTheme.colors.borderSecondary,
      color: currentTheme.colors.textPrimary,
    },
    
    primaryButtonStyle: {
      backgroundColor: currentTheme.colors.btnPrimaryBg,
      color: currentTheme.colors.btnPrimaryText,
    },
    
    secondaryButtonStyle: {
      backgroundColor: currentTheme.colors.btnSecondaryBg,
      color: currentTheme.colors.btnSecondaryText,
      borderColor: currentTheme.colors.btnSecondaryBorder,
    },
    
    // Utility functions
    getColor: (colorKey: keyof typeof currentTheme.colors) => currentTheme.colors[colorKey],
    getSpacing: (spacingKey: keyof typeof currentTheme.spacing) => currentTheme.spacing[spacingKey],
    getBorderRadius: (radiusKey: keyof typeof currentTheme.borderRadius) => currentTheme.borderRadius[radiusKey],
    getShadow: (shadowKey: keyof typeof currentTheme.shadows) => currentTheme.shadows[shadowKey],
  };
}

// Theme-aware component wrapper
export function withTheme<P extends object>(Component: React.ComponentType<P>) {
  return function ThemedComponent(props: P) {
    const themeProps = useThemeStyles();
    return <Component {...props} theme={themeProps} />;
  };
}