# IDENTITY_SESSION_DECISION.md — PlayaVida Identity and Session Design Decision Record

## Decision Status Convention

Every item in this record carries one of these statuses:

- ✅ **Confirmed product decision** — Approved by Mike; safe to implement
- 🔵 **Proposed secure default — requires Mike approval** — Reasonable default; blocks implementation until explicitly approved
- ❓ **Open decision — blocks implementation** — Must be decided before any implementation
- 🔧 **Future implementation detail — select only after design approval** — Low-level detail; choose after higher-level decisions

---

## 1. Decision Summary

- **Identity method**: Passwordless email OTP (one-time passcode) — ✅ **Confirmed product decision**
- **Future provider**: Resend (email delivery) — ✅ **Confirmed product decision**; no integration occurs in this ticket; no API key exists in this repository
- **Authentication boundary**: All identity, role, ownership, entitlement, staff, and platform-Superadmin decisions are **server-side** — ✅ **Confirmed product decision**
- **Frontend state** remains presentation/UX only and **never constitutes a security boundary** — ✅ **Confirmed product decision**
- **Session model**: Opaque server-managed session ID stored in secure HttpOnly cookie; no bearer tokens in browser storage — ✅ **Confirmed product decision**

---

## 2. Scope and Non-Goals

### First Implementation Phase Covers
- OTP request and verification endpoints
- Server-side session issuance, validation, and revocation
- Secure HttpOnly cookie with proper attributes
- `GET /api/auth/session` returning real authenticated state
- `POST /api/auth/logout` invalidating server-side session
- Minimal server-side authorization middleware (ownership, role)

### Explicitly Excluded (Future Tickets)
- Superadmin UI, routes, navigation, or role gates
- Payment/Stripe integration
- Notification sending (Resend campaign execution)
- Teable schema migration / data sync
- Advanced roles (delegated moderator, support agent, analytics viewer)
- Account recovery / change-email / step-up verification
- Provider setup (Resend API keys, webhook configuration)
- Feature flags / controlled rollout
- Analytics capture, webhooks, queues, cron jobs

---

## 3. Identity Model

| Attribute | Description | Status |
|-----------|-------------|--------|
| **Stable user ID** | Opaque string (e.g., `usr_<uuid>`), never exposed as email | ✅ Confirmed product decision |
| **Email** | Treated as sensitive PII; never in session response; used only for OTP delivery | ✅ Confirmed product decision |
| **Platform roles** | `member`, `business_owner`, `staff`, `coordinator`, `platform_superadmin` (distinct from `business_owner`) | ✅ Confirmed product decision |
| **Ownership** | Separate from platform roles; `business.owner_user_id` in Teable | ✅ Confirmed product decision |
| **Staff assignment** | Separate record: `staff { user_id, business_id, role: 'staff'|'manager', pin_hash }` | ✅ Confirmed product decision |
| **No hard-coded identity** | No auto-login demo user, no client-visible test account, no hard-coded admin email | ✅ Confirmed product decision |

---

## 4. OTP Lifecycle (High-Level)

| Stage | Behavior | Status |
|-------|----------|--------|
| **Request initiation** | `POST /api/auth/request-otp { email }` — always returns 200 (anti-enumeration) | ✅ Confirmed product decision |
| **Anti-enumeration** | Identical response regardless of email existence; rate-limited per IP + per email | ✅ Confirmed product decision |
| **Code format** | 6-digit numeric | ✅ Confirmed product decision |
| **Code generation** | Cryptographically random | 🔧 Future implementation detail |
| **Storage** | Hash (bcrypt) in server store with `email`, `expires_at`, `attempts`, `used` flag | ✅ Confirmed product decision |
| **Expiry** | 10 minutes | ✅ Confirmed product decision |
| **One-time use** | Marked `used=true` on successful verification; rejected thereafter | ✅ Confirmed product decision |
| **Rate limits** | ≤ 5 requests/hour per email; ≤ 20 requests/hour per IP; max 5 verification attempts per code | ✅ Confirmed product decision |
| **Verification** | Constant-time hash compare; on success: create session, mark OTP used, return 200 | ✅ Confirmed product decision |
| **Invalidation** | On success, expiry, or max attempts (5); cleanup job for expired records | 🔧 Future implementation detail |
| **Audit events** | `otp_requested`, `otp_verified`, `otp_failed`, `otp_expired` — no raw codes or emails in logs | ✅ Confirmed product decision |

