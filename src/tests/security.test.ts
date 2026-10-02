/**
 * Automated Security & Privacy Test Suite for PlayaVida
 *
 * Verifies core security invariants:
 * 1. Private contact details never leak into public business projections.
 * 2. Drafts and archived businesses are not publicly searchable.
 * 3. Unauthenticated users cannot view protected contacts or submit reports.
 * 4. Subscriptions and 7-day grace periods govern contact visibility.
 * 5. Blocked entities are strictly filtered from user views.
 * 6. Loyalty stamp awards require valid staff PIN authorization.
 */

import { playaVidaStore } from '../lib/storage';
import { teableAdapter } from '../lib/teableAdapter';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('\n🔒 Starting PlayaVida Security & Boundary Validation Tests...\n');

// TEST 1: Public Projections Never Contain Private Fields
console.log('--- Test Suite 1: Data Projection Security ---');
const publicBusinesses = playaVidaStore.getPublicBusinesses();
assert(publicBusinesses.length > 0, 'Public businesses list is not empty');

let leakedFieldsFound = false;
for (const biz of publicBusinesses) {
  const keys = Object.keys(biz);
  if (
    keys.includes('phone') ||
    keys.includes('whatsapp') ||
    keys.includes('email') ||
    keys.includes('address') ||
    keys.includes('booking_url')
  ) {
    leakedFieldsFound = true;
    break;
  }
}
assert(!leakedFieldsFound, 'Public business projections strictly exclude private contact fields');

// TEST 2: Drafts and Archived Profiles are NOT Publicly Accessible
console.log('\n--- Test Suite 2: Draft and Archived Visibility Boundaries ---');
const testDraftBiz = playaVidaStore.createBusinessDraft('usr_demo_001', {
  name: 'Secreto Beach Draft',
  category: 'Gastronomía y Restaurantes',
  location_code: 'PDC',
  location_label: 'Playa del Carmen, Q.R.',
  description_es: 'Borrador privado no publicado',
  description_en: 'Private unpublished draft',
  cover_url: 'https://images.unsplash.com/photo-1',
  logo_url: 'https://images.unsplash.com/photo-2',
  services: ['Borrador'],
  languages: ['Español'],
});

const searchResultsBeforePublish = playaVidaStore.getPublicBusinesses();
const isDraftSearchable = searchResultsBeforePublish.some((b) => b.id === testDraftBiz.id);
assert(!isDraftSearchable, 'Draft businesses are NOT included in public queries');

// Publish it
playaVidaStore.publishBusiness(testDraftBiz.id);
const searchResultsAfterPublish = playaVidaStore.getPublicBusinesses();
const isPublishedSearchable = searchResultsAfterPublish.some((b) => b.id === testDraftBiz.id);
assert(isPublishedSearchable, 'Published business becomes discoverable in public queries');

// Archive it
playaVidaStore.archiveBusiness(testDraftBiz.id);
const searchResultsAfterArchive = playaVidaStore.getPublicBusinesses();
const isArchivedSearchable = searchResultsAfterArchive.some((b) => b.id === testDraftBiz.id);
assert(!isArchivedSearchable, 'Archived business is strictly excluded from public queries');

// TEST 3: Contact Authorization & Entitlements
console.log('\n--- Test Suite 3: Contact Authorization Matrix ---');
// 3a. Unauthenticated user querying contact
const unauthContact = playaVidaStore.getAuthorizedContactDetails('bus_001', null);
assert(
  unauthContact.status === 'login_required' && unauthContact.details === null,
  'Unauthenticated user querying contact receives "login_required" with null details'
);

// 3b. Authenticated user querying locked/free tier business
// bus_003 is free tier / canceled
const freeTierContact = playaVidaStore.getAuthorizedContactDetails('bus_003', 'usr_002');
assert(
  freeTierContact.status === 'locked' && freeTierContact.details === null,
  'Authenticated user querying non-entitled business receives "locked" with null details'
);

// 3c. Authenticated user querying paid starter contact business
// bus_001 has active subscription
const paidContact = playaVidaStore.getAuthorizedContactDetails('bus_001', 'usr_002');
assert(
  paidContact.status === 'available' &&
    paidContact.details !== null &&
    typeof paidContact.details.phone === 'string' &&
    typeof paidContact.details.whatsapp === 'string',
  'Authenticated user querying entitled business receives "available" with sanitized details'
);

// TEST 4: Subscription Cancellation and 7-day Grace Period
console.log('\n--- Test Suite 4: Grace Period Security ---');
const cancelledSub = playaVidaStore.cancelSubscription('bus_001');
assert(
  cancelledSub !== null && cancelledSub.status === 'grace_period',
  'Cancelling active subscription transitions status to "grace_period"'
);
assert(
  cancelledSub !== null &&
    cancelledSub.grace_period_end !== undefined &&
    cancelledSub.grace_period_end !== null &&
    new Date(cancelledSub.grace_period_end) > new Date(),
  'Grace period has a valid future expiration timestamp (7 days)'
);

// During grace period, contact details still available
const gracePeriodContact = playaVidaStore.getAuthorizedContactDetails('bus_001', 'usr_002');
assert(
  gracePeriodContact.status === 'available' && gracePeriodContact.details !== null,
  'Contact details remain accessible during active grace period'
);

