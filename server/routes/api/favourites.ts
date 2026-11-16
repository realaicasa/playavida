import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../lib/auth.js';
import { getTeableClient } from '../../lib/teable.js';
import { logAuditEvent } from '../../lib/audit-log.js';

const FAVOURITES_TABLE_ID = process.env.TEABLE_TABLE_FAVOURITES || 'tbl7gZsBR4rUfeh2Osv';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method === 'GET') {
    const currentUser = await getCurrentUser(event);
    if (!currentUser.authenticated) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 401);
      return { ok: false, code: 'UNAUTHORIZED' };
    }

    try {
      const teable = getTeableClient();
      const records = await teable.listRecords(FAVOURITES_TABLE_ID, {
        filter: { fieldId: 'user_id', operator: 'is', value: currentUser.user?.user_id || '' },
        maxRecords: 500,
      });

      const favourites = records.records.map((r) => {
        const f = r.fields as any;
        return {
          id: r.id,
          user_id: f.user_id || '',
          target_type: f.target_type || '',
          target_id: f.target_id || '',
          created_at: f.created_at || '',
        };
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { favourites };
    } catch (e: any) {
      console.error('Failed to fetch favourites:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'FAVOURITES_FETCH_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  if (method === 'POST') {
    const currentUser = await getCurrentUser(event);
    if (!currentUser.authenticated) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 401);
      return { ok: false, code: 'UNAUTHORIZED' };
    }

    let body: any;
    try {
      body = await readBody(event);
    } catch (e: any) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_JSON' };
    }

    const targetType = body.target_type;
    const targetId = body.target_id;

    if (!targetType || !targetId) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_PARAMS' };
    }

    try {
      const teable = getTeableClient();

      // Check if already favourited
      const existing = await teable.listRecords(FAVOURITES_TABLE_ID, {
        filter: {
          conjunction: 'AND',
          conditions: [
            { fieldId: 'user_id', operator: 'is', value: currentUser.user?.user_id || '' },
            { fieldId: 'target_type', operator: 'is', value: targetType },
            { fieldId: 'target_id', operator: 'is', value: targetId },
          ],
        },
        maxRecords: 1,
      });

      if (existing.records.length > 0) {
        // Remove favourite
        await teable.deleteRecord(FAVOURITES_TABLE_ID, existing.records[0].id as string);
        await logAuditEvent({
          actor_email: currentUser.user?.email || 'unknown',
          action: 'remove_favourite',
          target_type: targetType,
          target_id: targetId,
        });

        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 200);
        return { ok: true, favourited: false };
      }

      // Add favourite
      await teable.createRecord(FAVOURITES_TABLE_ID, {
        user_id: currentUser.user?.user_id || '',
        target_type: targetType,
        target_id: targetId,
        created_at: new Date().toISOString(),
      });

      await logAuditEvent({
        actor_email: currentUser.user?.email || 'unknown',
        action: 'add_favourite',
        target_type: targetType,
        target_id: targetId,
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 201);
      return { ok: true, favourited: true };
    } catch (e: any) {
      console.error('Failed to toggle favourite:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'FAVOURITE_TOGGLE_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 405);
  return { ok: false, code: 'METHOD_NOT_ALLOWED' };
}