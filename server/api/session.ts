import { getTeableClient } from '../lib/teable.js';
import type { IncomingMessage, ServerResponse } from 'http';
import { getCookieHeader, jsonResponse } from '../lib/node-helpers.js';

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'GET') {
    return jsonResponse(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    // Get session cookie
    const cookieHeader = getCookieHeader(req);
    const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
    const sessionId = sessionMatch?.[1];

    if (!sessionId) {
      return jsonResponse(res, 200, { authenticated: false });
    }

    let teable;
    try {
      teable = getTeableClient();
    } catch (e: any) {
      console.error('Teable client init failed:', e?.message || e);
      return jsonResponse(res, 500, { ok: false, code: 'TEABLE_CONFIG_ERROR', error: e?.message || 'Teable configuration error' });
    }

    // Validate session
    let sessionRecord;
    try {
      const sessionRecords = await teable.listRecords('tblap3ykSwQQk276MdN', {
        filter: 'session_token_hash = "' + sessionId + '" AND expires_at >= "' + new Date().toISOString() + '"',
        maxRecords: 1,
      });

      if (sessionRecords.records.length === 0) {
        return jsonResponse(res, 200, { authenticated: false });
      }

      sessionRecord = sessionRecords.records[0];
    } catch (e: any) {
      console.error('Session validation error:', e?.message || e);
      return jsonResponse(res, 200, { authenticated: false });
    }

    const sessionFields = sessionRecord.fields as any;

    // Update last seen
    try {
      await teable.updateRecord('tblap3ykSwQQk276MdN', sessionRecord.id, {
        last_seen_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Failed to update session last_seen:', e);
    }

    const roles = JSON.parse(sessionFields.roles || '["member"]');
    const businessOwnerships = JSON.parse(sessionFields.business_ownerships || '[]');
    const staffAssignments = JSON.parse(sessionFields.staff_assignments || '[]');

    // Get user public reference
    let publicReference = '';
    try {
      const userRecords = await getTeableClient().listRecords('tblB6Wiwy4KOx3Tjgui', {
        filter: 'id = "' + sessionFields.user_id + '"',
        maxRecords: 1,
      });
      if (userRecords.records.length > 0) {
        publicReference = (userRecords.records[0].fields.public_reference as string) || '';
      }
    } catch (e) {
      console.warn('Failed to fetch user public reference:', e);
    }

    return jsonResponse(res, 200, {
      authenticated: true,
      userId: sessionFields.user_id,
      public_reference: publicReference,
      roles,
      businessOwnerships,
      staffAssignments,
      exp: Math.floor(new Date(sessionFields.expires_at).getTime() / 1000),
    });
  } catch (error: any) {
    console.error('Session validation error:', error?.message || error);
    return jsonResponse(res, 200, { authenticated: false });
  }
}