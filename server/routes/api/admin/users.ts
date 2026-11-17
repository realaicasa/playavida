import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const USERS_TABLE_ID = process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui';

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
    const search = url.searchParams.get('search') || '';

    try {
      const teable = getTeableClient();
      const records = await teable.listRecords(USERS_TABLE_ID, { maxRecords: 200 });

      let users = records.records.map((r) => {
        const f = r.fields as any;
        return {
          id: r.id,
          user_id: f.user_id || '',
          email: f.email || '',
          public_reference: f.public_reference || '',
          account_status: f.account_status || '',
          is_founding_member: f.is_founding_member === true,
          is_suspended: f.account_status === 'suspended',
          created_at: f.created_at || '',
        };
      });

      if (search) {
        const q = search.toLowerCase();
        users = users.filter((u) =>
          u.email.toLowerCase().includes(q) ||
          u.public_reference.toLowerCase().includes(q) ||
          u.user_id.toLowerCase().includes(q)
        );
      }

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { users };
    } catch (e: any) {
      console.error('Failed to fetch users:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'USERS_FETCH_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  if (method === 'POST') {
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

    const teable = getTeableClient();

    // Add founding email
    if (body.action === 'add_founding_email') {
      const email = String(body.email || '').toLowerCase().trim();
      if (!email) {
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 400);
        return { ok: false, code: 'INVALID_EMAIL' };
      }

      try {
        // Check if user exists
        const existing = await teable.listRecords(USERS_TABLE_ID, {
          filter: { fieldId: 'email', operator: 'is', value: email },
          maxRecords: 1,
        });

        if (existing.records.length > 0) {
          await teable.updateRecord(USERS_TABLE_ID, existing.records[0].id as string, {
            is_founding_member: true,
          });
        } else {
          await teable.createRecord(USERS_TABLE_ID, {
            email: email,
            is_founding_member: true,
            created_at: new Date().toISOString(),
          });
        }

        await logAuditEvent({
          actor_email: currentUser.user?.email || 'admin',
          action: 'add_founding_email',
          target_type: 'user',
          target_id: email,
          metadata: { email },
        });

        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 200);
        return { ok: true };
      } catch (e: any) {
        console.error('Failed to add founding email:', e?.message || e);
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 500);
        return { ok: false, code: 'USER_UPDATE_FAILED', error: e?.message || 'Unknown error' };
      }
    }

    // Toggle suspend
    if (body.action === 'toggle_suspend') {
      const userId = body.user_id;
      const suspend = body.suspend === true;
      try {
        await teable.updateRecord(USERS_TABLE_ID, userId, {
          account_status: suspend ? 'suspended' : 'active',
        });

        await logAuditEvent({
          actor_email: currentUser.user?.email || 'admin',
          action: suspend ? 'suspend_user' : 'restore_user',
          target_type: 'user',
          target_id: userId,
        });

        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 200);
        return { ok: true };
      } catch (e: any) {
        console.error('Failed to toggle suspend:', e?.message || e);
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 500);
        return { ok: false, code: 'USER_UPDATE_FAILED', error: e?.message || 'Unknown error' };
      }
    }

    // Toggle demo
    if (body.action === 'toggle_demo') {
      const userId = body.user_id;
      const demo = body.demo === true;
      // Safeguard: never mark miketest@dynamicmike.com as demo
      try {
        const userRecords = await teable.listRecords(USERS_TABLE_ID, {
          filter: { fieldId: 'user_id', operator: 'is', value: userId },
          maxRecords: 1,
        });
        if (userRecords.records.length > 0) {
          const email = (userRecords.records[0].fields.email as string || '').toLowerCase().trim();
          if (email === 'miketest@dynamicmike.com' && demo) {
            setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
            setResponseStatus(event, 400);
            return { ok: false, code: 'SAFEGUARD', message: 'miketest@dynamicmike.com cannot be marked as demo' };
          }
        }
      } catch (e) {
        console.warn('Failed to check user email:', e);
      }

      try {
        await teable.updateRecord(USERS_TABLE_ID, userId, {
          is_demo_account: demo,
        });

        await logAuditEvent({
          actor_email: currentUser.user?.email || 'admin',
          action: demo ? 'mark_demo' : 'unmark_demo',
          target_type: 'user',
          target_id: userId,
        });

        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 200);
        return { ok: true };
      } catch (e: any) {
        console.error('Failed to toggle demo:', e?.message || e);
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 500);
        return { ok: false, code: 'USER_UPDATE_FAILED', error: e?.message || 'Unknown error' };
      }
    }
    if (body.action === 'toggle_founding') {
      const userId = body.user_id;
      const founding = body.founding === true;
      try {
        await teable.updateRecord(USERS_TABLE_ID, userId, {
          is_founding_member: founding,
        });

        await logAuditEvent({
          actor_email: currentUser.user?.email || 'admin',
          action: founding ? 'add_founding_member' : 'remove_founding_member',
          target_type: 'user',
          target_id: userId,
        });

        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 200);
        return { ok: true };
      } catch (e: any) {
        console.error('Failed to toggle founding:', e?.message || e);
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 500);
        return { ok: false, code: 'USER_UPDATE_FAILED', error: e?.message || 'Unknown error' };
      }
    }

    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_ACTION' };
  }

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 405);
  return { ok: false, code: 'METHOD_NOT_ALLOWED' };
}
