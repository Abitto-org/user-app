import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import type { ManifestOptions } from 'vite-plugin-pwa'
import path from 'path'

const manifest: Partial<ManifestOptions> = {
  name: 'Abitto Energy',
  short_name: 'Abitto',
  description: 'Buy gas. Use gas. Track gas. Pay only for the gas you use.',
  theme_color: '#669900',
  background_color: '#ffffff',
  display: 'standalone',
  start_url: '/',
  scope: '/',
  icons: [
    {
      src: '/icon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any maskable',
    },
  ],
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'fonts/Geist-Variable.woff2'],
      manifest,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
