import { Theme } from './theme';

export interface ThemePreset {
  id: string;
  name: string;
  theme: Theme;
  isDefault?: boolean;
}

export const defaultPresets: ThemePreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    isDefault: true,
    theme: {
      id: 'classic',
      name: 'Classic Theme',
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
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    theme: {
      id: 'modern',
      name: 'Modern Theme',
      colors: {
        primary: '#6366F1',
        secondary: '#818CF8',
        background: '#111827',
        text: '#F9FAFB',
        accent: '#4F46E5'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        xs: '0.75rem',
        sm: '1.25rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem'
      }
    }
  },
  {
    id: 'kids',
    name: 'Kids',
    theme: {
      id: 'kids',
      name: 'Kids Theme',
      colors: {
        primary: '#EC4899',
        secondary: '#F472B6',
        background: '#FDF2F8',
        text: '#831843',
        accent: '#DB2777'
      },
      fonts: {
        heading: 'Comic Sans MS',
        body: 'Comic Sans MS'
      },
      spacing: {
        xs: '1rem',
        sm: '1.5rem',
        md: '2.5rem',
        lg: '3.5rem',
        xl: '5rem'
      }
    }
  }
];