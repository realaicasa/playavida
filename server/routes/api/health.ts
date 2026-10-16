import type { IncomingMessage, ServerResponse } from 'http';
import { jsonResponse } from '../../lib/node-helpers.ts';

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method === 'GET') {
    return jsonResponse(res, 200, { ok: true });
  }

  return jsonResponse(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
}