---

## 5. Session Model

| Property | Decision | Status |
|----------|----------|--------|
| **Session ID** | Opaque server-managed identifier (e.g., 256-bit random) | ✅ Confirmed product decision |
| **Storage** | Server-side store (Teable `sessions` table or Redis); keyed by session ID | ✅ Confirmed product decision |
| **Cookie name** | `session_id` (opaque server-managed ID) | ✅ Confirmed product decision |
| **Cookie attributes** | `HttpOnly; Secure; SameSite=Lax; Path=/` | ✅ Confirmed product decision |
| **Secure flag** | Required in production (HTTPS only) | ✅ Confirmed product decision |
| **SameSite** | `Lax` | ✅ Confirmed product decision |
| **Member/Business-owner sessions** | 30-day absolute lifetime; 24-hour idle timeout; rolling renewal | ✅ Confirmed product decision |
| **Staff operational sessions** | 12-hour absolute lifetime; 60-minute idle timeout; reauthentication for sensitive changes | ✅ Confirmed product decision |
| **Platform Superadmin sessions** | 8-hour absolute lifetime; 20-minute idle timeout; step-up OTP before privileged changes | ✅ Confirmed product decision |
| **Renewal** | Rolling on each authenticated request if > 50% lifetime elapsed (ordinary sessions) | ✅ Confirmed product decision |
| **Revocation** | Server-side delete by session ID; immediate on logout, password/email change, role change, security event | ✅ Confirmed product decision |
| **Expired/revoked behavior** | `GET /api/auth/session` returns `{ authenticated: false }`; cookie cleared via `Max-Age=0` | ✅ Confirmed product decision |
| **No bearer token** | No `Authorization` header, no `localStorage` token, no JWT in browser | ✅ Confirmed product decision |
| **Logout** | `POST /api/auth/logout` → server deletes session, returns `Set-Cookie: session_id=; Max-Age=0` | ✅ Confirmed product decision |

> **Note**: The previous contradiction about session duration is resolved. Member/business-owner sessions use 30-day absolute / 24-hour idle; staff sessions use 12-hour absolute / 60-minute idle; Superadmin sessions use 8-hour absolute / 20-minute idle with step-up OTP before privileged changes. All are now confirmed product decisions.

---

## 6. API Contracts (Future)

### `POST /api/auth/request-otp`
- **Method**: POST only (405 otherwise)
- **Request**: `{ email: string }`
- **Response categories**:
  - 200: `{ ok: true }` (always, anti-enumeration)
  - 429: `{ ok: false, code: "RATE_LIMITED" }`
  - 400: `{ ok: false, code: "INVALID_EMAIL" }`
- **No email enumeration**: Identical 200 response for existent/non-existent emails

### `POST /api/auth/verify-otp`
- **Method**: POST only (405 otherwise)
- **Request**: `{ email: string, code: string }`
- **Response categories**:
  - 200: Sets session cookie; `{ authenticated: true, userId, roles, businessOwnerships, staffAssignments, exp }`
  - 400: `{ ok: false, code: "INVALID_CODE" }` (also for expired/used)
  - 429: `{ ok: false, code: "RATE_LIMITED" }` (max 5 attempts per OTP)
  - 401: `{ ok: false, code: "OTP_EXPIRED" }`

### `GET /api/auth/session`
- **Method**: GET only (405 otherwise)
- **Response (unauthenticated)**: 200 `{ authenticated: false }`
- **Response (authenticated)**: 200 `{ authenticated: true, userId, roles, businessOwnerships, staffAssignments, exp }`
- **Privacy**: See §7 — no email, OTP state, consent history, payment details, unrestricted user data

### `POST /api/auth/logout`
- **Method**: POST only (405 otherwise; Allow: POST)
- **Response (authenticated)**: 200 `{ authenticated: false }` + clears cookie
- **Response (unauthenticated)**: 200 `{ authenticated: false }` (idempotent)
- **Non-POST**: 405 `{ ok: false, code: "METHOD_NOT_ALLOWED" }` + `Allow: POST`

---

## 7. Session Response Privacy

