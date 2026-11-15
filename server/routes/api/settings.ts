import { getMethod, setResponseStatus, setResponseHeader } from 'h3';
import { getSiteSettings } from '../../lib/site-settings.js';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'GET') {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 405);
    return { ok: false, code: 'METHOD_NOT_ALLOWED' };
  }

  const settings = await getSiteSettings();

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 200);
  return settings;
}