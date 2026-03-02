
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,  // listen on all addresses (0.0.0.0)
    port: 5173,  // your dev port
    strictPort: true,
    allowedHosts: ['admin.jbvuniversity.com']  // allow this host
  },
})