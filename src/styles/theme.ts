// =================================
// CENTRALIZED THEME SYSTEM
// =================================

export interface ThemeColors {
  // Primary Colors
  primaryBg: string;
  secondaryBg: string;
  cardBg: string;
  inputBg: string;
  headerBg: string;
  
  // Accent Colors
  primaryAccent: string;
  primaryAccentHover: string;
  primaryAccentLight: string;
  primaryAccentDark: string;
  
  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  
  // Border Colors
  borderPrimary: string;
  borderSecondary: string;
  borderMuted: string;
  
  // State Colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Shadow Colors
  shadowColor: string;
  
  // Button Colors
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHover: string;
  btnSecondaryBg: string;
  btnSecondaryText: string;
  btnSecondaryBorder: string;
  btnSecondaryHover: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  fonts: {
    sans: string;
    mono: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// Default Theme Configuration
export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    // Primary Colors
    primaryBg: '#0f1419',
    secondaryBg: '#1a2332',
    cardBg: '#233044',
    inputBg: '#2d3748',
    headerBg: '#1a2332',
    
    // Accent Colors
    primaryAccent: '#00d4aa',
    primaryAccentHover: '#00b894',
    primaryAccentLight: '#4fd1c7',
    primaryAccentDark: '#009688',
    
    // Text Colors
    textPrimary: '#ffffff',
    textSecondary: '#a0aec0',
    textMuted: '#718096',
    textAccent: '#00d4aa',
    
    // Border Colors
    borderPrimary: '#00d4aa',
    borderSecondary: '#2d3748',
    borderMuted: '#4a5568',
    
    // State Colors
    success: '#48bb78',
    error: '#f56565',
    warning: '#ed8936',
    info: '#4299e1',
    
    // Shadow Colors
    shadowColor: '#000000',
    
    // Button Colors
    btnPrimaryBg: '#00d4aa',
    btnPrimaryText: '#0f1419',
    btnPrimaryHover: '#00b894',
    btnSecondaryBg: 'transparent',
    btnSecondaryText: '#00d4aa',
    btnSecondaryBorder: '#00d4aa',
    btnSecondaryHover: '#00d4aa',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  fonts: {
    sans: 'var(--font-geist-sans), system-ui, sans-serif',
    mono: 'var(--font-geist-mono), monospace',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Alternative Theme Configurations
export const blueTheme: Theme = {
  ...defaultTheme,
  name: 'blue',
  colors: {
    ...defaultTheme.colors,
    primaryAccent: '#3182ce',
    primaryAccentHover: '#2c5282',
    primaryAccentLight: '#63b3ed',
    primaryAccentDark: '#2a69ac',
    textAccent: '#3182ce',
    borderPrimary: '#3182ce',
    btnPrimaryBg: '#3182ce',
    btnPrimaryHover: '#2c5282',
    btnSecondaryText: '#3182ce',
    btnSecondaryBorder: '#3182ce',
    btnSecondaryHover: '#3182ce',
  },
};

export const purpleTheme: Theme = {
  ...defaultTheme,
  name: 'purple',
  colors: {
    ...defaultTheme.colors,
    primaryAccent: '#805ad5',
    primaryAccentHover: '#6b46c1',
    primaryAccentLight: '#b794f6',
    primaryAccentDark: '#553c9a',
    textAccent: '#805ad5',
    borderPrimary: '#805ad5',
    btnPrimaryBg: '#805ad5',
    btnPrimaryHover: '#6b46c1',
    btnSecondaryText: '#805ad5',
    btnSecondaryBorder: '#805ad5',
    btnSecondaryHover: '#805ad5',
  },
};

export const redTheme: Theme = {
  ...defaultTheme,
  name: 'red',
  colors: {
    ...defaultTheme.colors,
    primaryAccent: '#e53e3e',
    primaryAccentHover: '#c53030',
    primaryAccentLight: '#fc8181',
    primaryAccentDark: '#9b2c2c',
    textAccent: '#e53e3e',
    borderPrimary: '#e53e3e',
    btnPrimaryBg: '#e53e3e',
    btnPrimaryHover: '#c53030',
    btnSecondaryText: '#e53e3e',
    btnSecondaryBorder: '#e53e3e',
    btnSecondaryHover: '#e53e3e',
  },
};

// Available Themes
export const themes = {
  default: defaultTheme,
  blue: blueTheme,
  purple: purpleTheme,
  red: redTheme,
} as const;

export type ThemeName = keyof typeof themes;

// Theme Utilities
export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || defaultTheme;
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVar}`, value);
  });
  
  // Apply spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
  
  // Apply border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
  
  // Apply shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
};