/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './scripts/**/*.{ts,tsx,js,jsx}',
    './public/static/**/*.html',
  ],
  safelist: [
    // Layout / Flex / Grid
    'min-h-screen', 'h-screen', 'w-full', 'w-screen',
    'flex', 'grid', 'items-center', 'justify-center', 'justify-between',
    'gap-2', 'gap-4', 'gap-6', 'gap-8',
    'absolute', 'relative', 'inset-0', 'z-50', 'z-0',
    'overflow-hidden', 'overflow-x-hidden',

    // Typography
    'text-left', 'text-center', 'text-right',
    'text-white', 'text-black', 'text-gray-400', 'text-sm',
    'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
    'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'uppercase', 'lowercase', 'tracking-widest',

    // Backgrounds / Gradients / Borders
    'bg-black', 'bg-white', 'bg-gradient-to-b',
    'from-black', 'via-purple-950', 'to-white',
    'border', 'border-white', 'border-gray-200',

    // Animations / Transitions
    'transition-all', 'transition-opacity', 'transition-transform',
    'duration-300', 'duration-500', 'ease-in-out', 'ease-in', 'ease-out',
    'animate-fade', 'animate-slide-up', 'animate-slide-down', 'animate-scale-in',
    'transform', 'translate-y-0', 'translate-y-4',

    // Visibility Fixes
    'opacity-0', 'opacity-100',
    'invisible', 'visible',
    'pointer-events-none', 'pointer-events-auto',

    // Fonts
    'font-serif', 'font-sans',

    // Buttons / Links
    'cursor-pointer', 'hover:bg-white', 'hover:text-black', 'underline',

    // Padding / Margin (common)
    'p-0', 'p-1', 'p-2', 'p-4', 'p-6', 'p-8',
    'pt-4', 'pb-4', 'pl-4', 'pr-4',
    'm-0', 'm-2', 'm-4', 'm-6',
    'mt-4', 'mb-4', 'ml-4', 'mr-4',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #3B82F6)',
        secondary: 'var(--color-secondary, #60A5FA)',
        background: 'var(--color-background, #000000)',
        text: 'var(--color-text, #ffffff)',
        accent: 'var(--color-accent, #2563EB)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Playfair Display', 'serif'],
        body: ['var(--font-body)', 'Playfair Display', 'serif'],
      },
      spacing: {
        xs: 'var(--spacing-xs, 0.5rem)',
        sm: 'var(--spacing-sm, 1rem)',
        md: 'var(--spacing-md, 1.5rem)',
        lg: 'var(--spacing-lg, 2rem)',
        xl: 'var(--spacing-xl, 3rem)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
