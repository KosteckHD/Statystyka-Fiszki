import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/Statystyka-Fiszki/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        drill: resolve(__dirname, 'drill.html'),
        'drill-dbs': resolve(__dirname, 'drill-dbs.html'),
      },
    },
  },
})
