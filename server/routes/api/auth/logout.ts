import { getMethod, getRequestHeader, setResponseStatus, setResponseHeader } from 'h3';
import { getTeableClient } from '../../../lib/teable.js';

const SESSIONS_TABLE_ID = process.env.TEABLE_SESSIONS_TABLE_ID;
if (!SESSIONS_TABLE_ID) {
  throw new Error('TEABLE_SESSIONS_TABLE_ID environment variable is required');
}

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'POST') {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 405);
    return { ok: false, code: 'METHOD_NOT_ALLOWED' };
  }

  try {
    // Get session cookie
    const cookieHeader = getRequestHeader(event, 'cookie') || '';
    const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
    const sessionId = sessionMatch?.[1];

    if (sessionId) {
      let teable;
      try {
        teable = getTeableClient();
      } catch (e: any) {
        console.error('Teable client init failed:', e?.message || e);
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 500);
        return { ok: false, code: 'TEABLE_CONFIG_ERROR', error: e?.message || 'Teable configuration error' };
      }

      // Delete session server-side
      try {
        const sessionRecords = await getTeableClient().listRecords('tblap3ykSwQQk276MdN', {
          filter: { fieldId: 'session_token_hash', operator: 'is', value: sessionId },
          maxRecords: 1,
        });

        if (sessionRecords.records.length > 0) {
          await getTeableClient().deleteRecord('tblap3ykSwQQk276MdN', sessionRecords.records[0].id as string);
        }
      } catch (e: any) {
        console.warn('Failed to delete session:', e?.message || e);
      }
    }

    // Clear cookie
    const clearCookie = 'session_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
    setResponseHeader(event, 'Set-Cookie', clearCookie);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return { authenticated: false };
  } catch (error: any) {
    console.error('Logout error:', error?.message || error);
    const clearCookie = 'session_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
    setResponseHeader(event, 'Set-Cookie', clearCookie);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return { authenticated: false };
  }
}