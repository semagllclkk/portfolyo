import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// İki sayfa: / çiftlik (src/farm), /klasik/ klasik site (src)
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
  build: {
    rollupOptions: {
      input: { main: 'index.html', klasik: 'klasik/index.html' },
    },
  },
})
