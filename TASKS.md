# TASKS.md — PlayaVida Phase 0 Task Tracking

## Phase 0: Clean Repository Setup ✓

- [x] Inspect repository structure and all docs
- [x] Create AGENTS.md
- [x] Create docs/PRODUCT.md
- [x] Create docs/ARCHITECTURE.md
- [x] Create docs/SECURITY.md
- [x] Create docs/SCHEMA.md
- [x] Create docs/DECISIONS.md
- [x] Create docs/DEPLOYMENT.md
- [x] Create docs/ROADMAP.md
- [x] Create docs/OPEN_RISKS.md
- [x] Verify .gitignore excludes required patterns
- [x] Run bun install --frozen-lockfile
- [x] Run bun run lint
- [x] Run bun run build
- [x] Run bun test

---

## Next Phase Tickets (Pending BUILD_CLEAN)

### REBUILD-002 — Minimal Health Route ✓ (completed locally)
- Added `/api/health` endpoint returning `{ ok: true }` on GET
- No auth, no DB, no external deps, no env vars
- Deploy behind existing domain only after Phase 0 approval
- **Next**: Vercel Preview deployment verification

### REBUILD-004 — Minimal Unauthenticated Session Endpoint ✓ (completed locally)
- Added `/api/auth/session` endpoint returning `{ authenticated: false }` on GET
- No auth, no DB, no external deps, no env vars, static response
- Deploy behind existing domain only after Phase 0 approval
- **Next**: Vercel Preview deployment verification

---

## Backlog (Post-Phase 0)

- REBUILD-003: Auth OTP flow (Email → Resend)
- REBUILD-005: Teable sync service (server-only)
- REBUILD-006: Stripe webhook handler
- REBUILD-007: Business public projection API
- REBUILD-008: Contact entitlement enforcement API
- REBUILD-009: Loyalty ledger append-only API
- REBUILD-010: Superadmin approval workflow for Community Initiatives