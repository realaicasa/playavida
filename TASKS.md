# TASKS.md — PlayaVida Phase 0 Task Tracking

## Phase 0: Clean Repository Setup ✓

- [x] Inspect repository structure and all docs
- [x] Create AGENTS.md
- [x] Create docs/PRODUCT.md
- [x] Create docs/ARCHITECTURE.md
- [x] Create docs/SECURITY.md
- [x] Create docs/SCHEMA.md
- [x] Create docs/DECISIONS.md
- [x] Create docs/DEPLOYMENT.md
- [x] Create docs/ROADMAP.md
- [x] Create docs/OPEN_RISKS.md
- [x] Verify .gitignore excludes required patterns
- [x] Run bun install --frozen-lockfile
- [x] Run bun run lint
- [x] Run bun run build
- [x] Run bun test

---

## Historical Completion Records (Phase 0 — Already Done)

These tickets were completed locally and are documented for historical traceability. Their numbers are **not reused** for future work.

### REBUILD-002 — Minimal Health Route ✓ (completed locally)
- Added `/api/health` endpoint returning `{ ok: true }` on GET
- No auth, no DB, no external deps, no env vars
- Deploy behind existing domain only after Phase 0 approval
- **Next**: Vercel Preview deployment verification

### REBUILD-004 — Minimal Unauthenticated Session Endpoint ✓ (completed locally)
- Added `/api/auth/session` endpoint returning `{ authenticated: false }` on GET
- No auth, no DB, no external deps, no env vars, static response
- Deploy behind existing domain only after Phase 0 approval
- **Next**: Vercel Preview deployment verification

### REBUILD-005 — Minimal Stateless Logout Endpoint ✓ (completed locally)
- Added `/api/auth/logout` endpoint returning `{ authenticated: false }` on POST
- No auth, no DB, no external deps, no env vars, static response
- Deploy behind existing domain only after Phase 0 approval
- **Next**: Vercel Preview deployment verification

### REBUILD-006 — Identity and Authorization Design Inventory ✓ (completed locally)
- Read-only inventory of identity, account, role, and authorization assumptions in source
- Documented current mock/localStorage auth, role model, ownership checks, and server-side boundary requirements
- Produced minimum design brief for future real auth/authorization phase
- **No source changes** — discovery and documentation only

### REBUILD-007 — Identity and Session Design Decision Record ✓ (completed locally)
- Passwordless email OTP identity method confirmed
- Server-side session model with secure HttpOnly cookies confirmed
- OTP: 6-digit, 10-min expiry, bcrypt hash, 5 req/hour rate limit, anti-enumeration
- Sessions: Member/owner 30d/24h, Staff 12h/60min, Superadmin 8h/20min with step-up
- Cookies: Secure, HttpOnly, SameSite=Lax, host-only
- OTP lifecycle, session model, API contracts, privacy boundaries, authorization model defined
- Server-side enforcement required for all sensitive actions
- No hard-coded auth, no client-only boundaries, test-account guard preserved
- Seven ordered follow-on tickets identified for implementation

---

## Future Build Phases — Canonical Ticket Sequence

**All tickets below are PLANNED — not implemented. No UI, API, schema, provider, realtime system, notification sender, or permission change is implemented by this documentation task.**

### Phase 1 — Core Auth & Server Foundation (REBUILD-008 to REBUILD-014)

#### REBUILD-008 — Provider Configuration & Secrets
- Resend API key configuration for OTP email delivery
- Session secret provisioning for cookie signing/encryption
- OTP hash pepper secret (optional defense-in-depth)
- Teable `sessions` table creation with proper indexes
- Out-of-source secret provisioning (no committed secrets)

#### REBUILD-009 — OTP Request & Verification Endpoints
- `POST /api/auth/request-otp` — generates 6-digit code, stores hashed, sends via Resend
- `POST /api/auth/verify-otp` — validates code, creates session, sets secure cookie
- Anti-enumeration: identical responses for valid/invalid emails
- Rate limits: 5 req/hour per email, 20 req/hour per IP

#### REBUILD-010 — Server Session Endpoint
- `GET /api/auth/session` — returns real authenticated state from cookie
- Session validation middleware (expiry, revocation, rotation)
- Secure cookie attributes: `Secure; HttpOnly; SameSite=Lax; Path=/`

#### REBUILD-011 — Logout Endpoint
- `POST /api/auth/logout` — server-side session revocation, cookie clearing
- Immediate revocation on logout, role change, security event

#### REBUILD-012 — Server-Side Authorization Middleware
- `requireAuth` — validates session cookie, returns user context
- `requireRole('platform_superadmin')` — platform superadmin gate
- `requireOwnership(businessId)` — business ownership verification
- `requireStaff(businessId)` — staff assignment verification

#### REBUILD-013 — Migration from Mock Identity
- Remove `DEMO_USERS[0]` auto-login from `App.tsx`
- Replace `currentUser` state with real session from `/api/auth/session`
- Preserve `STF-TEST-A` test guard in `INITIAL_STAFF_ACCOUNTS`
- Remove `loginWithOtp`, `authenticateWithEmail` mock functions from `storage.ts`

