import { getTeableClient } from '../lib/teable';

export default async function handler(
  request: Request,
  response: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (body: object) => void };
  }
): Promise<void> {
  if (request.method !== 'POST') {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Allow', 'POST');
    response.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    // Get session cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
    const sessionId = sessionMatch?.[1];

    if (sessionId) {
      const teable = getTeableClient();

      // Delete session server-side
      try {
        const sessionRecords = await teable.listRecords('tbl_sessions', {
          filter: `session_id = "${sessionId}"`,
          maxRecords: 1,
        });

        if (sessionRecords.records.length > 0) {
          await teable.deleteRecord('tbl_sessions', sessionRecords.records[0].id);
        }
      } catch (e) {
        console.warn('Failed to delete session:', e);
      }
    }

    // Clear cookie
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Set-Cookie', 'session_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');
    response.status(200).json({ authenticated: false });
  } catch (error) {
    console.error('Logout error:', error);
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ authenticated: false });
  }
}