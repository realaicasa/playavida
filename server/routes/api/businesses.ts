import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../lib/auth.js';
import { getTeableClient } from '../../lib/teable.js';

const BUSINESSES_TABLE_ID = process.env.TEABLE_TABLE_BUSINESSES || 'tbl8IOboEGdwYHqJck2';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method === 'GET') {
    const url = new URL(event.req.url || '/', 'http://localhost');
    const search = url.searchParams.get('search') || '';
    const currentUser = await getCurrentUser(event);

    try {
      const teable = getTeableClient();
      const records = await teable.listRecords(BUSINESSES_TABLE_ID, { maxRecords: 200 });

      let businesses = records.records.map((r) => {
        const f = r.fields as any;
        const isPro = f.is_pro === true;
        const isHidden = f.is_hidden === true;
        const isDemo = f.is_demo === true || f.is_demo_content === true;

        // Strip contact details for logged-out or non-Pro
        const showContact = currentUser.authenticated && isPro;

        const biz: any = {
          id: r.id,
          name: f.name || '',
          business_reference: f.business_reference || '',
          category: f.category || '',
          description: f.description_es || f.description_en || '',
          is_pro: isPro,
          is_featured: f.is_featured === true,
          is_sponsor: f.is_sponsor === true,
          is_demo: isDemo,
          is_hidden: isHidden,
          unique_ref: f.business_reference || '',
        };

        if (showContact) {
          biz.contact_email = f.contact_email || f.email || '';
          biz.contact_phone = f.contact_phone || f.phone || '';
          biz.website = f.website || '';
          biz.social_links = f.social_links || '';
          biz.booking_link = f.booking_link || f.booking_url || '';
        }

        return biz;
      });

      // Filter hidden and demo (if show_sample_data is false)
      const settings = await (await import('../../lib/site-settings.js')).getSiteSettings();
      if (!settings.show_sample_data) {
        businesses = businesses.filter((b) => !b.is_demo);
      }
      businesses = businesses.filter((b) => !b.is_hidden);

      if (search) {
        const q = search.toLowerCase();
        businesses = businesses.filter((b) => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
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

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 405);
  return { ok: false, code: 'METHOD_NOT_ALLOWED' };
}