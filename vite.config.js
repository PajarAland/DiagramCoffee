import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  test: {
    environment: "jsdom",   // penting buat React
    globals: true,          // biar gak perlu import describe/test
    setupFiles: "./src/setupTests.js",
  },
})