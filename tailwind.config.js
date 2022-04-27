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
        'title1': ['Londrina Outline', 'cursive'],
        'title2': ['Londrina Solid', 'cursive'],
      }
    }
  }
};
