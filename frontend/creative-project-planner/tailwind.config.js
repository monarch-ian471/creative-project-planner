/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}', // Adjust the path according to your project structure
    './public/index.html',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'app-bg': "url('@/assets/bg.png')", // Custom background image
      },
      colors: {
        'custom-teal': '#00BFA5',  // Tiffany Blue
        'custom-lime': '#A5D647',  // Lime Green
        'custom-peach': '#FFCCBC', // Peach Puff
      },
    },
  },
  plugins: [],
}

