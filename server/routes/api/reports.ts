import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../lib/auth.js';
import { getTeableClient } from '../../lib/teable.js';
import { logAuditEvent } from '../../lib/audit-log.js';
import crypto from 'crypto';

const REPORTS_TABLE_ID = process.env.TEABLE_TABLE_REPORTS || 'tblMXJBJkxwtugJKI9o';
const AUTH_SECRET = process.env.AUTH_SECRET || 'default-secret';

const HIGH_SEVERITY_REASONS = ['scam_fraud', 'illegal_content', 'hate_harassment'];

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'POST') {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 405);
    return { ok: false, code: 'METHOD_NOT_ALLOWED' };
  }

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
  const reason = body.reason;
  const details = body.details || '';

  if (!targetType || !targetId || !reason) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_PARAMS' };
  }

  // Hash IP
  const ip = (event.req?.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (typeof event.headers?.get === 'function' ? event.headers.get('x-forwarded-for')?.split(',')[0]?.trim() : '') ||
    'unknown';
  const ipHash = crypto.createHash('sha256').update(ip + AUTH_SECRET).digest('hex');

  const isHighSeverity = HIGH_SEVERITY_REASONS.includes(reason);

  try {
    const teable = getTeableClient();
    await teable.createRecord(REPORTS_TABLE_ID, {
      reporter_id: currentUser.user?.user_id || currentUser.user?.id || '',
      reporter_ip_hash: ipHash,
      target_type: targetType,
      target_id: targetId,
      reason: reason,
      details: details,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    // High-severity: auto-hide target
    if (isHighSeverity) {
      let tableId: string | null = null;
      if (targetType === 'business') tableId = process.env.TEABLE_TABLE_BUSINESSES || 'tbl8IOboEGdwYHqJck2';
      else if (targetType === 'user') tableId = process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui';
      else if (targetType === 'group') tableId = process.env.TEABLE_TABLE_GROUPS || 'tblff9Xqm9bvfuAdjps';
      else if (targetType === 'event') tableId = process.env.TEABLE_TABLE_EVENTS || 'tbl70Xi6rZEYQas9DRt';

      if (tableId) {
        try {
          await teable.updateRecord(tableId, targetId, { is_hidden: true });
        } catch (e) {
          console.warn('Failed to auto-hide target:', e);
        }
      }

      // Send notification email to owner (if business)
      if (targetType === 'business' && process.env.RESEND_API_KEY) {
        try {
          // Look up business owner
          const bizRecords = await teable.listRecords(tableId!, { maxRecords: 1 });
          // For now, just log — email to owner would need owner email lookup
          console.log('High-severity report: auto-hid business', targetId);
        } catch (e) {
          console.warn('Failed to notify owner:', e);
        }
      }
    }

    await logAuditEvent({
      actor_email: currentUser.user?.email || 'unknown',
      action: 'submit_report',
      target_type: targetType,
      target_id: targetId,
      metadata: { reason, isHighSeverity },
    });

    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return { ok: true };
  } catch (e: any) {
    console.error('Failed to submit report:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'REPORT_SUBMIT_FAILED', error: e?.message || 'Unknown error' };
  }
}