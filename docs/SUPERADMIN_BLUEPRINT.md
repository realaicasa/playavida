# SUPERADMIN_BLUEPRINT.md — PlayaVida Platform Superadmin Dashboard Blueprint

## 1. Purpose and Non-Goals

### Purpose
This document defines the implementation blueprint for the **PlayaVida Platform Superadmin Dashboard** — the platform control plane for operational oversight, governance, and safety. It is distinct from and superior to the BusinessDashboard (business-owner UI), staff interfaces, coordinator tools, and member features.

### Non-Goals
- This is **not** the BusinessDashboard (which serves business owners managing their own listings).
- This is **not** a staff terminal (which validates loyalty stamps via PIN).
- This is **not** a group coordinator panel.
- This is **not** a member-facing feature.
- No Superadmin dashboard component, route, or navigation exists today.
- No browser-accessible admin account or hard-coded bypass exists and none will be created.

### Role Separation
| Role | Scope | Authorization |
|------|-------|---------------|
| **Platform Superadmin** | Platform-wide oversight, governance, safety, configuration | Server-enforced; explicit role assignment in Teable; never UI-only |
| **Business Owner** | Own business: profile, contacts (if entitled), events, analytics, loyalty program | Server-enforced ownership (`created_by_user_id`) |
| **Assigned Staff** | Loyalty stamp validation via PIN; limited to assigned business | Server-enforced staff record + PIN |
| **Group Coordinator** | Group creation, membership moderation, group events | Server-enforced `owner_user_id` |
| **Ordinary Member** | Discovery, favorites, opt-ins, reviews, event RSVPs, loyalty cards | Authenticated member; no elevated privileges |

---

## 2. Functional Modules

| Module | Description | Current Status |
|--------|-------------|----------------|
| **Platform Overview Analytics & Health** | Platform-wide metrics: users, businesses, events, groups, reports, loyalty activity, entitlement states, payment health | **Proposed/defined requirement** — absent from source; current source has mock data only (`INITIAL_USERS`, `INITIAL_BUSINESSES`, etc.) |
| **User, Business, Staff, Role Oversight** | Search/filter users; view roles, status, ownership; assign/revoke platform roles; view staff assignments | **Partially represented** — `UserRole` type exists (`src/types/index.ts:17`); `INITIAL_USERS` has `member`/`business_owner`; no admin seeded; no admin UI |
| **Business Subscription/Entitlement Oversight** | View all businesses, subscription status, entitlements, payment state, grace periods, contact visibility | **Partially represented** — `BusinessSubscription` type and mock data in `storage.ts`; `getAuthorizedContactDetails` mock; no real subscription data |
| **Loyalty/Stamp/Reward Operational Oversight** | View loyalty programs, stamp issuance, voucher redemption, staff PIN activity, ledger audit | **Partially represented** — `NativeLoyaltyProgram`, `CustomerLoyaltyCard`, `LoyaltyLedgerTransaction` types; `INITIAL_STAFF_ACCOUNTS` test staff; `awardStamp` mock in `storage.ts` |
| **Reports, Moderation, Safety Operations** | View/review/resolve universal reports; moderation actions; safety signals | **Partially represented** — `UniversalReport` type; `submitReport` mock in `storage.ts`; `ReportReason` enum; no moderation UI |
| **Notifications/Campaign Governance & Delivery Visibility** | View broadcast campaigns, opt-in stats, delivery status; approve/deny campaign sends; notification templates | **Partially represented** — `BroadcastCampaign` type; `createBroadcastCampaign` mock; `optIns` in storage; no campaign UI |
| **Privacy, Consent, Data-Governance Oversight** | View consent records, data access logs, export requests, consent revocation; audit data access | **Partially represented** — `PrivacyPreferences` type; `updateUserPreferences` mock; `UserPushOptIn`; no consent audit UI |
| **Audit/Activity Visibility** | Platform-wide activity log: admin actions, role changes, entitlement changes, moderation decisions | **Proposed/defined requirement** — absent from source; `LoyaltyLedgerTransaction` exists for loyalty only |
| **Platform Configuration & Controlled Feature Rollout** | Feature flags, rollout stages, maintenance mode, configuration management | **Proposed/defined requirement** — absent from source |

---

## 3. Required Authorization Model

### Principles
- **Server-side only** — All Superadmin authorization decisions must be enforced server-side (Teable + API layer). No client-only `role === 'admin'` checks.
- **Explicit role assignment** — Platform Superadmin role must be explicitly assigned in Teable (e.g., `user_roles` table with `role = 'platform_superadmin'`). No implicit elevation from `business_owner` or `staff`.
- **No browser-only bypass** — No hard-coded admin email, localStorage flag, or UI-only `isAdmin` boolean.
- **Least privilege** — Superadmin actions require explicit intent (e.g., separate "Superadmin Dashboard" route, not accessible via business owner dashboard).
- **Audit trail** — Every Superadmin action (role assignment, entitlement override, moderation action, config change) must create an immutable audit record.

