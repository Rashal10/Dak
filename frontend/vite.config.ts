import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build runs from any static host or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['motion/react'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
})
