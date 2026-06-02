import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: rootDir,
  build: {
    outDir: resolve(rootDir, 'dist')
  },

  test: {
    environment: 'jsdom',
    globals: true
  }
})
