import plugin from 'tailwindcss/plugin'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        shop_dark_green: "#014421", // 🟩 use your desired hex value
        shop_lightpink: "#fdf2f8",   // for bg-shop-lightpink if needed
      },
    },
  },
  plugins: [],
};