### Distinctions
| Action | Business Owner | Platform Superadmin |
|--------|----------------|---------------------|
| Edit own business contacts | ✓ (if entitled) | ✓ (audit-logged override) |
| View any business subscription | ✗ | ✓ |
| Assign/revoke platform roles | ✗ | ✓ |
| Override contact visibility | ✗ | ✓ (audit-logged) |
| Moderate reports | ✗ | ✓ |
| Configure platform feature flags | ✗ | ✓ |
| View raw loyalty ledger | ✗ | ✓ |
| Approve notification campaigns | ✗ | ✓ |

---

## 4. Data and Privacy Boundaries

### Sensitive Categories (Must Not Be Broadly Exposed)
| Category | Examples | Access Rule |
|----------|----------|-------------|
| Account Identity/Contact | Email, phone, WhatsApp, address, coordinates | Superadmin: audit-logged access only; never bulk export |
| Consent Choices | `PrivacyPreferences`, `UserPushOptIn`, marketing opt-ins | Purpose-limited; audit-logged access |
| Lifestyle/Interests | `interest_ratings`, `tags`, `ProfileModal` sliders | Never exposed to Superadmin in identifiable form |
| Customer/Staff Activity | Loyalty stamps, opt-in timestamps, report submissions | Aggregated only; identifiable access = audit-logged |
| Payment State | `BusinessSubscription` status, Stripe IDs, OXXO refs | Superadmin: read-only for oversight; no raw Stripe data |
| Audit Records | `UniversalReport`, `LoyaltyLedgerTransaction`, moderation actions | Immutable; Superadmin read-only; no deletion |

### Restricted Until Proven Server-Side
- **Sponsor targeting / raw audience export** — Disabled until consent + server-side authorization proven
- **Automated promotional campaigns** — Disabled until consent + server-side authorization proven
- **Bulk contact export** — Never allowed for Superadmin
- **Automated promotional sending** — Disabled until consent + server-side authorization proven

---

## 4. Dependencies and Phased Implementation Plan

| Phase | Objective | Smallest Deliverable | Server-Side Prerequisite | Privacy/Security Criteria | Out of Scope |
|-------|-----------|----------------------|--------------------------|---------------------------|--------------|
| **1. Identity & Session Foundation** | Real auth/session layer | `POST /api/auth/otp/send`, `POST /api/auth/otp/verify`, `GET /api/auth/session` returns real user + roles | Resend OTP integration; secure HTTP-only cookies; session store | No credentials in localStorage; secure cookies; OTP rate limits | No Superadmin UI; no role assignment |
| **2. Server-Side Role Authorization Middleware** | Enforce roles server-side | `requireRole('platform_superadmin')` middleware; `requireOwnership(businessId)` | Teable `user_roles` table; ownership in `businesses` table | All role checks server-side; client checks = UX only | No Superadmin dashboard |
| **3. Ownership/Entitlement APIs** | Real ownership/entitlement checks | `GET /api/businesses/:id/ownership`, `GET /api/businesses/:id/entitlement` | Teable `businesses.owner_user_id`, `business_subscriptions` | Server validates ownership before any mutating action | No Superadmin dashboard |
| **4. Read-Only Superadmin Access** | Authenticated Superadmin can view platform overview | `GET /api/superadmin/overview` (counts only); Superadmin role check | Phase 1-2 complete; `user_roles` has `platform_superadmin` | Read-only; audit log on access; no mutations | No operational actions |
| **5. Reports & Moderation Read-Only** | View/resolve reports | `GET /api/superadmin/reports`, `POST /api/superadmin/reports/:id/resolve` | Phase 4 complete; `reports` table in Teable | Resolution audit-logged; no bulk actions | No automated moderation |
| **6. Business/Subscription Oversight** | View all businesses, subscriptions, entitlements | `GET /api/superadmin/businesses`, `GET /api/superadmin/businesses/:id` | Phase 4 complete; `business_subscriptions` in Teable | Read-only; contact access = audit-logged override | No entitlement overrides yet |
| **7. Loyalty/Stamp Operational Oversight** | View loyalty programs, ledger, staff activity | `GET /api/superadmin/loyalty/overview`, `GET /api/superadmin/loyalty/ledger` | Phase 4 complete; loyalty tables in Teable | Read-only; staff PIN validation stays server-side | No stamp overrides |
| **8. Notifications/Campaign Governance** | View/approve campaigns; delivery visibility | `GET /api/superadmin/campaigns`, `POST /api/superadmin/campaigns/:id/approve` | Phase 4 complete; `broadcast_campaigns` in Teable; Resend integration | Approval audit-logged; no auto-send without approval | No auto-send; no raw audience export |

