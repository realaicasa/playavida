import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import nitro from '@nitrojs/vite';

export default defineConfig(() => {
  return {
    plugins: [
        react(), 
        tailwindcss(),
        nitro(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['PlayaVida128.svg', 'PlayaVida192.svg', 'PlayaVida512.svg'],
          manifest: {
            id: '/',
            name: 'PlayaVida',
            short_name: 'PlayaVida',
            description: 'Bilingual community & local discovery PWA for Playa del Carmen and Riviera Maya.',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/',
            scope: '/',
            icons: [
              {
                src: '/PlayaVida192.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'any',
              },
              {
                src: '/PlayaVida512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any',
              },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          },
          devOptions: {
            enabled: true,
            type: 'module',
          },
        }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
