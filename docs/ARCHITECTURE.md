# ARCHITECTURE.md ÈÃ÷ PlayaVida Technical Architecture

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
È÷úÈ÷ÃÈ÷Ã App.tsx                 # Main app shell, routing, state
È÷úÈ÷ÃÈ÷Ã main.tsx                # Entry point
È÷úÈ÷ÃÈ÷Ã index.css               # Global styles + Tailwind imports
È÷úÈ÷ÃÈ÷Ã components/             # 40+ UI components (modals, cards, pages)
È÷úÈ÷ÃÈ÷Ã lib/
È÷Ú   È÷úÈ÷ÃÈ÷Ã storage.ts          # PlayaVidaStore (localStorage-backed, mock data)
È÷Ú   È÷úÈ÷ÃÈ÷Ã teableAdapter.ts    # Teable projection/sanitization (server-only)
È÷Ú   È÷úÈ÷ÃÈ÷Ã constants.ts        # Demo seed data
È÷Ú   È÷úÈ÷ÃÈ÷Ã i18n.ts             # Translations
È÷Ú   È÷úÈ÷ÃÈ÷Ã interests.ts        # Interest taxonomy
È÷Ú   È÷÷È÷ÃÈ÷Ã communityInterests.ts
È÷úÈ÷ÃÈ÷Ã types/index.ts          # All TypeScript interfaces
È÷÷È÷ÃÈ÷Ã tests/security.test.ts  # Security boundary validation
api/
È÷÷È÷ÃÈ÷Ã health.ts               # Minimal health endpoint (REBUILD-002)
È÷÷È÷ÃÈ÷Ã auth/
È÷÷È÷ÃÈ÷Ã   È÷÷È÷ÃÈ÷Ã session.ts          # Minimal unauthenticated session endpoint (REBUILD-004)
È÷÷È÷ÃÈ÷Ã   È÷÷È÷ÃÈ÷Ã logout.ts           # Minimal stateless logout endpoint (REBUILD-005)
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

## Future Server Architecture (Post-Phase 0)
- **API Layer**: Secure server routes (not in Phase 0)
- **Auth**: Email OTP via Resend, session cookies
- **Database**: Teable (67-table foundation)
- **Payments**: Stripe webhooks
- **Email**: Resend transactional
- **Repositories**: PublicDirectory, Event, Group, Business, Session, Consent, Loyalty

## Environment
- **Build**: `bun run build` ÈÕã `dist/`
- **Dev**: `bun run dev` (port 3000)
- **Typecheck**: `bun run typecheck` (`tsc --noEmit`)
- **Test**: `bun test` (security test suite)
- **Lint**: `bun run lint` (alias for typecheck)

## PWA Configuration
- Manifest: name "PlayaVida", standalone display
- Icons: 72-1024px SVG assets in `/public`
- Workbox: precache JS, CSS, HTML, images, fonts
- Dev SW enabled
