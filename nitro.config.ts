import { defineNitroConfig } from 'nitro/config';

export default defineNitroConfig({
  serverDir: './server',
  apiDir: 'api',
  routesDir: 'routes',
  compatibilityDate: '2026-10-12',
  routeRules: {
    '/api/**': { cors: true },
  },
  publicAssets: [{
    baseURL: '/',
    dir: 'dist',
  }],
});