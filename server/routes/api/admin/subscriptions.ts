import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
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

  try {
    const teable = getTeableClient();
    const records = await teable.listRecords(SUBSCRIPTIONS_TABLE_ID, { maxRecords: 500 });

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    let totalCollected = 0;
    let activePro = 0;
    let activeSponsors = 0;
    let activeFeatured = 0;
    const expiringSoon: any[] = [];

    for (const r of records.records) {
      const f = r.fields as any;
      const status = f.status || '';
      const periodEnd = f.current_period_end ? new Date(f.current_period_end) : null;

      if (status === 'active') {
        // Count by type (we'd need to join with businesses, but for now count all active)
        activePro++;
      }

      if (periodEnd && periodEnd <= sevenDaysFromNow && periodEnd >= now) {
        expiringSoon.push({
          id: r.id,
          business_id: f.business_id || '',
          status: status,
          expires_at: f.current_period_end,
        });
      }
    }

    const subscriptions = records.records.map((r) => {
      const f = r.fields as any;
      return {
        id: r.id,
        subscription_id: f.subscription_id || '',
        stripe_customer_id: f.stripe_customer_id || '',
        stripe_session_id: f.stripe_session_id || '',
        status: f.status || '',
        current_period_start: f.current_period_start || '',
        current_period_end: f.current_period_end || '',
        created_at: f.created_at || '',
        business_id: f.business_id || '',
        user_id: f.user_id || '',
      };
    });

    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return {
      kpis: {
        total_collected_mxn: totalCollected,
        active_pro: activePro,
        active_sponsors: activeSponsors,
        active_featured: activeFeatured,
        expiring_soon_count: expiringSoon.length,
      },
      expiring_soon: expiringSoon,
      subscriptions,
    };
  } catch (e: any) {
    console.error('Failed to fetch subscriptions:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'SUBSCRIPTIONS_FETCH_FAILED', error: e?.message || 'Unknown error' };
  }
}