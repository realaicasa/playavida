# SCHEMA.md — PlayaVida Data Schema (Teable Foundation)

## Overview
67-table Teable data foundation. This documents the core entities relevant to the frontend.

## Core Entities

### Users & Identity
| Table | Key Fields |
|-------|------------|
| `tbl_users` | `id`, `public_reference` (USR-PDC-XXXX), `email`, `selected_language`, `role`, `created_at` |
| `tbl_profiles` | `user_id`, `public_username`, `display_name`, `bio`, `avatar_url`, `profile_visibility`, `tags`, `social_links`, `preferred_location` |
| `tbl_privacy` | `user_id`, `public_profile_visible`, `reviews_visible`, `groups_visible`, `event_activity_visible`, `contact_permissions`, `personalized_recommendations`, `social_incentives`, `marketing_email`, `marketing_whatsapp` |
| `tbl_user_blocks` | `id`, `blocker_user_id`, `blocked_entity_type`, `blocked_entity_id`, `created_at` |

### Businesses
| Table | Key Fields |
|-------|------------|
| `tbl_businesses` | `id`, `business_reference` (BUS-PDC-XXXX), `name`, `slug`, `category`, `location_code`, `description_es/en`, `cover_url`, `logo_url`, `gallery_urls`, `services[]`, `languages[]`, `price_tier`, `opening_hours_summary`, `amenities[]`, `payment_methods[]`, `instagram_handle`, `facebook_url`, `linkedin_url`, `website_url`, `email_address`, `whatsapp_number`, `special_offer`, `tags[]`, `seo_*`, `faqs[]`, `status` (draft/published/archived/suspended), `has_contact_enabled`, `has_active_offers`, `has_loyalty_program`, `created_by_user_id`, `created_at` |
| `tbl_business_private_contacts` | `business_id`, `address`, `city`, `latitude`, `longitude`, `phone`, `email`, `whatsapp`, `website`, `booking_url`, `opening_hours[]`, `updated_at` |
| `tbl_business_subscriptions` | `id`, `business_id`, `plan_key` (free/starter_contact/pro_community/premium_sponsorship), `plan_name_es/en`, `monthly_price_mxn`, `status` (active/grace_period/pending_oxxo/expired/canceled), `current_period_start/end`, `grace_period_end`, `oxxo_reference`, `oxxo_expires_at`, `payment_method` |

### Events
| Table | Key Fields |
|-------|------------|
| `tbl_events` | `id`, `event_reference` (EVT-PDC-XXXX), `creator_user_id`, `organizer_business_id`, `organizer_group_id`, `community_group_id`, `organizer_name`, `location_code`, `title_es/en`, `description_es/en`, `category`, `image_url`, `start_at`, `end_at`, `timezone`, `event_location_label`, `venue_name`, `street_address`, `map_url`, `latitude`, `longitude`, `paid_status`, `price_label`, `cost_amount`, `cost_currency`, `ticket_url`, `registration_url`, `capacity`, `dress_code`, `age_policy`, `tags[]`, `special_instructions`, `sponsors[]`, `status`, `created_at` |

### Groups
| Table | Key Fields |
|-------|------------|
| `tbl_groups` | `id`, `group_reference` (GRP-PDC-XXXX), `owner_user_id`, `location_code`, `name_es/en`, `description_es/en`, `objectives_es/en`, `guidelines_es/en`, `cover_url`, `visibility` (public/private/restricted), `join_policy` (open/approval/invitation), `member_count`, `tags[]`, `faqs[]`, `whatsapp`, `instagram`, `facebook`, `website`, `category`, `meeting_frequency`, `primary_language`, `vibe`, `chat_link`, `max_members`, `status`, `source_language`, `translation_status`, `created_at` |

### Loyalty
| Table | Key Fields |
|-------|------------|
| `tbl_loyalty_programs` | `id`, `program_reference` (LOY-PDC-XXXX), `business_id`, `business_name`, `location_code`, `name_es/en`, `description_es/en`, `stamps_required_base`, `reward_tiers[]`, `bonus_features[]`, `active`, `staff_limit`, `created_at` |
| `tbl_loyalty_cards` | `id`, `user_id`, `program_id`, `business_id`, `business_name`, `stamps_count`, `total_lifetime_stamps`, `available_vouchers[]`, `completed_bonuses[]`, `joined_at` |
| `tbl_loyalty_ledger` | `id`, `transaction_reference` (TXN-PDC-XXXX), `idempotency_key`, `program_id`, `business_id`, `customer_user_id`, `staff_id`, `staff_name`, `event_type` (stamp_awarded/reward_redeemed), `amount`, `metadata`, `created_at` |

### Sponsors
| Table | Key Fields |
|-------|------------|
| `tbl_sponsors` | `id`, `sponsor_reference` (SPO-PDC-XXXX), `organization_name`, `headline_es/en`, `description_es/en`, `cta_label_es/en`, `destination_url`, `image_url`, `placement_type` (home_featured/event_banner), `is_sponsored`, `active`, `status` |

### Reports
| Table | Key Fields |
|-------|------------|
| `tbl_reports` | `id`, `report_reference` (RPT-PDC-XXXX), `reporter_user_id`, `reporter_reference`, `target_entity_type`, `target_reference`, `target_name`, `reason`, `description`, `content_snapshot`, `status` (open/reviewing/actioned/dismissed), `created_at` |

### Analytics & Social
| Table | Key Fields |
|-------|------------|
| `tbl_contact_analytics` | `id`, `business_id`, `event_type`, `field_key`, `language`, `created_at` |
| `tbl_group_members` | `group_id`, `user_id[]` |
| `tbl_organizer_follows` | `organizer_key`, `user_id[]` |
| `tbl_broadcast_campaigns` | `id`, `campaign_reference`, `owner_user_id`, `target_type`, `target_id`, `target_name`, `title`, `message`, `target_segment`, `recipient_count`, `plan_price_mxn`, `payment_method`, `status`, `created_at`, `sent_at` |

## TypeScript Interfaces
All interfaces defined in `src/types/index.ts`:
- `User`, `PersonalProfile`, `PrivacyPreferences`, `UserBlock`
- `PublicBusinessProjection`, `PrivateBusinessContactDetails`, `BusinessSubscription`
- `CommunityEvent`, `CommunityGroup`, `EventSponsor`
- `BusinessReview`, `BusinessOffer`
- `SponsorCampaign`
- `NativeLoyaltyProgram`, `StaffAccount`, `CustomerLoyaltyCard`, `LoyaltyLedgerTransaction`, `LoyaltyBonusFeature`, `RewardTier`
- `UniversalReport`, `ContactAnalyticsEvent`
- `BroadcastCampaign`

## Projection Rules
- **Public**: `PublicBusinessProjection` — no private contacts
- **Owner**: Full `PrivateBusinessContactDetails` access
- **Entitled visitor**: `PrivateBusinessContactDetails` if authenticated + active subscription
- **TeableAdapter** (`src/lib/teableAdapter.ts`): Single projection implementation