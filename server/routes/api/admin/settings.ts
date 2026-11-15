import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { updateSiteSettings, getSiteSettings } from '../../../lib/site-settings.js';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'PATCH') {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 405);
    return { ok: false, code: 'METHOD_NOT_ALLOWED' };
  }

  const currentUser = await getCurrentUser(event);

  if (!currentUser.authenticated || !currentUser.isSuperadmin) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 403);
    return { ok: false, code: 'FORBIDDEN' };
  }

  let body: any;
  try {
    body = await readBody(event);
  } catch (e: any) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_JSON' };
  }

  try {
    await updateSiteSettings(body);
    const updated = await getSiteSettings();

    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return updated;
  } catch (e: any) {
    console.error('Failed to update SiteSettings:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'SETTINGS_UPDATE_FAILED', error: e?.message || 'Unknown error' };
  }
}