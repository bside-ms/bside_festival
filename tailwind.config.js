const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Questrial', 'sans-serif'],
        'display': ['bdr-mono', 'serif'],
      }
    }
  }
};
