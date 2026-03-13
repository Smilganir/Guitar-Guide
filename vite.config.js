import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use '/' in dev so localhost shows the app; use repo base for GitHub Pages build
  base: process.env.NODE_ENV === 'production' ? '/Guitar-Guide/' : '/',
})
