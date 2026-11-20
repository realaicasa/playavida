import { defineNitroConfig } from 'nitro/config';

export default defineNitroConfig({
  serverDir: './server',
  apiDir: 'api',
  routesDir: 'routes',
  compatibilityDate: '2026-10-12',
  routeRules: {
    '/api/**': { cors: true, headers: { 'cache-control': 'no-store' } },
    '/sw.js': { headers: { 'cache-control': 'no-cache, no-store, must-revalidate' } },
    '/workbox-*.js': { headers: { 'cache-control': 'no-cache, no-store, must-revalidate' } },
    '/': { headers: { 'cache-control': 'no-cache, no-store, must-revalidate' } },
  },
  publicAssets: [{
    baseURL: '/',
    dir: 'dist',
  }],
});