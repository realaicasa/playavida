import { getTeableClient } from '../lib/teable.js';
import type { IncomingMessage, ServerResponse } from 'http';
import { getCookieHeader, jsonResponse, clearSessionCookie } from '../lib/node-helpers.js';

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    // Get session cookie
    const cookieHeader = getCookieHeader(req);
    const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
    const sessionId = sessionMatch?.[1];

    if (sessionId) {
      let teable;
      try {
        teable = getTeableClient();
      } catch (e: any) {
        console.error('Teable client init failed:', e?.message || e);
        return jsonResponse(res, 500, { ok: false, code: 'TEABLE_CONFIG_ERROR', error: e?.message || 'Teable configuration error' });
      }

      // Delete session server-side
      try {
        const sessionRecords = await teable.listRecords('tblap3ykSwQQk276MdN', {
          filter: 'session_token_hash = "' + sessionId + '"',
          maxRecords: 1,
        });

        if (sessionRecords.records.length > 0) {
          await teable.deleteRecord('tblap3ykSwQQk276MdN', sessionRecords.records[0].id);
        }
      } catch (e: any) {
        console.warn('Failed to delete session:', e?.message || e);
      }
    }

    // Clear cookie
    clearSessionCookie(res);
    return jsonResponse(res, 200, { authenticated: false });
  } catch (error: any) {
    console.error('Logout error:', error?.message || error);
    clearSessionCookie(res);
    return jsonResponse(res, 200, { authenticated: false });
  }
}