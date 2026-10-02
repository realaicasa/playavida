/**
 * Teable REST API Adapter for PlayaVida
 *
 * Implements typed communication with the 67-table Teable data foundation.
 * CRITICAL SECURITY PRINCIPLES:
 * 1. Never expose TEABLE_API_KEY to the client browser.
 * 2. Views and hidden columns in Teable are NOT security boundaries.
 * 3. Projections are calculated explicitly before returning data.
 */

import {
  PublicBusinessProjection,
  PrivateBusinessContactDetails,
  BusinessSubscription,
  UniversalReport,
  User,
  LocationCode,
  CommunityGroup,
  PrivacyPreferences,
} from '../types';

export interface TeableConfig {
  apiUrl: string;
  baseId: string;
  apiKey?: string;
  tables: {
    businesses: string;
    contacts: string;
    subscriptions: string;
    users: string;
    reports: string;
    loyaltyPrograms: string;
    loyaltyCards: string;
    loyaltyLedger: string;
  };
}

const getEnvVar = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch {
    // fallback if import.meta is unavailable
  }
  return fallback;
};

export const defaultTeableConfig: TeableConfig = {
  apiUrl: getEnvVar('VITE_TEABLE_API_URL', 'https://app.teable.io/api'),
  baseId: getEnvVar('VITE_TEABLE_BASE_ID', 'bse_playavida_foundation'),
  tables: {
    businesses: 'tbl_businesses',
    contacts: 'tbl_business_private_contacts',
    subscriptions: 'tbl_business_subscriptions',
    users: 'tbl_users',
    reports: 'tbl_reports',
    loyaltyPrograms: 'tbl_loyalty_programs',
    loyaltyCards: 'tbl_loyalty_cards',
    loyaltyLedger: 'tbl_loyalty_ledger',
  },
};

export class TeableAdapter {
  private config: TeableConfig;

  constructor(config: TeableConfig = defaultTeableConfig) {
    this.config = config;
  }

  /**
   * Transforms raw Teable business row into an explicit PublicBusinessProjection
   * Strictly omits private contact details (phone, whatsapp, raw email, coordinates).
   */
  public projectPublicBusiness(rawRecord: any): PublicBusinessProjection {
    const fields = rawRecord.fields || rawRecord;
    return {
      id: rawRecord.id || fields.id,
      business_reference: fields.business_reference,
      name: fields.name,
      slug: fields.slug,
      category: fields.category,
      location_code: fields.location_code,
      location_label: fields.location_label,
      description_es: fields.description_es,
      description_en: fields.description_en,
      cover_url: fields.cover_url,
      logo_url: fields.logo_url,
      gallery_urls: Array.isArray(fields.gallery_urls)
        ? fields.gallery_urls
        : fields.gallery_urls
        ? JSON.parse(fields.gallery_urls)
        : [],
      services: Array.isArray(fields.services)
        ? fields.services
        : fields.services
        ? fields.services.split(',').map((s: string) => s.trim())
        : [],
      languages: Array.isArray(fields.languages)
        ? fields.languages
        : fields.languages
        ? fields.languages.split(',').map((s: string) => s.trim())
        : [],
      status: fields.status,
      has_contact_enabled: Boolean(fields.has_contact_enabled),
      has_active_offers: Boolean(fields.has_active_offers),
      has_loyalty_program: Boolean(fields.has_loyalty_program),
      created_by_user_id: fields.created_by_user_id,
      created_at: fields.created_at,
    };
  }

  /**
   * Sanitizes private contacts according to entitlement and login status
   */
  public filterContactProjection(
    contactRecord: any,
    isEntitled: boolean,
    isAuthenticated: boolean
  ): {
    status: 'available' | 'locked' | 'login_required';
    details: PrivateBusinessContactDetails | null;
  } {
    if (!isAuthenticated) {
      return { status: 'login_required', details: null };
    }

    if (!isEntitled) {
      return { status: 'locked', details: null };
    }

    const fields = contactRecord?.fields || contactRecord || {};
    return {
      status: 'available',
      details: {
        business_id: fields.business_id,
        address: fields.address,
        city: fields.city,
        latitude: fields.latitude,
        longitude: fields.longitude,
        phone: fields.phone,
        email: fields.email,
        whatsapp: fields.whatsapp,
        website: fields.website,
        booking_url: fields.booking_url,
        opening_hours: Array.isArray(fields.opening_hours)
          ? fields.opening_hours
          : fields.opening_hours
          ? JSON.parse(fields.opening_hours)
          : [],
        updated_at: fields.updated_at,
      },
    };
  }

  /**
   * Projects raw community group record ensuring bilingual objectives and guidelines are handled
   */
  public projectCommunityGroup(rawRecord: any): CommunityGroup {
    const fields = rawRecord.fields || rawRecord;
    return {
      id: rawRecord.id || fields.id,
      group_reference: fields.group_reference,
      owner_user_id: fields.owner_user_id,
      location_code: fields.location_code as LocationCode,
      name_es: fields.name_es,
      name_en: fields.name_en,
      description_es: fields.description_es,
      description_en: fields.description_en,
      cover_url: fields.cover_url,
      visibility: fields.visibility || 'public',
      join_policy: fields.join_policy || 'open',
      member_count: Number(fields.member_count || 1),
      tags: Array.isArray(fields.tags)
        ? fields.tags
        : typeof fields.tags === 'string'
        ? fields.tags.split(',').map((t: string) => t.trim())
        : [],
      objectives: fields.objectives,
      objectives_es: fields.objectives_es,
      objectives_en: fields.objectives_en,
      guidelines: fields.guidelines,
      guidelines_es: fields.guidelines_es,
      guidelines_en: fields.guidelines_en,
      status: fields.status || 'active',
      created_at: fields.created_at || new Date().toISOString(),
    };
  }

  /**
   * Projects privacy preferences from Teable
   */
  public projectPrivacyPreferences(rawRecord: any, userId: string): PrivacyPreferences {
    const fields = rawRecord.fields || rawRecord || {};
    return {
      user_id: fields.user_id || userId,
      public_profile_visible: fields.public_profile_visible ?? true,
      reviews_visible: fields.reviews_visible ?? true,
      groups_visible: fields.groups_visible ?? true,
      event_activity_visible: fields.event_activity_visible ?? true,
      contact_permissions: fields.contact_permissions || 'everyone',
      personalized_recommendations: fields.personalized_recommendations ?? true,
      show_full_name: fields.show_full_name ?? true,
      show_username: fields.show_username ?? true,
      show_bio: fields.show_bio ?? true,
      show_interests: fields.show_interests ?? true,
      show_social_links: fields.show_social_links ?? true,
      allow_direct_messages: fields.allow_direct_messages ?? true,
      social_incentives: fields.social_incentives ?? false,
      marketing_email: fields.marketing_email ?? false,
      marketing_whatsapp: fields.marketing_whatsapp ?? false,
      updated_at: fields.updated_at,
    };
  }
}

export const teableAdapter = new TeableAdapter();
