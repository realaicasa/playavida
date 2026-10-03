export type Language = 'es' | 'en';

export type LocationCode = 'PDC' | 'TUL' | 'CUN' | 'PM' | 'AKU' | 'COZ' | 'PVA' | 'PVR';

export interface LocationInfo {
  code: LocationCode | string;
  name_es: string;
  name_en: string;
  region: string;
  country: string;
  timezone: string;
  parent_code?: LocationCode | string;
  latitude?: number;
  longitude?: number;
}

export type UserRole = 'member' | 'business_owner' | 'staff' | 'moderator' | 'admin';

export interface UserPushOptIn {
  target_reference: string;
  target_name: string;
  target_type: 'business' | 'event' | 'group' | 'loyalty';
  opted_in_at: string;
  receive_incentives: boolean;
}

export interface User {
  id: string;
  public_reference: string; // e.g. USR-PDC-8K4J2
  email: string;
  selected_language: Language;
  role: UserRole;
  privacy_preferences?: {
    show_in_public_directory: boolean;
    allow_direct_messages: boolean;
  };
  interest_ratings?: Record<string, number>; // key: interest id (1-10 scale)
  push_opt_ins?: UserPushOptIn[];
  created_at: string;
}

export interface PersonalProfile {
  user_id: string;
  public_username?: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  profile_visibility: 'public' | 'hidden';
  tags?: string[];
  social_links?: {
    instagram?: string;
    whatsapp?: string;
    website?: string;
    telegram?: string;
    linkedin?: string;
    twitter?: string;
  };
  preferred_location?: LocationCode;
}

export interface PrivacyPreferences {
  user_id?: string;
  public_profile_visible: boolean;
  public_username_visible?: boolean;
  bio_visible?: boolean;
  social_links_visible?: boolean;
  show_full_name?: boolean;
  show_username?: boolean;
  show_bio?: boolean;
  show_interests?: boolean;
  show_social_links?: boolean;
  allow_direct_messages?: boolean;
  reviews_visible: boolean;
  groups_visible: boolean;
  event_activity_visible: boolean;
  contact_permissions: 'everyone' | 'members_only' | 'nobody';
  personalized_recommendations: boolean;
  social_incentives: boolean;
  marketing_email: boolean;
  marketing_whatsapp: boolean;
  marketing_push?: boolean;
  sponsored_discovery?: boolean;
  updated_at?: string;
}

export interface UserBlock {
  id: string;
  blocker_user_id: string;
  blocked_entity_type: 'user' | 'business' | 'group' | 'organizer';
  blocked_entity_id: string;
  created_at: string;
}

export type BusinessStatus = 'draft' | 'published' | 'archived' | 'suspended';

export type FeatureKey =
  | 'business.contact_modal'
  | 'business.public_address'
  | 'business.public_map'
  | 'business.public_phone'
  | 'business.public_email'
  | 'business.public_whatsapp'
  | 'business.public_website'
  | 'business.public_social_links'
  | 'business.booking_link'
  | 'business.review_response'
  | 'business.offers'
  | 'business.gallery'
  | 'business.featured_listing'
  | 'loyalty.native'
  | 'loyalty.tiered_rewards';

export interface BusinessFeatureEntitlement {
  id: string;
  business_id: string;
  feature_key: FeatureKey;
  status: 'active' | 'grace_period' | 'expired';
  starts_at: string;
  ends_at: string;
}

export type SubscriptionStatus = 'active' | 'grace_period' | 'pending_oxxo' | 'expired' | 'canceled';

export interface BusinessSubscription {
  id: string;
  business_id: string;
  plan_key: 'free' | 'starter_contact' | 'pro_community' | 'premium_sponsorship';
  plan_name_es: string;
  plan_name_en: string;
  monthly_price_mxn: number;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  grace_period_end?: string;
  oxxo_reference?: string;
  oxxo_expires_at?: string;
  payment_method: 'card' | 'oxxo';
}

export interface BusinessMediaItem {
  id: string;
  business_id: string;
  media_type: 'image';
  media_role: 'logo' | 'cover' | 'gallery';
  media_url: string;
  alt_text: string;
  created_at: string;
}

