# Architecture Rules (NON-NEGOTIABLE)

## R1. Zero location hardcoding
No place names (city, state, region, country), currencies, phone formats, legal text, brand names, colours, keywords or FAQs in code. All come from the Tenant Settings store (superadmin-editable). Lint check: grep source for known place names before every release.

## R2. Everything bilingual (EN/ES), extensible
All user-facing strings use i18n keys. Settings fields have `_en` and `_es` variants (or a locale map) so a licensee can add a third language.

## R3. One tenant = one config
Each licensee instance has its own Tenant Config. Decision pending: separate Teable base per licensee (simpler data ownership, recommended at first) vs shared base with tenant_id.

## R4. Intro page is real, indexable content
Own route (/welcome), server-rendered/static HTML, crawlable. The app lives at /app. "Skip intro" is a per-user preference (cookie/localStorage + account flag); crawlers always see the intro. Footer link re-opens it.

## Superadmin Settings tree
- Brand: name, logo, colours, fonts, tagline (EN/ES), favicon, app icon
- Geography: area name, region, country, timezone, currency, map centre, service-area list
- Legal: privacy, T&C, disclaimer, cookie text, contact for data requests (EN/ES, versioned)
- SEO: title/meta per page, keywords (EN/ES), OG image, canonical domain, sitemap toggles
- AEO: Q&A library (question, short answer 40-60 words, long answer, language, page)
- GEO: entity facts (who/what/where), service areas, sameAs links, citations, schema.org JSON-LD generator, llms.txt (optional)
- Intro page: sections, order, CTA labels, language switch, install prompt, "never show again"
- Notifications: categories, tag taxonomy, frequency caps, sponsor labelling rules
- Social automation: connected accounts, templates, on/off per content type
- Monetisation: Pro tier definitions, prices, Stripe keys reference (never in client)
- Moderation: rules, report queue, banned terms
- Impact tracker: metrics definitions and manual entries

## App tree
/welcome (intro, SEO) | /app (home, discover, groups, events, businesses, impact, profile) | /b/{slug} (business mini-site) | /newsletter (preferences) | /admin (super-admin) | /legal/{privacy|terms|disclaimer}

## Teable additions (draft)
Users: +interests[], +languages[], +stay_type, +notif_opt_in{push,email,categories}, +consent_timestamp, +consent_version
Tags: id, name_en, name_es, category
Notification_Campaigns: advertiser_id, type (event/business/group/sponsor), audience_filter (JSON), status, scheduled_for, paid_ref, sent_count, opens, clicks
Social_Queue: source_record, platform, caption_en/es, image, status, posted_url
Tenant_Settings: key, value_en, value_es, group
