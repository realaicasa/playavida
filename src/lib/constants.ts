import {
  LocationInfo,
  User,
  PersonalProfile,
  PrivacyPreferences,
  PublicBusinessProjection,
  PrivateBusinessContactDetails,
  BusinessSubscription,
  CommunityEvent,
  CommunityGroup,
  BusinessReview,
  BusinessOffer,
  SponsorCampaign,
  NativeLoyaltyProgram,
  StaffAccount,
  CustomerLoyaltyCard,
  UniversalReport,
} from '../types';

export const LOCATIONS: LocationInfo[] = [
  {
    code: 'AKU',
    name_es: 'Akumal',
    name_en: 'Akumal',
    region: 'Quintana Roo',
    country: 'M├®xico',
    timezone: 'America/Cancun',
    parent_code: 'TUL',
    latitude: 20.3957,
    longitude: -87.3155,
  },
  {
    code: 'CUN',
    name_es: 'Canc├║n',
    name_en: 'Cancun',
    region: 'Quintana Roo',
    country: 'M├®xico',
    timezone: 'America/Cancun',
    parent_code: 'PDC',
    latitude: 21.1619,
    longitude: -86.8515,
  },
  {
    code: 'COZ',
    name_es: 'Cozumel',
    name_en: 'Cozumel',
    region: 'Quintana Roo',
    country: 'M├®xico',
    timezone: 'America/Cancun',
    parent_code: 'PDC',
    latitude: 20.423,
    longitude: -86.9223,
  },
  {
    code: 'OUT',
    name_es: 'Zona Externa',
    name_en: 'Outwith Area',
    region: 'N/A',
    country: 'M├®xico',
    timezone: 'America/Cancun',
    latitude: 0,
    longitude: 0,
  },
  {
    code: 'PDC',
    name_es: 'Playa del Carmen',
    name_en: 'Playa del Carmen',
    region: 'Quintana Roo',
    country: 'M├®xico',
    timezone: 'America/Cancun',
    latitude: 20.6274,
    longitude: -87.0799,
  },
  {
    code: 'PM',
    name_es: 'Puerto Morelos',
    name_en: 'Puerto Morelos',
    region: 'Quintana Roo',
    country: 'M├®xico',
    timezone: 'America/Cancun',
    parent_code: 'PDC',
    latitude: 20.8491,
    longitude: -86.8756,
  },
  {
    code: 'PVA',
    name_es: 'Puerto Aventuras',
    name_en: 'Puerto Aventuras',
    region: 'Quintana Roo',
    country: 'M├®xico',
    timezone: 'America/Cancun',
    parent_code: 'PDC',
    latitude: 20.4996,
    longitude: -87.2274,
  },
  {
    code: 'TUL',
    name_es: 'Tulum',
    name_en: 'Tulum',
    region: 'Quintana Roo',
    country: 'M├®xico',
    timezone: 'America/Cancun',
    parent_code: 'PDC',
    latitude: 20.2114,
    longitude: -87.4654,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_001',
    public_reference: 'USR-PDC-8K4J2',
    email: 'sofia.pdc@playavida.org',
    selected_language: 'es',
    role: 'business_owner',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr_002',
    public_reference: 'USR-PDC-3N9T1',
    email: 'marcus.expat@playavida.org',
    selected_language: 'en',
    role: 'member',
    created_at: '2026-02-01T12:00:00Z',
  },
  {
    id: 'usr_003',
    public_reference: 'USR-PDC-7V2Q8',
    email: 'carlos.hostel@playavida.org',
    selected_language: 'es',
    role: 'business_owner',
    created_at: '2026-02-10T14:30:00Z',
  },
];

export const DEMO_USERS = INITIAL_USERS;

export const INITIAL_PROFILES: Record<string, PersonalProfile> = {
  usr_001: {
    user_id: 'usr_001',
    public_username: 'sofia_caribe',
    display_name: 'Sof├¡a M├®ndez',
    bio: 'Chef y fundadora en Playa del Carmen apasionada por los ingredientes mayas y la gastronom├¡a regenerativa.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    profile_visibility: 'public',
    tags: ['Gastronom├¡a', 'Cocina Maya', 'Sostenibilidad', 'Caf├® de Especialidad'],
    social_links: {
      instagram: '@sofia_playa_chef',
      whatsapp: '+52 984 112 3456',
      website: 'https://laselvaplayacafe.mx',
    },
    preferred_location: 'PDC',
  },
  usr_002: {
    user_id: 'usr_002',
    public_username: 'marcus_travels',
    display_name: 'Marcus Vance',
    bio: 'Remote architect, cenote swimmer, and avid community volunteer living in Zazil-Ha since 2024.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    profile_visibility: 'public',
    tags: ['N├│mada Digital', 'Buceo y Cenotes', 'Voluntariado', 'Arquitectura'],
    social_links: {
      instagram: '@marcus_riviera',
      linkedin: 'https://linkedin.com/in/marcus-vance',
      website: 'https://marcusvance.design',
    },
    preferred_location: 'PDC',
  },
};

export const INITIAL_PRIVACY: Record<string, PrivacyPreferences> = {
  usr_001: {
    public_profile_visible: true,
    reviews_visible: true,
    groups_visible: true,
    event_activity_visible: true,
    contact_permissions: 'everyone',
    personalized_recommendations: true,
    social_incentives: true,
    marketing_email: false,
    marketing_whatsapp: false,
  },
  usr_002: {
    public_profile_visible: true,
    reviews_visible: false,
    groups_visible: true,
    event_activity_visible: true,
    contact_permissions: 'members_only',
    personalized_recommendations: true,
    social_incentives: false,
    marketing_email: false,
    marketing_whatsapp: false,
  },
};

// Public projection of seed businesses
export const INITIAL_BUSINESSES: PublicBusinessProjection[] = [];

// Protected contact details - strictly isolated in separate repository
export const INITIAL_PRIVATE_CONTACTS: Record<string, PrivateBusinessContactDetails> = {};

// Initial Subscriptions & Entitlements
export const INITIAL_SUBSCRIPTIONS: Record<string, BusinessSubscription> = {};

// Events seed
export const INITIAL_EVENTS: CommunityEvent[] = [];

// Groups seed
export const INITIAL_GROUPS: CommunityGroup[] = [];

// Reviews seed
export const INITIAL_REVIEWS: BusinessReview[] = [];

// Offers seed
export const INITIAL_OFFERS: BusinessOffer[] = [];

// Sponsors seed
export const INITIAL_SPONSORS: SponsorCampaign[] = [];

// Native Loyalty Program seed
export const INITIAL_LOYALTY_PROGRAMS: NativeLoyaltyProgram[] = [];

export const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'stf_test_a',
    staff_reference: 'STF-TEST-A',
    business_id: 'bus_test_a',
    display_name: 'Test Staff A',
    role: 'staff',
    pin_code: '1234',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_CUSTOMER_CARDS: CustomerLoyaltyCard[] = [];

export const INITIAL_REPORTS: UniversalReport[] = [];
