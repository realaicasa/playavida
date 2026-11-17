import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../lib/auth.js';
import { getTeableClient } from '../../lib/teable.js';
import { logAuditEvent } from '../../lib/audit-log.js';

const EVENTS_TABLE_ID = process.env.TEABLE_TABLE_EVENTS || 'tbl70Xi6rZEYQas9DRt';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method === 'GET') {
    const url = new URL(event.req.url || '/', 'http://localhost');
    const search = url.searchParams.get('search') || '';

    try {
      const teable = getTeableClient();
      const records = await teable.listRecords(EVENTS_TABLE_ID, { maxRecords: 200 });

      let events = records.records.map((r) => {
        const f = r.fields as any;
        return {
          id: r.id,
          event_title: f.event_title || '',
          owner_id: f.owner_id || '',
          description: f.description || '',
          event_date: f.event_date || '',
          event_time: f.event_time || '',
          location: f.location || '',
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
        events = events.filter((e) => e.event_title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
      }

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { events };
    } catch (e: any) {
      console.error('Failed to fetch events:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'EVENTS_FETCH_FAILED', error: e?.message || 'Unknown error' };
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

      // Check if user is a founding member
      let isFoundingMember = false;
      try {
        const userRecords = await teable.listRecords(process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui', {
          filter: { fieldId: 'user_id', operator: 'is', value: currentUser.user?.user_id || '' },
          maxRecords: 1,
        });
        if (userRecords.records.length > 0) {
          isFoundingMember = userRecords.records[0].fields.is_founding_member === true;
        }
      } catch (e) {
        console.warn('Failed to check founding member status:', e);
      }

      const record = await teable.createRecord(EVENTS_TABLE_ID, {
        event_title: body.event_title || '',
        owner_id: currentUser.user?.user_id || '',
        description: body.description || '',
        event_date: body.event_date || '',
        event_time: body.event_time || '',
        location: body.location || '',
        category: body.category || '',
        is_featured: isFoundingMember,
        is_demo: body.is_demo === true,
        is_hidden: false,
        unique_ref: body.unique_ref || `EVT-${Date.now()}`,
        created_at: new Date().toISOString(),
      });

      await logAuditEvent({
        actor_email: currentUser.user?.email || 'unknown',
        action: 'create_event',
        target_type: 'event',
        target_id: record.records[0].id,
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 201);
      return { ok: true, id: record.records[0].id };
    } catch (e: any) {
      console.error('Failed to create event:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'EVENT_CREATE_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 405);
  return { ok: false, code: 'METHOD_NOT_ALLOWED' };
}