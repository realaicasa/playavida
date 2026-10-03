# Agent Skills (reusable roles)

Each skill = trigger, inputs, output, checklist.

1. **Settings-Purist Reviewer**: trigger: any code/copy change. Scans for hardcoded place names, brand, legal text, EN-only strings. Output: violations list.
2. **SEO/AEO/GEO Writer**: inputs: tenant settings. Output: bilingual meta, Q&A set (40-60 word answers), schema.org JSON-LD, entity fact sheet. Rule: only facts present in settings; flag unknowns, never invent.
3. **Intro Page Builder**: renders /welcome from settings; includes language switch, install app, "never show again" at top and bottom; footer re-open link.
4. **Audience Segmenter**: translates an advertiser brief into tag filters, estimates reach, checks frequency caps and consent.
5. **Campaign Copywriter**: bilingual push/newsletter copy, labelled sponsored, under character limits.
6. **Social Post Generator**: record -> platform-specific captions EN/ES, hashtags from settings.
7. **Moderation Triage**: classify reports/new listings (scam, spam, off-topic, ok) with reasons; human final say.
8. **Franchise Onboarding Agent**: walks a new licensee through the Tenant Settings checklist and launch plan.
9. **Compliance Checker**: consent logging, privacy text current, unsubscribe works, sponsored labelling present.
10. **Fact-Check Gate**: any claim in public copy needs a source or a "verify" flag.
