import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SUBSCRIPTIONS_TABLE_ID = process.env.TEABLE_TABLE_SUBSCRIPTIONS || 'tbloyccWq6gEARYGLJH';

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

  if (!STRIPE_SECRET_KEY) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'STRIPE_NOT_CONFIGURED' };
  }

  let body: any;
  try {
    body = await readBody(event);
  } catch (e: any) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_JSON' };
  }

  const sessionId = body.session_id;
  if (!sessionId || !sessionId.startsWith('cs_')) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_SESSION_ID' };
  }

  try {
    // Fetch session from Stripe
    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
    });

    if (!stripeRes.ok) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'STRIPE_API_ERROR', error: await stripeRes.text() };
    }

    const session = await stripeRes.json();

    if (session.payment_status !== 'paid') {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { ok: false, code: 'UNPAID', message: 'Session payment status: ' + session.payment_status };
    }

    const clientRef = session.client_reference_id;
    if (!clientRef) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'NO_CLIENT_REFERENCE' };
    }

    const parts = clientRef.split(':');
    if (parts.length !== 3) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_CLIENT_REFERENCE' };
    }

    const [targetType, targetId, tier] = parts;

    // Check if already recorded
    const teable = getTeableClient();
    const existing = await teable.listRecords(SUBSCRIPTIONS_TABLE_ID, {
      filter: { fieldId: 'stripe_session_id', operator: 'is', value: sessionId },
      maxRecords: 1,
    });

    if (existing.records.length > 0) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { ok: true, code: 'ALREADY_RECORDED', message: 'Session already fulfilled' };
    }

    // Determine table ID and updates
    let tableId: string | null = null;
    let updates: Record<string, unknown> = {};

    const now = new Date();
    const plus90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const plus30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (targetType === 'business') {
      tableId = process.env.TEABLE_TABLE_BUSINESSES || 'tbl8IOboEGdwYHqJck2';
      if (tier === 'pro') {
        updates = { is_pro: true, pro_expires_at: plus90Days };
      } else if (tier === 'sponsor' || tier === 'featured') {
        updates = { is_sponsor: true, is_featured: true, pro_expires_at: plus90Days };
      }
    } else if (targetType === 'group') {
      tableId = process.env.TEABLE_TABLE_GROUPS || 'tblff9Xqm9bvfuAdjps';
      if (tier === 'sponsor' || tier === 'featured') {
        updates = { is_featured: true };
      }
    } else if (targetType === 'event') {
      tableId = process.env.TEABLE_TABLE_EVENTS || 'tbl70Xi6rZEYQas9DRt';
      if (tier === 'sponsor' || tier === 'featured') {
        updates = { is_featured: true };
      }
    }

    if (!tableId || Object.keys(updates).length === 0) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'UNKNOWN_TARGET_OR_TIER' };
    }

    try {
      await teable.updateRecord(tableId, targetId, updates);

      // Record subscription
      await teable.createRecord(SUBSCRIPTIONS_TABLE_ID, {
        stripe_session_id: sessionId,
        status: 'active',
        created_at: new Date().toISOString(),
      });

      await logAuditEvent({
        actor_email: 'stripe-replay',
        action: `replay_${tier}`,
        target_type: targetType,
        target_id: targetId,
        metadata: { tier, session_id: sessionId },
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { ok: true, code: 'FULFILLED', message: `${tier} activated for ${targetType} ${targetId}` };
    } catch (e: any) {
      console.error('Failed to fulfill:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'FULFILLMENT_FAILED', error: e?.message || 'Unknown error' };
    }
  } catch (e: any) {
    console.error('Stripe replay error:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'REPLAY_FAILED', error: e?.message || 'Unknown error' };
  }
}