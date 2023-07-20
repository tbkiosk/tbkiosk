/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/pages/**/*.{js,ts,jsx,tsx}', './src/layouts/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fly-in-from-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fly-in-from-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in-from-bottom': {
          '0%': { transform: 'translateY(50%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'step-spin': {
          '0%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(0)' },
          '50%': { transform: 'rotate(180deg)' },
          '75%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      colors: {
        'black-30': '#EDEDEE',
        'black-100': '#222325',
        purple: {
          100: '#DADBFB',
          500: '#6266EB',
        },
        yellow: {
          100: '#F5FAD0',
          500: '#BBC860',
        },
        orange: {
          100: '#FFF4DF',
          500: '#FFC85F',
        },
        violet: {
          100: '#FEDFFF',
          500: '#FC7DFF',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
