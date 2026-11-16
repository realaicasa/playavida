import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'POST') {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 405);
    return { ok: false, code: 'METHOD_NOT_ALLOWED' };
  }

  const currentUser = await getCurrentUser(event);
  if (!currentUser.authenticated || !currentUser.isSuperadmin) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 403);
    return { ok: false, code: 'FORBIDDEN' };
  }

  let body: any;
  try {
    body = await readBody(event);
  } catch (e: any) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_JSON' };
  }

  const action = body.action;
  const targetType = body.target_type;
  const targetId = body.target_id;

  if (!action || !targetType || !targetId) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_PARAMS' };
  }

  const teable = getTeableClient();

  // Determine table ID based on target type
  let tableId: string | null = null;
  if (targetType === 'business') tableId = process.env.TEABLE_TABLE_BUSINESSES || 'tbl8IOboEGdwYHqJck2';
  else if (targetType === 'user') tableId = process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui';
  // Groups and events would need their table IDs

  if (!tableId) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'UNKNOWN_TARGET_TYPE' };
  }

  try {
    if (action === 'hide') {
      await teable.updateRecord(tableId, targetId, { is_hidden: true });
      await logAuditEvent({
        actor_email: currentUser.user?.email || 'admin',
        action: 'hide',
        target_type: targetType,
        target_id: targetId,
      });
    } else if (action === 'restore') {
      await teable.updateRecord(tableId, targetId, { is_hidden: false });
      await logAuditEvent({
        actor_email: currentUser.user?.email || 'admin',
        action: 'restore',
        target_type: targetType,
        target_id: targetId,
      });
    } else if (action === 'suspend' && targetType === 'user') {
      await teable.updateRecord(tableId, targetId, { account_status: 'suspended' });
      await logAuditEvent({
        actor_email: currentUser.user?.email || 'admin',
        action: 'suspend',
        target_type: targetType,
        target_id: targetId,
      });
    } else if (action === 'restore_user' && targetType === 'user') {
      await teable.updateRecord(tableId, targetId, { account_status: 'active' });
      await logAuditEvent({
        actor_email: currentUser.user?.email || 'admin',
        action: 'restore_user',
        target_type: targetType,
        target_id: targetId,
      });
    } else if (action === 'purge') {
      if (body.confirmation !== 'DELETE') {
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 400);
        return { ok: false, code: 'CONFIRMATION_REQUIRED' };
      }
      await teable.deleteRecord(tableId, targetId);
      await logAuditEvent({
        actor_email: currentUser.user?.email || 'admin',
        action: 'purge',
        target_type: targetType,
        target_id: targetId,
      });
    } else {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_ACTION' };
    }

    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return { ok: true };
  } catch (e: any) {
    console.error('Moderation action failed:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'MODERATION_FAILED', error: e?.message || 'Unknown error' };
  }
}