**Ordering Principle**: Identity/session → server-side authorization → read-only Superadmin → operational modules. External integrations (Stripe, Teable sync, Resend) follow secure authorization boundaries.

---

## 5. Acceptance Criteria Before Superadmin Release

| Criterion | Verification |
|-----------|--------------|
| **Real authenticated identity** | `GET /api/auth/session` returns real user + roles; no `authenticated: false` for real users |
| **Server-side authorization checks** | All Superadmin endpoints return 403 for non-Superadmin; middleware tested |
| **No client-only security boundary** | Grep shows no `currentUser?.role === 'admin'` guarding Superadmin routes in client code |
| **Role/ownership tests** | Automated tests: Superadmin can access Superadmin endpoints; business owner cannot; member cannot |
| **Test-account guard** | `STF-TEST-A` not accessible via Superadmin endpoints; only test fixtures reference it |
| **Audit logging plan** | Every Superadmin mutation creates immutable audit record (Teable `admin_audit_log`) |
| **Privacy/consent boundaries** | No raw contact export; no automated promotional send; consent revocation respected |
| **No public route or default admin account** | No `/admin`, `/superadmin` route without auth; no seeded `admin` user in Teable |
| **Negative-access testing** | Automated tests: member, business owner, staff, coordinator all receive 403 on Superadmin endpoints |

---

## 6. Current-Source Mapping

| Current File | Concept | Potential Future Input | Not a Backend Control |
|--------------|---------|------------------------|----------------------|
| `src/types/index.ts` | `UserRole`, `User`, `BusinessSubscription`, `UniversalReport`, `NativeLoyaltyProgram`, `LoyaltyLedgerTransaction`, `BroadcastCampaign` | Type definitions for API contracts | Type-only; no enforcement |
| `src/lib/constants.ts` | `INITIAL_USERS`, `INITIAL_BUSINESSES`, `INITIAL_STAFF_ACCOUNTS`, `INITIAL_LOYALTY_PROGRAMS` | Seed data shapes | Mock/static only |
| `src/lib/storage.ts` | `loginWithOtp`, `verifyOtpAndLogin`, `getAuthorizedContactDetails`, `awardStamp`, `getOwnerPrivateContactDetails`, `getUserCreatedContent` | Mock implementations of future API contracts | localStorage only; no server |
| `src/lib/teableAdapter.ts` | `projectPublicBusiness`, `filterContactProjection`, `projectCommunityGroup` | Projection logic for server-side use | Server-side only; not in client bundle |
| `src/components/BusinessDashboard.tsx` | Business owner UI: contacts, billing, analytics, loyalty, QR, reviews | Business-owner scope only | Not Superadmin |
| `src/components/ProfileModal.tsx` | Member profile, interests, opt-ins, QR | Member scope | Not Superadmin |
| `src/tests/security.test.ts` | 8 security invariant test suites | Contract tests for future server implementation | Test fixtures only |

---

## 5. Product Decisions Required from Mike

1. **Exact Superadmin roles and delegation** — Single `platform_superadmin` role, or delegated roles (e.g., `moderator`, `support`, `analytics_viewer`)?
2. **Priority analytics metrics** — Which 5-10 metrics matter for "Platform Overview" v1?
3. **Notification approval/sending model** — Superadmin approves every campaign? Templates pre-approved? Rate limits?
3. **Moderation escalation authority** — Superadmin resolves reports directly, or delegates to moderators? Escalation path?
4. **Retention/export policy** — How long are audit logs retained? What exports are allowed for compliance?
5. **Separate support/admin role** — Is there a `support_agent` role (read-only access to user accounts for support) distinct from `platform_superadmin`?
6. **Feature flag granularity** — Per-business, per-region, per-role, or global only?
7. **Loyalty stamp override policy** — Can Superadmin manually add stamps? Under what audit conditions?
8. **Contact visibility override policy** — Can Superadmin force-contact-visibility for support? Audit requirements?

---

## 6. Inherited Baseline Condition (Transparent)

| Check | Result | Relevance |
|-------|--------|-----------|
| `bun run build` / `vite build` | **Passes**, exit code 0 | Build succeeds; no blocker |
| `bun run lint` / `tsc --noEmit` | **Fails**: 11 inherited TypeScript errors (Footer.tsx, ProfileModal.tsx, TenantSettings.ts) | Pre-existing; unrelated to Superadmin |
| `bun test` | **14/20 pass**; 6 inherited fixture/data failures | Pre-existing; missing test fixtures for businesses, subscriptions, loyalty |

**These are inherited baseline debt** — they must be fixed separately and must not be represented as Superadmin feature completion.

---

## 8. Future Implementation Phases (Aligned with REBUILD Tickets)

