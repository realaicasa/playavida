# OPEN_RISKS.md — PlayaVida Open Risks & Unknowns

## Technical Risks

### RISK-001: Bun Not Available in CI/CD
**Severity**: High
**Status**: Open
**Description**: Bun is required per package.json but not installed on this development system. Vercel supports Bun but version alignment needed.
**Mitigation**: Verify Bun version in Vercel settings. Document required version in `package.json` engines field.

### RISK-002: Teable API Stability
**Severity**: Medium
**Status**: Open
**Description**: Teable is early-stage. API changes could break projection layer. 67-table schema is large.
**Mitigation**: Pin Teable API version. Comprehensive projection tests. Adapter pattern isolates changes.

### RISK-003: Stripe OXXO Integration Complexity
**Severity**: Medium
**Status**: Open
**Description**: OXXO cash vouchers require 48-hour expiry handling, webhook reconciliation, Mexican tax compliance.
**Mitigation**: Use Stripe's native OXXO PaymentIntent flow. Test extensively in sandbox.

### RISK-004: Resend Deliverability in Mexico
**Severity**: Medium
**Status**: Open
**Description**: Email deliverability to Mexican domains (Telmex, Prodigy, Gmail MX) untested at scale.
**Mitigation**: Domain authentication (DKIM/DMARC/SPF) verified. Monitor bounce/complaint rates. WhatsApp OTP fallback planned.

### RISK-005: PWA Service Worker Caching Conflicts
**Severity**: Low
**Status**: Open
**Description**: `vite-plugin-pwa` Workbox may cache API responses incorrectly if not configured for dynamic routes.
**Mitigation**: Configure `navigateFallbackDenylist` for API routes. Test offline/online transitions.

## Product Risks

### RISK-006: Community Initiative Legal Exposure
**Severity**: High
**Status**: Open
**Description**: "Community Initiative" label may imply charity verification. No legal verification performed.
**Mitigation**: Clear disclaimer: "No claim of legal charity verification or endorsement." Superadmin approval required. Owner can revoke anytime.

### RISK-007: Contact Data Privacy (Mexico LFPDPPP)
**Severity**: High
**Status**: Open
**Description**: Mexican Federal Law on Personal Data Protection (LFPDPPP) requires explicit consent for contact data processing.
**Mitigation**: Privacy preferences granular. Contact details only with opt-in + entitlement. Data processing agreement with Teable.

### RISK-008: Demo Data Confusion in Production
**Severity**: Medium
**Status**: Open
**Description**: If demo data leaks to production, users may trust fictional listings.
**Mitigation**: Strict `isDemo` flags. Production API returns empty arrays. Visual "Demo" badges. Contract in DEMO_DATA_AND_REAL_DATA_CONTRACT.md.

### RISK-009: Loyalty Staff PIN Security
**Severity**: Medium
**Status**: Open
**Description**: PIN codes (4-digit) vulnerable to brute force. No rate limiting in Phase 0 mock.
**Mitigation**: Server-side rate limiting (5 attempts/minute). Lockout after 10 failures. Audit log in ledger.

### RISK-010: WhatsApp Business API Approval
**Severity**: Medium
**Status**: Open
**Description**: Meta Business API requires approval for OTP templates. Timeline unpredictable.
**Mitigation**: Email OTP as primary. WhatsApp as enhancement. Start approval process early.

## Operational Risks

### RISK-011: Superadmin Bottleneck
**Severity**: Medium
**Status**: Open
**Description**: Community Initiative approvals, affiliate sponsor management require superadmin action. Only 2 superadmin emails configured.
**Mitigation**: Build superadmin dashboard early. Consider delegated moderation roles.

### RISK-012: Teable Cost at Scale
**Severity**: Low
**Status**: Open
**Description**: Teable pricing for 67 tables + API calls at production volume unknown.
**Mitigation**: Monitor usage. Evaluate self-hosted Teable or direct PostgreSQL if cost-prohibitive.

## Unknowns (Require Investigation)

### UNKNOWN-001: Vercel Bun Support Version
**Question**: What Bun version does Vercel use? Does it match `bun.lock`?

### UNKNOWN-002: Teable Real-time Subscriptions
**Question**: Does Teable support WebSocket subscriptions for live updates? Needed for loyalty stamps, group joins.

### UNKNOWN-003: Stripe Mexico Tax Compliance
**Question**: Does Stripe handle IVA/IEPS automatically for Mexican subscriptions? Or manual calculation needed?

### UNKNOWN-004: PWA Install Prompt Timing
**Question**: Optimal timing for `beforeinstallprompt` in this user journey? After 2+ sessions?

### UNKNOWN-005: Image Optimization Strategy
**Question**: Vercel Image Optimization vs Cloudinary vs self-hosted? Unsplash CDN currently used.

### UNKNOWN-006: Analytics Platform
**Question**: PostHog, Mixpanel, or custom? Contact modal analytics required for Pro tier.

### UNKNOWN-007: Error Monitoring
**Question**: Sentry, LogRocket, or custom? Required for production debugging.

### UNKNOWN-008: Load Testing Baseline
**Question**: Expected concurrent users at launch? Teable/Stripe/Resend rate limits?