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
    },
  },
  plugins: [],
}

