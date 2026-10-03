/**
 * Test-only fixtures for security.test.ts
 * These fixtures are NOT imported by any application/UI code.
 * They exist solely to satisfy test assertions without polluting demo constants.
 */

import {
  PublicBusinessProjection,
  PrivateBusinessContactDetails,
  BusinessSubscription,
  User,
  NativeLoyaltyProgram,
  StaffAccount,
  CustomerLoyaltyCard,
} from '../../types';

export const TEST_OWNER_A: User = {
  id: 'usr_test_owner_a',
  public_reference: 'USR-TEST-OWNERA',
  email: 'test_owner_a@playavida.test',
  selected_language: 'es',
  role: 'business_owner',
  created_at: '2026-01-01T00:00:00Z',
};

export const TEST_CUSTOMER_A: User = {
  id: 'usr_test_customer_a',
  public_reference: 'USR-TEST-CUSTA',
  email: 'test_customer_a@playavida.test',
  selected_language: 'en',
  role: 'member',
  created_at: '2026-01-01T00:00:00Z',
};

export const TEST_STAFF_A: StaffAccount = {
  id: 'stf_test_a',
  staff_reference: 'STF-TEST-A',
  business_id: 'bus_test_a',
  display_name: 'Test Staff A',
  role: 'staff',
  pin_code: '1234',
  active: true,
  created_at: '2026-01-01T00:00:00Z',
};

export const TEST_BUSINESS_A: PublicBusinessProjection = {
  id: 'bus_test_a',
  business_reference: 'BUS-TEST-A',
  name: 'Test Business A',
  slug: 'test-business-a',
  category: 'Gastronomía y Restaurantes',
  description_es: 'Negocio de prueba A',
  description_en: 'Test Business A',
  services: ['Test'],
  languages: ['Español'],
  logo_url: 'https://example.com/logo.jpg',
  cover_url: 'https://example.com/cover.jpg',
  cover_image_url: 'https://example.com/cover.jpg',
  location_code: 'PDC',
  location_label: 'Playa del Carmen, Q.R.',
  status: 'published',
  has_contact_enabled: true,
  has_loyalty_program: true,
  has_active_offers: false,
  gallery_urls: [],
  created_by_user_id: TEST_OWNER_A.id,
  created_at: '2026-01-01T00:00:00Z',
};

export const TEST_BUSINESS_B: PublicBusinessProjection = {
  id: 'bus_test_b',
  business_reference: 'BUS-TEST-B',
  name: 'Test Business B',
  slug: 'test-business-b',
  category: 'Bienestar, Spas y Yoga',
  description_es: 'Negocio de prueba B',
  description_en: 'Test Business B',
  services: ['Test'],
  languages: ['Español'],
  logo_url: 'https://example.com/logo.jpg',
  cover_url: 'https://example.com/cover.jpg',
  cover_image_url: 'https://example.com/cover.jpg',
  location_code: 'PDC',
  location_label: 'Playa del Carmen, Q.R.',
  status: 'published',
  has_contact_enabled: false,
  has_loyalty_program: false,
  has_active_offers: false,
  gallery_urls: [],
  created_by_user_id: TEST_OWNER_A.id,
  created_at: '2026-01-01T00:00:00Z',
};

export const TEST_PRIVATE_CONTACTS_A: PrivateBusinessContactDetails = {
  business_id: 'bus_test_a',
  address: 'Test Address 123',
  city: 'Playa del Carmen',
  latitude: 20.6274,
  longitude: -87.0799,
  phone: '+52 984 111 1111',
  email: 'test_a@playavida.test',
  whatsapp: '+52 984 111 1111',
  website: 'https://test-a.playavida.test',
  booking_url: 'https://booking.test-a.playavida.test',
  opening_hours: [],
  updated_at: '2026-01-01T00:00:00Z',
};

export const TEST_SUBSCRIPTION_ACTIVE: BusinessSubscription = {
  id: 'sub_test_active',
  business_id: 'bus_test_a',
  plan_key: 'starter_contact',
  plan_name_es: 'Plan Contacto Pro',
  plan_name_en: 'Pro Contact Plan',
  monthly_price_mxn: 299,
  status: 'active',
  current_period_start: '2026-01-01T00:00:00Z',
  current_period_end: '2026-12-31T23:59:59Z',
  payment_method: 'card',
};

export const TEST_SUBSCRIPTION_EXPIRED: BusinessSubscription = {
  id: 'sub_test_expired',
  business_id: 'bus_test_b',
  plan_key: 'free',
  plan_name_es: 'Plan Gratuito',
  plan_name_en: 'Free Plan',
  monthly_price_mxn: 0,
  status: 'expired',
  current_period_start: '2026-01-01T00:00:00Z',
  current_period_end: '2026-01-01T00:00:00Z',
  payment_method: 'card',
};

export const TEST_LOYALTY_PROGRAM_A: NativeLoyaltyProgram = {
  id: 'prog_test_a',
  program_reference: 'LOY-TEST-A',
  business_id: 'bus_test_a',
  business_name: 'Test Business A',
  location_code: 'PDC',
  name_es: 'Club Test A',
  name_en: 'Test Club A',
  description_es: 'Programa de prueba',
  description_en: 'Test Program',
  stamps_required_base: 10,
  reward_tiers: [
    { threshold: 10, reward_es: 'Test Reward', reward_en: 'Test Reward', reward_type: 'drink' },
  ],
  bonus_features: [],
  active: true,
  staff_limit: 10,
  created_at: '2026-01-01T00:00:00Z',
};

export const TEST_CUSTOMER_CARD_A: CustomerLoyaltyCard = {
  id: 'card_test_a',
  user_id: TEST_CUSTOMER_A.id,
  program_id: 'prog_test_a',
  business_id: 'bus_test_a',
  business_name: 'Test Business A',
  stamps_count: 0,
  total_lifetime_stamps: 0,
  available_vouchers: [],
  joined_at: '2026-01-01T00:00:00Z',
};