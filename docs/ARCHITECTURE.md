# ARCHITECTURE.md — PlayaVida Technical Architecture

## Frontend (Phase 0 - Current)
- **Framework**: React 19 + Vite
- **Language**: TypeScript (strict)
- **Package Manager**: Bun (`bun.lock`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **PWA**: `vite-plugin-pwa` (autoUpdate, manifest, Workbox)
- **Icons**: lucide-react
- **Fonts**: Outfit, Plus Jakarta Sans (Google Fonts)
- **i18n**: Static object-based (`src/lib/i18n.ts`)

## Project Structure
```
src/
├── App.tsx                 # Main app shell, routing, state
├── main.tsx                # Entry point
├── index.css               # Global styles + Tailwind imports
├── components/             # 40+ UI components (modals, cards, pages)
├── lib/
│   ├── storage.ts          # PlayaVidaStore (localStorage-backed, mock data)
│   ├── teableAdapter.ts    # Teable projection/sanitization (server-only)
│   ├── constants.ts        # Demo seed data
│   ├── i18n.ts             # Translations
│   ├── interests.ts        # Interest taxonomy
│   ├── communityInterests.ts
├── types/index.ts          # All TypeScript interfaces
├── tests/security.test.ts  # Security boundary validation
api/
├── health.ts               # Minimal health endpoint (REBUILD-002)
├── auth/
    ├── session.ts          # Minimal unauthenticated session endpoint (REBUILD-004)
    ├── logout.ts           # Minimal stateless logout endpoint (REBUILD-005)
```

## Data Layer (Current - Mock)
- **PlayaVidaStore** (`src/lib/storage.ts`): In-memory + localStorage fallback
- **TeableAdapter** (`src/lib/teableAdapter.ts`): Projection logic for server-side use
- **Seed Data** (`src/lib/constants.ts`): Demo users, businesses, events, groups, loyalty, etc.
- **Types** (`src/types/index.ts`): 100+ interfaces for all domain entities

## Key Architectural Boundaries

### Public vs Private Projections
- `PublicBusinessProjection`: Safe for public directory (NO phone, email, address, whatsapp, coordinates)
- `PrivateBusinessContactDetails`: Strictly isolated, requires auth + entitlement
- TeableAdapter enforces projection boundaries

### Entitlement Model
- `BusinessSubscription`: `free` | `starter_contact` | `pro_community` | `premium_sponsorship`
- Status: `active` | `grace_period` | `pending_oxxo` | `expired` | `canceled`
- Contact access = authenticated + active subscription (or grace period)

### Security Invariants (Tested)
1. Private fields never leak into public projections
2. Draft/archived businesses excluded from public queries
3. Unauthenticated users cannot view protected contacts
4. 7-day grace period on cancellation
5. User blocks strictly filtered
6. Loyalty stamps require valid staff PIN

## Identity & Authorization Inventory (REBUILD-006)

### Current State (Phase 0 — Mock Only)

| Concept | Source | Implementation | Enforcement |
|---------|--------|----------------|-------------|
| `UserRole` type | `src/types/index.ts:17` | `'member' \| 'business_owner' \| 'staff' \| 'moderator' \| 'admin'` | Type-only; no runtime enforcement |
| `currentUser` state | `src/App.tsx:87` | `useState` initialized from `DEMO_USERS[0]` | UI-only; no auth layer |
| `loginWithOtp` / `verifyOtpAndLogin` | `src/lib/storage.ts:140-169` | Mock OTP (`774921`); writes `CURRENT_USER_ID` to localStorage | **UI-only**; no server validation |
| `authenticateWithEmail` | `src/lib/storage.ts:171-195` | Auto-creates user on first email; writes to localStorage | **UI-only** |
| `logout` | `src/lib/storage.ts:290` | Clears `CURRENT_USER_ID` from localStorage | **UI-only** |
| Owner checks (`created_by_user_id === currentUser.id`) | `src/lib/storage.ts:620,639` | In-memory comparison | **Mock**; no server enforcement |
| Staff PIN validation | `src/lib/storage.ts:1263` | `INITIAL_STAFF_ACCOUNTS.find(s => s.pin_code === staffPin)` | **Mock**; PINs in static data |
| `getAuthorizedContactDetails` | `src/lib/storage.ts:559-612` | Returns `login_required` / `locked` / `available` | **Mock**; no real session/entitlement |
| Role checks (`currentUser?.role === 'admin'`) | Multiple components | Type check only | **UI-only**; no admin user seeded |

### Authorization Classifications

| Mechanism | Current State | Future Boundary |
|-----------|---------------|-----------------|
| Member authentication | Mock (localStorage + DEMO_USERS) | **Server-side** (Resend OTP + secure cookies) |
| Business owner actions | `created_by_user_id` match in storage | **Server-side** (ownership in Teable) |
| Staff operations (loyalty stamps) | PIN check vs `INITIAL_STAFF_ACCOUNTS` | **Server-side** (staff record + PIN in Teable) |
| Contact visibility | Mock subscription status in storage | **Server-side** (entitlement + subscription) |
| Group coordination | `owner_user_id` match | **Server-side** |
| Platform admin (`role === 'admin'`) | Type exists; no user seeded; no dashboard | **Server-side**; platform-admin only |

### Key Architectural Boundaries

1. **Client-side checks are UX only** — all `currentUser?.role` checks, owner matches, subscription status reads must be re-validated server-side.
2. **No session exists** — `GET /api/auth/session` returns `{ authenticated: false }`; no cookies, JWT, or tokens.
3. **No real auth layer** — `loginWithOtp`, `verifyOtpAndLogin`, `authenticateWithEmail` write to localStorage only.
4. **Staff PINs in static data** — `STF-TEST-A` (pin `1234`) exists only in `INITIAL_STAFF_ACCOUNTS` for tests; no staff management UI.

### Superadmin Conclusion

- No Superadmin dashboard/component/route exists.
- `UserRole` includes `'admin'` but no admin user is seeded.
- Platform-admin access **must remain absent** until:
  - Real identity/session layer exists (server-validated)
  - Server-enforced admin role assignment exists
  - Separate platform-admin UI is explicitly designed and approved

### Test-Account Guard

- `STF-TEST-A` (staff reference, pin `1234`) exists only in `src/lib/constants.ts:223` (`INITIAL_STAFF_ACCOUNTS`) and is used only by `security.test.ts`.
- No production source path imports or exposes this test account.
- **Safe** — internal to test fixtures only.

## Identity & Session Design Decision (REBUILD-007)

A formal design decision record for the first real authentication implementation phase has been recorded in `docs/IDENTITY_SESSION_DECISION.md`. Key decisions:

- **Identity method**: Passwordless email OTP via Resend (provider setup deferred)
- **Session model**: Opaque server-managed session ID in secure HttpOnly cookie (`Secure; HttpOnly; SameSite=Lax`); no bearer tokens
- **OTP lifecycle**: 6-digit code, 10-min expiry, one-time use, 5 req/hour rate limit, bcrypt hash storage
- **Session model**: Opaque server-managed ID in secure HttpOnly cookie; 30-day absolute / 24-hour idle expiry; rolling renewal; server-side revocation
- **API contracts**: `POST /api/auth/request-otp`, `POST /api/auth/verify-otp`, `GET /api/auth/session`, `POST /api/auth/logout`
- **Session response privacy**: Minimal fields only (`userId`, `roles`, `businessOwnerships`, `staffAssignments`, `exp`); no email, OTP state, payment data
- **Authorization model**: Server-side enforcement for all sensitive actions; object-level ownership/staff/coordinator checks; platform Superadmin = explicit role; deny-by-default; client checks = UX only
- **CSRF/protection**: SameSite=Lax + Origin/Referer validation on mutations; rate limiting on OTP endpoints
- **Migration**: Replace mock `currentUser`/localStorage with real session; preserve `STF-TEST-A` test guard

### Future Server Architecture (Post-Phase 0)
- **API Layer**: Secure server routes (not in Phase 0)
- **Auth**: Email OTP via Resend, session cookies
- **Database**: Teable (67-table foundation)
- **Payments**: Stripe webhooks
- **Email**: Resend transactional
- **Repositories**: PublicDirectory, Event, Group, Business, Session, Consent, Loyalty

## Environment
- **Build**: `bun run build` → `dist/`
- **Dev**: `bun run dev` (port 3000)
- **Typecheck**: `bun run typecheck` (`tsc --noEmit`)
- **Test**: `bun test` (security test suite)
- **Lint**: `bun run lint` (alias for typecheck)

## PWA Configuration
- Manifest: name "PlayaVida", standalone display
- Icons: 72-1024px SVG assets in `/public`
- Workbox: precache JS, CSS, HTML, images, fonts
- Dev SW enabled

## Future Build Phases

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

### Phase 2 — Core Domain Features (REBUILD-015 to REBUILD-021)

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
- Approval audit-logged; no auto-send without approval

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

---

### Phase 4 — Advanced Platform Capabilities (REBUILD-030+)

- REBUILD-030 — Platform Configuration & Controlled Feature Rollout
- REBUILD-031 — Analytics/Event Pipeline
- REBUILD-032 — Multi-region / Edge Deployment
- REBUILD-033 — Data Export / Compliance Tooling

---

### Current Phase Status
**Phase 0 Complete** — All Phase 0 tickets done (REBUILD-002 through REBUILD-007)
**Phase 1 Pending** — Requires Vercel deployment verification and Node.js 22.x config