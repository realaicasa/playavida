import { getMethod, readBody, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const LOYALTY_PROGRAMS_TABLE_ID = process.env.TEABLE_TABLE_LOYALTY_PROGRAMS || 'tblo1JGtixvMWJuXHdP';
const LOYALTY_LEDGER_TABLE_ID = process.env.TEABLE_TABLE_LOYALTY_LEDGER || 'tblOMabh3mfkiEc9uBm';

export default async function handler(event: any): Promise<any> {
  const method = getMethod(event);

  if (method === 'GET') {
    const currentUser = await getCurrentUser(event);
    if (!currentUser.authenticated || !currentUser.isSuperadmin) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 403);
      return { ok: false, code: 'FORBIDDEN' };
    }

    try {
      const teable = getTeableClient();
      const [programs, ledger] = await Promise.all([
        teable.listRecords(LOYALTY_PROGRAMS_TABLE_ID, { maxRecords: 200 }),
        teable.listRecords(LOYALTY_LEDGER_TABLE_ID, { maxRecords: 500 }),
      ]);

      // Detect anomalies: 5+ stamps at same business within 1 hour
      const anomalies: string[] = [];
      const stampCounts: Record<string, { count: number; timestamps: number[] }> = {};

      for (const r of ledger.records) {
        const f = r.fields as any;
        const businessId = f.business_id || '';
        const userId = f.user_id || '';
        const key = `${businessId}:${userId}`;
        const ts = new Date(f.created_at || f.timestamp || 0).getTime();

        if (!stampCounts[key]) stampCounts[key] = { count: 0, timestamps: [] };
        stampCounts[key].count++;
        stampCounts[key].timestamps.push(ts);
      }

      for (const [key, data] of Object.entries(stampCounts)) {
        if (data.count >= 5) {
          // Check if within 1 hour
          const sorted = data.timestamps.sort();
          const span = sorted[sorted.length - 1] - sorted[0];
          if (span <= 3600000) { // 1 hour in ms
            anomalies.push(key);
          }
        }
      }

      const programsList = programs.records.map((r) => {
        const f = r.fields as any;
        return {
          id: r.id,
          name: f.name || f.program_name || '',
          is_active: f.is_active !== false,
          anomaly: anomalies.some((a) => a.startsWith(r.id)),
        };
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { programs: programsList, anomalies, ledger_count: ledger.records.length };
    } catch (e: any) {
      console.error('Failed to fetch loyalty data:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'LOYALTY_FETCH_FAILED', error: e?.message || 'Unknown error' };
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

    const programId = body.program_id;
    const isActive = body.is_active;

    if (!programId) {
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 400);
      return { ok: false, code: 'INVALID_PARAMS' };
    }

    try {
      const teable = getTeableClient();
      await teable.updateRecord(LOYALTY_PROGRAMS_TABLE_ID, programId, {
        is_active: isActive !== false,
      });

      await logAuditEvent({
        actor_email: currentUser.user?.email || 'admin',
        action: isActive === false ? 'pause_loyalty_program' : 'resume_loyalty_program',
        target_type: 'loyalty_program',
        target_id: programId,
      });

      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 200);
      return { ok: true };
    } catch (e: any) {
      console.error('Failed to update loyalty program:', e?.message || e);
      setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
      setResponseStatus(event, 500);
      return { ok: false, code: 'LOYALTY_UPDATE_FAILED', error: e?.message || 'Unknown error' };
    }
  }

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
  setResponseStatus(event, 405);
  return { ok: false, code: 'METHOD_NOT_ALLOWED' };
}