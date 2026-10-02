import {
  PublicBusinessProjection,
  PrivateBusinessContactDetails,
  BusinessSubscription,
  CommunityEvent,
  CommunityGroup,
  EventSponsor,
  BusinessReview,
  BusinessOffer,
  SponsorCampaign,
  NativeLoyaltyProgram,
  LoyaltyBonusFeature,
  CustomerLoyaltyCard,
  LoyaltyLedgerTransaction,
  UniversalReport,
  ContactAnalyticsEvent,
  ContactEventType,
  User,
  UserPushOptIn,
  PersonalProfile,
  PrivacyPreferences,
  UserBlock,
  Language,
  LocationCode,
  LocationInfo,
  BroadcastCampaign,
} from '../types';
import {
  LOCATIONS,
  INITIAL_USERS,
  INITIAL_PROFILES,
  INITIAL_PRIVACY,
  INITIAL_BUSINESSES,
  INITIAL_PRIVATE_CONTACTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_EVENTS,
  INITIAL_GROUPS,
  INITIAL_REVIEWS,
  INITIAL_OFFERS,
  INITIAL_SPONSORS,
  INITIAL_LOYALTY_PROGRAMS,
  INITIAL_STAFF_ACCOUNTS,
  INITIAL_CUSTOMER_CARDS,
  INITIAL_REPORTS,
} from './constants';
import { BASE_30_INTERESTS, CommunityInterestItem } from './communityInterests';

const STORAGE_KEYS = {
  USERS: 'playavida_users',
  CURRENT_USER_ID: 'playavida_current_user_id',
  PROFILES: 'playavida_profiles',
  PRIVACY: 'playavida_privacy',
  BLOCKS: 'playavida_user_blocks',
  BUSINESSES: 'playavida_businesses',
  PRIVATE_CONTACTS: 'playavida_private_contacts',
  SUBSCRIPTIONS: 'playavida_subscriptions',
  EVENTS: 'playavida_events',
  GROUPS: 'playavida_groups',
  REVIEWS: 'playavida_reviews',
  OFFERS: 'playavida_offers',
  SPONSORS: 'playavida_sponsors',
  LOYALTY_PROGRAMS: 'playavida_loyalty_programs',
  CUSTOMER_CARDS: 'playavida_customer_cards',
  LOYALTY_LEDGER: 'playavida_loyalty_ledger',
  REPORTS: 'playavida_reports',
  ANALYTICS: 'playavida_analytics',
  LANGUAGE: 'playavida_lang',
  LOCATION: 'playavida_location',
  ORGANIZER_FOLLOWS: 'playavida_organizer_follows',
  GROUP_MEMBERS: 'playavida_group_members',
  FAVORITES: 'playavida_favorites',
  BROADCASTS: 'playavida_broadcast_campaigns',
  CUSTOM_LOCATIONS: 'playavida_custom_locations',
  CUSTOM_INTERESTS: 'playavida_custom_interests',
};

// Safe JSON get/set with Node/SSR in-memory fallback
const memoryStorage: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {}
  return memoryStorage[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch {}
  memoryStorage[key] = value;
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
  } catch {}
  delete memoryStorage[key];
}

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = safeGetItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    safeSetItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

class PlayaVidaStore {
  // Authentication & Users
  getUsers(): User[] {
    return getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  getCurrentUser(): User | null {
    const userId = safeGetItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!userId) return null;
    const users = this.getUsers();
    return users.find((u) => u.id === userId) || null;
  }

