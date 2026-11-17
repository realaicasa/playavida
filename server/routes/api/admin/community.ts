import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const GROUPS_TABLE_ID = process.env.TEABLE_TABLE_GROUPS || 'tblff9Xqm9bvfuAdjps';
const EVENTS_TABLE_ID = process.env.TEABLE_TABLE_EVENTS || 'tbl70Xi6rZEYQas9DRt';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method === 'GET') {
    const currentUser = await getCurrentUser(event);
    if (!currentUser.authenticated || !currentUser.isSuperadmin) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 403);
      return { ok: false, code: 'FORBIDDEN' };
    }

    const url = new URL(event.req.url || '/', 'http://localhost');
    const filter = url.searchParams.get('filter') || 'all';
    const search = url.searchParams.get('search') || '';

    try {
      const teable = getTeableClient();
      const [groupRecords, eventRecords] = await Promise.all([
        teable.listRecords(GROUPS_TABLE_ID, { maxRecords: 200 }),
        teable.listRecords(EVENTS_TABLE_ID, { maxRecords: 200 }),
      ]);

      let items: any[] = [];

      if (filter === 'all' || filter === 'groups' || filter === 'featured' || filter === 'hidden') {
        for (const r of groupRecords.records) {
          const f = r.fields as any;
          const isFeatured = f.is_featured === true;
          const isHidden = f.is_hidden === true;
          if (filter === 'featured' && !isFeatured) continue;
          if (filter === 'hidden' && !isHidden) continue;
          items.push({
            type: 'group',
            id: r.id,
            title: f.group_name || '',
            owner_id: f.owner_id || '',
            is_featured: isFeatured,
            featured_expires_at: f.featured_expires_at || null,
            is_demo: f.is_demo === true,
            is_hidden: isHidden,
            event_date: null,
            unique_ref: f.unique_ref || '',
          });
        }
      }

      if (filter === 'all' || filter === 'events' || filter === 'featured' || filter === 'hidden') {
        for (const r of eventRecords.records) {
          const f = r.fields as any;
          const isFeatured = f.is_featured === true;
          const isHidden = f.is_hidden === true;
          if (filter === 'featured' && !isFeatured) continue;
          if (filter === 'hidden' && !isHidden) continue;
          items.push({
            type: 'event',
            id: r.id,
            title: f.event_title || '',
            owner_id: f.owner_id || '',
            is_featured: isFeatured,
            featured_expires_at: f.featured_expires_at || null,
            is_demo: f.is_demo === true,
            is_hidden: isHidden,
            event_date: f.event_date || '',
            unique_ref: f.unique_ref || '',
          });
        }
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter((i) => i.title.toLowerCase().includes(q) || i.owner_id.toLowerCase().includes(q));
      }

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { items };
    } catch (e: any) {
      console.error('Failed to fetch community:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'COMMUNITY_FETCH_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  if (method === 'PATCH') {
    const currentUser = await getCurrentUser(event);
    if (!currentUser.authenticated || !currentUser.isSuperadmin) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 403);
      return { ok: false, code: 'FORBIDDEN' };
    }

    const url = new URL(event.req.url || '/', 'http://localhost');
    const pathParts = url.pathname.split('/');
    // /api/admin/community/:type/:id
    const type = pathParts[4]; // group or event
    const id = pathParts[5];

    if (!type || !id || (type !== 'group' && type !== 'event')) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_PARAMS' };
    }

    let body: any;
    try {
      body = await readBody(event);
    } catch (e: any) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_JSON' };
    }

    const tableId = type === 'group' ? GROUPS_TABLE_ID : EVENTS_TABLE_ID;

    try {
      const teable = getTeableClient();
      const updates: Record<string, unknown> = {};
      if (body.is_featured !== undefined) updates.is_featured = body.is_featured === true;
      if (body.featured_expires_at) updates.featured_expires_at = body.featured_expires_at;
      if (body.is_hidden !== undefined) updates.is_hidden = body.is_hidden === true;
      if (body.event_date) updates.event_date = body.event_date;

      await teable.updateRecord(tableId, id, updates);

      await logAuditEvent({
        actor_email: currentUser.user?.email || 'admin',
        action: body.action || 'update',
        target_type: type,
        target_id: id,
        metadata: updates,
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { ok: true };
    } catch (e: any) {
      console.error('Failed to update community item:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'COMMUNITY_UPDATE_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  if (method === 'DELETE') {
    const currentUser = await getCurrentUser(event);
    if (!currentUser.authenticated || !currentUser.isSuperadmin) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 403);
      return { ok: false, code: 'FORBIDDEN' };
    }

    const url = new URL(event.req.url || '/', 'http://localhost');
    const pathParts = url.pathname.split('/');
    const type = pathParts[4];
    const id = pathParts[5];

    if (!type || !id || (type !== 'group' && type !== 'event')) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_PARAMS' };
    }

    const tableId = type === 'group' ? GROUPS_TABLE_ID : EVENTS_TABLE_ID;

    try {
      const teable = getTeableClient();
      await teable.deleteRecord(tableId, id);

      await logAuditEvent({
        actor_email: currentUser.user?.email || 'admin',
        action: 'purge',
        target_type: type,
        target_id: id,
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { ok: true };
    } catch (e: any) {
      console.error('Failed to purge community item:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'COMMUNITY_PURGE_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 405);
  return { ok: false, code: 'METHOD_NOT_ALLOWED' };
}