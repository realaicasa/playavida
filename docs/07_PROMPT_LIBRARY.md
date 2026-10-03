# PlayaVida Prompt Library
Tools: Google AI Studio (Build) | Teable (AI Chat, AI fields, automations) | Google Antigravity (agentic IDE)
Placeholders in {{double braces}} come from superadmin/tenant settings: never type real place names into code.
Always paste the MASTER CONTEXT first in a new session.

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

---
## B. TEABLE: AI Chat / manual build prompts
(Teable has AI chat, AI fields and automations triggered by record changes, schedules and webhooks; some AI and automation features may depend on your plan or edition: check before relying on them.)

### B1. Core schema (one base per tenant)
Create tables and fields: Tenant_Settings (group, key, value_en, value_es, version, updated_by). Users (name, email, language, interests [link to Tags, multi], stay_type [resident/nomad/visitor], areas [multi-select], role, created, marketing_consent_status [lookup from Consent_Log latest]). Businesses (name, slug, owner [link Users], category [link Tags], description_en/es, plan [Free/Pro], verified [checkbox], verification_date, status [Draft/Pending/Approved/Rejected], created). Events and Groups (title_en/es, organiser [link], tags, starts, ends, location, status, cover). Reviews/reports, Reports (target, reason, status).

### B2. Tags and audience segmentation
Create Tags (name_en, name_es, category [activity/lifestyle/wellness/food/eco/other], active). Add many-to-many links from Users, Businesses, Events, Groups. Build views: "Audience Builder" filtered by tag + stay_type + language + consent=granted; add a rollup/count so I can see reach per tag. Add a formula field "Engagement score" combining last_active recency and magazine opens. Explain what must be done via API/script if view filters cannot express a combined AND/OR audience.

### B3. Magazine tables
Create Issues (issue_no, title_en/es, week_start, status [Draft/Scheduled/Published], cover, public_teaser_slug). Deals (business [link], title_en/es, type [discount/reward/free-gift/early-access], terms_en/es, valid_from, valid_to, redemption [code/stamp/qr], code, max_redemptions, redeemed_count, sponsored [checkbox], status, is_active [formula: today between valid dates and status=Approved and redeemed<max]). Issue_Items (issue [link], deal/event/business/group [links], section, position, label_text [formula: if sponsored then "Partner offer / Oferta de socio"]). Add rollups: items per issue, deals per business.

### B4. Consent and compliance
Create Consent_Log (user, channel, granted [checkbox], timestamp, consent_version, source, ip_hash). Append-only: restrict edit permissions to automation/service account. Add Legal_Versions (doc_type, version, published_at, material_change [checkbox]). Add a view "Needs re-consent" = users whose latest consent_version < latest material version. Add Data_Requests (user, type [Access/Rectification/Cancellation/Opposition], received, due_date [formula received+X days from settings], status, notes).

### B5. Campaigns and paid slots
Create Advertisers (name, type [business/organiser/group admin/sponsor], contact, Stripe_customer_id). Slots (issue, section, price, capacity). Bookings (advertiser, slot, creative_en/es, audience_tags [link], estimated_reach [rollup], status [Requested/Approved/Paid/Published], paid_ref). Results (booking, impressions, clicks, redemptions) with formulas for CTR and redemption rate.

### B6. Automations (verify availability on your plan)
1. When Business/Event/Group status changes to Approved -> create Social_Queue row (platform per setting, caption_en/es via AI field, image, status Draft).
2. Weekly (day/time from settings): assemble next Issue draft from active Deals and upcoming Events matching tags; set status Draft and notify admin.
3. Daily: set Deals past valid_to to Expired.
4. When Reports reach N for a target -> flag for moderation.
5. When Data_Requests created -> notify admin and set due date.
6. Webhook out to the app on Issue Published (to send email digest).

### B7. AI fields
Add AI fields: (a) description_es from description_en and vice versa; (b) social caption (platform-specific, under length limits, no invented facts); (c) tag suggestion from description (output only existing Tag names); (d) moderation triage (Scam/Spam/Off-topic/OK + one-line reason). All AI output lands in a "suggested" field; a human approves into the live field.

### B8. Data quality
Add formula/health fields: missing_translation, stale (not updated in 180 days), duplicate-suspect (same phone/URL/name similarity), unverified. Build a "Data Health" view per table and a weekly summary count.

