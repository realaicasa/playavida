# Google Antigravity Prompts, Rules, Workflows, Skills
How to use: create the rule/workflow/skill FILES at the paths shown (C0-C3), then paste the task prompts (C4, C5) into the agent/Manager view.
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
