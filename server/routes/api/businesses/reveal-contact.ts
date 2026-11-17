import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const BUSINESSES_TABLE_ID = process.env.TEABLE_TABLE_BUSINESSES || 'tbl8IOboEGdwYHqJck2';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'POST') {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 405);
    return { ok: false, code: 'METHOD_NOT_ALLOWED' };
  }

  const currentUser = await getCurrentUser(event);
  if (!currentUser.authenticated) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 401);
    return { ok: false, code: 'UNAUTHORIZED' };
  }

  let body: any;
  try {
    body = await readBody(event);
  } catch (e: any) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_JSON' };
  }

  const businessId = body.business_id;
  if (!businessId) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_PARAMS' };
  }

  const teable = getTeableClient();

  try {
    const record = await teable.getRecord(BUSINESSES_TABLE_ID, businessId);
    const fields = record.fields as any;

    // Check if business is hidden
    if (fields.is_hidden === true) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 404);
      return { ok: false, code: 'NOT_FOUND' };
    }

    // Check if business is Pro
    if (fields.is_pro !== true) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 403);
      return { ok: false, code: 'NOT_PRO' };
    }

    // Demo isolation: demo accounts cannot contact real businesses
    const isDemoUser = currentUser.user?.is_demo_account === true || currentUser.user?.is_demo === true;
    const isDemoBusiness = fields.is_demo === true || fields.is_demo_content === true;
    if (isDemoUser && !isDemoBusiness) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 403);
      return { ok: false, code: 'DEMO_ISOLATION', message: 'Demo accounts cannot contact live businesses' };
    }

    // Increment modal_opens
    const currentOpens = fields.modal_opens || 0;
    await teable.updateRecord(BUSINESSES_TABLE_ID, businessId, {
      modal_opens: currentOpens + 1,
    });

    // Return gated contact fields
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return {
      ok: true,
      contact_email: fields.contact_email || fields.email || '',
      contact_phone: fields.contact_phone || fields.phone || '',
      website: fields.website || '',
      social_links: fields.social_links || '',
      booking_link: fields.booking_link || fields.booking_url || '',
    };
  } catch (e: any) {
    console.error('Failed to reveal contact:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'REVEAL_FAILED', error: e?.message || 'Unknown error' };
  }
}