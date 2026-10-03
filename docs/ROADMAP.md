# ROADMAP.md — PlayaVida Development Roadmap

## Phase 0: Clean Repository Setup ✓ (Current)
- Repository structure inspection
- Documentation creation (AGENTS.md, TASKS.md, PRODUCT.md, ARCHITECTURE.md, SECURITY.md, SCHEMA.md, DECISIONS.md, DEPLOYMENT.md, ROADMAP.md, OPEN_RISKS.md)
- .gitignore verification
- Build/typecheck/test verification (Bun not available on this system)

---

## Phase 1: Minimal Backend Foundation (Post-Approval)

### REBUILD-002: Minimal Health Route
- `GET /api/health` → `{ status: "ok", version, timestamp }`
- No auth, no DB, no external deps
- Deploy behind existing domain

### REBUILD-003: Auth OTP Flow
- Email OTP via Resend
- 10-min TTL, 5 max attempts, 5 max sends/hour
- Secure HTTP-only session cookies
- Login/register modal integration

### REBUILD-004: Teable Sync Service
- Server-only Teable client
- Projection layer (PublicBusinessProjection, PrivateBusinessContactDetails)
- CRUD for core entities
- Rate limiting & error handling

### REBUILD-005: Stripe Webhook Handler
- `POST /api/stripe/webhook`
- Verify signature with `STRIPE_WEBHOOK_SECRET`
- Handle: `checkout.session.completed`, `invoice.payment_succeeded/failed`, `subscription.updated/deleted`
- Update Teable subscriptions atomically

### REBUILD-006: Public Directory API
- `GET /api/businesses` — paginated, filtered, searchable
- `GET /api/businesses/:id` — public projection
- `GET /api/events`, `GET /api/groups` — similar
- Demo data flag for Phase 0 compatibility

### REBUILD-007: Contact Entitlement API
- `GET /api/businesses/:id/contact` — returns projection per SECURITY.md matrix
- Auth required
- Subscription status check (active/grace_period)
- Block list enforcement

---

## Phase 2: Core Features

### REBUILD-008: Loyalty Ledger API
- Append-only stamp awards (staff PIN verified)
- Idempotency keys
- Voucher issuance at tiers (10, 20, 50)
- Bonus features with photo verification

### REBUILD-009: Community Initiative Approval
- Superadmin dashboard for approval workflow
- 3-month complimentary Pro-equivalent access
- Automatic expiration & renewal review

### REBUILD-010: Sponsor Management
- Sponsor draft creation (logged-in users)
- Mini-site builder
- Featured Partners strip placement (post-payment)

### REBUILD-011: Real Group Membership
- Join requests + admin approval
- Invite codes (single-use, expiring, rate-limited)
- WhatsApp group linking (Meta Business API)

---

## Phase 3: Polish & Scale

### REBUILD-012: Advanced Business Dashboard
- Analytics (contact modal opens, phone reveals, etc.)
- Review responses
- Offer management
- Loyalty program management

### REBUILD-013: Contact Inquiry Inbox
- Business owner notifications
- Threaded conversations
- Email/WhatsApp integration

### REBUILD-014: Search & Discovery
- Full-text search (Meilisearch or Teable native)
- Map-based discovery
- Personalized recommendations

### REBUILD-015: Accessibility & i18n Hardening
- WCAG 2.1 AA compliance
- Complete ES/EN coverage
- RTL support preparation

---

## Milestones

| Milestone | Target | Criteria |
|-----------|--------|----------|
| M1: Backend Live | Week 2-3 | Health + Auth + Teable sync + Stripe webhook |
| M2: Directory Live | Week 4-5 | Public API + Contact entitlement + PWA deploy |
| M3: Loyalty Live | Week 6-7 | Stamp awards + ledger + vouchers |
| M4: Community Features | Week 8-9 | Groups + Sponsors + Initiatives |
| M5: Production Ready | Week 10+ | Dashboard + Inbox + Search + A11y |