### Phase 1 — Core Auth & Server Foundation (REBUILD-008 to REBUILD-014)
**Prerequisite for all Superadmin features** — No Superadmin UI or endpoints exist until identity/session layer is real and server-enforced.

| REBUILD | Superadmin-Relevant Deliverable |
|---------|---------------------------------|
| REBUILD-008 | Provider secrets provisioned (Resend, session, OTP); Teable `sessions` table created |
| REBUILD-009 | OTP endpoints deployed; rate limits enforced |
| REBUILD-010 | `GET /api/auth/session` returns real user + roles from secure cookie |
| REBUILD-011 | Server-side session revocation on logout |
| REBUILD-012 | `requireRole('platform_superadmin')` middleware deployed and tested |
| REBUILD-013 | Mock identity removed; real session replaces `currentUser` in client |
| REBUILD-014 | **First Superadmin endpoint**: `GET /api/superadmin/overview` (read-only, audit-logged) |

**Gate**: Phase 1 complete = `requireRole('platform_superadmin')` returns 403 for all non-Superadmin roles in automated tests.

---

### Phase 2 — Core Domain Features (REBUILD-015 to REBUILD-021)
**Read-only Superadmin operational oversight** — Each module adds one read-only endpoint + one controlled mutation endpoint.

| REBUILD | Superadmin Module | Endpoint(s) | Privacy/Security |
|---------|-------------------|-------------|------------------|
| REBUILD-015 | Reports & Moderation | `GET /api/superadmin/reports`, `POST /api/superadmin/reports/:id/resolve` | Resolution audit-logged; no bulk actions; no automated moderation |
| REBUILD-016 | Business/Subscription Oversight | `GET /api/superadmin/businesses`, `GET /api/superadmin/businesses/:id` | Contact access = audit-logged override; read-only |
| REBUILD-017 | Loyalty/Stamp Oversight | `GET /api/superadmin/loyalty/overview`, `GET /api/superadmin/loyalty/ledger` | Staff PIN validation stays server-side; no stamp overrides |
| REBUILD-018 | Notifications/Campaign Governance | `GET /api/superadmin/campaigns`, `POST /api/superadmin/campaigns/:id/approve` | Approval audit-logged; no auto-send without approval |
| REBUILD-019 | Privacy/Consent/Data-Governance | `GET /api/superadmin/consent`, `GET /api/superadmin/export-requests` | Purpose-limited access; minimization; auditability |
| REBUILD-020 | Audit/Activity Visibility | `GET /api/superadmin/audit-log` | Immutable audit log (Teable `admin_audit_log`) |
| REBUILD-021 | Platform Configuration & Feature Rollout | `GET/POST /api/superadmin/config`, `POST /api/superadmin/flags` | Controlled rollout governance; no global killswitch without approval |

**Gate**: Phase 2 complete = all 7 modules deployed, negative-access tests pass for each endpoint.

---

### Phase 3 — Group Conversations & Threaded Chat Oversight (REBUILD-022 to REBUILD-029)
**Superadmin visibility into communication layer** — Read-only oversight of group messaging platform.

| REBUILD | Superadmin-Relevant Deliverable |
|---------|---------------------------------|
| REBUILD-022 | Group membership and conversation metadata visibility |
| REBUILD-023 | Threaded reply structure and unread state monitoring |
| REBUILD-024 | Message reporting queue and moderation action audit |
| REBUILD-025 | Near-real-time delivery metrics and presence oversight |
| REBUILD-026 | Push notification delivery stats and mute compliance |
| REBUILD-027 | Advanced features (attachments, reactions) — read-only audit |
| REBUILD-028 | E2E encryption status monitoring (if implemented) |

**Gate**: Phase 3 complete = Superadmin can view communication health metrics without accessing message content.

---

### Phase 4 — Advanced Platform Capabilities (REBUILD-030+)
**Platform governance maturity** — Configuration, analytics, compliance, multi-region.

| REBUILD | Superadmin-Relevant Deliverable |
|---------|---------------------------------|
| REBUILD-030 | Feature flag granular controls (per-business, per-region, per-role) |
| REBUILD-031 | Analytics/event pipeline oversight (data flow, privacy compliance) |
| REBUILD-032 | Multi-region deployment oversight and failover controls |
| REBUILD-033 | Data export/compliance tooling (GDPR, LGPD, audit exports) |

**Gate**: Phase 4 complete = Superadmin has full platform governance visibility without raw data access.

---

### Current Phase Status
**Phase 0 Complete** — Blueprint defined; no Superadmin code exists
**Phase 1 Pending** — Requires Vercel deployment verification and Node.js 22.x config
**All Superadmin features gated behind Phase 1 completion** — no UI, no routes, no endpoints until `requireRole('platform_superadmin')` is live and tested