import { getTeableClient } from '../lib/teable';

export default async function handler(
  request: Request,
  response: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (body: object) => void };
  }
): Promise<void> {
  if (request.method !== 'GET') {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Allow', 'GET');
    response.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    // Get session cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
    const sessionId = sessionMatch?.[1];

    if (!sessionId) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json({ authenticated: false });
      return;
    }

    const teable = getTeableClient();

    // Validate session
    let sessionRecord;
    try {
      const sessionRecords = await teable.listRecords('tblap3ykSwQQk276MdN', {
        filter: `session_token_hash = "${sessionId}" AND expires_at >= "${new Date().toISOString()}"`,
        maxRecords: 1,
      });

      if (sessionRecords.records.length === 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json({ authenticated: false });
        return;
      }

      sessionRecord = sessionRecords.records[0];
    } catch (e) {
      console.error('Session validation error:', e);
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json({ authenticated: false });
      return;
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
      const userRecords = await teable.listRecords('tblB6Wiwy4KOx3Tjgui', {
        filter: `id = "${sessionFields.user_id}"`,
        maxRecords: 1,
      });
      if (userRecords.records.length > 0) {
        publicReference = (userRecords.records[0].fields.public_reference as string) || '';
      }
    } catch (e) {
      console.warn('Failed to fetch user public reference:', e);
    }

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({
      authenticated: true,
      userId: sessionFields.user_id,
      public_reference: publicReference,
      roles,
      businessOwnerships,
      staffAssignments,
      exp: Math.floor(new Date(sessionFields.expires_at).getTime() / 1000),
    });
  } catch (error) {
    console.error('Session validation error:', error);
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ authenticated: false });
  }
}