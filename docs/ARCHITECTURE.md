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
