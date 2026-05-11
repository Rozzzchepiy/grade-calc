import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.js',
    // Кажемо Vitest ігнорувати папку tests (Playwright)
    exclude: ['node_modules', 'src/tests/**'], 
  }
})