/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: '#ff4fa3',
        blue: '#4facfe',
      },
      backgroundImage: {
        'gradient-pink-blue': 'linear-gradient(135deg, #ff4fa3 0%, #4facfe 100%)',
      },
    },
  },
  plugins: [],
};
