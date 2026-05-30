import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // imported Tailwind CSS plugin for Vite we just installed
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // added Tailwind CSS plugin to the Vite configuration
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})