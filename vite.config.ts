import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://charbel12.github.io/wedding/
  base: '/wedding/',
  plugins: [react()],
})
