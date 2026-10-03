# Google AI Studio Prompts (Build mode)
How to use: open AI Studio > Build. Paste the MASTER CONTEXT first, then ONE prompt (A1, A2...) at a time, in order.
Placeholders in {{double braces}} come from superadmin/tenant settings.

## 0. MASTER CONTEXT (paste first, any tool)
You are building a community platform ("the Platform") for local residents, nomads and small businesses. It will be cloned for other regions, so:
1. ZERO hardcoding of place names, region, country, currency, brand, legal text, keywords, FAQs or colours. All come from a Tenant Settings store editable in a super-admin dashboard.
2. Every user-facing string is bilingual (EN/ES) via i18n keys; design so a third language can be added.
3. Data lives in Teable (one separate base per tenant). Secrets (Stripe, API keys) never in client code.
4. Marketing channel is a Weekly Magazine inside the user profile, plus email digest linking to it. Web push is optional.
5. Sponsored/partner items are always labelled "Partner offer / Oferta de socio" but framed as an opportunity: "Be first to know about offers and rewards from local businesses."
6. Consent: marketing opt-in is unticked by default, separate from T&C, logged with timestamp + consent version + channel, withdrawable from profile.
7. Never invent facts, listings or statistics. Unknown = show empty state or flag "needs input".
8. Output production-ready, accessible (WCAG AA), mobile-first PWA code.

---
## A. GOOGLE AI STUDIO (Build mode): app prompts

### A1. Foundation: tenant config + i18n layer
Build the foundation layer before any feature. Create (1) a TenantSettings service that loads all settings by group (brand, geography, legal, seo, aeo, geo, intro, notifications, monetisation, impact) from the data API, with EN/ES values and in-memory caching; (2) an i18n helper t(key) with fallback to the other language and a visible "missing translation" marker in dev; (3) a build-time lint script that fails if source contains any string from a banned list loaded from settings (place names, brand name). Provide mock settings JSON using obviously fake values ("Demo City", "Demo Brand") to prove nothing is hardcoded. Show the folder tree and explain each file in one line.

### A2. Intro page (/welcome)
Create a standalone, fast, indexable intro page at /welcome, rendered entirely from TenantSettings.intro, seo, aeo and geo. Sections in settings-defined order: hero (tagline), who it's for (residents, nomads, businesses), how it works, Be-First-to-Know magazine teaser, community impact counter, FAQ accordion, final CTA. TOP and BOTTOM bars both contain: language switch (EN/ES), Install App button (PWA beforeinstallprompt, with iOS add-to-home-screen instructions fallback), and a "Don't show this again" toggle (stores preference in localStorage and, if logged in, on the profile). Footer link "Show intro again" clears it. Crawlers and first-time visitors always get the full content; only returning users with the preference are redirected to /app client-side. Inject JSON-LD (Organization, WebSite, FAQPage from the AEO library) and hreflang alternates, canonical, OG tags, all from settings. Add a settings-driven "answer block" under the hero: a 50-word plain-language definition of what the Platform is and where it operates (for answer engines).

### A3. Super-admin dashboard
Build /admin with role check (super-admin only). Sections: Brand, Geography, Legal (privacy, T&C, disclaimer, cookie, ARCO-rights text, each versioned with a "publish new version" action that forces re-consent when marked material), SEO (per-page title/meta/keywords EN/ES with length counters), AEO (Q&A library: question, 40-60 word short answer, long answer, page assignment), GEO (entity facts, service areas, sameAs links, schema preview, llms.txt generator), Intro page builder (reorder/enable sections), Notifications and Magazine rules, Social automation, Monetisation tiers, Moderation, Impact metrics, Pilot KPIs (targets editable). Every field has an EN and ES input, a "needs translation" badge, and an audit log of who changed what.

### A4. Weekly Magazine library (profile tab)
Add a "My Magazines" tab in the user profile dashboard. Show a library of weekly issues (cover, date, headline items), reading view with sections: Featured Offers & Rewards ("Be first to know"), Events this week, New businesses, Community impact, Groups to join. Offers have: business, discount/reward text, valid-from/to, redemption method (show code / loyalty stamp), and a "Partner offer" label styled as a badge. Personalise item ORDER (never hide the label) using the user's interest tags. Include: expiry handling (hide expired deals, keep the issue in the archive), "save offer" and "redeem" actions, per-issue share link (public teaser version without redeemable codes for SEO), and an empty state. Data from Teable tables Issues, Issue_Items, Deals.

### A5. Registration consent audit
Review the existing registration flow and fix to this spec without changing visual design: marketing checkbox unticked by default, separate from the T&C acceptance, plain-language text from settings, link to privacy notice modal; on submit store consent_marketing {channel: magazine/email/push, granted, timestamp, consent_version, source: "registration"}; profile page shows current status with toggle to withdraw (writes a new log row, never overwrites). Output a pass/fail checklist and the diff.

### A6. Footer legal modal
Add footer links opening an accessible modal (focus trap, ESC close, EN/ES toggle) with tabs: Privacy Notice, Terms, Disclaimer, Your Data Rights (Access, Rectification, Cancellation, Opposition: how to request, contact email and response time from settings), Marketing Consent (current status + withdraw). All text from versioned Legal settings. Show "Last updated {{date}} / version {{n}}". Seed with clearly marked DRAFT placeholder text: "Draft: requires legal review before launch."

### A7. Business Pro tier + loyalty (Stripe prep)
Add Pro UI to business profile forms: plan comparison table from Monetisation settings, "Pro" badge, locked-feature states with upgrade CTA, Stripe Checkout/Customer Portal redirect via server endpoint (stub with TODO), webhook handler skeleton updating the business's plan in Teable. Loyalty: stamp-card or points per business with QR/redeem code, configurable per business by Pro owners. Never expose secret keys client-side.

### A8. AI Concierge
Build a bilingual chat concierge using the Gemini API server-side. It must ONLY recommend entities returned by a Teable query (grounding): first extract intent (mood, time, budget, area, group size), then query, then answer with 3 max results, each with a link. If no results: say so and suggest broadening. Respect user language, never invent opening hours or prices, log unanswered queries to a "Demand_Gaps" table (feeds business-recruitment).

### A9. Impact tracker
Dashboard section driven by Impact_Events: cumulative totals, per-event cards, monthly chart, shareable image card. Metric definitions (kg collected, volunteers, hours) come from settings. Mark manual vs verified entries.

### A10. Hardcode & quality audit
Audit the entire codebase: list every hardcoded location name, brand string, currency, legal text, colour token, EN-only string, and any secret in client code. Group by file, propose the settings key for each, and output a patch.
