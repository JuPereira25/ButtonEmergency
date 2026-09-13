import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/emergencyHub': {
        target: 'http://localhost:5268',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
