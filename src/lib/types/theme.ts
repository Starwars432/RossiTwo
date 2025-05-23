export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

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
  }
];