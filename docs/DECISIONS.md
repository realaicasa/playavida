# DECISIONS.md — PlayaVida Architectural Decisions

## ADR-001: Bun as Package Manager
**Date**: 2026-10-02
**Status**: Accepted
**Context**: AI Studio export used Bun. Clean repo must maintain consistency.
**Decision**: Use Bun exclusively. `bun.lock` is authoritative. No npm/yarn/pnpm lockfiles.
**Consequences**: All team members must have Bun installed. CI must use Bun.

## ADR-002: localStorage as Phase 0 Mock Backend
**Date**: 2026-10-02
**Status**: Accepted
**Context**: No server/API in Phase 0. UI needs data for visual prototype.
**Decision**: `PlayaVidaStore` in `src/lib/storage.ts` uses localStorage + in-memory fallback with demo seed data from `constants.ts`.
**Consequences**: Not authoritative for identity, ownership, payment, entitlements. Replaced by server API in Phase 1+.

## ADR-003: Public/Private Projection Separation
**Date**: 2026-10-02
**Status**: Accepted
**Context**: Contact details are sensitive. Must never leak to public directory.
**Decision**: Two distinct TypeScript interfaces:
- `PublicBusinessProjection` — safe for unauthenticated public queries
- `PrivateBusinessContactDetails` — requires auth + entitlement
Enforced by `TeableAdapter.projectPublicBusiness()` and `filterContactProjection()`.
**Consequences**: All data access goes through projection layer. No direct Teable row exposure.

## ADR-004: Teable Adapter Server-Only
**Date**: 2026-10-02
**Status**: Accepted
**Context**: `TEABLE_API_KEY` must never reach client.
**Decision**: `teableAdapter.ts` is server-side only. Frontend imports types only. No Teable client in browser bundle.
**Consequences**: All Teable calls via future API routes. Phase 0 mocks replace adapter.

## ADR-005: Email OTP Auth (Resend)
**Date**: 2026-10-02
**Status**: Planned (Phase 1)
**Context**: No passwords. Low-friction for Mexican/Expat user base.
**Decision**: Email OTP via Resend. 10-min TTL, 5 attempts, 5 sends/hour. WhatsApp OTP via Meta Business API as future enhancement.
**Consequences**: Requires Resend integration, secure session cookies, rate limiting.

## ADR-006: Stripe for Payments
**Date**: 2026-10-02
**Status**: Planned (Phase 1)
**Context**: Recurring subscriptions (quarterly), OXXO cash vouchers for Mexico.
**Decision**: Stripe Checkout + Webhooks. Prices: Sponsor Quarterly, Business Pro Quarterly. OXXO via PaymentIntent.
**Consequences**: Webhook endpoint `/api/stripe/webhook`. Subscription state synced to Teable.

## ADR-007: PWA-First Architecture
**Date**: 2026-10-02
**Status**: Accepted
**Context**: Mobile-first community app. Offline-capable directory browsing.
**Decision**: `vite-plugin-pwa` with `autoUpdate`, Workbox precaching. Standalone display mode.
**Consequences**: Service worker in production. Manifest with icons 72-1024px.

## ADR-008: TypeScript Strict Mode
**Date**: 2026-10-02
**Status**: Accepted
**Context**: Large codebase, many domain entities, security boundaries.
**Decision**: TS strict, `noEmit: true`, `isolatedModules: true`, `moduleResolution: bundler`. Typecheck via `tsc --noEmit`.
**Consequences**: Build fails on type errors. All props/events typed.

## ADR-009: Tailwind CSS v4 via Vite Plugin
**Date**: 2026-10-02
**Status**: Accepted
**Context**: AI Studio export used Tailwind v4. No `tailwind.config.js` needed.
**Decision**: `@tailwindcss/vite` plugin. Styles in `index.css` with `@import "tailwindcss"`.
**Consequences**: No separate config file. Design tokens in CSS.

## ADR-010: Demo Data Contract
**Date**: 2026-10-02
**Status**: Accepted
**Context**: Visual prototype needs data but must not confuse with real data.
**Decision**: `DEMO_DATA_AND_REAL_DATA_CONTRACT.md` — demo data labeled "Demo listing", never mixed with real user data, empty states in production.
**Consequences**: UI components check `isDemo` flags. Production API returns empty arrays when no real data.