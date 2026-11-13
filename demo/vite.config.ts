import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const demoRoot = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(demoRoot, '..')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'subscribe-proxy': resolve(packageRoot, 'src'),
    },
  },
  server: {
    fs: {
      allow: [packageRoot],
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
})
