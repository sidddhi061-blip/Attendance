/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e1e9ff',
          200: '#bccdff',
          300: '#86a6ff',
          400: '#4875ff',
          500: '#1d41ff',
          600: '#0022ff',
          700: '#001bd1',
          800: '#0018a8',
          900: '#001685',
        },
        accent: {
          50: '#effeff',
          100: '#d9faff',
          200: '#bdf5ff',
          300: '#91efff',
          400: '#5de2ff',
          500: '#25ccff',
          600: '#00a3ff',
          700: '#0084d1',
          800: '#006ba8',
          900: '#00588a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0,0,0,0.04), 0 2px 8px -1px rgba(0,0,0,0.02)',
        'card-hover': '0 20px 25px -5px rgba(29, 65, 255, 0.1), 0 10px 10px -5px rgba(29, 65, 255, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px rgba(37, 204, 255, 0.2)' },
          'to': { boxShadow: '0 0 20px rgba(37, 204, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
