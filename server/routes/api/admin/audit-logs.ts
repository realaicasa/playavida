import { getMethod, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';

const AUDIT_LOGS_TABLE_ID = process.env.TEABLE_TABLE_AUDIT_LOGS || 'tbl7AF4g74QQFJlHUlF';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'GET') {
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

  const url = new URL(event.req.url || '/', 'http://localhost');
  const adminEmail = url.searchParams.get('admin_email') || '';
  const action = url.searchParams.get('action') || '';
  const targetId = url.searchParams.get('target_id') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = 50;

  try {
    const teable = getTeableClient();
    const records = await teable.listRecords(AUDIT_LOGS_TABLE_ID, { maxRecords: 500 });

    let logs = records.records.map((r) => {
      const f = r.fields as any;
      return {
        id: r.id,
        actor_email: f.actor_email || '',
        action: f.action || '',
        target_type: f.target_type || '',
        target_id: f.target_id || '',
        metadata: f.metadata || '',
        created_at: f.created_at || '',
      };
    });

    // Sort newest first
    logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Filters
    if (adminEmail) {
      const q = adminEmail.toLowerCase();
      logs = logs.filter((l) => l.actor_email.toLowerCase().includes(q));
    }
    if (action) {
      const q = action.toLowerCase();
      logs = logs.filter((l) => l.action.toLowerCase().includes(q));
    }
    if (targetId) {
      const q = targetId.toLowerCase();
      logs = logs.filter((l) => l.target_id.toLowerCase().includes(q));
    }

    const total = logs.length;
    const start = (page - 1) * pageSize;
    const paged = logs.slice(start, start + pageSize);

    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return { logs: paged, total, page, pageSize };
  } catch (e: any) {
    console.error('Failed to fetch audit logs:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'AUDIT_LOGS_FETCH_FAILED', error: e?.message || 'Unknown error' };
  }
}