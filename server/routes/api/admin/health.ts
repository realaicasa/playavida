import { getMethod, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';

const SUBSCRIPTIONS_TABLE_ID = process.env.TEABLE_TABLE_SUBSCRIPTIONS || 'tbloyccWq6gEARYGLJH';

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

  const start = Date.now();
  let teableStatus = 'ok';
  let teableLatency = 0;
  let lastWebhookAt: string | null = null;

  try {
    const teable = getTeableClient();
    const records = await teable.listRecords(SUBSCRIPTIONS_TABLE_ID, { maxRecords: 1, sort: '-created_at' });
    teableLatency = Date.now() - start;
    if (records.records.length > 0) {
      lastWebhookAt = (records.records[0].fields as any)?.created_at || null;
    }
  } catch (e) {
    teableStatus = 'degraded';
    teableLatency = Date.now() - start;
  }

  const resendStatus = process.env.RESEND_API_KEY ? 'configured' : 'missing';
  const stripeStatus = process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing';

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 200);
  return {
    teable: { status: teableStatus, latency_ms: teableLatency },
    resend: { status: resendStatus },
    stripe: { status: stripeStatus },
    last_webhook_at: lastWebhookAt,
    timestamp: new Date().toISOString(),
  };
}