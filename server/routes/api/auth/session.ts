import { H3Event } from 'h3';
import { getTeableClient, Filter } from '../../../lib/teable.js';
import { getCookieHeader } from '../../../lib/node-helpers.js';

const SESSIONS_TABLE_ID = process.env.TEABLE_SESSIONS_TABLE_ID;
if (!SESSIONS_TABLE_ID) {
  throw new Error('TEABLE_SESSIONS_TABLE_ID environment variable is required');
}
const USERS_TABLE_ID = process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui';

function jsonResponse(res: any, status: number, body: object): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

function getCookieHeader(req: any): string {
  return req.headers.cookie || '';
}

export default async function handler(event: any): Promise<void> {
  const req = event.node.req;
  const res = event.node.res;

  if (req.method !== 'GET') {
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

    if (!sessionId) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

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

    // Validate session
    let sessionRecord;
    try {
      const sessionRecords = await teable.listRecords(SESSIONS_TABLE_ID, {
        filter: { fieldId: 'session_token_hash', operator: 'is', value: sessionId as string },
        maxRecords: 1,
      });

      if (sessionRecords.records.length === 0) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
      }

      sessionRecord = sessionRecords.records[0];
    } catch (e: any) {
      console.error('Session validation error:', e?.message || e);
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    const sessionFields = sessionRecord.fields as any;

    // Update last seen
    try {
      await teable.updateRecord(SESSIONS_TABLE_ID, sessionRecord.id as string, {
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
      const userRecords = await getTeableClient().listRecords(USERS_TABLE_ID, {
        filter: { fieldId: 'id', operator: 'is', value: sessionFields.user_id as string },
        maxRecords: 1,
      });
      if (userRecords.records.length > 0) {
        publicReference = (userRecords.records[0].fields.public_reference as string) || '';
      }
    } catch (e) {
      console.warn('Failed to fetch user public reference:', e);
    }

    const responseBody = JSON.stringify({
      authenticated: true,
      userId: sessionFields.user_id as string,
      public_reference: publicReference,
      roles: JSON.parse(sessionFields.roles || '["member"]'),
      businessOwnerships: JSON.parse(sessionFields.business_ownerships || '[]'),
      staffAssignments: JSON.parse(sessionFields.staff_assignments || '[]'),
      exp: Math.floor(new Date(sessionFields.expires_at as string).getTime() / 1000),
    });

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({
      authenticated: true,
      userId: sessionFields.user_id as string,
      public_reference: publicReference,
      roles: JSON.parse(sessionFields.roles || '["member"]'),
      businessOwnerships: JSON.parse(sessionFields.business_ownerships || '[]'),
      staffAssignments: JSON.parse(sessionFields.staff_assignments || '[]'),
      exp: Math.floor(new Date(sessionFields.expires_at as string).getTime() / 1000),
    }));
  } catch (error: any) {
    console.error('Session validation error:', error?.message || error);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({ authenticated: false }));
  }
}