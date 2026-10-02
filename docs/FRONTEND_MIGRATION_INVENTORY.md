Status: visual/product specification only. Secure server/API, Teable, authentication, payment verification, ownership, and entitlement enforcement remain required before production activation.

# Frontend Migration Inventory

| Area | Current files/components | Safe to copy now? | Depends on API/auth? | Depends on Teable? | Notes |
|---|---|---:|---:|---:|---|
| App shell/navigation | `App.tsx`, `Header.tsx`, `BottomNav.tsx`, `Footer.tsx` | Yes | Yes (auth states) | No | Visual shell |
| Public home | `App.tsx` (directory view) | Yes | No | Yes (data) | |
| Welcome/intro page | `/public/intro.html`, `LandingPage.tsx` | Yes | No | No | Static |
| Directory UI | `BusinessCard.tsx`, `BusinessPublicPage.tsx` | Yes | No | Yes (data) | |
| Groups UI | `GroupPublicPage.tsx` | Yes | No | Yes (data) | |
| Events UI | `EventPublicPage.tsx` | Yes | No | Yes (data) | |
| Impact UI | (Not fully implemented) | No | - | - | - |
| Profile UI | `ProfileModal.tsx` | Yes | Yes | Yes | Visual components |
| Login modal | `AuthModal.tsx` | Yes | Yes | Yes | Visual mock only |
| Business dashboard UI | `BusinessDashboard.tsx` | Yes | Yes | Yes | Visual mock only |
| Superadmin UI | (Not fully implemented) | No | Yes | Yes | - |
| Magazine UI | (Integrated in Directory) | Yes | No | Yes | |
| Loyalty UI | `LoyaltyWallet.tsx` | Yes | Yes | Yes | Visual mock only |
| Payment/Pro UI | `SponsorModal.tsx` | Yes | Yes | Yes | Visual mock only |
| AI concierge UI | `WikiGlobalSearch.tsx` | Yes | No | No | Visual shell |
| PWA assets/config | `/public/`, `vite.config.ts` | Yes | No | No | |
| i18n resources | `/src/lib/i18n.ts` | Yes | No | No | |
| Design tokens/styles | `index.css`, `tailwind.config.js` | Yes | No | No | |
