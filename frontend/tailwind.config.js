/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        learner: {
          blue: '#0066FF',
          blueDark: '#0052CC',
          blueLight: '#EBF3FF',
          yellow: '#FFB800',
          yellowDark: '#E6A600',
          yellowLight: '#FFF8E6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'learner': '0 4px 20px -2px rgba(0, 102, 255, 0.15)',
        'learner-lg': '0 12px 32px -4px rgba(0, 102, 255, 0.2)',
        'card-clean': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
