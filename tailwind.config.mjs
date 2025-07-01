import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'shop-dark-green': '#063c28', 
        'shop-light-pink': '#fcf0e4',
      },
    },
  },
  plugins: [
    // if you need custom plugins later, add them here
    // example: plugin(({ addUtilities }) => {})
  ],
};



 