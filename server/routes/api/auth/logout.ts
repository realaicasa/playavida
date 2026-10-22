import { H3Event } from 'h3';
import { getTeableClient } from '../../../lib/teable.js';

const SESSIONS_TABLE_ID = process.env.TEABLE_SESSIONS_TABLE_ID;
if (!SESSIONS_TABLE_ID) {
  throw new Error('TEABLE_SESSIONS_TABLE_ID environment variable is required');
}

export default async function handler(event: any): Promise<void> {
  const req = event.node.req;
  const res = event.node.res;

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, code: 'METHOD_NOT_ALLOWED' }));
    return;
  }

  try {
    // Get session cookie
    const cookieHeader = req.headers.cookie || '';
    const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
    const sessionId = sessionMatch?.[1];

    if (sessionId) {
      let teable;
      try {
        teable = getTeableClient();
      } catch (e: any) {
        console.error('Teable client init failed:', e?.message || e);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, code: 'TEABLE_CONFIG_ERROR', error: e?.message || 'Teable configuration error' }));
        return;
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
    res.setHeader('Set-Cookie', 'session_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({ authenticated: false }));
  } catch (error: any) {
    console.error('Logout error:', error?.message || error);
    res.setHeader('Set-Cookie', 'session_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({ authenticated: false }));
  }
}