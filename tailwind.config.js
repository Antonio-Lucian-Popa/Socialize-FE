/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      aspectRatio: {
        '3/2': '3 / 2',  // Example for a 3:2 aspect ratio
        // Define other custom aspect ratios as needed
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