export type PriceTier = '$' | '$$' | '$$$' | '$$$$';

export type BusinessCategory =
  | 'Gastronomía y Restaurantes'
  | 'Bienestar, Spas y Yoga'
  | 'Buceo y Deportes Acuáticos'
  | 'Boutiques y Diseño'
  | 'Vida Nocturna y Bares'
  | 'Coworking y Nómadas Digitales'
  | 'Arte y Talleres'
  | 'Tours y Excursiones'
  | 'Servicios Profesionales'
  | 'Comercio Local'
  | string;

// PUBLIC projection of a business - strictly NO protected contact details
export interface PublicBusinessProjection {
  id: string;
  business_reference: string; // e.g. BUS-PDC-4N7Q9
  name: string;
  slug?: string;
  category: string;
  description_es: string;
  description_en: string;
  services: string[];
  languages: string[];
  logo_url: string;
  cover_url: string;
  cover_image_url?: string;
  location_code: LocationCode;
  location_label: string;
  status: BusinessStatus;
  published_at?: string;
  gallery_urls: string[]; // only returned if gallery entitlement active
  has_contact_enabled: boolean;
  has_loyalty_program: boolean;
  has_active_offers: boolean;
  offers_count?: number;
  price_tier?: PriceTier;
  opening_hours_summary?: string;
  amenities?: string[];
  payment_methods?: string[];
  instagram_handle?: string;
  facebook_url?: string;
  linkedin_url?: string;
  website_url?: string;
  email?: string;
  email_address?: string;
  whatsapp?: string;
  whatsapp_number?: string;
  special_offer?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
  created_by_user_id: string;
  created_at?: string;
}

// PROTECTED contact details - kept in a separated repository and projected under strict auth & entitlements
export interface PrivateBusinessContactDetails {
  business_id: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    tripadvisor?: string;
  };
  booking_url?: string;
  opening_hours?: {
    days_es: string;
    days_en: string;
    hours: string;
  }[];
  updated_at: string;
}

// Event sponsor / co-host entity
export interface EventSponsor {
  id: string;
  type?: 'business' | 'group';
  name: string;
  business_id?: string;
  group_id?: string;
  logo_url?: string;
  cover_url?: string;
  category?: string;
  location_code?: LocationCode;
  offer_headline?: string;
  loyalty_headline?: string;
  tier?: string;
  highlight_offer?: string;
  loyalty_program_id?: string;
}

// Event model
export interface CommunityEvent {
  id: string;
  event_reference: string; // EVT-PDC-2M6TX
  creator_user_id: string;
  organizer_business_id?: string;
  organizer_group_id?: string;
  community_group_id?: string;
  organizer_name: string;
  location_code: LocationCode;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  category: string;
  image_url: string;
  start_at: string;
  end_at: string;
  timezone: string;
  event_location_label: string;
  venue_name?: string;
  street_address?: string;
  map_url?: string;
  latitude?: number;
  longitude?: number;
  paid_status: 'free' | 'paid';
  price_label?: string;
  cost_amount?: number;
  cost_currency?: string;
  ticket_url?: string;
  registration_url?: string;
  capacity?: number;
  dress_code?: string;
  age_policy?: string;
  tags?: string[];
  special_instructions?: string;
  sponsors?: EventSponsor[];
  status: 'draft' | 'published' | 'completed' | 'archived';
  created_at: string;
}

// Community Groups
export interface CommunityGroup {
  id: string;
  group_reference: string; // GRP-PDC-9R3LM
  owner_user_id: string;
  location_code: LocationCode;
  name_es: string;
  name_en: string;
  name?: string;
  description_es: string;
  description_en: string;
  objectives?: string;
  objectives_es?: string;
  objectives_en?: string;
  guidelines?: string;
  guidelines_es?: string;
  guidelines_en?: string;
  cover_url: string;
  cover_image_url?: string;
  image_url?: string;
  profile_image_url?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  category?: string;
  visibility: 'public' | 'private' | 'restricted';
  join_policy: 'open' | 'approval' | 'invitation';
  member_count: number;
  members_count?: number;
  tags: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  is_muted?: boolean;
  meeting_frequency?: string;
  primary_language?: string;
  vibe?: string;
  chat_link?: string;
  max_members?: number;
  status?: 'published' | 'draft' | 'archived';
  source_language?: Language;
  translation_status?: 'original' | 'human_reviewed' | 'machine_draft' | 'pending';
  created_at: string;
}