**Minimal authenticated response**:
```json
{
  "authenticated": true,
  "userId": "usr_<opaque>",
  "roles": ["member", "business_owner"],
  "businessOwnerships": ["bus_<id1>", "bus_<id2>"],
  "staffAssignments": [{"businessId": "bus_<id>", "role": "staff"}],
  "exp": 1735689600
}
```

**Excluded (never in session response)**:
- Email address
- OTP state, hash, attempts
- Raw consent history (`PrivacyPreferences`, `UserPushOptIn`)
- Payment details, Stripe IDs, OXXO references
- Unrestricted user directory data
- Secrets, internal audit records, raw consent choices

**Status**: ✅ Confirmed product decision

---

## 8. Authorization Model

| Principle | Status |
|-----------|--------|
| **Server-side enforcement** for all sensitive actions | ✅ Confirmed product decision |
| **Object-level checks**: ownership (`business.owner_user_id`), staff assignment (`staff.business_id`), coordinator (`group.owner_user_id`) | ✅ Confirmed product decision |
| **Platform Superadmin** = explicit role `platform_superadmin` in `user_roles` table; separate from `business_owner`/`staff` | ✅ Confirmed product decision |
| **Client checks = UX only** — frontend `role` checks never grant permission | ✅ Confirmed product decision |
| **Deny-by-default** — missing session → 401; insufficient role/ownership → 403 | ✅ Confirmed product decision |
| **Negative-access tests required** — automated tests for all role combinations | ✅ Confirmed product decision |
| **No hard-coded admin identity or bypass** | ✅ Confirmed product decision |

---

## 9. CSRF and Request Protections

| Protection | Decision | Status |
|------------|----------|--------|
| **Cookie-based mutations** | All state-changing endpoints require valid session cookie | ✅ Confirmed product decision |
| **SameSite=Lax** | Baseline CSRF protection for top-level navigations | ✅ Confirmed product decision |
| **Origin/Referer validation** | Additional check on mutating endpoints — reject if missing/mismatched | ✅ Confirmed product decision |
| **GET non-mutating** | Enforced by convention and middleware | ✅ Confirmed product decision |
| **Rate limiting** | OTP endpoints — 5 req/hour per email, 20 req/hour per IP | ✅ Confirmed product decision |

---

## 10. Data and Retention Boundaries

| Data | Retention | Status |
|------|-----------|--------|
| OTP hash + metadata | 24 hours post-expiry/verification | ✅ Confirmed product decision |
| Session record | Session lifetime + 7 days grace | ✅ Confirmed product decision |
| Auth audit events | 2 years | ✅ Confirmed product decision |
| Session revocation reasons | 2 years | ✅ Confirmed product decision |

- **No raw OTP logging** — only hash stored; logs show `otp_requested { email_hash }` not email — ✅ Confirmed product decision
- **No client-visible secrets** — session ID never in response body (only cookie) — ✅ Confirmed product decision
- **Consent/privacy** — Follows Superadmin Blueprint §4: purpose-limited access, minimization, auditability; no raw consent export — ✅ Confirmed product decision

---

## 11. Migration from Current Mock State

| Current Mock | Limitation | Migration Approach |
|--------------|------------|-------------------|
| `currentUser` from `DEMO_USERS[0]` | Auto-login, no real auth | Remove before release; replace with real `GET /api/auth/session` |
| `loginWithOtp` / `verifyOtpAndLogin` | Fixed code `774921`; localStorage | Replace with real OTP endpoints + server session |
| `authenticateWithEmail` | Auto-creates user; no verification | Remove; use OTP flow |
| `logout` | Clears localStorage only | Replace with server session revocation |
| `getAuthorizedContactDetails` | Mock subscription status | Replace with server entitlement check |
| `currentUser?.role === 'admin'` checks | UI-only; no admin user seeded | Migrate to server-side middleware; remove client gates |
| `STF-TEST-A` (pin `1234`) | Test staff in `INITIAL_STAFF_ACCOUNTS` | **Preserve** — internal test fixture only; no prod path references it — ✅ Confirmed product decision |

---

## 12. Decisions Required from Mike (Approval Checklist)

Mike must approve or decide each of the following before implementation:

