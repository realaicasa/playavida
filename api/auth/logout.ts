import { getTeableClient } from '../lib/teable';

export default async function handler(
  request: Request,
  response: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (body: object) => void };
  }
): Promise<void> {
  const jsonResponse = (res: typeof response, status: number, body: object) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(body);
  };

  if (request.method !== 'POST') {
    return jsonResponse(response, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
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
    return jsonResponse(response, 200, { authenticated: false });
  } catch (error: any) {
    console.error('Logout error:', error?.message || error);
    return jsonResponse(response, 200, { authenticated: false });
  }
}