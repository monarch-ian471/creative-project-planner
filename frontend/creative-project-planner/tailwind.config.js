/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}', // Adjust the path according to your project structure
    './public/index.html',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'app-bg': "url('@/assets/background8.png')",
        'hero-bg': "url('@/assets/bg.png')",
        'hero-banner-bg': "url('@/assets/community2.png')",
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
