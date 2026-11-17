import { getTeableClient } from './teable.js';

const SITE_SETTINGS_TABLE_ID = process.env.TEABLE_TABLE_SITE_SETTINGS;

const DEFAULT_SETTINGS = {
  launch_mode_enabled: true,
  waitlist_url: 'https://list.playavida.org/wait',
  show_sample_data: true,
  brand_name: 'PlayaVida',
  place_name: 'Playa del Carmen',
  currency: 'MXN',
  legal_privacy_en: '',
  legal_privacy_es: '',
  legal_terms_en: '',
  legal_terms_es: '',
  maintenance_readonly: false,
  banner_enabled: false,
  banner_text: '',
  banner_link: '',
  banner_tone: 'info' as 'info' | 'promo' | 'alert',
};

export interface SiteSettings {
  launch_mode_enabled: boolean;
  waitlist_url: string;
  show_sample_data: boolean;
  brand_name: string;
  place_name: string;
  currency: string;
  legal_privacy_en: string;
  legal_privacy_es: string;
  legal_terms_en: string;
  legal_terms_es: string;
  maintenance_readonly: boolean;
  banner_enabled: boolean;
  banner_text: string;
  banner_link: string;
  banner_tone: 'info' | 'promo' | 'alert';
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!SITE_SETTINGS_TABLE_ID) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const teable = getTeableClient();
    const records = await teable.listRecords(SITE_SETTINGS_TABLE_ID, { maxRecords: 1 });
    if (records.records.length > 0) {
      const fields = records.records[0].fields as any;
      return {
        launch_mode_enabled: fields.launch_mode_enabled === true || fields.launch_mode_enabled === 'true',
        waitlist_url: fields.waitlist_url || DEFAULT_SETTINGS.waitlist_url,
        show_sample_data: fields.show_sample_data === true || fields.show_sample_data === 'true',
        brand_name: fields.brand_name || DEFAULT_SETTINGS.brand_name,
        place_name: fields.place_name || DEFAULT_SETTINGS.place_name,
        currency: fields.currency || DEFAULT_SETTINGS.currency,
        legal_privacy_en: fields.legal_privacy_en || '',
        legal_privacy_es: fields.legal_privacy_es || '',
        legal_terms_en: fields.legal_terms_en || '',
        legal_terms_es: fields.legal_terms_es || '',
        maintenance_readonly: fields.maintenance_readonly === true || fields.maintenance_readonly === 'true',
        banner_enabled: fields.banner_enabled === true || fields.banner_enabled === 'true',
        banner_text: fields.banner_text || '',
        banner_link: fields.banner_link || '',
        banner_tone: fields.banner_tone || 'info',
      };
    }
  } catch (e) {
    console.warn('Failed to fetch SiteSettings, using defaults:', e);
  }

  return { ...DEFAULT_SETTINGS };
}

export async function updateSiteSettings(fields: Partial<SiteSettings>): Promise<void> {
  if (!SITE_SETTINGS_TABLE_ID) {
    throw new Error('TEABLE_TABLE_SITE_SETTINGS environment variable is required');
  }

  const teable = getTeableClient();
  const records = await teable.listRecords(SITE_SETTINGS_TABLE_ID, { maxRecords: 1 });

  if (records.records.length > 0) {
    await teable.updateRecord(SITE_SETTINGS_TABLE_ID, records.records[0].id as string, fields as any);
  } else {
    await teable.createRecord(SITE_SETTINGS_TABLE_ID, fields as any);
  }
}

export async function createSiteSettingsTable(): Promise<string | null> {
  const baseId = process.env.TEABLE_BASE_ID;
  const apiKey = process.env.TEABLE_API_KEY;
  const apiUrl = process.env.TEABLE_API_BASE;

  if (!baseId || !apiKey || !apiUrl) {
    console.warn('Missing Teable config for table creation');
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/base/${baseId}/table`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'SiteSettings',
        fields: [
          { name: 'brand_name', type: 'singleLineText', options: { defaultValue: 'PlayaVida' } },
          { name: 'launch_mode_enabled', type: 'checkbox', options: { defaultValue: true } },
          { name: 'waitlist_url', type: 'singleLineText', options: { defaultValue: 'https://list.playavida.org/wait' } },
          { name: 'show_sample_data', type: 'checkbox', options: { defaultValue: true } },
          { name: 'place_name', type: 'singleLineText', options: { defaultValue: 'Playa del Carmen' } },
          { name: 'currency', type: 'singleLineText', options: { defaultValue: 'MXN' } },
          { name: 'legal_privacy_en', type: 'longText' },
          { name: 'legal_privacy_es', type: 'longText' },
          { name: 'legal_terms_en', type: 'longText' },
          { name: 'legal_terms_es', type: 'longText' },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to create SiteSettings table:', response.status, error);
      return null;
    }

    const data = await response.json();
    console.log('SiteSettings table created:', data);
    return data.id || data.tableId || null;
  } catch (e) {
    console.error('Error creating SiteSettings table:', e);
    return null;
  }
}