export interface BroadcastCampaign {
  id: string;
  campaign_reference: string;
  owner_user_id: string;
  target_type: 'business' | 'group';
  target_id: string;
  target_name: string;
  title: string;
  message: string;
  target_segment: 'all_members' | 'active_this_month' | 'new_members';
  recipient_count: number;
  plan_price_mxn: number;
  payment_method: 'card' | 'oxxo';
  status: 'queued' | 'delivered' | 'processing';
  created_at: string;
  sent_at?: string;
}

// Reviews model
export interface BusinessReview {
  id: string;
  review_reference: string; // REV-PDC-7W2PA
  business_id: string;
  author_user_id: string;
  author_name: string;
  rating: number; // 1-5
  content: string;
  status: 'published' | 'hidden_by_user' | 'flagged';
  created_at: string;
  business_response?: {
    author_name: string;
    content: string;
    created_at: string;
  };
}

// Offers
export interface BusinessOffer {
  id: string;
  offer_reference: string; // OFF-PDC-5H8KD
  business_id: string;
  business_name: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  terms_es: string;
  terms_en: string;
  discount_label: string;
  start_at: string;
  end_at: string;
  redemption_method: 'show_qr' | 'promo_code';
  status: 'active' | 'expired';
}

// Sponsors & Monetization
export interface SponsorCampaign {
  id: string;
  sponsor_reference: string; // SPO-PDC-1X9Y2
  organization_name: string;
  headline_es: string;
  headline_en: string;
  description_es: string;
  description_en: string;
  cta_label_es: string;
  cta_label_en: string;
  destination_url: string;
  image_url: string;
  placement_type: 'home_featured' | 'event_banner';
  is_sponsored: true; // explicit flag
  active: boolean;
  status?: 'active' | 'inactive';
}

export type SponsorBannerItem = SponsorCampaign;

// Native Loyalty
export interface RewardTier {
  threshold: number; // e.g. 10, 20, 50
  reward_es: string;
  reward_en: string;
  reward_type: 'drink' | 'discount' | 'meal' | 'experience';
}

export interface LoyaltyBonusFeature {
  id: string;
  title_es: string;
  title_en: string;
  description_es?: string;
  description_en?: string;
  bonus_stamps?: number; // e.g. 1 or 2 extra stamps
  extra_stamps?: number;
  requires_photo_upload: boolean; // e.g. "share photo of your coffee topping"
  photo_prompt_es?: string;
  photo_prompt_en?: string;
  active?: boolean;
  expires_at?: string;
  created_at?: string;
}

export interface NativeLoyaltyProgram {
  id: string;
  program_reference: string; // LOY-PDC-3R7K1
  business_id: string;
  business_name: string;
  location_code: LocationCode;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  stamps_required_base: number; // e.g. 10
  stamps_required?: number;
  reward_name_es?: string;
  reward_name_en?: string;
  reward_tiers: RewardTier[];
  bonus_features?: LoyaltyBonusFeature[];
  active?: boolean;
  staff_limit?: number; // max 10
  created_at?: string;
}

export interface StaffAccount {
  id: string;
  staff_reference: string; // STF-PDC-001
  business_id: string;
  display_name: string;
  role: 'staff' | 'manager';
  pin_code: string; // individual password/PIN
  active: boolean;
  created_at: string;
}

