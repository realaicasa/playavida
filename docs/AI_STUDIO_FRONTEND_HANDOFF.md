Status: visual/product specification only. Secure server/API, Teable, authentication, payment verification, ownership, and entitlement enforcement remain required before production activation.

# AI Studio Frontend Handoff Document

This document outlines the current state of the PlayaVida frontend, intended for migration to a clean repository.

## A. Framework and Build Tool
- Framework: React 19
- Build Tool: Vite
- Language: TypeScript

## B. Package Manager and Lockfile
- Package Manager: Bun
- Lockfile: `bun.lock`

## C. Public Route/Page List
- `/` (Directory / Discover / Events / Community / Loyalty / Profile)
- `/intro.html` (Landing page / Intro)

## D. Component Inventory
- **Shell/Navigation:** `App.tsx`, `Header.tsx`, `BottomNav.tsx`, `Footer.tsx`
- **Public Directory:** `BusinessCard.tsx`, `BusinessPublicPage.tsx`, `EventPublicPage.tsx`, `GroupPublicPage.tsx`, `RivieraMayaMap.tsx`
- **Modals:** `AuthModal.tsx`, `ProfileModal.tsx`, `QrModal.tsx`, `ContactModal.tsx`, `UniversalReportModal.tsx`, `SponsorModal.tsx`, `CreateBusinessModal.tsx`, `CreateGroupModal.tsx`, `CreateEventModal.tsx`, `QuickLookupModal.tsx`, `WikiGlobalSearch.tsx`, `ComplianceModals.tsx` (Privacy, Terms, InstallApp, Disclaimer, Legal, QRcasas)
- **Features:** `LoyaltyWallet.tsx`, `EventDiscovery.tsx`, `CommunitySection.tsx`, `SponsorBanner.tsx`, `LandingPage.tsx` (iframe wrapper)

## E. Assets/Fonts/Icons
- Icons: `lucide-react`
- Fonts: `Outfit`, `Plus Jakarta Sans` (Google Fonts)
- Assets: `/public/PlayaVida*.svg`

## F. i18n
- Approach: `/src/lib/i18n.ts` (Static object-based translations), language preference persisted in `localStorage`.

## G. PWA Configuration
- Using `vite-plugin-pwa` (detected in `package.json`).

## H. Existing External Integrations
- Stripe (payment links used in UI)
- Teable (Backend storage, but UI treats data as read-only/managed via store)

## I. Existing Server/API/Auth Files
- `server.ts` (implied by `package.json` setup, but UI is frontend focused)
- `/src/lib/storage.ts` (Abstraction layer)

## J. Safe to Migrate UI
- Shell/Navigation
- Public Directory UI components
- Landing Page (`/public/intro.html`)
- Profile/Settings UI (visuals)

## K. Visual Mock Only UI
- Auth/Login flow
- Payment/Stripe checkout UI
- Loyalty redemption logic
- AI Concierge (if any)
- Business Dashboard analytics (visual mock)

## L. Known Build Limitations
- Dependencies on `server.ts` for full functionality in dev.
- Logic in `storage.ts` assumes Teable presence for dynamic updates.
