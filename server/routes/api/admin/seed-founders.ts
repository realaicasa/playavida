import { getMethod, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const USERS_TABLE_ID = process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui';

const FOUNDERS = [
  { email: 'franckpropertysquare@gmail.com', name: 'Franck Robert' },
  { email: 'loryes2001@yahoo.com.mx', name: 'Lorena' },
  { email: 'elybecvue87@icloud.com', name: 'Ely Becerril' },
  { email: 'ely_b@coldwellbanker.com.mx', name: 'Ely Becerril' },
  { email: 'info@freedomplaya.com', name: 'Letitia Montana' },
  { email: 'fordbjay@gmail.com', name: 'Brian Ford' },
  { email: 'pinedadreamhomes@gmail.com', name: 'Susy' },
  { email: 'travelmap8@gmail.com', name: 'Victoria' },
  { email: 'arbelsustaitarealestate@gmail.com', name: 'Arbel Sustaita Real Estate' },
  { email: 'almarerealestate@gmail.com', name: 'Alejandra Almare' },
  { email: 'pranatowers@gmail.com', name: 'Ruben Mondragon' },
  { email: 'miketest@dynamicmike.com', name: 'Mike Test' },
  { email: 'taniago.realty@gmail.com', name: 'Tania Go' },
  { email: 'kyrinveritas@gmail.com', name: 'Kyrin Veritas' },
  { email: 'vromeroarq@gmail.com', name: 'Veronica Romero' },
  { email: 'goes@archinblue.com', name: 'Gustavo Escobar' },
  { email: 'info@silviagalambosi.com', name: 'Silvia Galambosi' },
  { email: 'meybell@unlimited-travels.eu', name: 'Meybell Gonzalez' },
  { email: 'meybell.gonzalez@bio-natural.mx', name: 'Meybell Gonzalez' },
  { email: 'tierrasantasuyab21@gmail.com', name: 'Jacqueline Francasi' },
  { email: 'speaklikealocal15@gmail.com', name: 'Philip Arsenault' },
];

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

  const teable = getTeableClient();
  let created = 0;
  let updated = 0;

  for (const founder of FOUNDERS) {
    const email = founder.email.toLowerCase().trim();
    try {
      const existing = await teable.listRecords(USERS_TABLE_ID, {
        filter: { fieldId: 'email', operator: 'is', value: email },
        maxRecords: 1,
      });

      const fields = {
        email: email,
        is_founding_member: true,
        is_demo_account: false,
        pro_status: 'lifetime_paid',
        featured_perk: true,
        updated_at: new Date().toISOString(),
      };

      if (existing.records.length > 0) {
        await teable.updateRecord(USERS_TABLE_ID, existing.records[0].id as string, fields);
        updated++;
      } else {
        await teable.createRecord(USERS_TABLE_ID, {
          ...fields,
          user_id: email,
          public_reference: `USR-${email.split('@')[0].substring(0, 6).toUpperCase()}`,
          account_status: 'active',
          created_at: new Date().toISOString(),
        });
        created++;
      }
    } catch (e: any) {
      console.error(`Failed to seed founder ${email}:`, e?.message || e);
    }
  }

  await logAuditEvent({
    actor_email: currentUser.user?.email || 'admin',
    action: 'seed_founders',
    target_type: 'system',
    target_id: 'founders_allowlist',
    metadata: { created, updated, total: FOUNDERS.length },
  });

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 200);
  return { ok: true, created, updated, total: FOUNDERS.length };
}