# PRODUCT.md — PlayaVida Product Specification

## Overview
Bilingual (ES/EN) community & local discovery PWA for Playa del Carmen and Riviera Maya. Direct business contact access, events, native loyalty cards, regional discovery.

## Core Product Rules

### 1. Demo vs Real Data
- Demo mode: clearly fictional public listings only
- Demo data NEVER appears as real user's favorites, comments, ownership, payment, membership, profile, dashboard, or history
- Production: only server-projected real published records

### 2. Persistent Data (Server-Authoritative)
Must persist through secure server APIs:
- Identity, ownership, profile changes
- Favorites, business/group/event/sponsor creation
- Reports, memberships
- Community Initiative approval
- Payment state, entitlements
- Loyalty settings
- Contact inquiries
- **localStorage is never authoritative** for identity, ownership, payment, approval, entitlement, or real public records

### 3. Access Boundaries
- Featured placement ≠ Business Pro features
- Featured placement ≠ contact visibility
- Featured placement ≠ loyalty access
- Paid Business Pro = verified payment/server entitlement (later)
- Community Initiative business = complimentary, requires active superadmin approval, 3 months, distinct from paid Pro
- Active verified Paid Pro OR active approved Community Initiative = selected Pro-equivalent benefits (later)
- Contact details = authenticated visitor + active qualifying business contact-access entitlement
- `test_only` never means paid

### 4. Future Pro Benefits (Later)
- Logged-in visitor contact access
- Contact modal open analytics
- Contact inquiry inbox & notifications
- Loyalty-card management dashboard
- Advanced business dashboard
- Featured placement remains separately purchased

### 5. Sponsor Model (Later)
- Logged-in user creates Sponsor draft
- Sponsor = full mini-site with external destination link
- Sponsor contact details = logged-in visitors only
- Sponsor in homepage Featured Partners strip = after verified active Sponsor placement
- Footer Sponsor button = informational → registered user dashboard
- Affiliate sponsors = superadmin-managed only
- No sponsor QR/category/location requirement

### 6. Community Initiatives (Later)
- Normal Business/Group can request Community Initiatives category
- Superadmin approval required before display
- Approved Community Initiative Business = 3 months complimentary Pro-equivalent selected access
- Approved Community Initiative Group = placement only
- Renewal = superadmin review
- Owner can remove category → removes placement/access immediately
- No claim of legal charity verification or endorsement

---

## Current Stack (Phase 0)
- React 19, Vite, TypeScript, Bun
- Tailwind CSS v4, vite-plugin-pwa
- lucide-react icons
- Fonts: Outfit, Plus Jakarta Sans (Google Fonts)
- i18n: static object-based (`src/lib/i18n.ts`), localStorage persistence

---

## Public Routes
- `/` — Directory / Discover / Events / Community / Loyalty / Profile
- `/intro.html` — Landing page / Intro