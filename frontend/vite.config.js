import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  return {
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../shared'),
      ],
    },
    proxy: {
      '/api': process.env.API_PROXY_TARGET || env.API_PROXY_TARGET || 'http://127.0.0.1:5000',
    },
  },
  }
})
