import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../lib/auth.js';
import { getTeableClient } from '../../lib/teable.js';
import { logAuditEvent } from '../../lib/audit-log.js';

const GROUPS_TABLE_ID = process.env.TEABLE_TABLE_GROUPS || 'tblff9Xqm9bvfuAdjps';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method === 'GET') {
    const url = new URL(event.req.url || '/', 'http://localhost');
    const search = url.searchParams.get('search') || '';

    try {
      const teable = getTeableClient();
      const records = await teable.listRecords(GROUPS_TABLE_ID, { maxRecords: 200 });

      let groups = records.records.map((r) => {
        const f = r.fields as any;
        return {
          id: r.id,
          group_name: f.group_name || '',
          owner_id: f.owner_id || '',
          description: f.description || '',
          category: f.category || '',
          is_featured: f.is_featured === true,
          is_demo: f.is_demo === true,
          is_hidden: f.is_hidden === true,
          unique_ref: f.unique_ref || '',
          created_at: f.created_at || '',
        };
      });

      if (search) {
        const q = search.toLowerCase();
        groups = groups.filter((g) => g.group_name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
      }

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { groups };
    } catch (e: any) {
      console.error('Failed to fetch groups:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'GROUPS_FETCH_FAILED', error: e?.message || 'Unknown error' };
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

    try {
      const teable = getTeableClient();
      const record = await teable.createRecord(GROUPS_TABLE_ID, {
        group_name: body.group_name || '',
        owner_id: currentUser.user?.user_id || '',
        description: body.description || '',
        category: body.category || '',
        is_featured: false,
        is_demo: body.is_demo === true,
        is_hidden: false,
        unique_ref: body.unique_ref || `GRP-${Date.now()}`,
        created_at: new Date().toISOString(),
      });

      await logAuditEvent({
        actor_email: currentUser.user?.email || 'unknown',
        action: 'create_group',
        target_type: 'group',
        target_id: record.records[0].id,
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 201);
      return { ok: true, id: record.records[0].id };
    } catch (e: any) {
      console.error('Failed to create group:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'GROUP_CREATE_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 405);
  return { ok: false, code: 'METHOD_NOT_ALLOWED' };
}