- [x] **OTP code format and expiry** — 6-digit numeric, 10-min expiry
- [x] **OTP resend/attempt/rate limits** — 5 req/hour per email, 20 req/hour per IP, 5 attempts per OTP
- [x] **Session lifetimes by role** — Member/business-owner: 30-day absolute / 24-hour idle; Staff: 12-hour absolute / 60-min idle; Superadmin: 8-hour absolute / 20-min idle with step-up OTP
- [x] **Rolling renewal behavior** — Renew if > 50% lifetime elapsed (ordinary sessions); staff/Superadmin sessions require reauthentication
- [x] **Trusted application origin/domain/subdomain model** — `https://playavida.org` and `https://www.playavida.org` only; no subdomain cookie sharing
- [x] **Platform Superadmin step-up verification** — Require re-OTP before privileged Superadmin actions
- [x] **Admin delegation/approval rule** — Existing Superadmin + recorded approval process required for role grants/revocations
- [x] **Session/audit/OTP retention requirements** — Auth audit events: 2 years; OTP metadata: 24 hours post-expiry; session metadata: session lifetime + 7 days grace
- [x] **Trusted application origin/domain/subdomain model** — Confirmed: `https://playavida.org` and `https://www.playavida.org` only; no subdomain cookie sharing without separate approved design
- [x] **Account recovery / change-email flow** — Re-verify via OTP to current email; change-email requires OTP to both old and new email; revoke all sessions after change
- [x] **Launch handling of mock/demo/local data** — No localStorage/demo identity migration; real server identities only; approved roles seeded through auditable admin process

---

---

---

## 13. Implementation Sequence (Max 7 Follow-On Tickets)

| Ticket | Objective | Prerequisite |
|--------|-----------|--------------|
| **REBUILD-008** | **Provider/configuration decision and out-of-source secret provisioning, after Mike approves the open OTP/session/domain decisions** | Mike approves open decisions (§12) |
| **REBUILD-009** | OTP request/verify endpoints (`POST /api/auth/request-otp`, `POST /api/auth/verify-otp`) | REBUILD-008 |
| **REBUILD-010** | Server session issuance, cookie, validation, `GET /api/auth/session` | REBUILD-009 |
| **REBUILD-011** | `POST /api/auth/logout` + server-side revocation + cookie clearing | REBUILD-010 |
| **REBUILD-012** | Server-side authorization middleware (ownership, role, staff) | REBUILD-010 |
| **REBUILD-013** | Migrate UI away from mock identity (`currentUser` from session, remove demo auto-login) | REBUILD-011 |
| **REBUILD-014** | Read-only Superadmin access (`GET /api/superadmin/overview`) | REBUILD-012 |

---

## 14. Acceptance Criteria

| Criterion | Verification | Status |
|-----------|--------------|--------|
| No hard-coded auth secrets | Grep: no API keys, secrets, OTP codes in source | ✅ Confirmed product decision |
| No user enumeration via OTP request | `POST /api/auth/request-otp` returns identical 200 for any email | ✅ Confirmed product decision |
| OTP expiry/single use/rate limits | Unit/integration tests: 10-min expiry, one-time use, 5 req/hour limit | ✅ Confirmed product decision |
| HttpOnly Secure cookie in production | Cookie flags verified in staging/production; `Secure` flag set | ✅ Confirmed product decision |
| Server-side revocation | Logout deletes server session; subsequent `GET /api/auth/session` returns unauthenticated | ✅ Confirmed product decision |
| GET session privacy | Response schema validated: no email, OTP state, payment data, unrestricted user data | ✅ Confirmed product decision |
| Logout invalidation | Session deleted server-side; cookie cleared; subsequent requests unauthenticated | ✅ Confirmed product decision |
| Role/ownership/staff denial tests | Automated: member/owner/staff/coordinator → 403 on Superadmin endpoints | ✅ Confirmed product decision |
| Non-admin Superadmin denial | Business owner, staff, coordinator all 403 on Superadmin endpoints | ✅ Confirmed product decision |
| STF-TEST-A remains internal-only | Grep: only test fixtures reference `STF-TEST-A` or pin `1234` | ✅ Confirmed product decision |
| No UI-only authorization claim | No `currentUser?.role === 'admin'` gating Superadmin routes in client code | ✅ Confirmed product decision |

---

*End of IDENTITY_SESSION_DECISION.md*