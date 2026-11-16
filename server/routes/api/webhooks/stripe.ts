import { getMethod, setResponseStatus, setResponseHeader } from 'h3';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

function verifyStripeSignature(payload: string, signature: string, secret: string): boolean {
  // Stripe signature format: t=timestamp,v1=signature
  const parts = signature.split(',');
  const timestamp = parts.find((p) => p.startsWith('t='))?.split('=')[1];
  const sig = parts.find((p) => p.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !sig) return false;

  // Check timestamp tolerance (5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
}

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method !== 'POST') {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 405);
    return { ok: false, code: 'METHOD_NOT_ALLOWED' };
  }

  if (!WEBHOOK_SECRET) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'WEBHOOK_SECRET_NOT_CONFIGURED' };
  }

  // Read raw body
  let rawBody: string;
  try {
    const chunks: Buffer[] = [];
    const req = (event as any).req || (event as any).node?.req;
    if (req) {
      for await (const chunk of req) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, 'utf8');
        chunks.push(buf);
      }
      rawBody = Buffer.concat(chunks).toString('utf8');
    } else {
      const body = await (await import('h3')).readBody(event);
      rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    }
  } catch (e: any) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_BODY' };
  }

  const signature = (event.req?.headers?.['stripe-signature'] as string) ||
    (typeof event.headers?.get === 'function' ? event.headers.get('stripe-signature') : '') || '';

  if (!signature) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'MISSING_SIGNATURE' };
  }

  if (!verifyStripeSignature(rawBody, signature, WEBHOOK_SECRET)) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_SIGNATURE' };
  }

  let stripeEvent: any;
  try {
    stripeEvent = JSON.parse(rawBody);
  } catch (e) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 400);
    return { ok: false, code: 'INVALID_JSON' };
  }

  // Log webhook event
  await logAuditEvent({
    actor_email: 'stripe-webhook',
    action: `stripe_${stripeEvent.type}`,
    target_type: 'stripe',
    target_id: stripeEvent.id,
    metadata: { type: stripeEvent.type, data: stripeEvent.data },
  });

  // Handle checkout.session.completed
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data?.object;
    const clientRef = session?.client_reference_id; // format: target_type:target_id:tier

    if (!clientRef) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { ok: true, message: 'No client_reference_id, skipping' };
    }

    const parts = clientRef.split(':');
    if (parts.length !== 3) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_CLIENT_REFERENCE' };
    }

    const [targetType, targetId, tier] = parts;
    const teable = getTeableClient();

    // Determine table ID and field updates
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

      await logAuditEvent({
        actor_email: 'stripe-webhook',
        action: `activate_${tier}`,
        target_type: targetType,
        target_id: targetId,
        metadata: { tier, client_reference_id: clientRef },
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { ok: true, message: `${tier} activated for ${targetType} ${targetId}` };
    } catch (e: any) {
      console.error('Failed to update record:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'UPDATE_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  // Default: acknowledge webhook
  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 200);
  return { ok: true, message: 'Webhook received' };
}