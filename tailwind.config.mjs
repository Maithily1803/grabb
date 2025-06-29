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
        shop_dark_green: '#014421',
        shop_lightpink: '#fdf2f8',
      },
    },
  },
  plugins: [
    // if you need custom plugins later, add them here
    // example: plugin(({ addUtilities }) => {})
  ],
};



