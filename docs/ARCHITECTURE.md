# ARCHITECTURE.md ิว๖ PlayaVida Technical Architecture

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
ิ๖ฃิ๖วิ๖ว App.tsx                 # Main app shell, routing, state
ิ๖ฃิ๖วิ๖ว main.tsx                # Entry point
ิ๖ฃิ๖วิ๖ว index.css               # Global styles + Tailwind imports
ิ๖ฃิ๖วิ๖ว components/             # 40+ UI components (modals, cards, pages)
ิ๖ฃิ๖วิ๖ว lib/
ิ๖้   ิ๖ฃิ๖วิ๖ว storage.ts          # PlayaVidaStore (localStorage-backed, mock data)
ิ๖้   ิ๖ฃิ๖วิ๖ว teableAdapter.ts    # Teable projection/sanitization (server-only)
ิ๖้   ิ๖ฃิ๖วิ๖ว constants.ts        # Demo seed data
ิ๖้   ิ๖ฃิ๖วิ๖ว i18n.ts             # Translations
ิ๖้   ิ๖ฃิ๖วิ๖ว interests.ts        # Interest taxonomy
ิ๖้   ิ๖๖ิ๖วิ๖ว communityInterests.ts
ิ๖ฃิ๖วิ๖ว types/index.ts          # All TypeScript interfaces
ิ๖๖ิ๖วิ๖ว tests/security.test.ts  # Security boundary validation
api/
ิ๖๖ิ๖วิ๖ว health.ts               # Minimal health endpoint (REBUILD-002)
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
- **Build**: `bun run build` ิๅฦ `dist/`
- **Dev**: `bun run dev` (port 3000)
- **Typecheck**: `bun run typecheck` (`tsc --noEmit`)
- **Test**: `bun test` (security test suite)
- **Lint**: `bun run lint` (alias for typecheck)

## PWA Configuration
- Manifest: name "PlayaVida", standalone display
- Icons: 72-1024px SVG assets in `/public`
- Workbox: precache JS, CSS, HTML, images, fonts
- Dev SW enabled
