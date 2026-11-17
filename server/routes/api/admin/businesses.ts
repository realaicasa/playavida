import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const BUSINESSES_TABLE_ID = process.env.TEABLE_TABLE_BUSINESSES || 'tbl8IOboEGdwYHqJck2';

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
      const records = await teable.listRecords(BUSINESSES_TABLE_ID, { maxRecords: 200 });

      let businesses = records.records.map((r) => {
        const f = r.fields as any;
        return {
          id: r.id,
          name: f.name || '',
          is_pro: f.is_pro === true,
          is_featured: f.is_featured === true,
          is_sponsor: f.is_sponsor === true,
          is_demo: f.is_demo === true,
          is_hidden: f.is_hidden === true,
        };
      });

      if (search) {
        const q = search.toLowerCase();
        businesses = businesses.filter((b) => b.name.toLowerCase().includes(q));
      }

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { businesses };
    } catch (e: any) {
      console.error('Failed to fetch businesses:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'BUSINESSES_FETCH_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  if (method === 'PATCH') {
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

    if (body.action === 'toggle_hidden') {
      const businessId = body.business_id;
      const hidden = body.hidden === true;
      try {
        await teable.updateRecord(BUSINESSES_TABLE_ID, businessId, {
          is_hidden: hidden,
        });

        await logAuditEvent({
          actor_email: currentUser.user?.email || 'admin',
          action: hidden ? 'hide_business' : 'restore_business',
          target_type: 'business',
          target_id: businessId,
        });

        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 200);
        return { ok: true };
      } catch (e: any) {
        console.error('Failed to toggle hidden:', e?.message || e);
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 500);
        return { ok: false, code: 'BUSINESS_UPDATE_FAILED', error: e?.message || 'Unknown error' };
      }
    }

    if (body.action === 'transfer_ownership') {
      const businessId = body.business_id;
      const newOwnerEmail = String(body.new_owner_email || '').toLowerCase().trim();
      if (!businessId || !newOwnerEmail) {
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 400);
        return { ok: false, code: 'INVALID_PARAMS' };
      }
      try {
        // Find user by email
        const userRecords = await teable.listRecords(process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui', {
          filter: { fieldId: 'email', operator: 'is', value: newOwnerEmail },
          maxRecords: 1,
        });
        if (userRecords.records.length === 0) {
          setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
          setResponseStatus(event, 404);
          return { ok: false, code: 'USER_NOT_FOUND' };
        }
        const newOwnerId = userRecords.records[0].fields.user_id || userRecords.records[0].id;

        await teable.updateRecord(BUSINESSES_TABLE_ID, businessId, {
          created_by_user_id: newOwnerId,
        });

        await logAuditEvent({
          actor_email: currentUser.user?.email || 'admin',
          action: 'transfer_ownership',
          target_type: 'business',
          target_id: businessId,
          metadata: { new_owner_email: newOwnerEmail, new_owner_id: newOwnerId, audit_reason: body.audit_reason },
        });

        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 200);
        return { ok: true };
      } catch (e: any) {
        console.error('Failed to transfer ownership:', e?.message || e);
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 500);
        return { ok: false, code: 'BUSINESS_UPDATE_FAILED', error: e?.message || 'Unknown error' };
      }
    }

    if (body.action === 'tier_override') {
      const businessId = body.business_id;
      const updates: Record<string, unknown> = {};
      if (body.is_pro !== undefined) updates.is_pro = body.is_pro === true;
      if (body.is_sponsor !== undefined) updates.is_sponsor = body.is_sponsor === true;
      if (body.is_featured !== undefined) updates.is_featured = body.is_featured === true;
      if (body.pro_expires_at) updates.pro_expires_at = body.pro_expires_at;
      if (body.sponsor_expires_at) updates.sponsor_expires_at = body.sponsor_expires_at;
      if (body.featured_expires_at) updates.featured_expires_at = body.featured_expires_at;

      if (!body.audit_reason) {
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 400);
        return { ok: false, code: 'AUDIT_REASON_REQUIRED' };
      }

      try {
        await teable.updateRecord(BUSINESSES_TABLE_ID, businessId, updates);

        await logAuditEvent({
          actor_email: currentUser.user?.email || 'admin',
          action: 'tier_override',
          target_type: 'business',
          target_id: businessId,
          metadata: { updates, audit_reason: body.audit_reason },
        });

        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 200);
        return { ok: true };
      } catch (e: any) {
        console.error('Failed to override tier:', e?.message || e);
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 500);
        return { ok: false, code: 'BUSINESS_UPDATE_FAILED', error: e?.message || 'Unknown error' };
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