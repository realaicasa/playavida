import { getMethod, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'GET') {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 405);
    return { ok: false, code: 'METHOD_NOT_ALLOWED' };
  }

  const result = await getCurrentUser(event);

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 200);
  return {
    authenticated: result.authenticated,
    user: result.user,
    isSuperadmin: result.isSuperadmin,
    isFoundingMember: result.isFoundingMember,
  };
}