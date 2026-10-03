# SECURITY.md — PlayaVida Security Model

## Security Principles

### Local Filesystem Boundary
Agents may access, read, write, execute, create, modify, or delete files only within the repository root. They must not access parent directories, sibling directories, user-profile folders, temporary folders, system folders, other repositories, or external local paths unless the user gives explicit written approval for one named path and one stated purpose.

### Secrets Boundary
Never request, print, commit, store, copy, log, or expose secret values. Use environment-variable names only. If a secret is exposed, treat it as compromised, instruct the owner to revoke/rotate it at the provider, and do not reproduce it.

### 1. Projection Boundaries (Enforced)
- **Public projections** (`PublicBusinessProjection`): Strictly omit private contact fields (phone, whatsapp, email, address, coordinates, booking_url)
- **Private projections** (`PrivateBusinessContactDetails`): Only released after:
  - User authenticated
  - Active subscription OR valid grace period
  - User not blocked by business owner
- **TeableAdapter** (`src/lib/teableAdapter.ts`): Single source of truth for projection logic

### 2. Authentication (Future - Not Phase 0)
- Email OTP via Resend (no passwords)
- Secure HTTP-only cookies for sessions
- OTP: 10-min TTL, 5 max attempts, 5 max sends/hour
- Mock auth in Phase 0 (`AuthModal.tsx`, `storage.ts` loginWithOtp) — NOT secure

### 3. Authorization Matrix
| Requestor | Target | Subscription | Result |
|-----------|--------|--------------|--------|
| Unauthenticated | Contact details | N/A | `login_required` |
| Authenticated | Free/expired tier | None/expired | `locked` |
| Authenticated | Paid Pro (starter_contact/pro) | Active | `available` |
| Authenticated | Grace period | Grace | `available` |
| Blocked user | Any | Any | `blocked` |
| Owner | Own business | Any | Full private access |

### 4. Data Isolation
- **Teable views/hidden columns are NOT security boundaries**
- Projections calculated explicitly before returning data
- NEVER expose `TEABLE_API_KEY` to client browser
- All Teable calls server-side only

### 5. Loyalty Security
- Stamp awards require valid staff PIN (individual per staff)
- Append-only ledger (`LoyaltyLedgerTransaction`) with idempotency keys
- Bonus features require photo upload verification (optional)

### 6. Reporting
- Universal reports require authenticated `reporter_user_id`
- Immutable `RPT-*` references
- Content snapshots for evidence

### 7. User Blocks
- User-owned block lists (business, group, organizer, user)
- Strictly filtered from all user-facing queries

### 8. Subscription Grace Period
- Cancellation → `grace_period` (7 days)
- Contact access maintained during grace
- After grace → `expired`, contact locked

## Tested Invariants (`src/tests/security.test.ts`)
All 8 test suites must pass:
1. Data Projection Security
2. Draft/Archived Visibility Boundaries
3. Contact Authorization Matrix
4. Grace Period Security
5. Universal Reporting Authentication
6. User-Owned Block List Filtering
7. Loyalty Staff PIN Authentication
8. Teable Adapter Boundary Verification

## Secrets Management
- `.env`, `.env.*` → `.gitignore`
- No secrets in repo
- Server-only: `TEABLE_API_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `OTP_SECRET`, `AUTH_SECRET`, `SESSION_SECRET`
- Client-safe: `VITE_STRIPE_PUBLISHABLE_KEY` only

## Content Security
- No inline scripts (CSP compatible)
- PWA manifest + SW integrity
- External fonts: Google Fonts (preconnect)
- Images: Unsplash CDN (HTTPS)