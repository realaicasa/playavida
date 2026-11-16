import { getMethod } from 'h3';
import { jsonResponse } from '../../lib/node-helpers.js';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method === 'GET') {
    return jsonResponse(event, 200, { ok: true });
  }

  return jsonResponse(event, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
}