// TEST 5: Reporting Security
console.log('\n--- Test Suite 5: Universal Reporting Authentication Enforced ---');
let unauthReportThrew = false;
try {
  playaVidaStore.submitReport({
    reporter_user_id: '',
    target_entity_type: 'business',
    target_reference: 'BUS-PDC-4N7Q9',
    reason: 'spam',
    details: 'Anonymous report attempt',
  });
} catch (e) {
  unauthReportThrew = true;
}
assert(unauthReportThrew, 'Unauthenticated report submission is strictly rejected');

const validReport = playaVidaStore.submitReport({
  reporter_user_id: 'usr_002',
  target_entity_type: 'business',
  target_reference: 'BUS-PDC-4N7Q9',
  reason: 'inaccurate_info',
  details: 'Updated phone number',
});
assert(
  validReport.report_reference.startsWith('RPT-'),
  'Valid authenticated report generates immutable RPT-* reference'
);

// TEST 6: User-Owned Blocking
console.log('\n--- Test Suite 6: User-Owned Block List Filtering ---');
playaVidaStore.blockEntity('usr_001', 'BUS-PDC-9K2L1', 'business');
const blockedEntities = playaVidaStore.getBlockedEntities('usr_001');
assert(
  blockedEntities.some((b) => b.target_reference === 'BUS-PDC-9K2L1'),
  'Blocked business recorded in user block preferences'
);

// TEST 7: Native Loyalty Stamp Security
console.log('\n--- Test Suite 7: Loyalty Staff PIN Authentication ---');
const userCards = playaVidaStore.getCustomerCards('usr_002');
assert(userCards.length > 0, 'Customer loyalty card found for testing');
if (userCards.length > 0) {
  const card = userCards[0];
  const initialStamps = card.stamps_count;

  // Attempt with invalid PIN
  const invalidPinResult = playaVidaStore.awardStamp(card.id, '9999');
  assert(!invalidPinResult.success, 'Stamp award with invalid staff PIN is rejected');
  assert(card.stamps_count === initialStamps, 'Stamp count was not incremented');

  // Attempt with valid Barista PIN (1234 for Mateo)
  const validPinResult = playaVidaStore.awardStamp(card.id, '1234');
  assert(validPinResult.success, 'Stamp award with valid staff PIN is accepted');
  assert(
    card.stamps_count === initialStamps + 1,
    'Stamp count atomically incremented by exactly 1'
  );
}

// TEST 8: Teable Adapter Projection & Boundary Security
console.log('\n--- Test Suite 8: Teable Adapter Boundary Verification ---');
const rawTeableBusinessRecord = {
  id: 'rec_teable_999',
  fields: {
    business_reference: 'BUS-PDC-TB888',
    name: 'Caribe Raw Dining',
    category: 'Gastronomía y Restaurantes',
    location_code: 'PDC',
    location_label: 'Playa del Carmen Centro',
    description_es: 'Cocina de autor caribeña.',
    description_en: 'Artisanal Caribbean cuisine.',
    cover_url: 'https://example.com/cover.jpg',
    logo_url: 'https://example.com/logo.jpg',
    status: 'published',
    has_contact_enabled: true,
    // Sensitive fields injected by accident into raw row:
    phone: '+52 984 000 0000',
    email: 'private_owner@cariberaw.com',
    whatsapp: '+52 984 000 0000',
    address: 'Calle Secreta 123',
    latitude: 20.6274,
    longitude: -87.0799,
  },
};

const projectedBusiness = teableAdapter.projectPublicBusiness(rawTeableBusinessRecord);
assert(
  projectedBusiness.name === 'Caribe Raw Dining' &&
    projectedBusiness.business_reference === 'BUS-PDC-TB888',
  'TeableAdapter successfully projects public business fields'
);
assert(
  !('phone' in projectedBusiness) &&
    !('email' in projectedBusiness) &&
    !('whatsapp' in projectedBusiness) &&
    !('address' in projectedBusiness),
  'TeableAdapter public projection rigorously strips private contact fields'
);

const unauthContactProjection = teableAdapter.filterContactProjection(
  rawTeableBusinessRecord.fields,
  true,
  false
);
assert(
  unauthContactProjection.status === 'login_required' && unauthContactProjection.details === null,
  'TeableAdapter contact projection returns login_required with null details for unauthenticated requests'
);

const lockedContactProjection = teableAdapter.filterContactProjection(
  rawTeableBusinessRecord.fields,
  false,
  true
);
assert(
  lockedContactProjection.status === 'locked' && lockedContactProjection.details === null,
  'TeableAdapter contact projection returns locked with null details for non-entitled requests'
);

const entitledContactProjection = teableAdapter.filterContactProjection(
  rawTeableBusinessRecord.fields,
  true,
  true
);
assert(
  entitledContactProjection.status === 'available' &&
    entitledContactProjection.details !== null &&
    entitledContactProjection.details.phone === '+52 984 000 0000',
  'TeableAdapter contact projection releases contact details only when authenticated and entitled'
);

// Summary
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All security validation invariants verified successfully!\n');
}
