/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Copies dist/index.html to dist/dystroy/index.html so static hosts
// (GitHub Pages etc.) serve the SPA boot file at /dystroy.
function dystroyRoute(): Plugin {
  return {
    name: 'dystroy-route',
    closeBundle() {
      const dist = path.resolve(process.cwd(), 'dist')
      const src = path.join(dist, 'index.html')
      if (!fs.existsSync(src)) return
      const destDir = path.join(dist, 'dystroy')
      fs.mkdirSync(destDir, { recursive: true })
      fs.copyFileSync(src, path.join(destDir, 'index.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dystroyRoute()],
  build: {
    // Warn when any chunk exceeds 500 kB (helps keep initial load ≤1 MB)
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks so they can be cached independently
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
