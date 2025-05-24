import { create } from 'zustand';
import { Theme } from '../types/theme';

interface ThemeState {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    background: '#000000',
    text: '#FFFFFF',
    accent: '#2563EB'
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Playfair Display'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: defaultTheme,
  setTheme: (theme) => {
    set({ currentTheme: theme });
    // Apply theme to CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    Object.entries(theme.fonts).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--font-${key}`, value);
    });
  }
}));