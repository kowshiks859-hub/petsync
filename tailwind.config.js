/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0057B8',
          dark: '#003F91',
          light: '#064DA8',
        },
        secondary: '#FFC400',
        white: '#FFFFFF',
        gray: {
          50: '#F6F8FC',
          100: '#F3F4F6',
          200: '#E4E7EC',
          500: '#667085',
          800: '#101828',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
