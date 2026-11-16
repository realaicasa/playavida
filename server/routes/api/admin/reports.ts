import { getMethod, setResponseStatus, setResponseHeader } from 'h3';
import { getCurrentUser } from '../../../lib/auth.js';
import { getTeableClient } from '../../../lib/teable.js';
import { logAuditEvent } from '../../../lib/audit-log.js';

const REPORTS_TABLE_ID = process.env.TEABLE_TABLE_REPORTS;

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

  if (!REPORTS_TABLE_ID) {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return { reports: [], repeatReporters: [], sameIpGroups: [] };
  }

  try {
    const teable = getTeableClient();
    const records = await teable.listRecords(REPORTS_TABLE_ID, { maxRecords: 500 });

    // Compute repeat reporter flags
    const reporterCounts: Record<string, number> = {};
    const ipCounts: Record<string, number> = {};
    for (const r of records.records) {
      const f = r.fields as any;
      const reporterId = f.reporter_id || '';
      const ipHash = f.reporter_ip_hash || '';
      reporterCounts[reporterId] = (reporterCounts[reporterId] || 0) + 1;
      if (ipHash) ipCounts[ipHash] = (ipCounts[ipHash] || 0) + 1;
    }

    const reports = records.records.map((r) => {
      const f = r.fields as any;
      const reporterId = f.reporter_id || '';
      const ipHash = f.reporter_ip_hash || '';
      return {
        id: r.id,
        reporter_id: reporterId,
        reporter_ip_hash: ipHash,
        target_type: f.target_type || '',
        target_id: f.target_id || '',
        reason: f.reason || '',
        status: f.status || 'pending',
        created_at: f.created_at || '',
        repeat_reporter: reporterCounts[reporterId] > 1,
        same_ip: ipHash ? ipCounts[ipHash] > 1 : false,
      };
    });

    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 200);
    return { reports };
  } catch (e: any) {
    console.error('Failed to fetch reports:', e?.message || e);
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    setResponseStatus(event, 500);
    return { ok: false, code: 'REPORTS_FETCH_FAILED', error: e?.message || 'Unknown error' };
  }
}