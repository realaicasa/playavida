# AGENTS.md — PlayaVida Phase 0 Configuration

## Purpose
Authoritative instruction file for all AI agents working on this repository. These rules apply to every session.

---

## Project Boundary Rules (CRITICAL)

**You may not access any files outwith this project folder:**
`F:\Mike d drive\Mike Webs\PlayaVida.org\playavida-newgithub02oct26`

**Local filesystem boundary:** Agents may access, read, write, execute, create, modify, or delete files only within the repository root. They must not access parent directories, sibling directories, user-profile folders, temporary folders, system folders, other repositories, or external local paths unless the user gives explicit written approval for one named path and one stated purpose.

**Secrets boundary:** Never request, print, commit, store, copy, log, or expose secret values. Use environment-variable names only. If a secret is exposed, treat it as compromised, instruct the owner to revoke/rotate it at the provider, and do not reproduce it.

**Live URLs:** Do NOT create any new repositories, Vercel projects, or deployments without explicit user approval.

**No authority to:**
- Create new projects or repositories
- Run browser automation (antigravity, Playwright, etc.)
- Write to folders/files outside the project directory
- Deploy to Vercel or any hosting platform
- Create or modify environment variables in external systems

**Memory:** Update permanent memory `.md` files if project boundary rules are not already recorded.

---

## Package Manager

**Bun only.** Allowed commands:
- `bun install --frozen-lockfile`
- `bun run typecheck`
- `bun run build`
- `bun test`

Do NOT create: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
Do NOT change package manager.

---

## Phase 0 Scope

**Do NOT add:**
- API routes
- Auth / OTP / sessions
- Teable integration
- Resend / Stripe
- Environment variables
- server.ts
- Vercel configuration
- Diagnostics
- Payment logic
- Feature entitlements
- QR generation
- Real group membership / invite codes
- Live contact gating
- Database writes
- New product features

**Do NOT change visible UI behavior.**

---

## Phase 0 Work

1. Inspect repository structure and all docs
2. Create required documentation files if missing
3. Keep documents concise
4. Record product rules without implementing them
5. Inspect: package.json, bun.lock, Node version/engines, scripts, TypeScript config, Vite/PWA config, existing server/API/provider files, .gitignore
6. Ensure .gitignore safely excludes: node_modules/, dist/, .vercel/, .env, .env.*, *.pem, *.key
7. Run only: bun install --frozen-lockfile, bun run typecheck, bun run build, bun test
8. Do not create/change Vercel project settings
9. Do not deploy unless explicitly asked after Phase 0 report

---

## Return Format (Phase 0)

1. Files created
2. Framework/Bun setup summary
3. Existing server/API/provider files found: yes/no and paths only
4. Any files that should not be in the clean repository
5. Typecheck/build/test results
6. BUILD_CLEAN: yes/no
7. One next ticket only: REBUILD-002 — Minimal health route (only if BUILD_CLEAN is yes)
8. Anything not verified

---

## Product Rules (Recorded, Not Implemented)

See `docs/PRODUCT.md` for full product rules including:
- Demo vs real data boundaries
- Persistent data requirements
- Access boundaries (Featured ≠ Pro, Contact visibility, etc.)
- Future Pro benefits
- Sponsor model
- Community Initiatives rules

---

## Environment Variables (Reference Only — Do Not Add)

```
APP_URL=https://playavida.org/
TEABLE_API_BASE=https://app.teable.ai/api
TEABLE_API_URL=https://app.teable.ai/api
TEABLE_API_KEY=<secret>
TEABLE_BASE_ID=bseeZUvNX8unS2KrzOE
STRIPE_SECRET_KEY=<secret>
STRIPE_WEBHOOK_SECRET=<secret>
VITE_STRIPE_PUBLISHABLE_KEY=<public>
RESEND_API_KEY=<secret>
EMAIL_FROM=PlayaVida <support@playavida.org>
OTP_SECRET=<secret>
AUTH_SECRET=<secret>
SESSION_SECRET=<secret>
SUPERADMIN_EMAILS=mike@dynamicmike.com,dynamicmike@gmail.com
```

---

## Stripe Webhook

- Destination: `https://playavida.org/api/stripe/webhook`
- Dashboard ID: `we_1UJKyxGe9hhLYer6dGZhfJSg`

---

## Resend

- Logged in with: `playavidalife@gmail.com`
- Domain verified: `playavida.org`
- OTP email: `support@playavida.org`