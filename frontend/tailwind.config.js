/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: '#2A3850',
        altBg: '#192c4b',
        primary: '#41436A',
        headerColor: '#dbddff',
        accent1: '#984063',
        accent2: '#f64668',
        accent3: '#FE9677',
        textColor: '#e0e0e0',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
