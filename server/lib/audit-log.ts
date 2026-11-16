import { getTeableClient } from './teable.js';

const AUDIT_LOGS_TABLE_ID = process.env.TEABLE_TABLE_AUDIT_LOGS;

export interface AuditLogEntry {
  actor_email: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  if (!AUDIT_LOGS_TABLE_ID) {
    console.warn('TEABLE_TABLE_AUDIT_LOGS not set, skipping audit log');
    return;
  }

  try {
    const teable = getTeableClient();
    await teable.createRecord(AUDIT_LOGS_TABLE_ID, {
      actor_email: entry.actor_email,
      action: entry.action,
      target_type: entry.target_type,
      target_id: entry.target_id,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : '',
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Failed to log audit event:', e);
  }
}