### B9. Tenant template
Prepare this base as a TEMPLATE: strip demo data, keep schema, views, automations, and a seed Tenant_Settings with empty placeholders. Add a "Launch checklist" table (task, owner, done) covering settings completion, legal review, Stripe, domain, social accounts.

---
## C. GOOGLE ANTIGRAVITY
(Rules go in .agents/rules/ [12,000-char limit per file], skills in .agents/skills/<name>/SKILL.md, workflows in .agents/workflows/ as slash commands. The older .agent/ folder still works but .agents/ is the current default.)

### C0. Rule: .agents/rules/00-constitution.md (Always On)
# Platform Constitution
- Never hardcode place names, brand, country, currency, legal text, SEO keywords, FAQs or colours. Read from TenantSettings. If a value is missing, add a settings key and an empty-state, do not insert a literal.
- All UI strings via i18n keys with EN and ES. Never ship a key without both.
- Secrets never in client code or committed files; use env vars.
- Marketing consent: unticked by default, separate from T&C, logged (timestamp, version, channel), withdrawable. Never send marketing to users without a granted latest consent row.
- Sponsored items always labelled "Partner offer / Oferta de socio".
- Never invent data, statistics, listings or legal claims. Flag "needs input".
- Public pages (/welcome, /b/{slug}, magazine teasers) must be server-rendered or static, with canonical, hreflang and JSON-LD.
- Before finishing any task: run the lint for banned strings, run tests, list what you did not verify.

### C1. Workflow: .agents/workflows/hardcode-audit.md
# /hardcode-audit
1. Load banned-string list from tenant settings (or mock file).
2. Search source, templates, seed data, tests and meta files for banned strings, currencies, country names, hex colours outside tokens, and EN-only literals in UI.
3. Output a table: file, line, offending text, proposed settings key.
4. Apply fixes, re-run, and report remaining violations.

### C2. Workflow: .agents/workflows/release-check.md
# /release-check
1. Run hardcode-audit. 2. Run unit and e2e tests. 3. Verify consent flow with the browser agent (register with box unticked -> no consent row; tick -> row with version; withdraw -> new row). 4. Check /welcome has one H1, JSON-LD validates, hreflang pairs, Lighthouse mobile >= targets in settings. 5. Check legal modal shows current version. 6. Produce a pass/fail report with screenshots.

### C3. Skills to create (folder, then SKILL.md with name + description frontmatter)
- tenant-config: add or change settings keys safely.
- seo-aeo-geo: generate bilingual meta, 40-60 word answers, JSON-LD, entity sheet from settings only.
- magazine-builder: compile weekly issue from Teable, enforce labels, expiry, teaser export.
- consent-compliance: consent log, versioning, ARCO request handling.
- social-automation: caption templates, queue states, platform limits.
- teable-ops: schema changes, view/automation conventions, API usage.
- moderation-triage: classification rubric and escalation.

SKILL.md template:
---
name: seo-aeo-geo
description: Use when creating or editing SEO, AEO (Q&A answers) or GEO (entity/location facts, schema.org) content for any page. Generates bilingual output strictly from tenant settings.
---
## Steps
1. Read relevant settings groups. 2. Draft EN then ES (natural, not literal). 3. Answers 40-60 words, direct first sentence. 4. Emit JSON-LD. 5. List any facts you could not source as "needs input".
## Constraints
Do not invent facts. Do not insert place names that are not in settings.

### C4. Multi-agent build tasks (Manager view)
Task 1 (Foundation agent): Implement A1 (settings service, i18n, banned-string lint). Done when mock tenant "Demo City" renders with zero literals.
Task 2 (Intro agent): After Task 1, implement A2. Validate JSON-LD, hreflang, install prompt, don't-show-again and footer re-show link.
Task 3 (Magazine agent): After Task 1, implement A4 against mock data, then wire Teable.
Task 4 (Compliance agent): Implement A5/A6 and write e2e tests for the consent flow.
Task 5 (Reviewer agent, independent): Review all diffs against the constitution; do not edit, only report violations.
Each agent must produce an artifact summary: what changed, how verified, what remains.

### C5. Browser-agent test prompt
Open the app in a fresh session. Register a new user without ticking the marketing box; confirm no marketing consent granted. Register another with the box ticked; confirm a consent record with version and timestamp. Open profile, withdraw, confirm a new log row. Switch language to ES mid-flow and confirm all strings are translated. Report failures with screenshots.
