# PlayaVida integration contracts

Read-only interpretation of the schema in [Schema_Integration_Handoff.md](Schema_Integration_Handoff.md). This is **not** a claim that the rebuilt GitHub/Vercel app currently implements these controls. The field appendix contains every field ID, select option and relation; selected high-risk mappings are repeated below. The Teable base remains `bseeZUvNX8unS2KrzOE` and must not be restarted or replaced.

## Authentication and identity

| Surface | Existing table | Important field IDs / requirements |
|---|---|---|
| User identity | `Users` `tblB6Wiwy4KOx3Tjgui` | `user_id` `flddCyi2jmDWCL1XDWp`, `email` `fldnBFAznz1H4AXn2iD`, `email_verified` `fldXAiTdIQPaNybm7U2`, `account_status` `fldS7bTfSbJNKXW6sGP` (`pending`, `active`, `suspended`, `disabled`). No dedicated superadmin role field was found. |
| Public profile | `PersonalProfiles` `tblLPvqsTYbSeHqbO88` | `public_username`, `display_name`, `avatar_url`, `profile_visibility`; serialize public-safe fields only. |
| OTP | `AuthenticationOtpChallenges` `tblVe1AhQ3zLW3eijnw` | `email_hash` `fldMrBXahv8IF2ZfSRq`, `code_hash` `fldxu0JAKVpnPe1dT4Z`, `status` `fldJLj85iRMZS5nXaEw` (`issued`, `consumed`, `expired`, `invalidated`, `attempts_exceeded`, `delivery_failed`), `expires_at` `fldMqPflVIUVtOmD6O2`, `attempt_count` `fld9YVB0887WgJDGCpF`. No raw OTP or raw address in this table. |
| Sessions | `AuthenticationSessions` `tblap3ykSwQQk276MdN` | `session_token_hash` `fldl84pPnEaE789o4fb`, `session_version` `fldIQcKFLYxwiUmaEWS`, `status` `fldQSZKuqBlTqqKJCpV` (`active`, `revoked`, `expired`, `disabled`), `expires_at` `fldBV5lfBYmE1JEp6fm`, `user_id` `fldLm29Lep2rFZHqaEw` -> Users. No raw token. |
| Operational security | `AuthenticationOperationalAggregates` `tblARiGin9HMQpGMgQK`; `StaffPinSecurityEvents` `tblciuNt63idIfaLnIB`; `AdminNotifications` `tblF34hdMYFOtQhCN7P`; `ModerationActions` `tblR4eJVDk27AQV5zGj` | Aggregates are not an authentication audit log. Keep private security events and moderation details out of public payloads. |
| Consent and privacy | `UserPrivacyPreferences` `tblBqY7HYRNqX0fFLQY`; `NotificationConsentEvents` `tblWw4I7WjQcMCCMgU5`; `EntityNotificationSubscriptions` `tbl3UzWdkBCNCwTV9iZ` | `marketing_email` `fldzB4lRvbiCHSBUaGd`, `marketing_push` `fldxUTjPNNcMAGUcxtB`; consent-event `action` `fldpC5M9T0UKa1lo7AJ` (`opted_in`, `opted_out`, `updated`, `revoked`, `migrated`). An explicit versioned email-digest consent and privacy/data-request workflow need a decision and implementation. |

Only the server validates OTPs, performs atomic single-use consumption, enforces expiry/rate limits, creates hashed sessions, and revokes them. Specify retention/expiry in the rebuilt app and legal policy before purging anything; date fields exist but no schedule or guarantee was verified. Preserve consent events and payment audit history as append-only application operations. Superadmin requires a valid server session **and** a server-side allowlist/role check; an email or Teable field alone is not access. Browser clients receive neither a Teable token nor direct Teable writes. Keep email, interests, consent, hashes, session metadata, reports, contact details and inquiry contents private. Teable view visibility is not an authorization boundary. No dedicated privacy/data-request table or dedicated auth audit trail was identified by name.

## Billing and Business Pro

- `BusinessPlans` `tblfB89TSYURsaZ267N` holds both the current `business_pro_quarterly` and `sponsor_quarterly` plan definitions as well as a legacy monthly plan; use `target_account_type`, `billing_interval_months`, `amount_mxn`, `entitlement_grants_json` for plan interpretation. Legacy `BusinessSubscriptions` `tbloyccWq6gEARYGLJH` and `PaymentEvents` `tbly21wpo66mG81LZHu` must not silently drive new quarterly billing.
- New billing: `PlatformSubscriptions` `tblniV4rYBKuBjHiPk8`, `PlatformPaymentEvents` `tbl1TOw9us9ObkXMmHR`, business ownership through `BusinessManagers` `tblBZ0dELDl3z7gTTOw` (`role` `fldHJ0u8ZKv2BcPAVVo`, `status` `fldKRJbqOSCDePGUYhH`), and `BusinessFeatureEntitlements` `tblxdmuLBv4TLP5KDVE` (`feature_key` `flde5TLeyXIAfbHXvAt`, `status` `fldd6W9SpPfs8gCuW1r`).
- Subscription `payment_verification_status` `fldIzn6vblrK3EEGgqs` has `unverified`, `paid`, `failed`, `refunded`, `test_only`; `last_verified_payment_event` `fldPlaWIQss2M3AZJna` links to the event. A `test_only` value does not mean paid, and a displayed `paid` value or entitlement is not independently sufficient authorization.
- Payment evidence includes `external_event_id` `fldMqPngWTQ1oyqMGUl`, `status` `fld1Pja5UF5fpkoWnQ8` (`confirmed` among other states), `processing_status` `fldR4ofF887jZtKLVxU` (`processed` among other states), `subscription_id_nullable` `fldZHqbabnb38Ifyun4`, and `business_id_nullable` `fldz0dawqrHSGteRNkQ`. Reconcile reversals, retries, renewal and cancellation idempotently after verifying Stripe's signature. Browser writes to billing tables are forbidden.
- For each Pro request, verify: valid session; active authorized owner/manager of that exact business; `business_pro_quarterly` plan; current period; subscription `active`, not revoked/cancelled/expired/past due/refunded/test-only; **matching** verified, processed, confirmed Stripe payment event for that subscription and term; active feature grant matching the requested capability. No grace period. Server-side checks apply to protected reads and writes, not just dashboard visibility. Superadmin is separate from paid status.
- `business.pro_analytics`, `business.inbox`, `business.contact_modal`, and `business.loyalty_native` are the current Pro keys. Lapsed Pro keeps its free public listing and historical inquiries/export, shows existing customer cards paused, blocks new inquiries and loyalty mutations, and offers bilingual renewal UI. Sponsor access is a distinct plan/subject; no payment flag alone publishes incomplete creative.

