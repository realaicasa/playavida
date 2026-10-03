# Teable Prompts (AI Chat / manual build)
How to use: open your tenant Teable base > AI Chat. Paste the MASTER CONTEXT first, then ONE prompt (B1, B2...) at a time. Check each result before the next.
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
