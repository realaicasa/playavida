import { defineMiddleware } from 'nitro';
import { getMethod, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../lib/auth.js';
import { getSiteSettings } from '../lib/site-settings.js';

export default defineMiddleware(async (event) => {
  const url = new URL(event.req.url || '/', 'http://localhost');
  const path = url.pathname;
  const method = getMethod(event);

  // Only block write methods on public routes
  if (method !== 'POST') return;

  // Excluded paths
  if (path.startsWith('/api/auth/') || path.startsWith('/api/webhooks/') || path.startsWith('/api/admin/')) {
    return;
  }

  // Only block specific public write routes
  const blockedRoutes = ['/api/businesses', '/api/groups', '/api/events', '/api/reports', '/api/favourites'];
  if (!blockedRoutes.includes(path)) return;

  const settings = await getSiteSettings();

  if (!settings.maintenance_readonly) return;

  // Check if user is superadmin
  const currentUser = await getCurrentUser(event);
  if (currentUser.authenticated && currentUser.isSuperadmin) return;

  // Block with 503
  setResponseStatus(event, 503);
  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  return { ok: false, code: 'MAINTENANCE_MODE', message: 'The site is currently in maintenance mode. Please try again later.' };
});