## Settings and content readiness

| Setting group | Coverage now | Next contract |
|---|---|---|
| Branding/language/geography | `Locations`, `LocationConfigurations`, `LocationBranding`, `LocationLanguageConfigurations`, `LocationDomains`, `NearbyLocationRelationships` | Exists; use explicit public serializer and verified domain/locale settings via future server API. Never treat a location as a licensee tenant. |
| Contact details | `BusinessContactDetails` and `LocationConfigurations.public_contact_policy` | Exists; private fields require server authorization. Public contact modal/link exposure needs login, entitlement, and tracking; do not serve raw contact table. |
| Legal/footer | `LegalConfigurations`, `LegalDocumentVersions`, `LocationFooterLinks`, `ExternalLinks` | Exists as configuration; legal identity/copy and QRcasas destination need explicit publication decisions. Local app mock is acceptable until published content is verified. |
| SEO/AEO/GEO, FAQ/guide/intro | `LocationSeoSettings`, `LocationSeoKeywords`, `LocationAeoContent`, `LocationGeoContent`, `LocationFaqs`, `LocationGuides`, `LocationIntroductionPages` | Exists in schema; safe API/public serializer and draft/noindex gates before publication. |
| Notification rules | `UserPrivacyPreferences`, `EntityNotificationSubscriptions`, `NotificationConsentEvents`, `NotificationCampaigns`, `NotificationDeliveryAggregates` | Schema exists; a distinct, versioned opt-in email-digest audience and delivery decision precede send jobs. |
| Monetisation | `BusinessPlans`, `PlatformSubscriptions`, `PlatformPaymentEvents`, `BusinessFeatureEntitlements`, `SponsorCampaigns`, `SponsorOffers` | Schema exists; production Stripe IDs and verified webhook/authorization contract still need implementation. No local mock should imply a real payment. |
| Impact metrics / pilot KPIs | `AnalyticsMetricDefinitions`, `AnalyticsMetricAggregates`, `LocationAnalytics`, `DataIntegrityIssues` | Definitions/aggregate containers exist. Metric activation, source events, privacy policy and numeric pilot targets need explicit decisions; no fabricated traffic. |

A full `Tenant_Settings` schema is not needed here. Future licensees receive separate bases; this pilot's location configuration is not a tenant boundary.

## Magazine, consent and campaigns

Existing schema: `Offers`, `PlayavidaLoyaltyRewards`, `SponsorOffers`, `SponsorOfferTags`, `InterestDefinitions`, `UserInterestPreferences`, `NotificationConsentEvents`, `NotificationCampaigns`, `EntityNotificationSubscriptions`, `SponsoredPlacements`, `PublicSponsorPlacements`, `AdminNotifications`, `ModerationActions`, `EventPartnerships`, and loyalty impact/analytics tables. No dedicated Weekly Magazine `Issues`, `Issue_Items`, or `Deals` table, nor a named social-queue table, was found in the 117-table snapshot. These are future product/schema decisions, not migrations authorized by this report.

A read-only UI can use explicitly serialized public content from the existing projection tables and draft-free approved content; it must not join raw interests, recipient lists, contact data or billing events into public payloads. Any writes (campaign setup, consent, offer publication, moderation, loyalty) require authenticated, owner-scoped server endpoints. Email targeting needs separate initially unticked, versioned, withdrawable consent and an approved audience definition. Sponsored/partner offers must carry a visible bilingual label on every placement, including future magazine issues. User interests are not launch sponsor-ad targeting and must remain private. Do not schedule delivery, create AI fields, or publish issues as part of this handoff.

## First integration sequence

1. Deploy a minimal health route for the rebuilt app and verify production routing.
2. Add a session route that fails closed, never exposes tokens, and identifies the authenticated principal.
3. Define and validate `send-OTP` input without sending to an arbitrary production recipient during smoke tests.
4. Validate config presence/targets safely without logging secret values.
5. Verify server-only Teable read/config access with a least-privilege token.
6. Implement atomic OTP hash persistence, expiry, attempt limits and single-use consumption.
7. Wire Resend delivery and verify authorized sender/domain and operational errors.
8. Implement verify/login/logout, session rotation and revocation.
9. Enforce business ownership and Stripe-verified payment/feature access at every protected route, then integrate the dashboard.