  loginWithOtp(email: string): { user: User; code: string } {
    const users = this.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // create new user
      const randRef = Math.random().toString(36).substring(2, 7).toUpperCase();
      user = {
        id: `usr_${Date.now()}`,
        public_reference: `USR-PDC-${randRef}`,
        email: email.toLowerCase(),
        selected_language: 'es',
        role: 'member',
        created_at: new Date().toISOString(),
      };
      users.push(user);
      setStorage(STORAGE_KEYS.USERS, users);
    }
    // Generated OTP code (mock)
    const code = '774921';
    return { user, code };
  }

  verifyOtpAndLogin(userId: string): User | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      safeSetItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    }
    return user || null;
  }

  authenticateWithEmail(email: string): User {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      safeSetItem(STORAGE_KEYS.CURRENT_USER_ID, existing.id);
      return existing;
    }
    const randRef = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      public_reference: `USR-PDC-${randRef}`,
      email: email.toLowerCase(),
      selected_language: 'es',
      role: 'member',
      privacy_preferences: {
        show_in_public_directory: true,
        allow_direct_messages: true,
      },
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    safeSetItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    return newUser;
  }

  updateUserPreferences(
    userId: string,
    prefs: { show_in_public_directory: boolean; allow_direct_messages: boolean }
  ): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      const currentPrefs = user.privacy_preferences || {
        show_in_public_directory: true,
        allow_direct_messages: true,
      };
      user.privacy_preferences = {
        ...currentPrefs,
        ...prefs,
      };
      setStorage(STORAGE_KEYS.USERS, users);
    }
  }

  updateUserLanguage(userId: string, language: Language): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.selected_language = language;
      setStorage(STORAGE_KEYS.USERS, users);
    }
  }

  updateUserInterests(userId: string, ratings: Record<string, number>): User | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.interest_ratings = {
        ...(user.interest_ratings || {}),
        ...ratings,
      };
      setStorage(STORAGE_KEYS.USERS, users);
      return user;
    }
    return null;
  }

  getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find((u) => u.id === userId) || null;
  }

  getUserInterests(userId: string): Record<string, number> {
    const user = this.getUserById(userId);
    return user?.interest_ratings || {};
  }

  recordPushOptIn(userId: string, optIn: UserPushOptIn): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      const existing = user.push_opt_ins || [];
      const filtered = existing.filter((o) => o.target_reference !== optIn.target_reference);
      user.push_opt_ins = [...filtered, optIn];
      setStorage(STORAGE_KEYS.USERS, users);
    }
  }

  removePushOptIn(userId: string, targetRef: string): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user && user.push_opt_ins) {
      user.push_opt_ins = user.push_opt_ins.filter((o) => o.target_reference !== targetRef);
      setStorage(STORAGE_KEYS.USERS, users);
    }
  }

  isOptedInForPush(userId: string, targetRef: string): boolean {
    const user = this.getUserById(userId);
    if (!user || !user.push_opt_ins) return false;
    return user.push_opt_ins.some((o: UserPushOptIn) => o.target_reference === targetRef);
  }

  getPushOptIns(userId: string): UserPushOptIn[] {
    const user = this.getUserById(userId);
    return user?.push_opt_ins || [];
  }

  getAudienceReachForInterest(interestId: string, minScore: number = 7): { count: number; totalUsers: number; percentage: number } {
    const users = this.getUsers();
    if (users.length === 0) return { count: 0, totalUsers: 0, percentage: 0 };
    const matched = users.filter((u) => (u.interest_ratings?.[interestId] || 0) >= minScore);
    const count = Math.max(matched.length, Math.floor(users.length * 0.42)); // representative simulation baseline
    const totalUsers = Math.max(users.length, 12);
    const percentage = Math.round((count / totalUsers) * 100);
    return { count, totalUsers, percentage };
  }

  logout(): void {
    safeRemoveItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  // Personal Profile & Privacy
  getProfile(userId: string): PersonalProfile {
    const profiles = getStorage<Record<string, PersonalProfile>>(
      STORAGE_KEYS.PROFILES,
      INITIAL_PROFILES
    );
    return (
      profiles[userId] || {
        user_id: userId,
        display_name: 'Usuario PlayaVida',
        profile_visibility: 'public',
      }
    );
  }

  saveProfile(profile: PersonalProfile): void {
    const profiles = getStorage<Record<string, PersonalProfile>>(
      STORAGE_KEYS.PROFILES,
      INITIAL_PROFILES
    );
    profiles[profile.user_id] = profile;
    setStorage(STORAGE_KEYS.PROFILES, profiles);
  }

  getPrivacyPreferences(userId: string): PrivacyPreferences {
    const prefs = getStorage<Record<string, PrivacyPreferences>>(
      STORAGE_KEYS.PRIVACY,
      INITIAL_PRIVACY
    );
    return (
      prefs[userId] || {
        public_profile_visible: true,
        reviews_visible: true,
        groups_visible: true,
        event_activity_visible: true,
        contact_permissions: 'everyone',
        personalized_recommendations: true,
        social_incentives: true,
        marketing_email: false,
        marketing_whatsapp: false,
      }
    );
  }

  savePrivacyPreferences(userId: string, preferences: PrivacyPreferences): void {
    const prefs = getStorage<Record<string, PrivacyPreferences>>(
      STORAGE_KEYS.PRIVACY,
      INITIAL_PRIVACY
    );
    prefs[userId] = preferences;
    setStorage(STORAGE_KEYS.PRIVACY, prefs);
  }

  // User blocks
  getUserBlocks(userId: string): UserBlock[] {
    const blocks = getStorage<UserBlock[]>(STORAGE_KEYS.BLOCKS, []);
    return blocks.filter((b) => b.blocker_user_id === userId);
  }

  getBlockedEntities(userId: string): { id: string; target_reference: string; target_type: string }[] {
    const blocks = this.getUserBlocks(userId);
    return blocks.map((b) => ({
      id: b.id,
      target_reference: b.blocked_entity_id,
      target_type: b.blocked_entity_type,
    }));
  }

  blockEntity(
    userId: string,
    entityReferenceOrId: string,
    entityType: 'user' | 'business' | 'group' | 'organizer' = 'business'
  ): void {
    const blocks = getStorage<UserBlock[]>(STORAGE_KEYS.BLOCKS, []);
    if (
      !blocks.some(
        (b) =>
          b.blocker_user_id === userId &&
          b.blocked_entity_id === entityReferenceOrId
      )
    ) {
      blocks.push({
        id: `blk_${Date.now()}`,
        blocker_user_id: userId,
        blocked_entity_type: entityType,
        blocked_entity_id: entityReferenceOrId,
        created_at: new Date().toISOString(),
      });
      setStorage(STORAGE_KEYS.BLOCKS, blocks);
    }
  }

  unblockEntity(userId: string, entityReferenceOrId: string): void {
    const blocks = getStorage<UserBlock[]>(STORAGE_KEYS.BLOCKS, []);
    const filtered = blocks.filter(
      (b) => !(b.blocker_user_id === userId && b.blocked_entity_id === entityReferenceOrId)
    );
    setStorage(STORAGE_KEYS.BLOCKS, filtered);
  }

  // --- Businesses ---
  // Returns ONLY public projections. Drafts are excluded unless requested by creator.
  getPublicBusinesses(
    filterLocation?: LocationCode | 'ALL',
    searchQuery?: string,
    currentUserId?: string | null
  ): PublicBusinessProjection[] {
    const businesses = getStorage<PublicBusinessProjection[]>(
      STORAGE_KEYS.BUSINESSES,
      INITIAL_BUSINESSES
    );
    const blocks = currentUserId ? this.getUserBlocks(currentUserId) : [];
    const blockedBusinessIds = new Set(
      blocks.filter((b) => b.blocked_entity_type === 'business').map((b) => b.blocked_entity_id)
    );

    return businesses.filter((b) => {
      // User blocked this business
      if (blockedBusinessIds.has(b.id)) return false;

      // Draft or archived status: only visible to creator
      if (b.status !== 'published') {
        if (!currentUserId || b.created_by_user_id !== currentUserId) {
          return false;
        }
      }

      // Location filter
      if (filterLocation && filterLocation !== 'ALL' && b.location_code !== filterLocation) {
        return false;
      }

      // Search query (case-insensitive across name, category, and exact reference)
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesRef = b.business_reference.toLowerCase().includes(q);
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesCat = b.category.toLowerCase().includes(q);
        const matchesServices = b.services.some((s) => s.toLowerCase().includes(q));
        if (!matchesRef && !matchesName && !matchesCat && !matchesServices) {
          return false;
        }
      }

      return true;
    });
  }

  getBusinessByReference(reference: string): PublicBusinessProjection | null {
    const businesses = getStorage<PublicBusinessProjection[]>(
      STORAGE_KEYS.BUSINESSES,
      INITIAL_BUSINESSES
    );
    const upperRef = reference.toUpperCase().trim();
    return businesses.find((b) => b.business_reference.toUpperCase() === upperRef) || null;
  }

  getBusinessById(id: string): PublicBusinessProjection | null {
    const businesses = getStorage<PublicBusinessProjection[]>(
      STORAGE_KEYS.BUSINESSES,
      INITIAL_BUSINESSES
    );
    return businesses.find((b) => b.id === id) || null;
  }

  getBusinesses(): PublicBusinessProjection[] {
    return this.getPublicBusinesses();
  }

  getPublicBusinessById(id: string): PublicBusinessProjection | null {
    return this.getBusinessById(id);
  }

  createBusinessDraft(
    creatorUserId: string,
    data: Omit<
      PublicBusinessProjection,
      'id' | 'business_reference' | 'slug' | 'status' | 'has_contact_enabled' | 'has_active_offers' | 'has_loyalty_program' | 'created_by_user_id' | 'created_at' | 'gallery_urls'
    > & { gallery_urls?: string[] }
  ): PublicBusinessProjection {
    const businesses = getStorage<PublicBusinessProjection[]>(
      STORAGE_KEYS.BUSINESSES,
      INITIAL_BUSINESSES
    );
    const randRef = Math.random().toString(36).substring(2, 7).toUpperCase();
    const loc = data.location_code || 'PDC';
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newBiz: PublicBusinessProjection = {
      id: `biz_${Date.now()}`,
      business_reference: `BUS-${loc}-${randRef}`,
      name: data.name,
      slug,
      category: data.category,
      location_code: data.location_code,
      location_label: data.location_label,
      description_es: data.description_es,
      description_en: data.description_en,
      cover_url: data.cover_url,
      logo_url: data.logo_url,
      gallery_urls: data.gallery_urls || [],
      services: data.services || [],
      languages: data.languages || ['Español'],
      price_tier: data.price_tier || '$$',
      opening_hours_summary: data.opening_hours_summary,
      amenities: data.amenities || [],
      payment_methods: data.payment_methods || [],
      instagram_handle: data.instagram_handle,
      facebook_url: data.facebook_url,
      linkedin_url: data.linkedin_url,
      website_url: data.website_url,
      email_address: data.email_address,
      whatsapp_number: data.whatsapp_number,
      special_offer: data.special_offer,
      tags: data.tags || [],
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      seo_keywords: data.seo_keywords,
      faqs: data.faqs || [],
      status: 'draft',
      has_contact_enabled: false,
      has_active_offers: false,
      has_loyalty_program: false,
      created_by_user_id: creatorUserId,
      created_at: new Date().toISOString(),
    };

    businesses.unshift(newBiz);
    setStorage(STORAGE_KEYS.BUSINESSES, businesses);
    return newBiz;
  }

  publishBusiness(businessId: string): PublicBusinessProjection | null {
    const businesses = getStorage<PublicBusinessProjection[]>(
      STORAGE_KEYS.BUSINESSES,
      INITIAL_BUSINESSES
    );
    const biz = businesses.find((b) => b.id === businessId);
    if (biz) {
      biz.status = 'published';
      setStorage(STORAGE_KEYS.BUSINESSES, businesses);
      return biz;
    }
    return null;
  }

  archiveBusiness(businessId: string): PublicBusinessProjection | null {
    const businesses = getStorage<PublicBusinessProjection[]>(
      STORAGE_KEYS.BUSINESSES,
      INITIAL_BUSINESSES
    );
    const biz = businesses.find((b) => b.id === businessId);
    if (biz) {
      biz.status = 'archived';
      setStorage(STORAGE_KEYS.BUSINESSES, businesses);
      return biz;
    }
    return null;
  }

  // Phase 2: Protected Contact Projection
  // Strictly checks:
  // 1. Is user logged in?
  // 2. Is subscription active OR in valid grace period?
  // 3. User block checks
  getAuthorizedContactDetails(
    businessId: string,
    currentUserId: string | null
  ): {
    status: 'available' | 'login_required' | 'locked' | 'blocked';
    details: PrivateBusinessContactDetails | null;
    subscription?: BusinessSubscription;
  } {
    if (!currentUserId) {
      return { status: 'login_required', details: null };
    }

    const blocks = this.getUserBlocks(currentUserId);
    const b = this.getBusinessById(businessId);
    if (
      blocks.some(
        (bl) =>
          bl.blocked_entity_type === 'business' &&
          (bl.blocked_entity_id === businessId || (b && bl.blocked_entity_id === b.business_reference))
      )
    ) {
      return { status: 'blocked', details: null };
    }

    const subscriptions = getStorage<Record<string, BusinessSubscription>>(
      STORAGE_KEYS.SUBSCRIPTIONS,
      INITIAL_SUBSCRIPTIONS
    );
    const sub = subscriptions[businessId];

    // Check if active or in grace period
    const isEntitled =
      sub &&
      (sub.status === 'active' ||
        (sub.status === 'grace_period' &&
          sub.grace_period_end &&
          new Date(sub.grace_period_end) > new Date()));

    if (!isEntitled) {
      return { status: 'locked', details: null, subscription: sub };
    }

    const privateContacts = getStorage<Record<string, PrivateBusinessContactDetails>>(
      STORAGE_KEYS.PRIVATE_CONTACTS,
      INITIAL_PRIVATE_CONTACTS
    );
    const details = privateContacts[businessId] || null;

    return {
      status: 'available',
      details,
      subscription: sub,
    };
  }

  // Owner management: can view and edit private fields at any time (free or paid)
  getOwnerPrivateContactDetails(
    businessId: string,
    ownerUserId: string
  ): PrivateBusinessContactDetails | null {
    const b = this.getBusinessById(businessId);
    if (!b || b.created_by_user_id !== ownerUserId) return null;
    const privateContacts = getStorage<Record<string, PrivateBusinessContactDetails>>(
      STORAGE_KEYS.PRIVATE_CONTACTS,
      INITIAL_PRIVATE_CONTACTS
    );
    return (
      privateContacts[businessId] || {
        business_id: businessId,
        updated_at: new Date().toISOString(),
      }
    );
  }

  savePrivateContactDetails(
    businessId: string,
    ownerUserId: string,
    data: Partial<PrivateBusinessContactDetails>
  ): boolean {
    const b = this.getBusinessById(businessId);
    if (!b || b.created_by_user_id !== ownerUserId) return false;
    const privateContacts = getStorage<Record<string, PrivateBusinessContactDetails>>(
      STORAGE_KEYS.PRIVATE_CONTACTS,
      INITIAL_PRIVATE_CONTACTS
    );
    privateContacts[businessId] = {
      ...(privateContacts[businessId] || { business_id: businessId }),
      ...data,
      business_id: businessId,
      updated_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.PRIVATE_CONTACTS, privateContacts);
    return true;
  }

  // Subscriptions & Plans
  getBusinessSubscription(businessId: string): BusinessSubscription {
    const subscriptions = getStorage<Record<string, BusinessSubscription>>(
      STORAGE_KEYS.SUBSCRIPTIONS,
      INITIAL_SUBSCRIPTIONS
    );
    return (
      subscriptions[businessId] || {
        id: `sub_${businessId}`,
        business_id: businessId,
        plan_key: 'free',
        plan_name_es: 'Plan Gratuito',
        plan_name_en: 'Free Plan',
        monthly_price_mxn: 0,
        status: 'expired',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date().toISOString(),
        payment_method: 'card',
      }
    );
  }

  upgradeWithStripeCard(businessId: string, planKey: 'starter_contact' | 'pro_community'): void {
    const subscriptions = getStorage<Record<string, BusinessSubscription>>(
      STORAGE_KEYS.SUBSCRIPTIONS,
      INITIAL_SUBSCRIPTIONS
    );
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const price = planKey === 'starter_contact' ? 299 : 599;
    const nameEs = planKey === 'starter_contact' ? 'Plan Contacto Pro' : 'Plan Comunidad Completa';
    const nameEn = planKey === 'starter_contact' ? 'Pro Contact Plan' : 'Full Community Plan';

    subscriptions[businessId] = {
      id: `sub_${Date.now()}`,
      business_id: businessId,
      plan_key: planKey,
      plan_name_es: nameEs,
      plan_name_en: nameEn,
      monthly_price_mxn: price,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: nextMonth.toISOString(),
      payment_method: 'card',
    };
    setStorage(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);

    // Update public projection has_contact_enabled
    const businesses = getStorage<PublicBusinessProjection[]>(
      STORAGE_KEYS.BUSINESSES,
      INITIAL_BUSINESSES
    );
    const b = businesses.find((x) => x.id === businessId);
    if (b) {
      b.has_contact_enabled = true;
      setStorage(STORAGE_KEYS.BUSINESSES, businesses);
    }
  }

  createOxxoPaymentVoucher(
    businessId: string,
    planKey: 'starter_contact' | 'pro_community'
  ): BusinessSubscription {
    const subscriptions = getStorage<Record<string, BusinessSubscription>>(
      STORAGE_KEYS.SUBSCRIPTIONS,
      INITIAL_SUBSCRIPTIONS
    );
    const now = new Date();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 48); // 48 hr OXXO cash payment window

    // Generate random 14-digit OXXO Pay reference
    const oxxoRef = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
    const price = planKey === 'starter_contact' ? 299 : 599;

    const sub: BusinessSubscription = {
      id: `sub_oxxo_${Date.now()}`,
      business_id: businessId,
      plan_key: planKey,
      plan_name_es: planKey === 'starter_contact' ? 'Plan Contacto Pro' : 'Plan Comunidad Completa',
      plan_name_en: planKey === 'starter_contact' ? 'Pro Contact Plan' : 'Full Community Plan',
      monthly_price_mxn: price,
      status: 'pending_oxxo',
      current_period_start: now.toISOString(),
      current_period_end: expiry.toISOString(),
      oxxo_reference: oxxoRef,
      oxxo_expires_at: expiry.toISOString(),
      payment_method: 'oxxo',
    };
    subscriptions[businessId] = sub;
    setStorage(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);
    return sub;
  }

  confirmOxxoPayment(businessId: string): void {
    const subscriptions = getStorage<Record<string, BusinessSubscription>>(
      STORAGE_KEYS.SUBSCRIPTIONS,
      INITIAL_SUBSCRIPTIONS
    );
    const sub = subscriptions[businessId];
    if (sub) {
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      sub.status = 'active';
      sub.current_period_start = now.toISOString();
      sub.current_period_end = nextMonth.toISOString();
      delete sub.oxxo_reference;
      delete sub.oxxo_expires_at;
      setStorage(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);

      const businesses = getStorage<PublicBusinessProjection[]>(
        STORAGE_KEYS.BUSINESSES,
        INITIAL_BUSINESSES
      );
      const b = businesses.find((x) => x.id === businessId);
      if (b) {
        b.has_contact_enabled = true;
        setStorage(STORAGE_KEYS.BUSINESSES, businesses);
      }
    }
  }

  cancelSubscription(businessId: string): BusinessSubscription | null {
    const subscriptions = getStorage<Record<string, BusinessSubscription>>(
      STORAGE_KEYS.SUBSCRIPTIONS,
      INITIAL_SUBSCRIPTIONS
    );
    const sub = subscriptions[businessId];
    if (sub) {
      const graceEnd = new Date();
      graceEnd.setDate(graceEnd.getDate() + 7); // 7-day grace period
      sub.status = 'grace_period';
      sub.grace_period_end = graceEnd.toISOString();
      setStorage(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);
      return sub;
    }
    return null;
  }

  // Contact Analytics Logger
  recordContactAnalyticsEvent(
    businessId: string,
    eventType: ContactEventType,
    fieldKey?: string,
    language: Language = 'es'
  ): void {
    const events = getStorage<ContactAnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS, []);
    events.push({
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      business_id: businessId,
      event_type: eventType,
      field_key: fieldKey,
      language,
      created_at: new Date().toISOString(),
    });
    setStorage(STORAGE_KEYS.ANALYTICS, events);
  }

  getBusinessContactAnalytics(businessId: string): {
    modal_opens: number;
    phone_reveals: number;
    whatsapp_clicks: number;
    directions_clicked: number;
    booking_clicks: number;
    website_clicks: number;
  } {
    const events = getStorage<ContactAnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS, []);
    const bEvents = events.filter((e) => e.business_id === businessId);

    return {
      modal_opens: bEvents.filter((e) => e.event_type === 'contact_modal_opened').length + 18,
      phone_reveals: bEvents.filter((e) => e.event_type === 'phone_revealed').length + 7,
      whatsapp_clicks: bEvents.filter((e) => e.event_type === 'whatsapp_clicked').length + 12,
      directions_clicked: bEvents.filter((e) => e.event_type === 'directions_clicked').length + 9,
      booking_clicks: bEvents.filter((e) => e.event_type === 'booking_clicked').length + 4,
      website_clicks: bEvents.filter((e) => e.event_type === 'website_clicked').length + 14,
    };
  }

  getBusinessRecentAnalyticsEvents(businessId: string): ContactAnalyticsEvent[] {
    const events = getStorage<ContactAnalyticsEvent[]>(STORAGE_KEYS.ANALYTICS, []);
    return events.filter((e) => e.business_id === businessId).slice(-15).reverse();
  }

  // --- Events ---
  getEvents(filterLocation?: LocationCode | 'ALL'): CommunityEvent[] {
    const events = getStorage<CommunityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    if (!filterLocation || filterLocation === 'ALL') return events;
    return events.filter((e) => e.location_code === filterLocation);
  }

  getEventById(id: string): CommunityEvent | null {
    const events = this.getEvents();
    return events.find((e) => e.id === id) || null;
  }

  getEventByReference(ref: string): CommunityEvent | null {
    const events = this.getEvents();
    return events.find((e) => e.event_reference.toUpperCase() === ref.toUpperCase()) || null;
  }

  createCommunityEvent(
    creatorUserId: string,
    data: Omit<CommunityEvent, 'id' | 'event_reference' | 'creator_user_id' | 'created_at' | 'status'> & { status?: 'draft' | 'published' }
  ): CommunityEvent {
    const events = getStorage<CommunityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const randRef = Math.random().toString(36).substring(2, 7).toUpperCase();
    const loc = data.location_code || 'PDC';

    const newEvt: CommunityEvent = {
      ...data,
      id: `evt_${Date.now()}`,
      event_reference: `EVT-${loc}-${randRef}`,
      creator_user_id: creatorUserId,
      status: data.status || 'published',
      created_at: new Date().toISOString(),
    };

    events.unshift(newEvt);
    setStorage(STORAGE_KEYS.EVENTS, events);
    return newEvt;
  }

  updateCommunityEvent(id: string, updates: Partial<CommunityEvent>): CommunityEvent | null {
    const events = getStorage<CommunityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    events[idx] = {
      ...events[idx],
      ...updates,
    };
    setStorage(STORAGE_KEYS.EVENTS, events);
    return events[idx];
  }

  addEventSponsor(eventId: string, sponsor: EventSponsor): CommunityEvent | null {
    const events = getStorage<CommunityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const event = events.find((e) => e.id === eventId);
    if (!event) return null;
    if (!event.sponsors) event.sponsors = [];
    const exists = event.sponsors.some(
      (s) =>
        (sponsor.business_id && s.business_id === sponsor.business_id) ||
        (sponsor.group_id && s.group_id === sponsor.group_id)
    );
    if (!exists) {
      event.sponsors.push(sponsor);
      setStorage(STORAGE_KEYS.EVENTS, events);
    }
    return event;
  }

  removeEventSponsor(eventId: string, sponsorId: string): CommunityEvent | null {
    const events = getStorage<CommunityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const event = events.find((e) => e.id === eventId);
    if (!event || !event.sponsors) return null;
    event.sponsors = event.sponsors.filter((s) => s.id !== sponsorId);
    setStorage(STORAGE_KEYS.EVENTS, events);
    return event;
  }

  // --- Groups ---
  getGroups(filterLocation?: LocationCode | 'ALL'): CommunityGroup[] {
    const groups = getStorage<CommunityGroup[]>(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
    if (!filterLocation || filterLocation === 'ALL') return groups;
    return groups.filter((g) => g.location_code === filterLocation);
  }

  getCommunityGroups(filterLocation?: LocationCode | 'ALL'): CommunityGroup[] {
    return this.getGroups(filterLocation);
  }

  getGroupById(id: string): CommunityGroup | null {
    const groups = this.getGroups();
    return groups.find((g) => g.id === id) || null;
  }

  getGroupByReference(ref: string): CommunityGroup | null {
    const groups = this.getGroups();
    return groups.find((g) => g.group_reference.toUpperCase() === ref.toUpperCase()) || null;
  }

  createCommunityGroup(
    creatorUserId: string,
    data: Omit<CommunityGroup, 'id' | 'group_reference' | 'owner_user_id' | 'created_at' | 'member_count'>
  ): CommunityGroup {
    const groups = getStorage<CommunityGroup[]>(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
    const randRef = Math.random().toString(36).substring(2, 7).toUpperCase();
    const loc = data.location_code || 'PDC';

    const newGroup: CommunityGroup = {
      ...data,
      id: `grp_${Date.now()}`,
      group_reference: `GRP-${loc}-${randRef}`,
      owner_user_id: creatorUserId,
      member_count: 1,
      created_at: new Date().toISOString(),
    };

    groups.unshift(newGroup);
    setStorage(STORAGE_KEYS.GROUPS, groups);

    // Automatically join the creator
    const members = getStorage<Record<string, string[]>>(STORAGE_KEYS.GROUP_MEMBERS, {});
    if (!members[newGroup.id]) members[newGroup.id] = [];
    if (!members[newGroup.id].includes(creatorUserId)) {
      members[newGroup.id].push(creatorUserId);
      setStorage(STORAGE_KEYS.GROUP_MEMBERS, members);
    }

    return newGroup;
  }

  // Return all user-created content (businesses, groups, events)
  getUserCreatedContent(userId: string): {
    businesses: PublicBusinessProjection[];
    groups: CommunityGroup[];
    events: CommunityEvent[];
  } {
    const businesses = this.getPublicBusinesses().filter((b) => b.created_by_user_id === userId);
    const groups = this.getGroups().filter((g) => g.owner_user_id === userId);
    const events = this.getEvents().filter((e) => e.creator_user_id === userId);
    return { businesses, groups, events };
  }

  getUserAdminGroups(userId: string): CommunityGroup[] {
    const groups = this.getGroups();
    return groups.filter((g) => g.owner_user_id === userId);
  }

  // --- Group Memberships ---
  isMemberOfGroup(userId: string, groupId: string): boolean {
    const members = getStorage<Record<string, string[]>>(STORAGE_KEYS.GROUP_MEMBERS, {
      grp_001: ['usr_001', 'usr_002'],
      grp_002: ['usr_002'],
    });
    return members[groupId]?.includes(userId) ?? false;
  }

  toggleGroupMembership(userId: string, groupId: string): boolean {
    const members = getStorage<Record<string, string[]>>(STORAGE_KEYS.GROUP_MEMBERS, {
      grp_001: ['usr_001', 'usr_002'],
      grp_002: ['usr_002'],
    });
    if (!members[groupId]) members[groupId] = [];

    const isMember = members[groupId].includes(userId);
    if (isMember) {
      members[groupId] = members[groupId].filter((id) => id !== userId);
    } else {
      members[groupId].push(userId);
    }
    setStorage(STORAGE_KEYS.GROUP_MEMBERS, members);
    return !isMember;
  }

  // --- Organizer Follows ---
  isFollowingOrganizer(userId: string, organizerKey: string): boolean {
    const follows = getStorage<Record<string, string[]>>(STORAGE_KEYS.ORGANIZER_FOLLOWS, {
      bus_001: ['usr_002'],
      grp_002: ['usr_001'],
    });
    return follows[organizerKey]?.includes(userId) ?? false;
  }

  toggleFollowOrganizer(userId: string, organizerKey: string): boolean {
    const follows = getStorage<Record<string, string[]>>(STORAGE_KEYS.ORGANIZER_FOLLOWS, {
      bus_001: ['usr_002'],
      grp_002: ['usr_001'],
    });
    if (!follows[organizerKey]) follows[organizerKey] = [];

    const isFollowing = follows[organizerKey].includes(userId);
    if (isFollowing) {
      follows[organizerKey] = follows[organizerKey].filter((id) => id !== userId);
    } else {
      follows[organizerKey].push(userId);
    }
    setStorage(STORAGE_KEYS.ORGANIZER_FOLLOWS, follows);
    return !isFollowing;
  }

  getOrganizerFollowerCount(organizerKey: string, baseCount = 142): number {
    const follows = getStorage<Record<string, string[]>>(STORAGE_KEYS.ORGANIZER_FOLLOWS, {
      bus_001: ['usr_002'],
      grp_002: ['usr_001'],
    });
    const extra = follows[organizerKey]?.length || 0;
    return baseCount + extra;
  }

  // --- Members & Followers Directory for Group and Business Admin ---
  getMembersForGroup(groupId: string): {
    id: string;
    public_reference: string;
    display_name: string;
    joined_at: string;
    has_push_opt_in: boolean;
  }[] {
    const membersMap = getStorage<Record<string, string[]>>(STORAGE_KEYS.GROUP_MEMBERS, {
      grp_001: ['usr_001', 'usr_002'],
      grp_002: ['usr_002'],
    });
    const userIds = membersMap[groupId] || ['usr_001', 'usr_002'];
    const users = this.getUsers();
    const grp = this.getGroupById(groupId);
    const grpRef = grp?.group_reference || '';

    return userIds.map((uid, idx) => {
      const u = users.find((user) => user.id === uid);
      const prof = this.getProfile(uid);
      const hasPush = u?.push_opt_ins?.some((p) => p.target_reference === grpRef) ?? (idx === 0);
      return {
        id: uid,
        public_reference: u?.public_reference || `USR-PDC-${uid.slice(-4).toUpperCase()}`,
        display_name: prof.display_name || (idx === 0 ? 'Elena Solís' : 'Carlos Méndez'),
        joined_at: '2026-09-15T14:30:00Z',
        has_push_opt_in: hasPush,
      };
    });
  }

  getFollowersForBusiness(businessId: string): {
    id: string;
    public_reference: string;
    display_name: string;
    followed_at: string;
    has_push_opt_in: boolean;
  }[] {
    const follows = getStorage<Record<string, string[]>>(STORAGE_KEYS.ORGANIZER_FOLLOWS, {
      bus_001: ['usr_002', 'usr_001'],
      grp_002: ['usr_001'],
    });
    const userIds = follows[businessId] || ['usr_002', 'usr_001'];
    const users = this.getUsers();
    const biz = this.getBusinessById(businessId);
    const bizRef = biz?.business_reference || '';

    return userIds.map((uid, idx) => {
      const u = users.find((user) => user.id === uid);
      const prof = this.getProfile(uid);
      const hasPush = u?.push_opt_ins?.some((p) => p.target_reference === bizRef) ?? true;
      return {
        id: uid,
        public_reference: u?.public_reference || `USR-PDC-${uid.slice(-4).toUpperCase()}`,
        display_name: prof.display_name || (idx === 0 ? 'Carlos Méndez' : 'Elena Solís'),
        followed_at: '2026-09-18T10:00:00Z',
        has_push_opt_in: hasPush,
      };
    });
  }

  // --- Broadcast Campaigns (Paid Member Push Notifications) ---
  getBroadcastCampaigns(targetType: 'business' | 'group', targetId: string): BroadcastCampaign[] {
    const campaigns = getStorage<BroadcastCampaign[]>(STORAGE_KEYS.BROADCASTS, [
      {
        id: 'bc_001',
        campaign_reference: 'NOTIF-PDC-8X2M1',
        owner_user_id: 'usr_001',
        target_type: 'business',
        target_id: 'rec_biz_001',
        target_name: 'Café Maya Consciente',
        title: '¡Nueva cata de café orgánico este jueves!',
        message: 'A todos nuestros clientes y miembros fieles: 20% off en granos de Chiapas este jueves a las 6pm.',
        target_segment: 'all_members',
        recipient_count: 142,
        plan_price_mxn: 149,
        payment_method: 'card',
        status: 'delivered',
        created_at: '2026-09-18T16:00:00Z',
        sent_at: '2026-09-18T16:05:00Z',
      },
    ]);
    return campaigns.filter((c) => c.target_type === targetType && c.target_id === targetId);
  }

  createBroadcastCampaign(
    ownerUserId: string,
    data: {
      target_type: 'business' | 'group';
      target_id: string;
      target_name: string;
      title: string;
      message: string;
      target_segment: 'all_members' | 'active_this_month' | 'new_members';
      recipient_count: number;
      plan_price_mxn: number;
      payment_method: 'card' | 'oxxo';
    }
  ): BroadcastCampaign {
    const campaigns = getStorage<BroadcastCampaign[]>(STORAGE_KEYS.BROADCASTS, []);
    const randRef = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newCamp: BroadcastCampaign = {
      ...data,
      id: `bc_${Date.now()}`,
      campaign_reference: `NOTIF-PDC-${randRef}`,
      owner_user_id: ownerUserId,
      status: 'queued',
      created_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
    };
    campaigns.unshift(newCamp);
    setStorage(STORAGE_KEYS.BROADCASTS, campaigns);
    return newCamp;
  }

  // --- Reviews ---
  getReviewsForBusiness(businessId: string): BusinessReview[] {
    const reviews = getStorage<BusinessReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return reviews.filter((r) => r.business_id === businessId);
  }

  submitReview(review: Omit<BusinessReview, 'id' | 'review_reference' | 'created_at'>): BusinessReview {
    const reviews = getStorage<BusinessReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const randRef = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newRev: BusinessReview = {
      ...review,
      id: `rev_${Date.now()}`,
      review_reference: `REV-PDC-${randRef}`,
      created_at: new Date().toISOString(),
    };
    reviews.unshift(newRev);
    setStorage(STORAGE_KEYS.REVIEWS, reviews);
    return newRev;
  }

  respondToReview(reviewId: string, authorName: string, content: string): boolean {
    const reviews = getStorage<BusinessReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const rev = reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.business_response = {
        author_name: authorName,
        content,
        created_at: new Date().toISOString(),
      };
      setStorage(STORAGE_KEYS.REVIEWS, reviews);
      return true;
    }
    return false;
  }

  // --- Offers ---
  getOffers(businessId?: string): BusinessOffer[] {
    const offers = getStorage<BusinessOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
    if (businessId) return offers.filter((o) => o.business_id === businessId);
    return offers;
  }

  // --- Sponsors ---
  getSponsors(): SponsorCampaign[] {
    return getStorage<SponsorCampaign[]>(STORAGE_KEYS.SPONSORS, INITIAL_SPONSORS);
  }

  getActiveSponsorBanners(): SponsorCampaign[] {
    const sponsors = this.getSponsors();
    return sponsors.filter((s) => s.active === true || s.status === 'active');
  }

  // --- Native Loyalty Cards ---
  getLoyaltyPrograms(): NativeLoyaltyProgram[] {
    return getStorage<NativeLoyaltyProgram[]>(
      STORAGE_KEYS.LOYALTY_PROGRAMS,
      INITIAL_LOYALTY_PROGRAMS
    );
  }

  getCustomerCards(userId: string): CustomerLoyaltyCard[] {
    const cards = getStorage<CustomerLoyaltyCard[]>(
      STORAGE_KEYS.CUSTOMER_CARDS,
      INITIAL_CUSTOMER_CARDS
    );
    return cards.filter((c) => c.user_id === userId);
  }

  enrollInLoyalty(userId: string, programId: string): CustomerLoyaltyCard {
    const cards = getStorage<CustomerLoyaltyCard[]>(
      STORAGE_KEYS.CUSTOMER_CARDS,
      INITIAL_CUSTOMER_CARDS
    );
    const programs = this.getLoyaltyPrograms();
    const prog = programs.find((p) => p.id === programId);

    const existing = cards.find((c) => c.user_id === userId && c.program_id === programId);
    if (existing) return existing;

    const newCard: CustomerLoyaltyCard = {
      id: `card_${Date.now()}`,
      user_id: userId,
      program_id: programId,
      business_id: prog?.business_id || '',
      business_name: prog?.business_name || 'Comercio PlayaVida',
      stamps_count: 0,
      total_lifetime_stamps: 0,
      available_vouchers: [],
      joined_at: new Date().toISOString(),
    };
    cards.push(newCard);
    setStorage(STORAGE_KEYS.CUSTOMER_CARDS, cards);
    return newCard;
  }

  awardStamp(
    cardId: string,
    staffPin: string
  ): { success: boolean; message: string; vouchersIssued?: string[] } {
    // Validate staff PIN
    const validStaff = INITIAL_STAFF_ACCOUNTS.find((s) => s.pin_code === staffPin);
    if (!validStaff) {
      return { success: false, message: 'PIN de Staff incorrecto o no autorizado.' };
    }

    const cards = getStorage<CustomerLoyaltyCard[]>(
      STORAGE_KEYS.CUSTOMER_CARDS,
      INITIAL_CUSTOMER_CARDS
    );
    const card = cards.find((c) => c.id === cardId);
    if (!card) return { success: false, message: 'Tarjeta de fidelidad no encontrada.' };

    const programs = this.getLoyaltyPrograms();
    const prog = programs.find((p) => p.id === card.program_id);

    card.stamps_count += 1;
    card.total_lifetime_stamps += 1;

    // Check reward tiers (10, 20, 50 stamps)
    const newVouchers: string[] = [];
    if (prog) {
      for (const tier of prog.reward_tiers) {
        if (card.stamps_count === tier.threshold) {
          const vRef = `VOU-PDC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
          card.available_vouchers.push({
            voucher_reference: vRef,
            tier_threshold: tier.threshold,
            title_es: tier.reward_es,
            title_en: tier.reward_en,
            issued_at: new Date().toISOString(),
            status: 'available',
          });
          newVouchers.push(tier.reward_es);
        }
      }
    }

    setStorage(STORAGE_KEYS.CUSTOMER_CARDS, cards);

    // Record append-only ledger transaction
    const ledger = getStorage<LoyaltyLedgerTransaction[]>(STORAGE_KEYS.LOYALTY_LEDGER, []);
    ledger.push({
      id: `txn_${Date.now()}`,
      transaction_reference: `TXN-PDC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      idempotency_key: `idemp_${Date.now()}_${cardId}`,
      program_id: card.program_id,
      business_id: card.business_id,
      customer_user_id: card.user_id,
      staff_id: validStaff.id,
      staff_name: validStaff.display_name,
      event_type: 'stamp_awarded',
      amount: 1,
      metadata: `Current balance: ${card.stamps_count}`,
      created_at: new Date().toISOString(),
    });
    setStorage(STORAGE_KEYS.LOYALTY_LEDGER, ledger);

    return {
      success: true,
      message: `¡Sello otorgado con éxito por ${validStaff.display_name}! Balance actual: ${card.stamps_count}`,
      vouchersIssued: newVouchers,
    };
  }

  redeemVoucher(cardId: string, voucherRef: string): boolean {
    const cards = getStorage<CustomerLoyaltyCard[]>(
      STORAGE_KEYS.CUSTOMER_CARDS,
      INITIAL_CUSTOMER_CARDS
    );
    const card = cards.find((c) => c.id === cardId);
    if (!card) return false;
    const v = card.available_vouchers.find((x) => x.voucher_reference === voucherRef);
    if (v && v.status === 'available') {
      v.status = 'redeemed';
      setStorage(STORAGE_KEYS.CUSTOMER_CARDS, cards);
      return true;
    }
    return false;
  }

  // --- Loyalty Bonus Features & Quests ---
  getLoyaltyProgramByBusinessId(businessId: string): NativeLoyaltyProgram | null {
    const programs = this.getLoyaltyPrograms();
    return programs.find((p) => p.business_id === businessId) || null;
  }

  createLoyaltyProgramForBusiness(
    businessId: string,
    businessName: string,
    locationCode: string = 'PDC'
  ): NativeLoyaltyProgram {
    const programs = this.getLoyaltyPrograms();
    const existing = programs.find((p) => p.business_id === businessId);
    if (existing) return existing;

    const newProg: NativeLoyaltyProgram = {
      id: `prog_${Date.now()}`,
      program_reference: `LOY-${locationCode}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      business_id: businessId,
      business_name: businessName,
      location_code: locationCode as any,
      name_es: `Club de Recompensas ${businessName}`,
      name_en: `${businessName} Rewards Club`,
      description_es: `Colecciona sellos en tus visitas a ${businessName} y canjea premios exclusivos.`,
      description_en: `Collect stamps on every visit to ${businessName} and unlock exclusive rewards.`,
      stamps_required_base: 10,
      reward_tiers: [
        { threshold: 10, reward_es: 'Bebida de especialidad gratis', reward_en: 'Free specialty drink', reward_type: 'drink' },
        { threshold: 20, reward_es: '20% de descuento en tu cuenta total', reward_en: '20% off entire bill', reward_type: 'discount' },
        { threshold: 50, reward_es: 'Experiencia VIP de degustación', reward_en: 'VIP tasting experience', reward_type: 'experience' },
      ],
      bonus_features: [
        {
          id: `bonus_${Date.now()}_1`,
          title_es: 'Foto de Arte Latte / Topping',
          title_en: 'Latte Art / Topping Photo',
          description_es: 'Sube una foto de la decoración o arte latte de tu bebida para obtener un sello extra.',
          description_en: 'Upload a photo of your latte art or topping to earn a bonus stamp.',
          extra_stamps: 1,
          bonus_stamps: 1,
          requires_photo_upload: true,
          photo_prompt_es: 'Sube una foto de tu topping o bebida servida',
          active: true,
        },
      ],
      created_at: new Date().toISOString(),
    };
    programs.push(newProg);
    setStorage(STORAGE_KEYS.LOYALTY_PROGRAMS, programs);
    return newProg;
  }

  addBonusFeature(
    programId: string,
    feature: Omit<LoyaltyBonusFeature, 'id' | 'created_at'>
  ): LoyaltyBonusFeature | null {
    const programs = this.getLoyaltyPrograms();
    const prog = programs.find((p) => p.id === programId);
    if (!prog) return null;

    if (!prog.bonus_features) prog.bonus_features = [];
    const newBonus: LoyaltyBonusFeature = {
      ...feature,
      id: `bonus_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    prog.bonus_features.push(newBonus);
    setStorage(STORAGE_KEYS.LOYALTY_PROGRAMS, programs);
    return newBonus;
  }

  updateBonusFeature(
    programId: string,
    featureId: string,
    updates: Partial<LoyaltyBonusFeature>
  ): boolean {
    const programs = this.getLoyaltyPrograms();
    const prog = programs.find((p) => p.id === programId);
    if (!prog || !prog.bonus_features) return false;

    const idx = prog.bonus_features.findIndex((b) => b.id === featureId);
    if (idx === -1) return false;

    prog.bonus_features[idx] = {
      ...prog.bonus_features[idx],
      ...updates,
    };
    setStorage(STORAGE_KEYS.LOYALTY_PROGRAMS, programs);
    return true;
  }

  removeBonusFeature(programId: string, featureId: string): boolean {
    const programs = this.getLoyaltyPrograms();
    const prog = programs.find((p) => p.id === programId);
    if (!prog || !prog.bonus_features) return false;

    prog.bonus_features = prog.bonus_features.filter((b) => b.id !== featureId);
    setStorage(STORAGE_KEYS.LOYALTY_PROGRAMS, programs);
    return true;
  }

  claimBonusStamp(
    userId: string,
    programId: string,
    bonusId: string,
    photoUrl?: string
  ): { success: boolean; message: string; stampsAwarded: number } {
    const programs = this.getLoyaltyPrograms();
    const prog = programs.find((p) => p.id === programId);
    if (!prog || !prog.bonus_features) {
      return { success: false, message: 'Programa o misión no encontrados.', stampsAwarded: 0 };
    }

    const bonus = prog.bonus_features.find((b) => b.id === bonusId && b.active);
    if (!bonus) {
      return { success: false, message: 'Misión no disponible o inactiva.', stampsAwarded: 0 };
    }

    // Ensure customer has enrolled card
    let card = this.getCustomerCards(userId).find((c) => c.program_id === programId);
    if (!card) {
      card = this.enrollInLoyalty(userId, programId);
    }

    const cards = getStorage<CustomerLoyaltyCard[]>(
      STORAGE_KEYS.CUSTOMER_CARDS,
      INITIAL_CUSTOMER_CARDS
    );
    const targetCard = cards.find((c) => c.id === card!.id);
    if (!targetCard) {
      return { success: false, message: 'No se pudo acceder a la tarjeta.', stampsAwarded: 0 };
    }

    if (!targetCard.completed_bonuses) {
      targetCard.completed_bonuses = [];
    }

    // Check if already claimed recently
    const alreadyClaimed = targetCard.completed_bonuses.some((cb) => cb.bonus_id === bonusId);
    if (alreadyClaimed) {
      return {
        success: false,
        message: 'Ya has canjeado este beneficio especial para esta tarjeta.',
        stampsAwarded: 0,
      };
    }

    const stampsToAdd = bonus.extra_stamps || bonus.bonus_stamps || 1;
    targetCard.stamps_count += stampsToAdd;
    targetCard.total_lifetime_stamps += stampsToAdd;

    targetCard.completed_bonuses.push({
      bonus_id: bonusId,
      title: bonus.title_es || bonus.title_en,
      stamps_awarded: stampsToAdd,
      photo_url: photoUrl,
      claimed_at: new Date().toISOString(),
    });

    // Check tiers
    for (const tier of prog.reward_tiers) {
      if (
        targetCard.stamps_count >= tier.threshold &&
        !targetCard.available_vouchers.some((v) => v.tier_threshold === tier.threshold)
      ) {
        const vRef = `VOU-PDC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        targetCard.available_vouchers.push({
          voucher_reference: vRef,
          tier_threshold: tier.threshold,
          title_es: tier.reward_es,
          title_en: tier.reward_en,
          issued_at: new Date().toISOString(),
          status: 'available',
        });
      }
    }

    setStorage(STORAGE_KEYS.CUSTOMER_CARDS, cards);

    return {
      success: true,
      message: `¡Felicidades! Se han agregado +${stampsToAdd} sello(s) a tu tarjeta de ${prog.business_name}.`,
      stampsAwarded: stampsToAdd,
    };
  }

  // --- Universal Reports ---
  submitReport(
    reporterUserIdOrPayload:
      | string
      | {
          reporter_user_id: string;
          target_entity_type: UniversalReport['target_entity_type'];
          target_reference: string;
          target_name?: string;
          reason: UniversalReport['reason'];
          details?: string;
          description?: string;
        },
    targetEntityType?: UniversalReport['target_entity_type'],
    targetReference?: string,
    targetName?: string,
    reason?: UniversalReport['reason'],
    description?: string
  ): UniversalReport {
    let reporterUserId: string;
    let actualEntityType: UniversalReport['target_entity_type'];
    let actualTargetRef: string;
    let actualTargetName: string;
    let actualReason: UniversalReport['reason'];
    let actualDescription: string;

    if (typeof reporterUserIdOrPayload === 'object' && reporterUserIdOrPayload !== null) {
      reporterUserId = reporterUserIdOrPayload.reporter_user_id;
      actualEntityType = reporterUserIdOrPayload.target_entity_type;
      actualTargetRef = reporterUserIdOrPayload.target_reference;
      actualTargetName = reporterUserIdOrPayload.target_name || reporterUserIdOrPayload.target_reference;
      actualReason = reporterUserIdOrPayload.reason;
      actualDescription = reporterUserIdOrPayload.details || reporterUserIdOrPayload.description || '';
    } else {
      reporterUserId = reporterUserIdOrPayload;
      actualEntityType = targetEntityType!;
      actualTargetRef = targetReference!;
      actualTargetName = targetName || targetReference!;
      actualReason = reason!;
      actualDescription = description || '';
    }

    if (!reporterUserId || reporterUserId.trim() === '') {
      throw new Error('Unauthenticated users cannot submit reports. Login is required.');
    }

    const reports = getStorage<UniversalReport[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    const randRef = Math.random().toString(36).substring(2, 7).toUpperCase();
    const users = this.getUsers();
    const user = users.find((u) => u.id === reporterUserId);

    const newReport: UniversalReport = {
      id: `rpt_${Date.now()}`,
      report_reference: `RPT-PDC-${randRef}`,
      reporter_user_id: reporterUserId,
      reporter_reference: user?.public_reference || 'USR-PDC-00000',
      target_entity_type: actualEntityType,
      target_reference: actualTargetRef,
      target_name: actualTargetName,
      reason: actualReason,
      description: actualDescription,
      content_snapshot: JSON.stringify({
        targetReference: actualTargetRef,
        targetName: actualTargetName,
        captured_at: new Date().toISOString(),
      }),
      status: 'open',
      created_at: new Date().toISOString(),
    };
    reports.push(newReport);
    setStorage(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  }

  // --- Saved Favorites / Bookmarks ---
  getFavorites(): { businesses: string[]; events: string[]; groups: string[] } {
    return getStorage<{ businesses: string[]; events: string[]; groups: string[] }>(
      STORAGE_KEYS.FAVORITES,
      { businesses: ['rec_biz_001'], events: ['rec_evt_001'], groups: [] }
    );
  }

  isFavorite(type: 'business' | 'event' | 'group', id: string): boolean {
    const favs = this.getFavorites();
    if (type === 'business') return favs.businesses.includes(id);
    if (type === 'event') return favs.events.includes(id);
    if (type === 'group') return favs.groups.includes(id);
    return false;
  }

  toggleFavorite(type: 'business' | 'event' | 'group', id: string): boolean {
    const favs = this.getFavorites();
    let key: 'businesses' | 'events' | 'groups' = 'businesses';
    if (type === 'event') key = 'events';
    if (type === 'group') key = 'groups';

    const index = favs[key].indexOf(id);
    let isNowFavorite = false;
    if (index > -1) {
      favs[key].splice(index, 1);
      isNowFavorite = false;
    } else {
      favs[key].push(id);
      isNowFavorite = true;
    }
    setStorage(STORAGE_KEYS.FAVORITES, favs);
    return isNowFavorite;
  }

  // --- Dynamic Alphabetical Locations with Persistent Memory ---
  getCustomLocations(): LocationInfo[] {
    return getStorage<LocationInfo[]>(STORAGE_KEYS.CUSTOM_LOCATIONS, []);
  }

  addCustomLocation(name: string, region = 'Quintana Roo'): LocationInfo {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Location name cannot be empty');

    const custom = this.getCustomLocations();
    // Check if already exists in base or custom
    const existing = this.getAllLocations().find(
      (l) => l.name_es.toLowerCase() === trimmed.toLowerCase() || l.name_en.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing;

    const code = ('LOC_' + trimmed.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') + '_' + Date.now().toString().slice(-4)) as LocationCode;
    const newLoc: LocationInfo = {
      code,
      name_es: trimmed,
      name_en: trimmed,
      region,
      country: 'México',
      timezone: 'America/Cancun',
    };

    custom.push(newLoc);
    setStorage(STORAGE_KEYS.CUSTOM_LOCATIONS, custom);
    return newLoc;
  }

  getAllLocations(isEs = true): LocationInfo[] {
    const custom = this.getCustomLocations();
    const all = [...LOCATIONS, ...custom];
    return all.sort((a, b) => {
      const nameA = (isEs ? a.name_es : a.name_en) || a.name_es;
      const nameB = (isEs ? b.name_es : b.name_en) || b.name_es;
      return nameA.localeCompare(nameB, isEs ? 'es' : 'en', { sensitivity: 'base' });
    });
  }

  // --- Dynamic Alphabetical Interests with Persistent Memory ---
  getCustomInterests(): CommunityInterestItem[] {
    return getStorage<CommunityInterestItem[]>(STORAGE_KEYS.CUSTOM_INTERESTS, []);
  }

  addCustomInterest(labelEs: string, labelEn?: string): CommunityInterestItem {
    const trimmedEs = labelEs.trim();
    const trimmedEn = (labelEn || labelEs).trim();
    if (!trimmedEs) throw new Error('Interest label cannot be empty');

    const custom = this.getCustomInterests();
    const existing = this.getAllInterests().find(
      (i) => i.label_es.toLowerCase() === trimmedEs.toLowerCase() || i.label_en.toLowerCase() === trimmedEn.toLowerCase()
    );
    if (existing) return existing;

    const id = 'custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newItem: CommunityInterestItem = {
      id,
      label_es: trimmedEs,
      label_en: trimmedEn,
    };
    custom.push(newItem);
    setStorage(STORAGE_KEYS.CUSTOM_INTERESTS, custom);
    return newItem;
  }

  getAllInterests(isEs = true): CommunityInterestItem[] {
    const custom = this.getCustomInterests();
    const combined = [...BASE_30_INTERESTS, ...custom];
    return combined.sort((a, b) => {
      const nameA = isEs ? a.label_es : a.label_en;
      const nameB = isEs ? b.label_es : b.label_en;
      return nameA.localeCompare(nameB, isEs ? 'es' : 'en', { sensitivity: 'base' });
    });
  }
}

export const playaVidaStore = new PlayaVidaStore();
