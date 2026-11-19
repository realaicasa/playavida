import { defineMiddleware } from 'nitro';
import { redirect } from 'h3';
import { getCurrentUser } from '../lib/auth.js';
import { getTeableClient } from '../lib/teable.js';

// Default settings (used if SiteSettings table doesn't exist)
const DEFAULT_LAUNCH_MODE = true;
const DEFAULT_WAITLIST_URL = 'https://list.playavida.org/wait';

async function getSiteSettings(): Promise<{ launch_mode_enabled: boolean; waitlist_url: string }> {
  const tableId = process.env.TEABLE_TABLE_SITE_SETTINGS;
  if (!tableId) {
    return { launch_mode_enabled: DEFAULT_LAUNCH_MODE, waitlist_url: DEFAULT_WAITLIST_URL };
  }

  try {
    const teable = getTeableClient();
    const records = await teable.listRecords(tableId, { maxRecords: 1 });
    if (records.records.length > 0) {
      const fields = records.records[0].fields as any;
      return {
        launch_mode_enabled: fields.launch_mode_enabled === true || fields.launch_mode_enabled === 'true',
        waitlist_url: fields.waitlist_url || DEFAULT_WAITLIST_URL,
      };
    }
  } catch (e) {
    console.warn('Failed to fetch SiteSettings, using defaults:', e);
  }

  return { launch_mode_enabled: DEFAULT_LAUNCH_MODE, waitlist_url: DEFAULT_WAITLIST_URL };
}

export default defineMiddleware(async (event) => {
  const url = new URL(event.req.url || '/', 'http://localhost');
  const path = url.pathname;

  // Excluded paths: /admin, /api/*, /login, /auth, static assets
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api/') ||
    path.startsWith('/_') ||
    path === '/login' ||
    path === '/auth' ||
    url.searchParams.has('login') ||
    path.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|webmanifest|json)$/)
  ) {
    return;
  }

  const settings = await getSiteSettings();

  if (!settings.launch_mode_enabled) {
    return; // Launch mode disabled, allow all
  }

  // Check authentication
  const currentUser = await getCurrentUser(event);

  if (currentUser.authenticated && (currentUser.isSuperadmin || currentUser.isFoundingMember)) {
    return; // Bypass gate
  }

  // Redirect to waitlist
  return redirect(settings.waitlist_url, 302);
});