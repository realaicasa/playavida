import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const TIERS: Record<string, { amount: number; durationDays: number; label: string }> = {
  business_pro: { amount: 240000, durationDays: 90, label: 'Business Pro (3 months)' },
  sponsor: { amount: 360000, durationDays: 90, label: 'Sponsor Slot (3 months)' },
  featured_business: { amount: 360000, durationDays: 90, label: 'Featured Business (3 months)' },
  featured_group: { amount: 360000, durationDays: 90, label: 'Featured Group (3 months)' },
  featured_event: { amount: 30000, durationDays: 30, label: 'Featured Event (1 month)' },
};

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

  const targetType = body.target_type; // 'business' | 'group' | 'event'
  const targetId = body.target_id;
  const tier = body.tier;

  if (!targetType || !targetId || !tier || !TIERS[tier]) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_PARAMS' };
  }

  // Verify ownership
  const tableId = targetType === 'business' ? (process.env.TEABLE_TABLE_BUSINESSES || 'tbl8IOboEGdwYHqJck2')
    : targetType === 'group' ? (process.env.TEABLE_TABLE_GROUPS || 'tblff9Xqm9bvfuAdjps')
    : targetType === 'event' ? (process.env.TEABLE_TABLE_EVENTS || 'tbl70Xi6rZEYQas9DRt')
    : null;

  if (!tableId) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'UNKNOWN_TARGET_TYPE' };
  }

  const teable = getTeableClient();

  // Verify ownership
  try {
    const record = await teable.getRecord(tableId, targetId);
    const fields = record.fields as any;
    const ownerId = fields.owner_id || fields.created_by_user_id;
    const userId = currentUser.user?.user_id || currentUser.user?.id;
    if (ownerId !== userId && !currentUser.isSuperadmin) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 403);
      return { ok: false, code: 'NOT_OWNER' };
    }

    // Check if founding member (hide CTA for founders)
    const userRecords = await teable.listRecords(process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui', {
      filter: { fieldId: 'email', operator: 'is', value: currentUser.user?.email || '' },
      maxRecords: 1,
    });
    if (userRecords.records.length > 0) {
      const userFields = userRecords.records[0].fields as any;
      if (userFields.is_founding_member === true || userFields.pro_status === 'lifetime_paid') {
        setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
        setResponseStatus(event, 400);
        return { ok: false, code: 'FOUNDING_MEMBER_LIFETIME', message: 'Founding members have lifetime access' };
      }
    }
  } catch (e: any) {
    console.error('Ownership verification failed:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 404);
    return { ok: false, code: 'TARGET_NOT_FOUND', error: e?.message || 'Unknown error' };
  }

  // Check maintenance mode
  const { getSiteSettings } = await import('../../../lib/site-settings.js');
  const settings = await getSiteSettings();
  if (settings.maintenance_readonly) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 503);
    return { ok: false, code: 'MAINTENANCE_MODE' };
  }

  // Create Stripe Checkout Session
  const clientRef = `${targetType}:${targetId}:${tier}`;
  const tierInfo = TIERS[tier];

  try {
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'client_reference_id': clientRef,
        'line_items[0][price_data][currency]': 'mxn',
        'line_items[0][price_data][unit_amount]': tierInfo.amount.toString(),
        'line_items[0][price_data][product_data][name]': tierInfo.label,
        'line_items[0][quantity]': '1',
        'success_url': `https://playavida.org/?checkout=success`,
        'cancel_url': `https://playavida.org/?checkout=cancel`,
      }).toString(),
    });

    if (!stripeRes.ok) {
      const error = await stripeRes.text();
      console.error('Stripe checkout creation failed:', error);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'STRIPE_ERROR', error };
    }

    const session = await stripeRes.json();

    await logAuditEvent({
      actor_email: currentUser.user?.email || 'unknown',
      action: 'create_checkout_session',
      target_type: targetType,
      target_id: targetId,
      metadata: { tier, session_id: session.id },
    });

    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return { ok: true, checkout_url: session.url, session_id: session.id };
  } catch (e: any) {
    console.error('Failed to create checkout session:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'CHECKOUT_FAILED', error: e?.message || 'Unknown error' };
  }
}