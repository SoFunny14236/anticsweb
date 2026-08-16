/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          950: '#050505',
          900: '#0a0a0a',
          800: '#121212',
          700: '#191919',
          600: '#242424',
        },
        blood: {
          50: '#fdecec',
          100: '#f9caca',
          200: '#f0a0a0',
          300: '#e17272',
          400: '#d94a4a',
          500: '#cc1414',
          600: '#b31212',
          700: '#8b0000',
          800: '#6e0000',
          900: '#4a0000',
        },
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(204, 20, 20, 0.35)',
        'glow-lg': '0 0 40px rgba(204, 20, 20, 0.45)',
      },
    },
  },
  plugins: [],
};
