import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/ai':   { target: 'http://localhost:8000', changeOrigin: true },
      '/api/kpis': { target: 'http://localhost:8000', changeOrigin: true },
      '/api/auth': { target: 'http://localhost:5275', changeOrigin: true },
      '/api/scan': { target: 'http://localhost:5275', changeOrigin: true },
      '/api/v1':   { target: 'http://localhost:5114', changeOrigin: true },
    },
  },
})
