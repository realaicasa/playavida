import { getTeableClient } from './teable.js';

const FOUNDER_ENTITLEMENTS_TABLE_ID = 'tblqy2myxpOouJ3tmIw';

export interface FounderEntitlement {
  email: string;
  display_name: string;
  is_founding_member: boolean;
  unlimited_pro: boolean;
  featured_businesses: boolean;
  featured_groups: boolean;
  featured_events: boolean;
}

export async function lookupFounderEntitlement(email: string): Promise<FounderEntitlement | null> {
  if (!email) return null;

  const normalizedEmail = email.toLowerCase().trim();
  const teable = getTeableClient();

  try {
    const records = await teable.listRecords(FOUNDER_ENTITLEMENTS_TABLE_ID, {
      filter: { fieldId: 'email', operator: 'is', value: normalizedEmail },
      maxRecords: 1,
    });

    if (records.records.length === 0) return null;

    const fields = records.records[0].fields as any;
    const status = fields.status || '';
    const accessStatus = fields.access_status || '';

    // Only active founders
    if (status !== 'active' && accessStatus !== 'active') {
      // Still check — some records might not have status set
      if (status && status !== 'active') return null;
    }

    return {
      email: normalizedEmail,
      display_name: fields.display_name || '',
      is_founding_member: true,
      unlimited_pro: fields.unlimited_pro === true,
      featured_businesses: fields.featured_businesses === true,
      featured_groups: fields.featured_groups === true,
      featured_events: fields.featured_events === true,
    };
  } catch (e) {
    console.warn('Failed to lookup founder entitlement:', e);
    return null;
  }
}

export async function isFoundingMember(email: string): Promise<boolean> {
  const entitlement = await lookupFounderEntitlement(email);
  return entitlement !== null;
}