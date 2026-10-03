# Storage Migration Notes

This document outlines the migration plan for the PlayaVida application's storage layer.

## UI-Safe Types/Interfaces
The following types and interfaces from `src/types.ts` and `src/lib/storage.ts` are safe to retain as they represent the data structure of the application:
- `User`, `PersonalProfile`, `PrivacyPreferences`
- `PublicBusinessProjection`, `PrivateBusinessContactDetails`, `BusinessSubscription`
- `CommunityEvent`, `CommunityGroup`, `EventSponsor`
- `BusinessReview`, `BusinessOffer`
- `SponsorCampaign`
- `NativeLoyaltyProgram`, `CustomerLoyaltyCard`
- `BroadcastCampaign`

## Functions Requiring Secure Server API
The following functions in `PlayaVidaStore` rely on live Teable data, secure authentication, or payment processing and MUST be migrated to a backend API:
- `loginWithOtp` / `verifyOtpAndLogin` (Auth/OTP)
- `authenticateWithEmail` (Auth)
- `upgradeWithStripeCard` / `createOxxoPaymentVoucher` / `confirmOxxoPayment` (Stripe)
- Methods performing direct writes/reads to/from Teable (e.g., `saveProfile`, `savePrivateContactDetails`, `createCommunityGroup`)

## Future Interface Boundaries
Suggested boundaries for repositories in the new backend:
- `PublicDirectoryRepository` (Handles `getPublicBusinesses`)
- `EventRepository` (Handles `getEvents`)
- `GroupRepository` (Handles `getGroups`)
- `BusinessRepository` (Handles `getPublicBusinessById`, `getOwnerPrivateContactDetails`)
- `SessionRepository` (Handles user authentication state)
- `ConsentRepository` (Handles `savePrivacyPreferences`)

## Mocking Strategy
Until a secure server API is available, these methods should use mock data defined in `src/lib/constants.ts` to maintain UI functionality.

## Auth Recommendations
- The current authentication UI is a mock and does NOT perform actual verification.
- **Priority:** Implement secure Email OTP or SMS/WhatsApp OTP in the backend phase.
- WhatsApp verification (via Meta Business API) is highly recommended as a more reliable and engaging verification method for this user base.
