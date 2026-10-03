import tenantSettingsJson from '../../tenant-settings.json';

type SettingsGroup = 'brand' | 'geography' | 'legal';

class TenantSettingsService {
  private settings: any = tenantSettingsJson;

  constructor() {
    // In production, this would fetch from Teable on init
  }

  get(group: SettingsGroup, key: string, locale: 'en' | 'es' = 'en') {
    const value = this.settings[group]?.[key];
    if (!value) return `[MISSING: ${group}.${key}]`;
    
    // Simple bilingual handling
    if (typeof value === 'object' && value[locale]) return value[locale];
    return value;
  }
}

export const tenantSettings = new TenantSettingsService();
