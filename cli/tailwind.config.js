/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 50%, #16213e 100%)',
      },
    },
  },
  plugins: [],
}
