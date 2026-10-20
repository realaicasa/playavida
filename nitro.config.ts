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
  handlers: [
    { route: '/api/health', handler: 'server/routes/api/health.ts', format: 'node' },
    { route: '/api/auth/request-otp', handler: 'server/routes/api/auth/request-otp.ts', format: 'node' },
    { route: '/api/auth/verify-otp', handler: 'server/routes/api/auth/verify-otp.ts', format: 'node' },
    { route: '/api/auth/session', handler: 'server/routes/api/auth/session.ts', format: 'node' },
    { route: '/api/auth/logout', handler: 'server/routes/api/auth/logout.ts', format: 'node' },
  ],
});