export interface CustomerLoyaltyCard {
  id: string;
  user_id: string;
  program_id: string;
  business_id: string;
  business_name: string;
  stamps_count: number;
  total_lifetime_stamps: number;
  available_vouchers: {
    voucher_reference: string; // VOU-PDC-XXXXX
    tier_threshold: number;
    title_es: string;
    title_en: string;
    issued_at: string;
    status: 'available' | 'redeemed';
  }[];
  earned_vouchers?: {
    voucher_reference: string;
    tier_threshold?: number;
    title_es?: string;
    title_en?: string;
    issued_at?: string;
    status: string;
  }[];
  completed_bonuses?: {
    bonus_id: string;
    title: string;
    stamps_awarded: number;
    photo_url?: string;
    claimed_at: string;
  }[];
  joined_at: string;
}

export interface LoyaltyLedgerTransaction {
  id: string;
  transaction_reference: string; // TXN-PDC-XXXXX
  idempotency_key: string;
  program_id: string;
  business_id: string;
  customer_user_id: string;
  staff_id: string;
  staff_name: string;
  event_type: 'stamp_awarded' | 'reward_redeemed';
  amount: number;
  metadata: string;
  created_at: string;
}

// Universal Reports
export type ReportReason =
  | 'inaccurate_information'
  | 'inaccurate_info'
  | 'image_issue'
  | 'spam'
  | 'scam'
  | 'impersonation'
  | 'harassment'
  | 'privacy_issue'
  | 'copyright_issue'
  | 'inappropriate_content'
  | 'fake_review'
  | 'illegal_activity'
  | 'fraud'
  | 'closed_business'
  | 'other';

export interface UniversalReport {
  id: string;
  report_reference: string; // RPT-PDC-3Q6VS
  reporter_user_id: string;
  reporter_reference: string;
  target_entity_type: 'business' | 'event' | 'group' | 'review' | 'image' | 'user' | 'offer';
  target_reference: string;
  target_name: string;
  reason: ReportReason;
  description: string;
  content_snapshot: string;
  status: 'open' | 'reviewing' | 'actioned' | 'dismissed';
  created_at: string;
}

// Contact Analytics Events
export type ContactEventType =
  | 'contact_modal_opened'
  | 'address_viewed'
  | 'map_opened'
  | 'directions_clicked'
  | 'phone_revealed'
  | 'email_clicked'
  | 'whatsapp_clicked'
  | 'website_clicked'
  | 'social_link_clicked'
  | 'booking_clicked'
  | 'profile_viewed'
  | 'business_qr_scanned';

export interface ContactAnalyticsEvent {
  id: string;
  business_id: string;
  event_type: ContactEventType;
  field_key?: string;
  language: Language;
  created_at: string;
}

// Legal Configuration Model (Prompt 1)
export interface LegalConfiguration {
  legal_entity_name: string;
  legal_entity_type: string;
  legal_domicile: string;
  tax_id?: string;
  privacy_contact_email: string;
  data_protection_contact: string;
  support_email: string;
  support_url: string;
  privacy_notice_url: string;
  terms_url: string;
  community_guidelines_url: string;
  loyalty_terms_url: string;
  accessibility_statement_url: string;
  status: 'draft' | 'under_review' | 'finalized';
  version: string;
  effective_at: string;
  last_reviewed_at: string;
}

// Trust Badge Types (Prompt 1)
export type TrustBadgeType =
  | 'business_managed'
  | 'organizer_managed'
  | 'community_reported'
  | 'recently_confirmed'
  | 'approximate_location'
  | 'external_ticketing'
  | 'sponsored'
  | 'machine_translated';

export interface TrustBadgeInfo {
  type: TrustBadgeType;
  label_es: string;
  label_en: string;
  explanation_es: string;
  explanation_en: string;
  last_reviewed_at?: string;
}

// Configurable Environmental Notice (Prompt 1)
export interface EnvironmentalNotice {
  id: string;
  title_es: string;
  title_en: string;
  content_es: string;
  content_en: string;
  applicable_location: LocationCode | 'ALL';
  applicable_activity: 'marine_wildlife' | 'reef' | 'cenote' | 'beach' | 'general';
  source_label: string;
  source_url?: string;
  last_reviewed_at: string;
  review_due_at: string;
  responsible_editor: string;
}
