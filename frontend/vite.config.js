import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  define: {
    'import.meta.env.VITE_AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN),
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(new URL('/', import.meta.url).pathname, 'src'), // Check this alias setup
    },
  },
  css: {
    // Configure PostCSS
        tailwindcss, // Include Tailwind CSS
        autoprefixer, // Include Autoprefixer
    },
  },
)