#### REBUILD-014 — Read-Only Superadmin Access
- `GET /api/superadmin/overview` — platform counts (users, businesses, events, groups, reports, loyalty)
- Requires `platform_superadmin` role (server-enforced)
- Read-only; audit log on access; no mutations

---

### Phase 2 — Core Domain Features, Business Pro Publishing, and Superadmin Operations (REBUILD-015 to REBUILD-021)

#### REBUILD-015 — Reports & Moderation Read-Only
- `GET /api/superadmin/reports` — list with filters, pagination
- `POST /api/superadmin/reports/:id/resolve` — resolution with audit log
- No automated moderation; human review required

#### REBUILD-016 — Business/Subscription Oversight
- `GET /api/superadmin/businesses` — all businesses, subscription status, entitlements
- `GET /api/superadmin/businesses/:id` — detail view with subscription, entitlements, ownership
- Read-only; contact access = audit-logged override

#### REBUILD-017 — Loyalty/Stamp Operational Oversight
- `GET /api/superadmin/loyalty/overview` — programs, active cards, stamp rates
- `GET /api/superadmin/loyalty/ledger` — audit trail of stamp issuance/redemption
- Read-only; staff PIN validation stays server-side; no stamp overrides

#### REBUILD-018 — Notifications/Campaign Governance
- `GET /api/superadmin/campaigns` — list with status, delivery stats
- `POST /api/superadmin/campaigns/:id/approve` — approval with audit log
- No auto-send without approval; no raw audience export

#### REBUILD-019 — Privacy/Consent/Data-Governance Oversight
- `GET /api/superadmin/consent` — consent records, revocation status
- `GET /api/superadmin/export-requests` — export requests, status
- Purpose-limited access, minimization, auditability

#### REBUILD-020 — Audit/Activity Visibility
- Platform-wide activity log: admin actions, role changes, entitlement changes, moderation decisions
- Immutable audit log (Teable `admin_audit_log`)

#### REBUILD-021 — Platform Configuration & Controlled Feature Rollout
- Feature flags, rollout stages, maintenance mode, configuration management
- Controlled feature rollout governance

---

### Phase 3 — Group Conversations & Threaded Chat (REBUILD-022 to REBUILD-029)

#### REBUILD-022 — Group Membership & Persisted Conversations
- Group creation, membership (join/leave), roles (owner, coordinator, member)
- Persisted conversations with pagination, unread state

#### REBUILD-023 — Threaded Replies & Unread State
- `parent_message_id` relationship for threading
- Unread count per conversation per user
- Read receipts, typing indicators (future)

#### REBUILD-024 — Moderation & Safety
- Message reporting, moderation queue
- Rate limiting, abuse controls
- Content deletion/takedown policy

#### REBUILD-025 — Near-Real-Time Updates
- Server-sent events or WebSocket for message delivery
- Typing indicators, presence

#### REBUILD-026 — Push Notifications
- VAPID/Web Push for mobile/desktop
- Mute controls, notification preferences

#### REBUILD-027 — Advanced Chat Features (Future)
- Attachments, reactions, voice notes (post-approval only)

#### REBUILD-028 — End-to-End Encryption (Future)
- Separate high-complexity security project
- Not implied by "WhatsApp-like" terminology

#### REBUILD-029 — SEO/GEO & Crawlable Article Requirements
- Threaded chat content indexing strategy
- Meta tags, structured data for conversation threads
- Sitemap integration for public conversation views

---

### Phase 4 — Advanced Platform Capabilities (REBUILD-030 to REBUILD-033)

#### REBUILD-030 — Platform Configuration & Controlled Feature Rollout
- Feature flag granular controls (per-business, per-region, per-role)
- Advanced rollout governance

#### REBUILD-031 — Analytics/Event Pipeline
- Event ingestion, processing, and visualization
- Privacy-compliant analytics (data flow, consent enforcement)

#### REBUILD-032 — Multi-region / Edge Deployment
- Multi-region deployment oversight and failover controls
- Edge function routing and latency optimization

#### REBUILD-033 — Data Export / Compliance Tooling
- GDPR, LGPD, and audit export capabilities
- Automated compliance reporting

---

## Current Phase Status
**Phase 0 Complete** — All Phase 0 tickets done (REBUILD-002 through REBUILD-007)
**Phase 1 Pending** — Requires Vercel deployment verification and Node.js 22.x config
**Phases 2-4 Planned** — No implementation started

---

## Backlog (Post-Phase 0 — Historical Reference Only)

*These legacy ticket numbers are from an earlier planning iteration and are kept for reference. They do not represent current planned work and their numbers are not reused.*

- ~~REBUILD-003: Auth OTP flow (Email → Resend)~~ → Superseded by REBUILD-009
- ~~REBUILD-006: Teable sync service (server-only)~~ → Superseded by Phase 1-2 server implementation
- ~~REBUILD-007: Stripe webhook handler~~ → Superseded by Phase 2+ payment integration
- ~~REBUILD-008: Business public projection API~~ → Superseded by REBUILD-016
- ~~REBUILD-009: Contact entitlement enforcement API~~ → Superseded by REBUILD-016
- ~~REBUILD-010: Loyalty ledger append-only API~~ → Superseded by REBUILD-017
- ~~REBUILD-011: Superadmin approval workflow for Community Initiatives~~ → Superseded by REBUILD-018