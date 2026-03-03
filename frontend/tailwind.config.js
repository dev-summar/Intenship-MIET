/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          bg: '#0f172a',
          bgDeep: '#0b1120',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, #0f172a 0%, #0b1120 100%)',
        'gradient-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(139, 92, 246, 0.08), transparent)',
        'gradient-light': 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #e0e7ff 100%)',
        'gradient-hero-light': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.12), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(59, 130, 246, 0.08), transparent)',
        'gradient-text': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
        'gradient-button': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'card-light': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'card-light-hover': '0 20px 40px rgba(0, 0, 0, 0.12)',
        glow: '0 0 40px -10px rgba(59, 130, 246, 0.35), 0 0 20px -5px rgba(139, 92, 246, 0.25)',
        'glow-sm': '0 0 20px -5px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animationDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
};
