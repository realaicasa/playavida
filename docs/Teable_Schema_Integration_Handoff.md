# Schema_Integration_Handoff

Read-only schema snapshot for the existing PlayaVida base `bseeZUvNX8unS2KrzOE`. Captured from table and field metadata on 2026-10-01. No record data was read for this inventory. No operational resource was changed.

Scope: 117 tables; 2009 fields. Field IDs, types, select choices and link targets in the appendix are the canonical integration mapping at capture time.

The Write owner and Read audience columns are **proposed minimum-privilege application contracts**, not verified Teable permissions. A raw table must not be exposed merely because a public projection exists. `unknown / needs decision` is intentional where product ownership is not clear.

## Table inventory

| Table name | Table ID | Purpose | Key fields | Field types | Links/relations | Select options | Write owner | Read audience | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Locations | `tblvc9P1eUHidtcW4tH` | Locations records/configuration | `location_id`, `location_code`, `reference`, `name_es`, `name_en` | singleLineText, singleSelect, createdTime, lastModifiedTime, link | 54 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| NearbyLocationRelationships | `tblebCLYkMXlJyuP2Xh` | Nearby Location Relationships records/configuration | `relationship_id`, `relationship_type`, `sort_order`, `active`, `created_at` | singleLineText, singleSelect, number, checkbox, createdTime, link | 2 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| Users | `tblB6Wiwy4KOx3Tjgui` | Users records/configuration | `user_id`, `public_reference`, `email`, `email_verified`, `account_status` | singleLineText, checkbox, singleSelect, date, createdTime, lastModifiedTime, link | 77 links; see appendix | 5 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| PersonalProfiles | `tblLPvqsTYbSeHqbO88` | Personal Profiles records/configuration | `personal_profile_id`, `public_username`, `display_name`, `bio`, `avatar_url` | singleLineText, longText, singleSelect, createdTime, lastModifiedTime, link | 1 link; see appendix | 2 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| UserPrivacyPreferences | `tblBqY7HYRNqX0fFLQY` | User Privacy Preferences records/configuration | `preference_id`, `public_profile_visible`, `reviews_visible`, `group_memberships_visible`, `event_activity_visible` | singleLineText, checkbox, singleSelect, lastModifiedTime, link | 1 link; see appendix | 1 select; see appendix | approved server API | authenticated user own records only | Marketing consent must be separate, versioned and withdrawable. |
| Businesses | `tbl8IOboEGdwYHqJck2` | Businesses records/configuration | `business_id`, `business_reference`, `name`, `category`, `description_es` | singleLineText, longText, singleSelect, date, createdTime, lastModifiedTime, link, checkbox | 42 links; see appendix | 10 selects; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| BusinessContactDetails | `tbltUE83U9V7QTWqA1T` | Business Contact Details records/configuration | `contact_id`, `address`, `city`, `region`, `latitude` | singleLineText, number, longText, singleSelect, lastModifiedTime, link | 1 link; see appendix | 1 select; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| BusinessManagers | `tblBZ0dELDl3z7gTTOw` | Business Managers records/configuration | `manager_id`, `role`, `permissions_json`, `status`, `created_at` | singleLineText, singleSelect, longText, createdTime, lastModifiedTime, link | 2 links; see appendix | 2 selects; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| BusinessMedia | `tblNDTuVfCgJZyUsB8Y` | Business Media records/configuration | `media_id`, `media_type`, `media_url`, `alt_text`, `sort_order` | singleLineText, singleSelect, number, createdTime, lastModifiedTime, link | 2 links; see appendix | 3 selects; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| EntityReferences | `tbl65eT3PEGL66qJzjj` | Entity References records/configuration | `entity_reference_id`, `reference`, `entity_type`, `entity_id`, `location_code` | singleLineText, singleSelect, longText, createdTime | 0 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| QRIdentities | `tblSBIa2tbHlaHJkAVC` | QRIdentities records/configuration | `qr_id`, `qr_reference`, `entity_type`, `entity_id`, `destination_path` | singleLineText, singleSelect, number, createdTime, lastModifiedTime | 0 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| Reports | `tblMXJBJkxwtugJKI9o` | Reports records/configuration | `report_id`, `report_reference`, `target_entity_type`, `target_entity_id`, `target_reference` | singleLineText, singleSelect, longText, createdTime, lastModifiedTime, date, link | 4 links; see appendix | 4 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| AnalyticsEvents | `tblIC6qV8KN4MzzGXtb` | Analytics Events records/configuration | `analytics_event_id`, `event_type`, `entity_type`, `entity_id`, `entity_reference` | singleLineText, singleSelect, longText, createdTime, link | 3 links; see appendix | 3 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| BusinessFeatureEntitlements | `tblxdmuLBv4TLP5KDVE` | Business Feature Entitlements records/configuration | `entitlement_id`, `feature_key`, `status`, `source`, `starts_at` | singleLineText, singleSelect, date, createdTime, lastModifiedTime, link | 2 links; see appendix | 3 selects; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| BusinessPlans | `tblfB89TSYURsaZ267N` | Business Plans records/configuration | `plan_id`, `plan_key`, `name_es`, `name_en`, `billing_interval` | singleLineText, singleSelect, checkbox, createdTime, lastModifiedTime, link, number, longText | 4 links; see appendix | 2 selects; see appendix | superadmin manual | superadmin only | Legacy billing surface; confirm migration mapping before writes. |
| BusinessSubscriptions | `tbloyccWq6gEARYGLJH` | Business Subscriptions records/configuration | `subscription_id`, `stripe_customer_id`, `stripe_subscription_id`, `status`, `current_period_start` | singleLineText, singleSelect, date, checkbox, createdTime, lastModifiedTime, link | 3 links; see appendix | 3 selects; see appendix | unknown / needs decision | business owner own business only | Legacy billing surface; confirm migration mapping before writes. |
| PaymentEvents | `tbly21wpo66mG81LZHu` | Payment Events records/configuration | `payment_event_id`, `provider`, `external_event_id`, `event_type`, `status` | singleLineText, singleSelect, longText, date, createdTime, link | 1 link; see appendix | 2 selects; see appendix | unknown / needs decision | server only | Legacy billing surface; confirm migration mapping before writes. |
| ContactAnalyticsEvents | `tbl7QlJqX4pTlFV8PAv` | Contact Analytics Events records/configuration | `event_id`, `anonymous_session_id`, `event_type`, `field_key`, `language` | singleLineText, singleSelect, createdTime, link, longText | 4 links; see appendix | 3 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| EventCategories | `tbl8L4iHQCWMLBmCvSo` | Event Categories records/configuration | `category_id`, `name_es`, `name_en`, `slug`, `active` | singleLineText, checkbox, number, link | 1 link; see appendix | 0 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| Events | `tblOA1Eb39I2imf93JV` | Events records/configuration | `event_id`, `event_reference`, `title_es`, `title_en`, `description_es` | singleLineText, longText, date, number, singleSelect, createdTime, lastModifiedTime, link, checkbox | 16 links; see appendix | 9 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| EventManagers | `tblCCKm0CjWqllQyh4Z` | Event Managers records/configuration | `manager_id`, `role`, `permissions_json`, `created_at`, `updated_at` | singleLineText, singleSelect, longText, createdTime, lastModifiedTime, link | 2 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| EventQRIdentities | `tblob2Fc8FBUDbYbGf9` | Event QRIdentities records/configuration | `qr_id`, `qr_reference`, `destination_path`, `status`, `scan_count` | singleLineText, singleSelect, number, createdTime, lastModifiedTime, link | 1 link; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| EventAnalytics | `tblwKstzAdAZYtNrIEE` | Event Analytics records/configuration | `event_analytics_id`, `event_type`, `anonymous_session_id`, `language`, `metadata_json` | singleLineText, singleSelect, longText, createdTime, link | 3 links; see appendix | 2 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| Groups | `tblHILTdHKnZTaHRL3P` | Groups records/configuration | `group_id`, `group_reference`, `name_es`, `name_en`, `description_es` | singleLineText, longText, singleSelect, createdTime, lastModifiedTime, link, date, number, checkbox | 9 links; see appendix | 9 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| GroupMemberships | `tbloXopVSAHrEb16p3t` | Group Memberships records/configuration | `membership_id`, `role`, `status`, `joined_at`, `approved_at` | singleLineText, singleSelect, date, createdTime, lastModifiedTime, link | 2 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| Posts | `tblGAutYOeq09yHxIfo` | Posts records/configuration | `post_id`, `post_reference`, `content_es`, `content_en`, `media_json` | singleLineText, longText, singleSelect, createdTime, lastModifiedTime, link | 5 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| Comments | `tblJla61gciIKagESV2` | Comments records/configuration | `comment_id`, `comment_reference`, `content`, `status`, `created_at` | singleLineText, longText, singleSelect, createdTime, lastModifiedTime, link | 4 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| Follows | `tblWWTS1GCKsl0k5O67` | Follows records/configuration | `follow_id`, `target_entity_type`, `target_entity_id`, `status`, `created_at` | singleLineText, singleSelect, createdTime, link | 1 link; see appendix | 2 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| SavedEntities | `tblAhSbxUWsQH2oX2Io` | Saved Entities records/configuration | `save_id`, `entity_type`, `entity_id`, `created_at`, `entity_reference` | singleLineText, singleSelect, createdTime, link, lastModifiedTime | 1 link; see appendix | 2 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| Reviews | `tblKpxxGnkvVJbLLRbF` | Reviews records/configuration | `review_id`, `review_reference`, `rating`, `content`, `visibility` | singleLineText, rating, longText, singleSelect, createdTime, lastModifiedTime, link | 3 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| ReviewResponses | `tblhocc6wtg3ByqxASA` | Review Responses records/configuration | `response_id`, `content`, `status`, `created_at`, `updated_at` | singleLineText, longText, singleSelect, createdTime, lastModifiedTime, link | 3 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| UserBlocks | `tblC9DloBIgtRPaBefP` | User Blocks records/configuration | `block_id`, `blocked_entity_type`, `blocked_entity_id`, `reason`, `status` | singleLineText, singleSelect, createdTime, lastModifiedTime, link | 1 link; see appendix | 2 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| Notifications | `tbl556QiZgdJyJaa1zi` | Notifications records/configuration | `notification_id`, `type`, `entity_type`, `entity_id`, `message_key` | singleLineText, singleSelect, longText, date, createdTime, link | 2 links; see appendix | 2 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| Offers | `tblf2PeEIunfjiRaoVV` | Offers records/configuration | `offer_id`, `offer_reference`, `title_es`, `title_en`, `description_es` | singleLineText, longText, date, singleSelect, createdTime, lastModifiedTime, link, checkbox | 5 links; see appendix | 7 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| Sponsors | `tbld8kbsDB3c17XO5Dy` | Sponsors records/configuration | `sponsor_id`, `sponsor_reference`, `organization_name`, `description`, `logo_url` | singleLineText, longText, singleSelect, createdTime, lastModifiedTime, link, checkbox | 7 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| SponsorCampaigns | `tblrauOTshgT1dvx9sg` | Sponsor Campaigns records/configuration | `campaign_id`, `campaign_reference`, `placement_type`, `creative_json`, `targeting_json` | singleLineText, singleSelect, longText, date, createdTime, lastModifiedTime, link, number, checkbox | 10 links; see appendix | 5 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| SponsoredPlacements | `tblFcHe1WDlfp0UQadz` | Sponsored Placements records/configuration | `placement_id`, `surface`, `position`, `active`, `created_at` | singleLineText, checkbox, createdTime, lastModifiedTime, link, singleSelect | 2 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| MonetizationPaymentEvents | `tblRYvN9yW1mi6vl55C` | Monetization Payment Events records/configuration | `payment_event_id`, `provider`, `external_event_id`, `event_type`, `status` | singleLineText, singleSelect, date, createdTime, link | 2 links; see appendix | 2 selects; see appendix | unknown / needs decision | server only | Proposed ownership/audience; not verified Teable ACL. |
| OfferAnalytics | `tblAYgQlbcInI9iGuAI` | Offer Analytics records/configuration | `analytics_id`, `event_type`, `anonymous_session_id`, `language`, `created_at` | singleLineText, singleSelect, createdTime, link | 3 links; see appendix | 2 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| SponsorAnalytics | `tblONPlRsokLKoiQAgV` | Sponsor Analytics records/configuration | `analytics_id`, `event_type`, `anonymous_session_id`, `language`, `created_at` | singleLineText, singleSelect, createdTime, link | 3 links; see appendix | 2 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyPrograms | `tblo1JGtixvMWJuXHdP` | Playavida Loyalty Programs records/configuration | `program_id`, `program_reference`, `name_es`, `name_en`, `description_es` | singleLineText, longText, singleSelect, number, createdTime, lastModifiedTime, link, date, checkbox | 20 links; see appendix | 14 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyRewards | `tbl1hAqY1edir4G4tTH` | Playavida Loyalty Rewards records/configuration | `reward_id`, `reward_reference`, `name_es`, `name_en`, `description_es` | singleLineText, longText, number, checkbox, createdTime, lastModifiedTime, link, singleSelect, date | 3 links; see appendix | 5 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyCustomers | `tblUzmjEEuckEhzvf5W` | Playavida Loyalty Customers records/configuration | `enrollment_id`, `customer_reference`, `status`, `consent_loyalty`, `consent_marketing` | singleLineText, singleSelect, checkbox, date, createdTime, lastModifiedTime, link | 2 links; see appendix | 1 select; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyTransactions | `tblOMabh3mfkiEc9uBm` | Playavida Loyalty Transactions records/configuration | `transaction_id`, `transaction_reference`, `idempotency_key`, `event_type`, `amount` | singleLineText, singleSelect, number, longText, createdTime, link | 10 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaRewardVouchers | `tbldUROYfJl9AhT0q4B` | Playavida Reward Vouchers records/configuration | `voucher_id`, `voucher_reference`, `status`, `redemption_code_hash`, `issued_at` | singleLineText, singleSelect, date, createdTime, lastModifiedTime, link | 4 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyBalances | `tblBnCPs0ymMEgHl4EF` | Playavida Loyalty Balances records/configuration | `balance_id`, `stamp_balance`, `points_balance`, `rewards_earned`, `rewards_redeemed` | singleLineText, number, lastModifiedTime, link | 2 links; see appendix | 0 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyQRs | `tblf0TqIOWmtXFi6k2K` | Playavida Loyalty QRs records/configuration | `qr_id`, `qr_reference`, `destination_path`, `status`, `created_at` | singleLineText, singleSelect, createdTime, lastModifiedTime, link | 3 links; see appendix | 1 select; see appendix | approved server API | server only | Proposed ownership/audience; not verified Teable ACL. |
| ExternalLoyaltyConnections | `tbl9zi1E9KfuimQocvT` | External Loyalty Connections records/configuration | `connection_id`, `provider`, `external_account_reference`, `external_program_reference`, `status` | singleLineText, singleSelect, date, longText, createdTime, lastModifiedTime, link | 1 link; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| LoyaltyAnalytics | `tblOZrYZdyZQqrXvG7F` | Loyalty Analytics records/configuration | `analytics_id`, `event_type`, `language`, `metadata_json`, `created_at` | singleLineText, singleSelect, longText, createdTime, link | 4 links; see appendix | 1 select; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaRewardRules | `tblE7RpFT4b6HFSzY8H` | Playavida Reward Rules records/configuration | `reward_rule_id`, `threshold`, `progress_unit`, `title_es`, `title_en` | singleLineText, number, singleSelect, longText, checkbox, createdTime, lastModifiedTime, link | 3 links; see appendix | 4 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaRewardRuleVersions | `tblGLvpKNEuksKlAOg9` | Playavida Reward Rule Versions records/configuration | `reward_rule_version_id`, `version_number`, `threshold`, `reward_content_json`, `repeat_policy` | singleLineText, number, longText, singleSelect, date, createdTime, link | 3 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaStaffAccounts | `tblFemWKDqyaQtOqDCV` | Playavida Staff Accounts records/configuration | `staff_id`, `staff_reference`, `display_name`, `role`, `status` | singleLineText, singleSelect, date, createdTime, lastModifiedTime, link, number | 8 links; see appendix | 2 selects; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaStaffActions | `tblVVKsUd6LQraQKypB` | Playavida Staff Actions records/configuration | `staff_action_id`, `action_type`, `amount`, `transaction_reference`, `created_at` | singleLineText, singleSelect, number, createdTime, link | 5 links; see appendix | 1 select; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaEngagementCampaigns | `tblqyhBcVEn6Ab8owZh` | Playavida Engagement Campaigns records/configuration | `campaign_id`, `campaign_reference`, `name_es`, `name_en`, `status` | singleLineText, singleSelect, createdTime, lastModifiedTime, link | 7 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaEngagementCampaignVersions | `tblQNAoxZbAfwzriuzM` | Playavida Engagement Campaign Versions records/configuration | `campaign_version_id`, `version_number`, `action_type`, `points_awarded`, `destination_url` | singleLineText, number, singleSelect, date, createdTime, link, longText | 7 links; see appendix | 4 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaCustomerActionSessions | `tblQMtLnkxbFGT3btUt` | Playavida Customer Action Sessions records/configuration | `session_id`, `token_hash`, `status`, `started_at`, `expires_at` | singleLineText, singleSelect, date, createdTime, link | 3 links; see appendix | 2 selects; see appendix | approved server API | server only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaCustomerActionCompletions | `tblorS1uwoPiOy06gAk` | Playavida Customer Action Completions records/configuration | `completion_id`, `points_awarded`, `verification_method`, `completed_at`, `status` | singleLineText, number, singleSelect, date, longText, link | 7 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaCustomerCards | `tblOVokzPDd71IyedJu` | Playavida Customer Cards records/configuration | `card_id`, `status`, `joined_at`, `last_activity_at`, `archived_at` | singleLineText, singleSelect, date, link, createdTime, lastModifiedTime | 6 links; see appendix | 1 select; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyProgress | `tbl8tGEEKD5X75CquuU` | Playavida Loyalty Progress records/configuration | `progress_id`, `current_progress`, `threshold`, `status`, `earned_at` | singleLineText, number, singleSelect, date, lastModifiedTime, link | 4 links; see appendix | 1 select; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| LocationConfigurations | `tblcuRKmubtOrykPw3i` | Location Configurations records/configuration | `configuration_id`, `brand_name`, `logo_url`, `favicon_url`, `primary_color` | singleLineText, singleSelect, longText, createdTime, lastModifiedTime, link, checkbox, number | 2 links; see appendix | 6 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationAdministrators | `tblTUJ6E6EiRjEtE8Vh` | Location Administrators records/configuration | `administrator_id`, `role`, `permissions_json`, `status`, `created_at` | singleLineText, singleSelect, longText, createdTime, lastModifiedTime, link | 2 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| LocationDomains | `tblvNgSexAKVo00mb0D` | Location Domains records/configuration | `domain_id`, `domain`, `verification_status`, `ssl_status`, `created_at` | singleLineText, singleSelect, createdTime, lastModifiedTime, link, checkbox | 1 link; see appendix | 3 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| ParentBrands | `tblaWXXSoWyjRxuDHKT` | Parent Brands records/configuration | `parent_brand_id`, `parent_brand_reference`, `name`, `description`, `logo_url` | singleLineText, longText, createdTime, lastModifiedTime, link | 1 link; see appendix | 0 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| BusinessBranches | `tblId1kLGb9QDGiYXlt` | Business Branches records/configuration | `branch_id`, `branch_reference`, `status`, `created_at`, `updated_at` | singleLineText, singleSelect, createdTime, lastModifiedTime, link | 3 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| MlsLinks | `tblzMdiFf495i0vaXEd` | Mls Links records/configuration | `mls_link_id`, `entity_type`, `entity_id`, `destination_url`, `label_es` | singleLineText, singleSelect, checkbox, number, createdTime, lastModifiedTime, link | 2 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| CloneJobs | `tblhoxtYAEeTDEO5r6l` | Clone Jobs records/configuration | `clone_job_id`, `configuration_json`, `status`, `dry_run`, `started_at` | singleLineText, longText, singleSelect, checkbox, date, createdTime, link | 3 links; see appendix | 1 select; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationAnalytics | `tbldHRUowetwBdvCq0s` | Location Analytics records/configuration | `analytics_id`, `event_type`, `entity_type`, `entity_id`, `language` | singleLineText, singleSelect, longText, createdTime, link | 2 links; see appendix | 2 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| InterestDefinitions | `tblvuVLbXPglY1Pchr6` | Interest Definitions records/configuration | `interest_key`, `name_es`, `name_en`, `category`, `active` | singleLineText, singleSelect, checkbox, number, createdTime, lastModifiedTime, link, longText | 1 link; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| UserInterestPreferences | `tblheln1oKP60zBiYSX` | User Interest Preferences records/configuration | `preference_id`, `score`, `opted_out`, `updated_at`, `created_at` | singleLineText, number, checkbox, lastModifiedTime, link, createdTime | 2 links; see appendix | 0 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| EntityNotificationSubscriptions | `tbl3UzWdkBCNCwTV9iZ` | Entity Notification Subscriptions records/configuration | `subscription_id`, `entity_type`, `entity_id`, `entity_reference`, `notify_updates` | singleLineText, singleSelect, checkbox, number, date, createdTime, lastModifiedTime, link | 3 links; see appendix | 2 selects; see appendix | unknown / needs decision | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| NotificationConsentEvents | `tblWw4I7WjQcMCCMgU5` | Notification Consent Events records/configuration | `consent_event_id`, `entity_type`, `entity_id`, `category`, `action` | singleLineText, singleSelect, createdTime, link | 2 links; see appendix | 5 selects; see appendix | approved server API | authenticated user own records only | Marketing consent must be separate, versioned and withdrawable. |
| EventRSVPs | `tblwzt47e24t1dPGifV` | Event RSVPs records/configuration | `rsvp_id`, `status`, `party_size`, `source`, `created_at` | singleLineText, singleSelect, number, createdTime, lastModifiedTime, link, checkbox | 3 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| NotificationCampaigns | `tbl5QQarciJIXc9YMs6` | Notification Campaigns records/configuration | `campaign_id`, `campaign_reference`, `owner_entity_type`, `owner_entity_id`, `owner_entity_reference` | singleLineText, singleSelect, longText, date, createdTime, lastModifiedTime, link | 4 links; see appendix | 3 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| NotificationDeliveryAggregates | `tblxNrqNnvGWe3YGpAi` | Notification Delivery Aggregates records/configuration | `aggregate_id`, `reporting_date`, `eligible_count`, `sent_count`, `delivered_count` | singleLineText, date, number, createdTime, link | 2 links; see appendix | 0 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| Organizers | `tblmDooGwHyQGdr5KXn` | Organizers records/configuration | `organizer_id`, `organizer_reference`, `organizer_type`, `display_name_es`, `display_name_en` | singleLineText, singleSelect, longText, number, createdTime, lastModifiedTime, link, checkbox | 6 links; see appendix | 3 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| OrganizerFollows | `tblpPnTELmYMBukhGTZ` | Organizer Follows records/configuration | `follow_id`, `status`, `created_at`, `updated_at` | singleLineText, singleSelect, createdTime, lastModifiedTime, link | 2 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| SearchDocuments | `tbld7tEWGDzoEtOJajg` | Search Documents records/configuration | `search_document_id`, `entity_type`, `entity_id`, `entity_reference`, `title_es` | singleLineText, singleSelect, longText, checkbox, date, createdTime, lastModifiedTime, link, multipleSelect, number | 1 link; see appendix | 7 selects; see appendix | public read-only projection | public projection only | Explicit safe serializer and freshness required; never expose linked private source fields. |
| CoastalMapHubs | `tblSJ8SRrWaZYu69fis` | Coastal Map Hubs records/configuration | `hub_id`, `display_order`, `public_label_es`, `public_label_en`, `map_latitude_public` | singleLineText, number, checkbox, createdTime, lastModifiedTime, link | 1 link; see appendix | 0 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| EventPartnerships | `tblJmefbtJ46XBeFhPD` | Event Partnerships records/configuration | `partnership_id`, `role`, `partner_type`, `status`, `display_name_es` | singleLineText, singleSelect, attachment, checkbox, number, date, createdTime, lastModifiedTime, link | 9 links; see appendix | 4 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaBonusSubmissions | `tblckGGsvFJzebfPfiy` | Playavida Bonus Submissions records/configuration | `submission_id`, `status`, `photo_evidence`, `photo_caption`, `consent_to_review_photo` | singleLineText, singleSelect, attachment, longText, checkbox, createdTime, date, lastModifiedTime, link | 8 links; see appendix | 1 select; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| SponsorOffers | `tblvWVjcFntkZ3zi5lw` | Sponsor Offers records/configuration | `sponsor_offer_id`, `sponsor_offer_reference`, `title_es`, `title_en`, `description_es` | singleLineText, longText, singleSelect, createdTime, lastModifiedTime, link, checkbox | 6 links; see appendix | 3 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| SponsorOfferTags | `tblLXIzlQ6k6LUxr3KA` | Sponsor Offer Tags records/configuration | `sponsor_offer_tag_id`, `tag_original`, `tag_normalized`, `active`, `created_at` | singleLineText, checkbox, createdTime, lastModifiedTime, link | 1 link; see appendix | 0 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlatformSubscriptions | `tblniV4rYBKuBjHiPk8` | Platform Subscriptions records/configuration | `subscription_id`, `provider`, `external_customer_reference`, `external_subscription_reference`, `status` | singleLineText, singleSelect, date, checkbox, createdTime, lastModifiedTime, link | 8 links; see appendix | 3 selects; see appendix | unknown / needs decision | business owner own business only | Paid flag is not authorization; verify matching webhook evidence and current term. |
| PlatformPaymentEvents | `tbl1TOw9us9ObkXMmHR` | Platform Payment Events records/configuration | `payment_event_id`, `provider`, `external_event_id`, `event_type`, `status` | singleLineText, singleSelect, longText, date, createdTime, link | 7 links; see appendix | 3 selects; see appendix | Stripe webhook only | server only | Webhook signature, idempotency and matching business are required. |
| BusinessInquiries | `tblVqS6wUBbpH3MBTIF` | Business Inquiries records/configuration | `inquiry_id`, `inquiry_reference`, `sender_public_reference`, `sender_display_name_snapshot`, `subject` | singleLineText, longText, singleSelect, checkbox, createdTime, date, link | 4 links; see appendix | 3 selects; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| InquiryEvents | `tbloUosCMRXyVTZzMjY` | Inquiry Events records/configuration | `inquiry_event_id`, `event_type`, `metadata_json`, `created_at` | singleLineText, singleSelect, longText, createdTime, link | 2 links; see appendix | 1 select; see appendix | approved server API | business owner own business only | Proposed ownership/audience; not verified Teable ACL. |
| AdminNotifications | `tblF34hdMYFOtQhCN7P` | Admin Notifications records/configuration | `admin_notification_id`, `notification_type`, `severity`, `entity_type`, `entity_id` | singleLineText, singleSelect, longText, createdTime, date, link | 3 links; see appendix | 3 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| ModerationActions | `tblR4eJVDk27AQV5zGj` | Moderation Actions records/configuration | `moderation_action_id`, `target_entity_type`, `target_entity_id`, `action_type`, `severity` | singleLineText, singleSelect, longText, createdTime, link | 3 links; see appendix | 2 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| StaffPinSecurityEvents | `tblciuNt63idIfaLnIB` | Staff Pin Security Events records/configuration | `event_id`, `event_type`, `failure_count`, `lock_until_nullable`, `correlation_id` | singleLineText, singleSelect, number, date, createdTime, link | 2 links; see appendix | 1 select; see appendix | approved server API | server only | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyProgramVersions | `tbl2DdfvdxEUatWEjWV` | Playavida Loyalty Program Versions records/configuration | `program_version_id`, `version_number`, `configuration_json`, `effective_from`, `effective_until` | singleLineText, number, longText, date, createdTime, link | 5 links; see appendix | 0 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaLoyaltyCardCycles | `tblaXjpNTunNEk9pvhf` | Playavida Loyalty Card Cycles records/configuration | `cycle_id`, `cycle_reference`, `started_at`, `completed_at_nullable`, `claimed_at_nullable` | singleLineText, date, singleSelect, createdTime, lastModifiedTime, link | 6 links; see appendix | 2 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| PlayavidaDynamicQRChallenges | `tblPfGTmoL9vWyI7kl0` | Playavida Dynamic QRChallenges records/configuration | `challenge_id`, `challenge_reference`, `token_hash`, `nonce_hash`, `purpose` | singleLineText, singleSelect, date, number, createdTime, lastModifiedTime, link | 6 links; see appendix | 2 selects; see appendix | approved server API | server only | Proposed ownership/audience; not verified Teable ACL. |
| ExternalLinks | `tblOBFt1oowRmIv0Mp4` | External Links records/configuration | `external_link_id`, `entity_type`, `entity_id`, `entity_reference`, `link_type` | singleLineText, singleSelect, longText, date, createdTime, lastModifiedTime, link | 3 links; see appendix | 5 selects; see appendix | approved server API | unknown / needs decision | Proposed ownership/audience; not verified Teable ACL. |
| ExternalLinkAnalyticsEvents | `tblICT2Bcuh5Li3aPIh` | External Link Analytics Events records/configuration | `analytics_event_id`, `event_type`, `language`, `outcome`, `created_at` | singleLineText, singleSelect, createdTime, link | 2 links; see appendix | 3 selects; see appendix | approved server API | server only | Proposed ownership/audience; not verified Teable ACL. |
| ExternalLinkAnalyticsAggregates | `tblH4lLgW7JUoTt29KF` | External Link Analytics Aggregates records/configuration | `aggregate_id`, `reporting_date`, `event_type`, `language`, `event_count` | singleLineText, date, singleSelect, number, createdTime, link | 2 links; see appendix | 2 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| SchemaChangeLog | `tblEWCWe1M0iLsHuPSq` | Schema Change Log records/configuration | `schema_change_id`, `change_reference`, `change_type`, `description`, `affected_tables_json` | singleLineText, singleSelect, longText, user, date, createdTime | 0 links; see appendix | 3 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| DataIntegrityIssues | `tblgld6aJED9x7z5Vrq` | Data Integrity Issues records/configuration | `issue_id`, `issue_reference`, `entity_type`, `entity_id`, `issue_type` | singleLineText, singleSelect, longText, date, createdTime, lastModifiedTime, link | 1 link; see appendix | 3 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| AnalyticsMetricDefinitions | `tblmGSz6oiQAkxUj63f` | Analytics Metric Definitions records/configuration | `metric_definition_id`, `metric_key`, `entity_type`, `name_es`, `name_en` | singleLineText, singleSelect, longText, checkbox, createdTime, lastModifiedTime | 0 links; see appendix | 2 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| AnalyticsMetricAggregates | `tblKJ3vSsiJJPiMrRfy` | Analytics Metric Aggregates records/configuration | `aggregate_id`, `metric_key`, `entity_type`, `entity_reference`, `placement_surface` | singleLineText, singleSelect, date, number, createdTime, lastModifiedTime, link | 3 links; see appendix | 4 selects; see appendix | internal operational process | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| PublicSponsorPlacements | `tblAeo0JsssvWXRS2x8` | Public Sponsor Placements records/configuration | `public_placement_reference`, `sponsor_reference`, `sponsor_name`, `sponsor_offer_reference`, `offer_title_es` | singleLineText, longText, singleSelect, date, number, checkbox, createdTime, lastModifiedTime | 0 links; see appendix | 3 selects; see appendix | public read-only projection | public projection only | Explicit safe serializer and freshness required; never expose linked private source fields. |
| LocationBranding | `tblPSsHmTFanwWZlzPw` | Location Branding records/configuration | `branding_id`, `logo_url`, `favicon_url`, `primary_color`, `secondary_color` | singleLineText, longText, checkbox, createdTime, lastModifiedTime, link | 1 link; see appendix | 0 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationLanguageConfigurations | `tblb8ZBb23iHPRTk1GV` | Location Language Configurations records/configuration | `language_configuration_id`, `language_code`, `locale`, `is_default`, `active` | singleLineText, checkbox, singleSelect, createdTime, lastModifiedTime, link | 1 link; see appendix | 1 select; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationSeoSettings | `tbl6SHVb0Az8mPkwqdk` | Location Seo Settings records/configuration | `seo_settings_id`, `language_code`, `site_title_template`, `homepage_title`, `homepage_description` | singleLineText, longText, singleSelect, checkbox, createdTime, lastModifiedTime, link | 1 link; see appendix | 1 select; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationSeoKeywords | `tblH8kjuSFpaBCvNDyc` | Location Seo Keywords records/configuration | `keyword_id`, `language_code`, `keyword`, `normalized_keyword`, `keyword_type` | singleLineText, singleSelect, number, checkbox, createdTime, lastModifiedTime, link | 1 link; see appendix | 1 select; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationAeoContent | `tblS23pg1qCPsyO5J0W` | Location Aeo Content records/configuration | `aeo_content_id`, `language_code`, `question`, `normalized_question`, `concise_answer` | singleLineText, longText, singleSelect, date, createdTime, lastModifiedTime, link | 3 links; see appendix | 2 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationGeoContent | `tbl5Cpr3K6ALLbDF76P` | Location Geo Content records/configuration | `geo_content_id`, `content_type`, `name_es`, `name_en`, `slug` | singleLineText, singleSelect, longText, number, checkbox, createdTime, lastModifiedTime, link | 3 links; see appendix | 2 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationFaqs | `tblJv7ZpUOMf4NLu2my` | Location Faqs records/configuration | `faq_id`, `language_code`, `category`, `question`, `normalized_question` | singleLineText, longText, checkbox, singleSelect, date, number, createdTime, lastModifiedTime, link | 3 links; see appendix | 1 select; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationGuides | `tblX9SDzD23C2cvtVMk` | Location Guides records/configuration | `guide_id`, `guide_reference`, `category`, `slug`, `title_es` | singleLineText, longText, singleSelect, date, createdTime, lastModifiedTime, link | 2 links; see appendix | 2 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationIntroductionPages | `tblDTdvzX5CTxMZFXvW` | Location Introduction Pages records/configuration | `intro_page_id`, `version`, `language_code`, `hero_title`, `hero_subtitle` | singleLineText, number, longText, singleSelect, checkbox, date, createdTime, lastModifiedTime, link | 2 links; see appendix | 2 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| UserIntroductionPreferences | `tblwqk6kwZeqQzUIqb6` | User Introduction Preferences records/configuration | `preference_id`, `anonymous_device_id_nullable`, `intro_version`, `language_code`, `dismissed_at_nullable` | singleLineText, number, date, createdTime, lastModifiedTime, link | 3 links; see appendix | 0 selects; see appendix | approved server API | authenticated user own records only | Proposed ownership/audience; not verified Teable ACL. |
| LegalConfigurations | `tblSYwZm78DAE0JyV2I` | Legal Configurations records/configuration | `legal_configuration_id`, `name`, `status`, `support_email`, `support_url` | singleLineText, singleSelect, createdTime, lastModifiedTime, link | 3 links; see appendix | 1 select; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LegalDocumentVersions | `tblo5BCNrhdj3QCn8QE` | Legal Document Versions records/configuration | `legal_document_version_id`, `document_type`, `language_code`, `version`, `title` | singleLineText, singleSelect, number, longText, date, createdTime, lastModifiedTime, link | 3 links; see appendix | 2 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationFooterLinks | `tbljWgtF5oJLhFDpAJz` | Location Footer Links records/configuration | `footer_link_id`, `language_code`, `label`, `link_type`, `internal_path_nullable` | singleLineText, singleSelect, number, checkbox, createdTime, lastModifiedTime, link | 3 links; see appendix | 1 select; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| LocationCategories | `tbl7CJ7Yox3tVKwcdid` | Location Categories records/configuration | `category_id`, `category_type`, `name_es`, `name_en`, `slug` | singleLineText, singleSelect, longText, checkbox, number, createdTime, lastModifiedTime, link | 3 links; see appendix | 2 selects; see appendix | superadmin manual | superadmin only | Proposed ownership/audience; not verified Teable ACL. |
| AuthenticationOtpChallenges | `tblVe1AhQ3zLW3eijnw` | Authentication Otp Challenges records/configuration | `otp_challenge_id`, `challenge_reference`, `email_hash`, `code_hash`, `purpose` | singleLineText, singleSelect, date, number, createdTime, lastModifiedTime | 0 links; see appendix | 2 selects; see appendix | approved server API | server only | Hashes only; atomic expiry, consumption and revocation need server enforcement. |
| AuthenticationSessions | `tblap3ykSwQQk276MdN` | Authentication Sessions records/configuration | `session_id`, `session_reference`, `session_token_hash`, `session_version`, `status` | singleLineText, number, singleSelect, date, createdTime, lastModifiedTime, link | 1 link; see appendix | 2 selects; see appendix | approved server API | server only | Hashes only; atomic expiry, consumption and revocation need server enforcement. |
| AuthenticationOperationalAggregates | `tblARiGin9HMQpGMgQK` | Authentication Operational Aggregates records/configuration | `aggregate_id`, `metric_group`, `metric_key`, `record_count`, `as_of` | singleLineText, singleSelect, number, date, createdTime, lastModifiedTime | 0 links; see appendix | 3 selects; see appendix | approved server API | server only | Proposed ownership/audience; not verified Teable ACL. |

## Field and relation appendix

Every field below is listed as `name` (`field ID`): type; select options and link relationship/foreign table when present. A reverse link shown here is schema metadata, not permission to traverse it in a public API.

### Locations (tblvc9P1eUHidtcW4tH)

- `location_id` (`fld8Hmoa90nqyTLffNf`): `singleLineText`
- `location_code` (`fld705WwyJbd5OieZFe`): `singleLineText`
- `reference` (`fldvqIUTa7Vvde4nfPj`): `singleLineText`
- `name_es` (`fldVA2ktA8HpIXGgEKT`): `singleLineText`
- `name_en` (`flde4J0kLgtWgNLyCmp`): `singleLineText`
- `slug` (`fldfoitwFTGToAIIxXr`): `singleLineText`
- `country` (`fld4ScRBstopccAckqy`): `singleLineText`
- `region` (`fld3Bsdwt71dvY1TTD8`): `singleLineText`
- `status` (`fldaJLJHIS49X9x4RYT`): `singleSelect`; options: `active`, `inactive`, `planned`, `draft`, `paused`, `archived`, `template`
- `timezone` (`fldcgADlZcl9zpyNDBC`): `singleLineText`
- `created_at` (`fld5UzxoyNTsd5naNH3`): `createdTime`
- `updated_at` (`fldDxjy3y4sj2n9GECK`): `lastModifiedTime`
- `parent_location_id` (`fldDl0wXjJdYjlIp4fK`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `Locations` (`fldAPF8T5OpuFsZRxPL`): `link`; relation: oneMany -> Locations (tblvc9P1eUHidtcW4tH)
- `NearbyLocationRelationships` (`fldzsgVpx1BuaWRxFEL`): `link`; relation: oneMany -> NearbyLocationRelationships (tblebCLYkMXlJyuP2Xh)
- `NearbyLocationRelationships (linked)` (`fld9rPVVshdqDvGWJ5b`): `link`; relation: oneMany -> NearbyLocationRelationships (tblebCLYkMXlJyuP2Xh)
- `Businesses` (`fld2cihFiTZUDvnLQ3m`): `link`; relation: oneMany -> Businesses (tbl8IOboEGdwYHqJck2)
- `AnalyticsEvents` (`fldi5hIyfJDzfrnILl1`): `link`; relation: oneMany -> AnalyticsEvents (tblIC6qV8KN4MzzGXtb)
- `ContactAnalyticsEvents` (`fldSWUc6kCV0Vv5YKGI`): `link`; relation: oneMany -> ContactAnalyticsEvents (tbl7QlJqX4pTlFV8PAv)
- `Events` (`fldMx62kOTnCvqEhy3w`): `link`; relation: oneMany -> Events (tblOA1Eb39I2imf93JV)
- `EventAnalytics` (`fldUNlhUBs1DAQRyPaF`): `link`; relation: oneMany -> EventAnalytics (tblwKstzAdAZYtNrIEE)
- `Groups` (`fldRLCmwwuRgrluijRE`): `link`; relation: oneMany -> Groups (tblHILTdHKnZTaHRL3P)
- `SponsorCampaigns` (`fldRxabwlpSpIIozX3k`): `link`; relation: oneMany -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `OfferAnalytics` (`fld72hjAXlttDkzrlJX`): `link`; relation: oneMany -> OfferAnalytics (tblAYgQlbcInI9iGuAI)
- `SponsorAnalytics` (`fldzwakOWWoH2rW3ZKF`): `link`; relation: oneMany -> SponsorAnalytics (tblONPlRsokLKoiQAgV)
- `PlayavidaLoyaltyPrograms` (`fldLVaig356aFgSHDM8`): `link`; relation: oneMany -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `PlayavidaLoyaltyTransactions` (`fldilJ1nIieuZAkaqTE`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)
- `PlayavidaLoyaltyQRs` (`fldZBlYuQCTITNMFu7c`): `link`; relation: oneMany -> PlayavidaLoyaltyQRs (tblf0TqIOWmtXFi6k2K)
- `LoyaltyAnalytics` (`fldia1iWHNUg3YSVe9y`): `link`; relation: oneMany -> LoyaltyAnalytics (tblOZrYZdyZQqrXvG7F)
- `PlayavidaStaffAccounts` (`fld7j8QneEySDvqjCeM`): `link`; relation: oneMany -> PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)
- `PlayavidaStaffActions` (`fldJTiHSeEmZQIZoj0e`): `link`; relation: oneMany -> PlayavidaStaffActions (tblVVKsUd6LQraQKypB)
- `LocationConfigurations` (`fldDRG60GeRJU3qdhvF`): `link`; relation: oneOne -> LocationConfigurations (tblcuRKmubtOrykPw3i)
- `LocationAdministrators` (`fldnoxGrtLfx5Ec7q92`): `link`; relation: oneMany -> LocationAdministrators (tblTUJ6E6EiRjEtE8Vh)
- `LocationDomains` (`fldsUGiDTXZO3ZTocrk`): `link`; relation: oneMany -> LocationDomains (tblvNgSexAKVo00mb0D)
- `BusinessBranches` (`fldkdAkzquCTFmdOb56`): `link`; relation: oneMany -> BusinessBranches (tblId1kLGb9QDGiYXlt)
- `MlsLinks` (`fldQlj17LMI2eHO6oyI`): `link`; relation: oneMany -> MlsLinks (tblzMdiFf495i0vaXEd)
- `CloneJobs` (`fld8kf5D2XRd5uYUacG`): `link`; relation: oneMany -> CloneJobs (tblhoxtYAEeTDEO5r6l)
- `CloneJobs (linked)` (`fldxeTO8DUptkVg46l2`): `link`; relation: oneMany -> CloneJobs (tblhoxtYAEeTDEO5r6l)
- `LocationAnalytics` (`fldnMzNsLXfoCGcBNsF`): `link`; relation: oneMany -> LocationAnalytics (tbldHRUowetwBdvCq0s)
- `NotificationCampaigns` (`fldQK5tigD8R8QS8nli`): `link`; relation: oneMany -> NotificationCampaigns (tbl5QQarciJIXc9YMs6)
- `NotificationDeliveryAggregates` (`fldcBifXeypWG2VHLFu`): `link`; relation: oneMany -> NotificationDeliveryAggregates (tblxNrqNnvGWe3YGpAi)
- `Organizers` (`fld0VwVD94firsW7dxx`): `link`; relation: oneMany -> Organizers (tblmDooGwHyQGdr5KXn)
- `SearchDocuments` (`fldhTaCFvlN7UzJR8As`): `link`; relation: oneMany -> SearchDocuments (tbld7tEWGDzoEtOJajg)
- `CoastalMapHubs` (`fldFeFlQgyZuid5sWPB`): `link`; relation: oneOne -> CoastalMapHubs (tblSJ8SRrWaZYu69fis)
- `Offers` (`fldUWqpjRHrxlAWEp0C`): `link`; relation: oneMany -> Offers (tblf2PeEIunfjiRaoVV)
- `SponsorOffers` (`fldomM5XiBYghA9L67B`): `link`; relation: oneMany -> SponsorOffers (tblvWVjcFntkZ3zi5lw)
- `PlayavidaDynamicQRChallenges` (`fld8tNwJrCmFtHCgr8O`): `link`; relation: oneMany -> PlayavidaDynamicQRChallenges (tblPfGTmoL9vWyI7kl0)
- `ExternalLinkAnalyticsEvents` (`flddc1xTPVGmVnwQQyQ`): `link`; relation: oneMany -> ExternalLinkAnalyticsEvents (tblICT2Bcuh5Li3aPIh)
- `ExternalLinkAnalyticsAggregates` (`fldAfM1sYiBqwaEvMwT`): `link`; relation: oneMany -> ExternalLinkAnalyticsAggregates (tblH4lLgW7JUoTt29KF)
- `AnalyticsMetricAggregates` (`fldBvZBFN3GCN9cY4eN`): `link`; relation: oneMany -> AnalyticsMetricAggregates (tblKJ3vSsiJJPiMrRfy)
- `LocationBranding` (`fldFBdxyOiTpXRUOijc`): `link`; relation: oneMany -> LocationBranding (tblPSsHmTFanwWZlzPw)
- `LocationLanguageConfigurations` (`fldWrk7EhHs9pRT8Cuy`): `link`; relation: oneMany -> LocationLanguageConfigurations (tblb8ZBb23iHPRTk1GV)
- `LocationSeoSettings` (`fldjKU0rYfGowxy3GQz`): `link`; relation: oneMany -> LocationSeoSettings (tbl6SHVb0Az8mPkwqdk)
- `LocationSeoKeywords` (`fldyVHJUwvhm3OVOiMo`): `link`; relation: oneMany -> LocationSeoKeywords (tblH8kjuSFpaBCvNDyc)
- `LocationAeoContent` (`fldM71tQ6smffbYj5kG`): `link`; relation: oneMany -> LocationAeoContent (tblS23pg1qCPsyO5J0W)
- `LocationGeoContent` (`fldiOdMaIol0LIrozVV`): `link`; relation: oneMany -> LocationGeoContent (tbl5Cpr3K6ALLbDF76P)
- `LocationFaqs` (`fldNq0Y2bNI3ZAttjYo`): `link`; relation: oneMany -> LocationFaqs (tblJv7ZpUOMf4NLu2my)
- `LocationGuides` (`fld3J9E8iPXGm5q45dS`): `link`; relation: oneMany -> LocationGuides (tblX9SDzD23C2cvtVMk)
- `LocationIntroductionPages` (`fldVORosw8FUqcl1kA5`): `link`; relation: oneMany -> LocationIntroductionPages (tblDTdvzX5CTxMZFXvW)
- `UserIntroductionPreferences` (`fldpzqXkM6MTfkqURTY`): `link`; relation: oneMany -> UserIntroductionPreferences (tblwqk6kwZeqQzUIqb6)
- `LegalConfigurations` (`fldEiPO69BLM6S6ii8w`): `link`; relation: oneMany -> LegalConfigurations (tblSYwZm78DAE0JyV2I)
- `LegalDocumentVersions` (`fldRWZE3ra0IcYxBgUA`): `link`; relation: oneMany -> LegalDocumentVersions (tblo5BCNrhdj3QCn8QE)
- `LocationFooterLinks` (`fldiehecD26ziNmGRAF`): `link`; relation: oneMany -> LocationFooterLinks (tbljWgtF5oJLhFDpAJz)
- `LocationCategories` (`fldECQmWhmYeO53Gm8e`): `link`; relation: oneMany -> LocationCategories (tbl7CJ7Yox3tVKwcdid)
- `clone_source_location_id_nullable` (`fldHdWqxs6eKXyNhes6`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `Locations (linked)` (`fldSAuNdOMqokFz3ko8`): `link`; relation: oneMany -> Locations (tblvc9P1eUHidtcW4tH)
- `country_code` (`fldXs8QvOl8hZFPrC8j`): `singleLineText`
- `country_name_es` (`fld6am2s3SSXoaOiFcP`): `singleLineText`
- `country_name_en` (`fldEAFN6TqTfwDt6Sqt`): `singleLineText`
- `region_name_es` (`fldr1bUokCFP687p5CY`): `singleLineText`
- `region_name_en` (`fldVT8tJazoJTewib8x`): `singleLineText`
- `city_name_es` (`fldbGhNwUmM9nXNwk5o`): `singleLineText`
- `city_name_en` (`fldFptMiRABl4kcfjOT`): `singleLineText`
- `default_currency` (`fldFLF0PjeM6wtP0Lum`): `singleLineText`
- `default_locale` (`fldjOQVxBxsl9h5B95W`): `singleLineText`
- `template_version` (`fldC4tgH6LWCKkb9qL5`): `singleLineText`

### NearbyLocationRelationships (tblebCLYkMXlJyuP2Xh)

- `relationship_id` (`fldI0mipLrHNp3UV4ZK`): `singleLineText`
- `relationship_type` (`fldE0caYQgpWQhAt3JY`): `singleSelect`; options: `nearby`, `regional_hub`, `adjacent`
- `sort_order` (`fldwq01o6kwPiQCOHLT`): `number`
- `active` (`fldslX04UWQ9rUV7uwp`): `checkbox`
- `created_at` (`fldiyFWcCshMU6rZ9YB`): `createdTime`
- `location_id` (`fldpdSQuMiujenWfles`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `nearby_location_id` (`fldqATkzK1r9bYQUoZj`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### Users (tblB6Wiwy4KOx3Tjgui)

- `user_id` (`flddCyi2jmDWCL1XDWp`): `singleLineText`
- `public_reference` (`fldk9LWCFlJZw8GY3sR`): `singleLineText`
- `email` (`fldnBFAznz1H4AXn2iD`): `singleLineText`
- `email_verified` (`fldXAiTdIQPaNybm7U2`): `checkbox`
- `account_status` (`fldS7bTfSbJNKXW6sGP`): `singleSelect`; options: `pending`, `active`, `suspended`, `disabled`
- `selected_language` (`fldeky4NQUJwcGxRD8k`): `singleSelect`; options: `es`, `en`
- `last_login_at` (`fldPibGpBJxXLhKm8Pu`): `date`
- `created_at` (`fld63XxYsYxYQ2uxTDv`): `createdTime`
- `updated_at` (`fldIk2Wgd7t5UbRF356`): `lastModifiedTime`
- `PersonalProfiles` (`fldqnwsp8JszSLB2FBv`): `link`; relation: oneOne -> PersonalProfiles (tblLPvqsTYbSeHqbO88)
- `PrivacyPreferences` (`fldnPUmcydz0ZjRpcbu`): `link`; relation: oneOne -> UserPrivacyPreferences (tblBqY7HYRNqX0fFLQY)
- `Businesses` (`fld9z9fSPMbPtmWMap8`): `link`; relation: oneMany -> Businesses (tbl8IOboEGdwYHqJck2)
- `BusinessManagers` (`fld8jCQAvSU1mIQ2ENv`): `link`; relation: oneMany -> BusinessManagers (tblBZ0dELDl3z7gTTOw)
- `BusinessMedia` (`fldagGwEz8hcq0TeGJg`): `link`; relation: oneMany -> BusinessMedia (tblNDTuVfCgJZyUsB8Y)
- `Reports` (`fldLmG0HdPTCaGkYjuE`): `link`; relation: oneMany -> Reports (tblMXJBJkxwtugJKI9o)
- `Reports (linked)` (`fldga8zNY5iEPbjKoCj`): `link`; relation: oneMany -> Reports (tblMXJBJkxwtugJKI9o)
- `AnalyticsEvents` (`fldHO8jhe76B7vXu7ZZ`): `link`; relation: oneMany -> AnalyticsEvents (tblIC6qV8KN4MzzGXtb)
- `BusinessSubscriptions` (`fldjWMhRLpbSOUy8OVf`): `link`; relation: oneMany -> BusinessSubscriptions (tbloyccWq6gEARYGLJH)
- `ContactAnalyticsEvents` (`fldkmxfY4cvIw4w5XCf`): `link`; relation: oneMany -> ContactAnalyticsEvents (tbl7QlJqX4pTlFV8PAv)
- `Events` (`fldoKQ2ZJ4OctaO6koH`): `link`; relation: oneMany -> Events (tblOA1Eb39I2imf93JV)
- `EventManagers` (`fldHknQXKVNz7w8v0HP`): `link`; relation: oneMany -> EventManagers (tblCCKm0CjWqllQyh4Z)
- `EventAnalytics` (`fldyBOqu1vjwIkNoegj`): `link`; relation: oneMany -> EventAnalytics (tblwKstzAdAZYtNrIEE)
- `Groups` (`fldalLn1IkAx1VyNXMX`): `link`; relation: oneMany -> Groups (tblHILTdHKnZTaHRL3P)
- `GroupMemberships` (`fldij6iksk2mhedbCT1`): `link`; relation: oneMany -> GroupMemberships (tbloXopVSAHrEb16p3t)
- `Posts` (`fldinyygzNYwDkrXVAM`): `link`; relation: oneMany -> Posts (tblGAutYOeq09yHxIfo)
- `Comments` (`fld73tYwdVxHtrmE2rL`): `link`; relation: oneMany -> Comments (tblJla61gciIKagESV2)
- `Follows` (`flddWWqwRuPH01FMOXf`): `link`; relation: oneMany -> Follows (tblWWTS1GCKsl0k5O67)
- `SavedEntities` (`fldaTzyKwDZw8GWkZKa`): `link`; relation: oneMany -> SavedEntities (tblAhSbxUWsQH2oX2Io)
- `Reviews` (`fldN3TbO6NifeCYmOF0`): `link`; relation: oneMany -> Reviews (tblKpxxGnkvVJbLLRbF)
- `ReviewResponses` (`flddjlEjbduOIDfDzBC`): `link`; relation: oneMany -> ReviewResponses (tblhocc6wtg3ByqxASA)
- `UserBlocks` (`fldAiWDSna432OGa5uq`): `link`; relation: oneMany -> UserBlocks (tblC9DloBIgtRPaBefP)
- `Notifications` (`fldxNt6akernjOx13Bo`): `link`; relation: oneMany -> Notifications (tbl556QiZgdJyJaa1zi)
- `Offers` (`fldzepxbOqNtUfxQ8Ev`): `link`; relation: oneMany -> Offers (tblf2PeEIunfjiRaoVV)
- `Sponsors` (`fldkHGq3d1rCwaftIsZ`): `link`; relation: oneMany -> Sponsors (tbld8kbsDB3c17XO5Dy)
- `OfferAnalytics` (`fldULdmNFCfJHoQxdF8`): `link`; relation: oneMany -> OfferAnalytics (tblAYgQlbcInI9iGuAI)
- `SponsorAnalytics` (`fldD7WMqx4T7QHorHje`): `link`; relation: oneMany -> SponsorAnalytics (tblONPlRsokLKoiQAgV)
- `PlayavidaLoyaltyPrograms` (`fldUeqAJ1uEynp9tF6z`): `link`; relation: oneMany -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `PlayavidaLoyaltyCustomers` (`fldTl83x71qvYYsG6hY`): `link`; relation: oneMany -> PlayavidaLoyaltyCustomers (tblUzmjEEuckEhzvf5W)
- `PlayavidaLoyaltyTransactions` (`fldqj1NVtaGYjPUqukk`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)
- `PlayavidaLoyaltyTransactions (linked)` (`fldEbFJJzxbECC6GlcU`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)
- `PlayavidaRewardVouchers` (`fldy2N3cyhMkRir7OZ9`): `link`; relation: oneMany -> PlayavidaRewardVouchers (tbldUROYfJl9AhT0q4B)
- `PlayavidaRewardVouchers (linked)` (`fldGbF1zzQX1vBRLydM`): `link`; relation: oneMany -> PlayavidaRewardVouchers (tbldUROYfJl9AhT0q4B)
- `PlayavidaLoyaltyBalances` (`fld7GeRxTLtMmxF98ZI`): `link`; relation: oneMany -> PlayavidaLoyaltyBalances (tblBnCPs0ymMEgHl4EF)
- `LoyaltyAnalytics` (`fldKq2Adlwi5nQI8QV0`): `link`; relation: oneMany -> LoyaltyAnalytics (tblOZrYZdyZQqrXvG7F)
- `PlayavidaRewardRuleVersions` (`fld7T0GCo8nzjAKHcfT`): `link`; relation: oneMany -> PlayavidaRewardRuleVersions (tblGLvpKNEuksKlAOg9)
- `PlayavidaStaffAccounts` (`fldOsSdopC1gYlCsI7A`): `link`; relation: oneMany -> PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)
- `PlayavidaStaffActions` (`fldLwtJ6oUzgwAihHuj`): `link`; relation: oneMany -> PlayavidaStaffActions (tblVVKsUd6LQraQKypB)
- `PlayavidaEngagementCampaigns` (`fld7fza2Ek7D16uP27h`): `link`; relation: oneMany -> PlayavidaEngagementCampaigns (tblqyhBcVEn6Ab8owZh)
- `PlayavidaEngagementCampaignVersions` (`fld5PGIrVIzUeMqkCdV`): `link`; relation: oneMany -> PlayavidaEngagementCampaignVersions (tblQNAoxZbAfwzriuzM)
- `PlayavidaCustomerActionSessions` (`fldAHM55WZaZgM1hpRE`): `link`; relation: oneMany -> PlayavidaCustomerActionSessions (tblQMtLnkxbFGT3btUt)
- `PlayavidaCustomerActionCompletions` (`fldt6Q36L1WL6iXRc1u`): `link`; relation: oneMany -> PlayavidaCustomerActionCompletions (tblorS1uwoPiOy06gAk)
- `PlayavidaCustomerCards` (`fldkfFxer72KD4AggnO`): `link`; relation: oneMany -> PlayavidaCustomerCards (tblOVokzPDd71IyedJu)
- `PlayavidaLoyaltyProgress` (`fldRILKPSvqYutD1CLY`): `link`; relation: oneMany -> PlayavidaLoyaltyProgress (tbl8tGEEKD5X75CquuU)
- `LocationAdministrators` (`fld9c628fB33RnC7I0S`): `link`; relation: oneMany -> LocationAdministrators (tblTUJ6E6EiRjEtE8Vh)
- `CloneJobs` (`fldCbYw4MjFulbL7Ny3`): `link`; relation: oneMany -> CloneJobs (tblhoxtYAEeTDEO5r6l)
- `LocationAnalytics` (`fld1QjnQP8wL0Din5RU`): `link`; relation: oneMany -> LocationAnalytics (tbldHRUowetwBdvCq0s)
- `UserInterestPreferences` (`flddr1NG0Jdii0os8tk`): `link`; relation: oneMany -> UserInterestPreferences (tblheln1oKP60zBiYSX)
- `EntityNotificationSubscriptions` (`fldvbXBdyyqrjWlA1EJ`): `link`; relation: oneMany -> EntityNotificationSubscriptions (tbl3UzWdkBCNCwTV9iZ)
- `NotificationConsentEvents` (`fldyqt4LyMipw4gObJ1`): `link`; relation: oneMany -> NotificationConsentEvents (tblWw4I7WjQcMCCMgU5)
- `EventRSVPs` (`fldy4zwCnckNmk7L5Y0`): `link`; relation: oneMany -> EventRSVPs (tblwzt47e24t1dPGifV)
- `NotificationCampaigns` (`fldQ9XYthcPUmx2J3DS`): `link`; relation: oneMany -> NotificationCampaigns (tbl5QQarciJIXc9YMs6)
- `Events (linked)` (`fldmUb3qHOn2tPjoZMP`): `link`; relation: oneMany -> Events (tblOA1Eb39I2imf93JV)
- `Organizers` (`fldYpM3hsTIPpCLl1Sd`): `link`; relation: oneMany -> Organizers (tblmDooGwHyQGdr5KXn)
- `OrganizerFollows` (`fldY3t1EVGYsUwI6fDA`): `link`; relation: oneMany -> OrganizerFollows (tblpPnTELmYMBukhGTZ)
- `EventPartnerships` (`fldljKp40xVYBcINnJ2`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `EventPartnerships (linked)` (`fldGeWOS0O4ge7A4Flr`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `EventPartnerships (linked 2)` (`fldRueNG7j3itMQFSa2`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `PlayavidaBonusSubmissions` (`fldMe1JpItWKJ3XW5zR`): `link`; relation: oneMany -> PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)
- `PlatformSubscriptions` (`fld1Yd82D6lmmkFCokU`): `link`; relation: oneMany -> PlatformSubscriptions (tblniV4rYBKuBjHiPk8)
- `PlatformPaymentEvents` (`fldlHnuHLbzRCSKXhgB`): `link`; relation: oneMany -> PlatformPaymentEvents (tbl1TOw9us9ObkXMmHR)
- `BusinessInquiries` (`fldyvMwJzqX1JU50Nec`): `link`; relation: oneMany -> BusinessInquiries (tblVqS6wUBbpH3MBTIF)
- `BusinessInquiries (linked)` (`fldJaH2nfSYDFwU34Cm`): `link`; relation: oneMany -> BusinessInquiries (tblVqS6wUBbpH3MBTIF)
- `InquiryEvents` (`fldxDRIQNNGHjxjVp1m`): `link`; relation: oneMany -> InquiryEvents (tbloUosCMRXyVTZzMjY)
- `AdminNotifications` (`fldx0EkmxZIyLzZactR`): `link`; relation: oneMany -> AdminNotifications (tblF34hdMYFOtQhCN7P)
- `ModerationActions` (`fldHtZn6u2pUw7ops5r`): `link`; relation: oneMany -> ModerationActions (tblR4eJVDk27AQV5zGj)
- `PlayavidaLoyaltyProgramVersions` (`fldQdyEnet3tcE6bRcu`): `link`; relation: oneMany -> PlayavidaLoyaltyProgramVersions (tbl2DdfvdxEUatWEjWV)
- `PlayavidaLoyaltyCardCycles` (`flden9JgrFZhqmFTO19`): `link`; relation: oneMany -> PlayavidaLoyaltyCardCycles (tblaXjpNTunNEk9pvhf)
- `PlayavidaDynamicQRChallenges` (`fldPYvHWswtOzKXc1ib`): `link`; relation: oneMany -> PlayavidaDynamicQRChallenges (tblPfGTmoL9vWyI7kl0)
- `account_environment` (`fldH0LlrMXrMJJjQQys`): `singleSelect`; options: `production`, `test`, `demo`, `seed`, `generated`
- `is_test_account` (`fldCckVVeIWCdktsK3z`): `checkbox`
- `is_demo_account` (`fldYMwOa8e4SYomggie`): `checkbox`
- `is_seed_account` (`fldT6XgGrfcZilT214u`): `checkbox`
- `is_generated_content` (`fldybMllZros1fFQWUA`): `checkbox`
- `needs_review` (`fld2b6mT71RAooqjzm4`): `checkbox`
- `cleanup_status` (`fldFwORlNb2wFDIreDg`): `singleSelect`; options: `active`, `review_required`, `disabled`, `archived`, `queued_for_purge`, `purged`, `restored`
- `cleanup_reason` (`fldf6bvWlPZbnTwJCBK`): `singleSelect`; options: `generated_incorrect`, `duplicate`, `stale_demo`, `test_artifact`, `invalid_content`, `orphaned_record`, `suspected_spam`, `other`
- `disabled_at_nullable` (`fldHQl41mtsUxqi2SS4`): `date`
- `archived_at_nullable` (`fldvZ3p9poPAswDl57x`): `date`
- `purged_at_nullable` (`fldRZ5XRfyTEFtgmh9z`): `date`
- `DataIntegrityIssues` (`fldQP2nZPtjLWUGSOFW`): `link`; relation: oneMany -> DataIntegrityIssues (tblgld6aJED9x7z5Vrq)
- `LocationAeoContent` (`fldXu8i6AsBOOclmzjo`): `link`; relation: oneMany -> LocationAeoContent (tblS23pg1qCPsyO5J0W)
- `LocationAeoContent (linked)` (`fldc24ieZBdqnypG8BT`): `link`; relation: oneMany -> LocationAeoContent (tblS23pg1qCPsyO5J0W)
- `LocationFaqs` (`fldO9kVmgxSv1qhqvjm`): `link`; relation: oneMany -> LocationFaqs (tblJv7ZpUOMf4NLu2my)
- `LocationFaqs (linked)` (`fldgpC38nxrqwlkWdhX`): `link`; relation: oneMany -> LocationFaqs (tblJv7ZpUOMf4NLu2my)
- `LocationGuides` (`fldBkhPGiTGf9c1vUnZ`): `link`; relation: oneMany -> LocationGuides (tblX9SDzD23C2cvtVMk)
- `UserIntroductionPreferences` (`fldolf2ZtYDRaNE6Bi1`): `link`; relation: oneMany -> UserIntroductionPreferences (tblwqk6kwZeqQzUIqb6)
- `AuthenticationSessions` (`fldjeEiaWNY7Uu23iX3`): `link`; relation: oneMany -> AuthenticationSessions (tblap3ykSwQQk276MdN)

### PersonalProfiles (tblLPvqsTYbSeHqbO88)

- `personal_profile_id` (`fldGqPKqcmtZ7xKt59d`): `singleLineText`
- `public_username` (`fldfQaTRsXVq0dVQV5n`): `singleLineText`
- `display_name` (`fld2Dxo5vhe89RRVkah`): `singleLineText`
- `bio` (`fldX4Sq8PpV7Oqf1aiI`): `longText`
- `avatar_url` (`fldlmW7JdG5G6TqtUMU`): `singleLineText`
- `profile_visibility` (`fld5LdXqVNgM6H0xdmX`): `singleSelect`; options: `private`, `public`, `members`
- `created_at` (`fldr0Wso6KdpDWbHi7w`): `createdTime`
- `updated_at` (`fldCs3eRRTRxG2ed7Y8`): `lastModifiedTime`
- `user_id` (`fldj9uA6G5gNeOzGckG`): `link`; relation: oneOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `avatar_type` (`fldfXxBWS2eXE9Kp53z`): `singleSelect`; options: `preset`, `custom_url`, `uploaded`, `generated`
- `instagram_url` (`fldevwTUCIKD4vZ0Hi8`): `singleLineText`
- `whatsapp_url` (`fld4z8g3A8jOujTzZwc`): `singleLineText`
- `linkedin_url` (`fldhg6ppU0tH1H4EgwH`): `singleLineText`
- `personal_website_url` (`fldy8STwrfaaUsWbSHg`): `singleLineText`

### UserPrivacyPreferences (tblBqY7HYRNqX0fFLQY)

- `preference_id` (`fldbJwWshfC1JtBuVy1`): `singleLineText`
- `public_profile_visible` (`fldoYP76Z8EFJRtDrQI`): `checkbox`
- `reviews_visible` (`fldqyxwuJm2lsiDRTrp`): `checkbox`
- `group_memberships_visible` (`fldcfvsqFYz6UZici96`): `checkbox`
- `event_activity_visible` (`fldyLrC1eHKguMji5DG`): `checkbox`
- `contact_permissions` (`flde0PnJDxlOYlll6Dh`): `singleSelect`; options: `none`, `members`, `businesses`, `all`
- `personalized_recommendations` (`fldMIdHOl0mdjo86aUw`): `checkbox`
- `social_incentives` (`fldoWsEuNjapuF7R6wQ`): `checkbox`
- `marketing_email` (`fldzB4lRvbiCHSBUaGd`): `checkbox`
- `marketing_whatsapp` (`fldMNSzjayuFinR4NLc`): `checkbox`
- `marketing_push` (`fldxUTjPNNcMAGUcxtB`): `checkbox`
- `updated_at` (`fldoIZiQwU7LH5VwesX`): `lastModifiedTime`
- `user_id` (`fldHLcJ0dJ9uUS155Ys`): `link`; relation: oneOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `public_username_visible` (`fldn7ZChfrVZNzTzBlE`): `checkbox`
- `bio_visible` (`fld30649N7Fq5TlJuv9`): `checkbox`
- `social_links_visible` (`fldAW79C12SpmqZiszr`): `checkbox`
- `sponsored_discovery` (`fldaoDq7a8CA94LvTp4`): `checkbox`

### Businesses (tbl8IOboEGdwYHqJck2)

- `business_id` (`fldvSMOV3F8IbsUj8hD`): `singleLineText`
- `business_reference` (`fldqsyzWF6Lq3cmDlEx`): `singleLineText`
- `name` (`fld41NhQAhsoasa6SKw`): `singleLineText`
- `category` (`flddTownPFkO0WV68X9`): `singleLineText`
- `description_es` (`fldc2xh7Hgdr0yzDiKB`): `longText`
- `description_en` (`fldvSf0QMkULsxDkVMV`): `longText`
- `services_json` (`fldUYXP3fdlDiTriiGb`): `longText`
- `languages_json` (`fldtkcC6rtkJDcdg6Wq`): `longText`
- `logo_url` (`fldbcmmrfuGUxZF12oz`): `singleLineText`
- `cover_url` (`fldTJkqb9fyLno5WsQF`): `singleLineText`
- `status` (`fldeXxsTf3lMvgTb7FZ`): `singleSelect`; options: `draft`, `published`, `archived`, `suspended`
- `public_visibility` (`fldKuBSEkWKftnO36C4`): `singleSelect`; options: `private`, `public`, `unlisted`
- `lifecycle_status` (`fldCisrAPTATDms8dac`): `singleSelect`; options: `active`, `inactive`, `nearing_archive`, `archived`
- `published_at` (`fldBcf74GTp7JIqZkvy`): `date`
- `last_activity_at` (`fldQRPKoEmNV5caFaG7`): `date`
- `archive_at` (`fldEtB14KO72mD5GwZO`): `date`
- `archived_at` (`fldNWzsDzLzaYAinaTN`): `date`
- `archived_reason` (`fldvj3gH0WVJJvHvqaN`): `longText`
- `created_at` (`fldbwaSsmugATyalIq5`): `createdTime`
- `updated_at` (`fld5Z2KbG7udzgrFRbL`): `lastModifiedTime`
- `created_by_user_id` (`fld9LIf72NaQjEKXlHM`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `parent_brand_id` (`fldtqZyg708IMSdyvpJ`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `Businesses` (`fldnCxacn7NHQJHsYFy`): `link`; relation: oneMany -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldsjXHaTqsEJGvwS1H`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `BusinessContactDetails` (`fldWhFt3NeuxjSGIL7U`): `link`; relation: oneOne -> BusinessContactDetails (tbltUE83U9V7QTWqA1T)
- `BusinessManagers` (`fldqu8VrjZXyQix1jXO`): `link`; relation: oneMany -> BusinessManagers (tblBZ0dELDl3z7gTTOw)
- `BusinessMedia` (`fld20KVQH5zNzGJGCzv`): `link`; relation: oneMany -> BusinessMedia (tblNDTuVfCgJZyUsB8Y)
- `AnalyticsEvents` (`fldvbdCpG4PRJrHmAq0`): `link`; relation: oneMany -> AnalyticsEvents (tblIC6qV8KN4MzzGXtb)
- `FeatureEntitlements` (`fldoe5wJEnEV8RzF1GM`): `link`; relation: oneMany -> BusinessFeatureEntitlements (tblxdmuLBv4TLP5KDVE)
- `BusinessSubscriptions` (`fldLpZedpNfRmrClJD8`): `link`; relation: oneMany -> BusinessSubscriptions (tbloyccWq6gEARYGLJH)
- `PaymentEvents` (`fldt5g6eRD1NsweW77r`): `link`; relation: oneMany -> PaymentEvents (tbly21wpo66mG81LZHu)
- `ContactAnalyticsEvents` (`fldMHqwIQIBvU6K7n4r`): `link`; relation: oneMany -> ContactAnalyticsEvents (tbl7QlJqX4pTlFV8PAv)
- `Events` (`fldnJMKBUsTjichdsUj`): `link`; relation: oneMany -> Events (tblOA1Eb39I2imf93JV)
- `Groups` (`fldvd5RSVZ6MtXGQKON`): `link`; relation: oneMany -> Groups (tblHILTdHKnZTaHRL3P)
- `Posts` (`fld0sJclfMNeGM9qHDb`): `link`; relation: oneMany -> Posts (tblGAutYOeq09yHxIfo)
- `Reviews` (`fldwfdcXGDk4ppNJC59`): `link`; relation: oneMany -> Reviews (tblKpxxGnkvVJbLLRbF)
- `ReviewResponses` (`fldSASKcJYkRovR4AYo`): `link`; relation: oneMany -> ReviewResponses (tblhocc6wtg3ByqxASA)
- `Offers` (`fldFpIxzpodNi66QFko`): `link`; relation: oneMany -> Offers (tblf2PeEIunfjiRaoVV)
- `SponsorCampaigns` (`fldCf6EvHtYBsRV9fxI`): `link`; relation: oneMany -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `MonetizationPaymentEvents` (`fldPpupxXFPqpxqP8es`): `link`; relation: oneMany -> MonetizationPaymentEvents (tblRYvN9yW1mi6vl55C)
- `PlayavidaLoyaltyPrograms` (`fld5iZZa35WIObg3iZm`): `link`; relation: oneMany -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `PlayavidaLoyaltyTransactions` (`fldZ3P7Zg6xTvKGJ0cc`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)
- `PlayavidaLoyaltyQRs` (`fldOQEexnOEgrhrs3GJ`): `link`; relation: oneMany -> PlayavidaLoyaltyQRs (tblf0TqIOWmtXFi6k2K)
- `ExternalLoyaltyConnections` (`fldftWyq6WwUAfL1LLv`): `link`; relation: oneMany -> ExternalLoyaltyConnections (tbl9zi1E9KfuimQocvT)
- `LoyaltyAnalytics` (`fld91AoQQjilzJ8g3ac`): `link`; relation: oneMany -> LoyaltyAnalytics (tblOZrYZdyZQqrXvG7F)
- `PlayavidaStaffAccounts` (`fldwnRQrtE4WERLKjQt`): `link`; relation: oneMany -> PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)
- `PlayavidaStaffActions` (`fldYnvnSp7yL96WWbd3`): `link`; relation: oneMany -> PlayavidaStaffActions (tblVVKsUd6LQraQKypB)
- `PlayavidaEngagementCampaigns` (`fldwKIjGZNHM0tVydxu`): `link`; relation: oneMany -> PlayavidaEngagementCampaigns (tblqyhBcVEn6Ab8owZh)
- `PlayavidaCustomerCards` (`fldr7fIGRufgY9tGZLF`): `link`; relation: oneMany -> PlayavidaCustomerCards (tblOVokzPDd71IyedJu)
- `BusinessBranches` (`fldQCdJ1HGJLobCpwQK`): `link`; relation: oneOne -> BusinessBranches (tblId1kLGb9QDGiYXlt)
- `MlsLinks` (`fld3KCmk6dO1z0Wp6I8`): `link`; relation: oneMany -> MlsLinks (tblzMdiFf495i0vaXEd)
- `name_es` (`fldh6jnsbDffR3Kimmp`): `singleLineText`
- `name_en` (`fldwk2ROk6TLLkLHnHQ`): `singleLineText`
- `verification_status` (`fldVHmeeh1Cn98nacrg`): `singleSelect`; options: `unverified`, `pending`, `verified`, `rejected`, `suspended`
- `verified_at` (`fldkGtqSYkhVwOvYD5b`): `date`
- `verification_method` (`fldd8nXUPSzkcX3rWs0`): `singleLineText`
- `translation_status` (`fldAubL538d5XFLRXCH`): `singleSelect`; options: `missing`, `partial`, `complete`, `machine_draft`
- `source_language` (`fldoctxO7rOvCgx3fpc`): `singleSelect`; options: `es`, `en`
- `machine_translation_status` (`fldX4ZIIsGotEJeOMIe`): `singleSelect`; options: `none`, `draft`, `reviewed`, `rejected`
- `translation_status_es` (`fldNpCyCrgN9wgPnYPw`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_status_en` (`fldjztu6FUsWNXsY5dh`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_source_es` (`fldp45Mc3Oi6BJ0TBYD`): `singleLineText`
- `translation_source_en` (`fldH81lNjxjZPMBvpk1`): `singleLineText`
- `translation_reviewed_at_es` (`fldMxWcQMBvIO5GhRHl`): `date`
- `translation_reviewed_at_en` (`fld5ojEsT4OiwGpeFcz`): `date`
- `Organizers` (`fld7tFMcs6zfg6npwfl`): `link`; relation: oneMany -> Organizers (tblmDooGwHyQGdr5KXn)
- `EventPartnerships` (`fldvhIlseAtwPBu1Vbv`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `PlayavidaBonusSubmissions` (`fldDW9MrvNhEQFv7NTw`): `link`; relation: oneMany -> PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)
- `PlatformSubscriptions` (`fldD8ReKuBC3PZriyPP`): `link`; relation: oneMany -> PlatformSubscriptions (tblniV4rYBKuBjHiPk8)
- `PlatformPaymentEvents` (`fldqHeC6t3Z5F7svHny`): `link`; relation: oneMany -> PlatformPaymentEvents (tbl1TOw9us9ObkXMmHR)
- `BusinessInquiries` (`fldQDd1Z1LuKBzgsQcO`): `link`; relation: oneMany -> BusinessInquiries (tblVqS6wUBbpH3MBTIF)
- `StaffPinSecurityEvents` (`fldPfwccamYx3u9Wncu`): `link`; relation: oneMany -> StaffPinSecurityEvents (tblciuNt63idIfaLnIB)
- `PlayavidaLoyaltyCardCycles` (`fldROPPmSvr9nJDbiHu`): `link`; relation: oneMany -> PlayavidaLoyaltyCardCycles (tblaXjpNTunNEk9pvhf)
- `PlayavidaDynamicQRChallenges` (`fld9qDVGrqopCj58ELU`): `link`; relation: oneMany -> PlayavidaDynamicQRChallenges (tblPfGTmoL9vWyI7kl0)
- `PlayavidaCustomerActionCompletions` (`fldHA9vhazrhCO9Asvi`): `link`; relation: oneMany -> PlayavidaCustomerActionCompletions (tblorS1uwoPiOy06gAk)
- `is_demo_content` (`fld7eeQPfgzwJEAdBSw`): `checkbox`
- `needs_review` (`fldiHi4puBjMWHuVDJI`): `checkbox`
- `cleanup_status` (`fld9kW555bjh4H2ZNdF`): `singleSelect`; options: `active`, `review_required`, `disabled`, `archived`, `queued_for_purge`, `purged`, `restored`
- `AnalyticsMetricAggregates` (`fldciJUQjv6BjxP6soS`): `link`; relation: oneMany -> AnalyticsMetricAggregates (tblKJ3vSsiJJPiMrRfy)

### BusinessContactDetails (tbltUE83U9V7QTWqA1T)

- `contact_id` (`fldO8QrHCRD7AsQWmnG`): `singleLineText`
- `address` (`fldMHkETeOqDFrgD1uw`): `singleLineText`
- `city` (`fldGWKlE0JZHLGk7Nug`): `singleLineText`
- `region` (`fldTE8Y27zSTHzKjfrM`): `singleLineText`
- `latitude` (`fldKKZvT7NkpFZPr1aE`): `number`
- `longitude` (`fldFJ9ghnoJR4tuixNB`): `number`
- `phone` (`fld4BDaGpgx7AxZg7qr`): `singleLineText`
- `email` (`flddbVQ29CJK4Dp3jbD`): `singleLineText`
- `whatsapp` (`fldYygA3qiWM6XiaJ80`): `singleLineText`
- `website` (`fldcJMh9PGM8EctYimN`): `singleLineText`
- `social_links_json` (`fldaYghNZOn81BFgZIt`): `longText`
- `booking_url` (`fldOoi1OxwzqWLIqLR6`): `singleLineText`
- `opening_hours_json` (`fldko7elcv1rJQWIhOu`): `longText`
- `contact_visibility_state` (`fld2WVyGeogEBgxwij7`): `singleSelect`; options: `hidden`, `eligible`, `public`
- `updated_at` (`fldoz1QCJzJPfzshd1w`): `lastModifiedTime`
- `business_id` (`fld9cqUIdo6fFBdOKQA`): `link`; relation: oneOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `postal_code` (`fldRPZIwArBhjoJdDy4`): `singleLineText`
- `notes_private` (`fldJI5mzIFWWERymYnM`): `longText`

### BusinessManagers (tblBZ0dELDl3z7gTTOw)

- `manager_id` (`fld1sZ2KsqHYR4D6aEN`): `singleLineText`
- `role` (`fldHJ0u8ZKv2BcPAVVo`): `singleSelect`; options: `creator`, `owner`, `manager`, `editor`, `analyst`
- `permissions_json` (`fldWC2MdCqC2Y0d9Oly`): `longText`
- `status` (`fldKRJbqOSCDePGUYhH`): `singleSelect`; options: `invited`, `active`, `suspended`, `revoked`
- `created_at` (`fldb4BLhHcmlqa8LRjw`): `createdTime`
- `updated_at` (`fldXZE1VWMdUmK97Yme`): `lastModifiedTime`
- `business_id` (`fldYM6OSF0jXRFfRpu1`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `user_id` (`fldwkq0H4zMqQQCexJY`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### BusinessMedia (tblNDTuVfCgJZyUsB8Y)

- `media_id` (`fld8vB70qR88JhksfgT`): `singleLineText`
- `media_type` (`fldjKBZztOQzuRVuQJX`): `singleSelect`; options: `logo`, `cover`
- `media_url` (`fldlnaLiARlaXH8U2le`): `singleLineText`
- `alt_text` (`fldfr0WFc822hLsjYqG`): `singleLineText`
- `sort_order` (`fldWU1NnVsvp7rc09t9`): `number`
- `status` (`fld4QQW9cGXt0yhPNAB`): `singleSelect`; options: `draft`, `active`, `archived`
- `created_at` (`fld3oQROY93Oypk7PZ2`): `createdTime`
- `updated_at` (`fldFRCufTNynFU1iUca`): `lastModifiedTime`
- `business_id` (`fldBA0AnhERO5ijWbmX`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `uploaded_by_user_id` (`fldNhNMv9GRXpIh0f4r`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `media_role` (`fld6CAKkh2dvTvaCNlv`): `singleSelect`; options: `logo`, `cover`, `gallery`

### EntityReferences (tbl65eT3PEGL66qJzjj)

- `entity_reference_id` (`fldv2IHkiB4ZN8sHp3I`): `singleLineText`
- `reference` (`fldbafBBSkLrU5nmwsO`): `singleLineText`
- `entity_type` (`fldegQo1dtVc8pWJryG`): `singleSelect`; options: `user`, `business`, `event`, `group`, `organizer`, `post`, `review`, `image`, `offer`, `loyalty_program`, `sponsor`, `report`, `sponsor_offer`
- `entity_id` (`fldt5eCwL3LCiu9VxWs`): `singleLineText`
- `location_code` (`fldpNf9X7D4k9baV0YP`): `singleLineText`
- `searchable_text` (`fldbNpkFFD8FBwEFvuv`): `longText`
- `status` (`fldjeSZpSLWJvXnwGJG`): `singleSelect`; options: `active`, `archived`, `revoked`
- `created_at` (`fldSadup4tQHjSeEs08`): `createdTime`

### QRIdentities (tblSBIa2tbHlaHJkAVC)

- `qr_id` (`fldYu1sQwRS59KMV7ie`): `singleLineText`
- `qr_reference` (`fldgU2ynDZ3hTVVgDbf`): `singleLineText`
- `entity_type` (`fldEg9KVCrG03kvVoR3`): `singleSelect`; options: `business`, `event`, `loyalty`, `campaign`, `group`
- `entity_id` (`fldI9LyQFkv8M05SHh7`): `singleLineText`
- `destination_path` (`fldMaFjbigsQYWlXbYe`): `singleLineText`
- `location_code` (`fld2yZDLYB9ZL4NoZWk`): `singleLineText`
- `status` (`fldcMziBZkku2DgBfyf`): `singleSelect`; options: `active`, `inactive`, `revoked`
- `scan_count` (`fldpU9RyJxJqxDEYsqJ`): `number`
- `created_at` (`fldkyH6zXgTaBJDubCg`): `createdTime`
- `updated_at` (`fld8HUFVXBQLyh4kjes`): `lastModifiedTime`

### Reports (tblMXJBJkxwtugJKI9o)

- `report_id` (`fldR8SuXIo28yc6tOI4`): `singleLineText`
- `report_reference` (`fldGOC6lSoa3sizHL4c`): `singleLineText`
- `target_entity_type` (`flduDOZQUsOHp1PGIyP`): `singleSelect`; options: `user`, `business`, `event`, `group`, `post`, `review`, `image`, `offer`, `loyalty_program`, `profile`, `organizer`, `sponsor_offer`
- `target_entity_id` (`fldjcFfKr3fz0izs7Hc`): `singleLineText`
- `target_reference` (`fldxWE7ZaqIRHS0SxZE`): `singleLineText`
- `reason` (`fld1hVe6fPSnxIkP16J`): `singleSelect`; options: `inaccurate_information`, `image_issue`, `spam`, `scam`, `impersonation`, `harassment`, `privacy_issue`, `copyright_issue`, `inappropriate_content`, `fake_review`, `illegal_activity`, `other`, `incorrect_information`, `safety_concern`
- `description` (`fldsszCFipSuwvSL5F2`): `longText`
- `content_snapshot_json` (`fldIXVjUPQcwyD0BNM3`): `longText`
- `status` (`fldpxSUMUWAxKHZQVP2`): `singleSelect`; options: `open`, `reviewing`, `actioned`, `dismissed`, `escalated`
- `moderator_notes` (`fldea7Ja0usEzGmVqwW`): `longText`
- `resolution` (`fldMXKxSNNQF5ARMpnr`): `longText`
- `created_at` (`fldupgc6oeQ9HsGiqAg`): `createdTime`
- `updated_at` (`fldRoG4lOpJLncKltV3`): `lastModifiedTime`
- `resolved_at` (`fldr5OIkx1K9jcz4ehB`): `date`
- `reporter_user_id` (`fld5vi5zObTh1mF6dvQ`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `assigned_to_user_id` (`fldJYTFpz0qDKVPdN9S`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `appeal_status` (`fld23m48zXf8rDbBeBg`): `singleSelect`; options: `none`, `requested`, `reviewing`, `resolved`
- `appeal_notes` (`fldq8NYx7JwyAc8HCfw`): `longText`
- `duplicate_fingerprint` (`fld4u9RmSmZ1vMSSrUN`): `singleLineText`
- `duplicate_of_report_id` (`fldfb6YqXecVq49ZBCr`): `link`; relation: manyOne -> Reports (tblMXJBJkxwtugJKI9o)
- `Reports` (`fldO4IXnm9S4JMHD4S7`): `link`; relation: oneMany -> Reports (tblMXJBJkxwtugJKI9o)
- `reporter_public_reference` (`fldwZSDJbmuno1GqlEG`): `singleLineText`

### AnalyticsEvents (tblIC6qV8KN4MzzGXtb)

- `analytics_event_id` (`flduUiBA1YbUTxUBHR8`): `singleLineText`
- `event_type` (`fldWvFzRfOTi5G4ZnF0`): `singleSelect`; options: `profile_viewed`, `business_qr_scanned`, `profile_shared`, `business_created`, `business_published`, `business_updated`, `report_submitted`, `language_selected`
- `entity_type` (`fldlmFxsenogeg2iUMO`): `singleSelect`; options: `user`, `business`, `event`, `group`, `review`, `offer`, `report`
- `entity_id` (`fldlTYFvDUOjq9lpZM5`): `singleLineText`
- `entity_reference` (`fldU4t5KlTgMgJ1yqrl`): `singleLineText`
- `anonymous_session_id` (`fldwZTESQwn6BWaGXDp`): `singleLineText`
- `language` (`fldLwhGtqdc8OFazewT`): `singleSelect`; options: `es`, `en`
- `metadata_json` (`fldLTaP0jHOlCXCBHFm`): `longText`
- `created_at` (`fldhm5X0DqOdmlPufGK`): `createdTime`
- `business_id` (`fldWJWopT4YvC8u74Cg`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `user_id_nullable` (`fldBeEiUDoj0AiKKDxn`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `location_id` (`fldlya5Rpf7n4OGMUp4`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### BusinessFeatureEntitlements (tblxdmuLBv4TLP5KDVE)

- `entitlement_id` (`fldhX1w3epTx20KTOzx`): `singleLineText`
- `feature_key` (`flde5TLeyXIAfbHXvAt`): `singleSelect`; options: `business.contact_modal`, `business.public_address`, `business.public_map`, `business.public_phone`, `business.public_email`, `business.public_whatsapp`, `business.public_website`, `business.public_social_links`, `business.booking_link`, `business.review_response`, `business.offers`, `business.gallery`, `business.staff`, `business.featured_listing`, `loyalty.native`, `loyalty.tiered_rewards`, `loyalty.engagement_campaigns`, `business.inbox`, `business.pro_analytics`, `business.loyalty_native`
- `status` (`fldd6W9SpPfs8gCuW1r`): `singleSelect`; options: `inactive`, `pending`, `active`, `grace_period`, `expired`, `suspended`, `revoked`, `manually_granted`, `manually_revoked`
- `source` (`fldGjD7ZQvBsnW5Wpgs`): `singleSelect`; options: `manual`, `plan`, `promotion`, `migration`
- `starts_at` (`fldpi8RmMnqhEYFXYmC`): `date`
- `ends_at` (`fld0B4Ltd5LE1TonbXP`): `date`
- `created_at` (`fldLVebUxMSI9m3gnaU`): `createdTime`
- `updated_at` (`fldhj21MQ3ZnSg6AERb`): `lastModifiedTime`
- `business_id` (`fldIvSp0vN9wQizbKts`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `provider` (`fldvBBExdLP4Ymmeovo`): `singleLineText`
- `external_reference` (`fld5iSWavhzkjfD4kW1`): `singleLineText`
- `subscription_id_nullable` (`fldUrV9nMiGZMzdPVR0`): `link`; relation: manyOne -> PlatformSubscriptions (tblniV4rYBKuBjHiPk8)

### BusinessPlans (tblfB89TSYURsaZ267N)

- `plan_id` (`fldHWTdJzbFRTaPGasA`): `singleLineText`
- `plan_key` (`fldb6osKlzYMTFYUhRy`): `singleLineText`
- `name_es` (`fld7ThgKt1CBnkvIsAJ`): `singleLineText`
- `name_en` (`fldInhVITtfL7cjipuE`): `singleLineText`
- `billing_interval` (`fldCFpsksSMNUPz48Ek`): `singleSelect`; options: `monthly`, `quarterly`, `annual`, `one_time`
- `currency` (`fldXlbf2g06gUDmEgeB`): `singleLineText`
- `stripe_product_id` (`fld25SMZ2451IIwGu2T`): `singleLineText`
- `stripe_price_id` (`fldIwZKSSZqNNSFWzsl`): `singleLineText`
- `active` (`fldXuhiyTx8j4yor2Jm`): `checkbox`
- `created_at` (`fld8iQvWSr1MrzIphyv`): `createdTime`
- `updated_at` (`fldf8VlvmbnoPPdYBSN`): `lastModifiedTime`
- `BusinessSubscriptions` (`fld3IgIlGohM9Mts2O6`): `link`; relation: oneMany -> BusinessSubscriptions (tbloyccWq6gEARYGLJH)
- `PlatformSubscriptions` (`fldjKauernUTNNo6H8l`): `link`; relation: oneMany -> PlatformSubscriptions (tblniV4rYBKuBjHiPk8)
- `PlatformPaymentEvents` (`fld8432ABVF2u4J2PrL`): `link`; relation: oneMany -> PlatformPaymentEvents (tbl1TOw9us9ObkXMmHR)
- `SponsorCampaigns` (`fld7tFGU2zFQwfHNer2`): `link`; relation: oneMany -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `target_account_type` (`fldN7XuKiuIyfGTK8Q6`): `singleSelect`; options: `sponsor`, `business`
- `billing_interval_months` (`fld87Fo8sUGOf3WhhH0`): `number`
- `amount_mxn` (`fldruKAc57j6FmO3Bvv`): `number`
- `equivalent_monthly_mxn` (`fldUquh0nwpeevXhlFN`): `number`
- `requires_content_readiness` (`fldzsrkpkzNtu8LF5SA`): `checkbox`
- `requires_manual_approval` (`fldnUmRIjyHH6iwjLoX`): `checkbox`
- `entitlement_grants_json` (`fldsUCnrtELrXzMGyJh`): `longText`
- `grace_period_days` (`fldsC0KaKHuoftXkAgN`): `number`

### BusinessSubscriptions (tbloyccWq6gEARYGLJH)

- `subscription_id` (`fldJ2sQQWdRW2uQGoKz`): `singleLineText`
- `stripe_customer_id` (`fld6g9zO2XiNy9V9qqE`): `singleLineText`
- `stripe_subscription_id` (`fldCwt9O9RDBw4X2ybk`): `singleLineText`
- `status` (`fldMD0Ztdl6jKSylW1H`): `singleSelect`; options: `pending`, `active`, `past_due`, `canceled`, `expired`, `grace_period`
- `current_period_start` (`fld1XTtRP2sNjRcLPB2`): `date`
- `current_period_end` (`fld5Wt7V4guqE5AiHV4`): `date`
- `cancel_at_period_end` (`fldS9vxZW7TdvElvFPr`): `checkbox`
- `canceled_at` (`fldpQD42tfeWu4pCcSF`): `date`
- `grace_period_start` (`fldWuBOvsa6XGleSEO4`): `date`
- `grace_period_end` (`fldhSm3Jg6DmX1CmlsJ`): `date`
- `contact_visibility_state` (`fldi43YvefolwxsGPY9`): `singleSelect`; options: `private`, `active`, `grace_period`, `hidden`
- `private_data_retention_state` (`fldlwE3CV5WZZirhdrQ`): `singleSelect`; options: `retained`, `export_requested`, `deletion_requested`
- `created_at` (`fldJq0btjgoUkdQcHZA`): `createdTime`
- `updated_at` (`fldi3jynrZv2GZ6WY4K`): `lastModifiedTime`
- `business_id` (`fldLdkazl6bWVU45mZB`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `user_id` (`fldG6dUUWE9CkdVK6ya`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `plan_id` (`fldqGcimEJMhKecYQmq`): `link`; relation: manyOne -> BusinessPlans (tblfB89TSYURsaZ267N)

### PaymentEvents (tbly21wpo66mG81LZHu)

- `payment_event_id` (`fldiLLorwklKUGxRVks`): `singleLineText`
- `provider` (`fld6qAjUswd0vYR9EeG`): `singleSelect`; options: `stripe`, `oxxo`, `manual`
- `external_event_id` (`fldFJUKCdgR7amLxf3q`): `singleLineText`
- `event_type` (`fldsHyifpMC2njEujeG`): `singleLineText`
- `status` (`fldp3SaRjx5MpGlaoI2`): `singleSelect`; options: `pending`, `processed`, `failed`, `ignored`
- `payload_summary_json` (`fldWtpdF9uNMWw2le6N`): `longText`
- `processed_at` (`fldzuqoM66QY10wD063`): `date`
- `error_message` (`flde89dxI2ThVQGCwfL`): `longText`
- `created_at` (`fldZRTIT9fbUFl3nXIa`): `createdTime`
- `business_id` (`fldbdbDrtKxiolx36AW`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)

### ContactAnalyticsEvents (tbl7QlJqX4pTlFV8PAv)

- `event_id` (`fldRZjbi62XqglYsiNk`): `singleLineText`
- `anonymous_session_id` (`fldqKYSnfGtnMZIESKr`): `singleLineText`
- `event_type` (`fld9lhwDA1Iv8a7Qpsc`): `singleSelect`; options: `contact_modal_opened`, `address_viewed`, `map_opened`, `directions_clicked`, `phone_revealed`, `email_clicked`, `whatsapp_clicked`, `website_clicked`, `social_link_clicked`, `booking_clicked`, `contact_option_revealed`, `message_started`, `message_submitted`, `sponsor_impression`, `sponsor_card_focused`, `sponsor_modal_opened`, `sponsor_external_link_clicked`, `sponsor_favourited`, `sponsor_reported`
- `field_key` (`fldS4DkdLlSpXJb2qna`): `singleLineText`
- `language` (`fldxnF2DpOX0uBZ2ASC`): `singleSelect`; options: `es`, `en`
- `created_at` (`flduThI2n1EAZaG1NQ5`): `createdTime`
- `business_id` (`fldHzRp7J7DFs8Umz4i`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `viewer_user_id_nullable` (`fldNKKKFoAEEDhtTe7p`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `location_id` (`fldyX8mLtvG2uC30p36`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `sponsor_offer_id_nullable` (`fld8EEAXpxBts7QoojY`): `link`; relation: manyOne -> SponsorOffers (tblvWVjcFntkZ3zi5lw)
- `entity_type` (`fldxHXaBzc2ahpcGLp5`): `singleSelect`; options: `business`, `sponsor_offer`
- `entity_id` (`fldW2ELImKBqkLZIwOn`): `singleLineText`
- `entity_reference` (`fldPQdcp8CJ9fhnjiYW`): `singleLineText`
- `metadata_json` (`fldHfimRa1nJvZ0Ctkw`): `longText`

### EventCategories (tbl8L4iHQCWMLBmCvSo)

- `category_id` (`fldLFPbjyd5EA8t1W9b`): `singleLineText`
- `name_es` (`fldlumv8DdCRAAdyev8`): `singleLineText`
- `name_en` (`fldxMEKKfhiBqrBpwxs`): `singleLineText`
- `slug` (`fldhm36eTRKsGKnATGZ`): `singleLineText`
- `active` (`fldumE38K9a3BXVDrpN`): `checkbox`
- `sort_order` (`fldT7USkkqBDs4tWZ5B`): `number`
- `Events` (`fldRb1C6N9zpWQqwDIc`): `link`; relation: oneMany -> Events (tblOA1Eb39I2imf93JV)

### Events (tblOA1Eb39I2imf93JV)

- `event_id` (`fldOs2nt9lcypBPgADw`): `singleLineText`
- `event_reference` (`fldlMbmtxaforysOvH1`): `singleLineText`
- `title_es` (`fldWIKqo9uLTa8Q0ru3`): `singleLineText`
- `title_en` (`fldmlhyEyKkk2A6DTXN`): `singleLineText`
- `description_es` (`fldhaGaz3cmNJehlbaP`): `longText`
- `description_en` (`fld6T3gwjppw51UwJim`): `longText`
- `image_url` (`fldv9wZ7x0kRSKdjqLa`): `singleLineText`
- `start_at` (`fld7CzkezqNRG54sInr`): `date`
- `end_at` (`fldoIFxz8FUfq6y5aov`): `date`
- `timezone` (`fld5u6CM8EorXypmnrU`): `singleLineText`
- `recurrence_json` (`fldy1jKiroFDBy3CoXI`): `longText`
- `event_location_label` (`fld02igUXCTQYwlOxvm`): `singleLineText`
- `event_address_private` (`fldIMPqVN0Z4RFEC9vP`): `singleLineText`
- `latitude_private` (`fldO3WdF7ZerhcKAVUc`): `number`
- `longitude_private` (`fldsLhIWPOC8X9fAt3d`): `number`
- `location_visibility` (`fldJpEQvq7QeXvQwtpn`): `singleSelect`; options: `exact`, `approximate`, `hidden`
- `registration_url` (`fldjxxFNDHBIe4fdf0x`): `singleLineText`
- `ticket_url` (`fldWJViUiefRC3ihZAm`): `singleLineText`
- `paid_status` (`fld6qd3Vb4du70nPk4C`): `singleSelect`; options: `free`, `paid`, `donation`
- `capacity` (`fldEmYEXApjiFUF435J`): `number`
- `status` (`flditvmgVaCb18A4EoM`): `singleSelect`; options: `draft`, `pending_moderation`, `published`, `canceled`, `cancelled`, `completed`, `archived`, `suspended`
- `published_at` (`fld4tDmzDe5QYXz6bIN`): `date`
- `archived_at` (`fldjqrHjIAC9daYRdrJ`): `date`
- `created_at` (`fldZEVUbUEKMk0FQMHQ`): `createdTime`
- `updated_at` (`fldGQjJ9YwHDW4CIeYP`): `lastModifiedTime`
- `creator_user_id` (`fldPBBc7Zivhr8723z5`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `organizer_business_id_nullable` (`fldRG96X97emztoh6iW`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldCSCRKQGezhZoBpfX`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `category` (`fldpipXj0WssVDH2X6A`): `link`; relation: manyOne -> EventCategories (tbl8L4iHQCWMLBmCvSo)
- `EventManagers` (`fldalC7Qh8pGSxO2Ivj`): `link`; relation: oneMany -> EventManagers (tblCCKm0CjWqllQyh4Z)
- `EventQRIdentities` (`fldIOmKQKjIpv9SlWHD`): `link`; relation: oneMany -> EventQRIdentities (tblob2Fc8FBUDbYbGf9)
- `EventAnalytics` (`fldiREygZ5hePA5nDPW`): `link`; relation: oneMany -> EventAnalytics (tblwKstzAdAZYtNrIEE)
- `Posts` (`fldqUg0VLsGNHlxnxSm`): `link`; relation: oneMany -> Posts (tblGAutYOeq09yHxIfo)
- `organizer_group_id_nullable` (`fldxGNzEfyGAdHl1c0S`): `link`; relation: manyOne -> Groups (tblHILTdHKnZTaHRL3P)
- `SponsorCampaigns` (`fldMXuwtYRshGXUaavJ`): `link`; relation: oneMany -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `EventRSVPs` (`fldpk75S2Pu4LSqxlRM`): `link`; relation: oneMany -> EventRSVPs (tblwzt47e24t1dPGifV)
- `translation_status` (`fldt03QK9yftgAvHdKh`): `singleSelect`; options: `missing`, `partial`, `complete`, `machine_draft`
- `source_language` (`flda5pCKNiOf7HuwU2q`): `singleSelect`; options: `es`, `en`
- `machine_translation_status` (`fldjvfYNXrhVxXrPs4R`): `singleSelect`; options: `none`, `draft`, `reviewed`, `rejected`
- `translation_status_es` (`fldpgPXrYsW6ah38rzf`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_status_en` (`fldyLQpZsyPK0kOSc8s`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_source_es` (`fldomd7dHJ5hMEdEdq7`): `singleLineText`
- `translation_source_en` (`fldM3hRX2mMsptDtpbL`): `singleLineText`
- `translation_reviewed_at_es` (`fldmwQklWmHg5fjAiJN`): `date`
- `translation_reviewed_at_en` (`flddCtOkAg0tui1SMAq`): `date`
- `organizer_user_id_nullable` (`fldbkBdyYrmF4VAS80f`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `price_amount` (`fldXfzmMzeR3TCyfYog`): `number`
- `price_currency` (`fldAhvkrd0ccEya1TvV`): `singleLineText`
- `language_tags_json` (`fldh3WC6ngCjNrgxSdA`): `longText`
- `family_friendly` (`fldogX1p911yD0APv1G`): `checkbox`
- `organizer_display_label` (`fld8yDPZlW6Wma3Uq9r`): `singleLineText`
- `cancellation_reason` (`fldd9IKkYZp6OIKx3RG`): `longText`
- `external_ticket_provider` (`fldFzdSnELzbV3XSHg2`): `singleLineText`
- `last_confirmed_at` (`fldmhadmhBM6PQFBIJu`): `date`
- `organizer_id_nullable` (`fldWaTiqATa8iTzUIIn`): `link`; relation: manyOne -> Organizers (tblmDooGwHyQGdr5KXn)
- `EventPartnerships` (`fldXJxLYPYPEg60QnH7`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `PlayavidaEngagementCampaignVersions` (`fldwL1uLtldjRqBiaYm`): `link`; relation: oneMany -> PlayavidaEngagementCampaignVersions (tblQNAoxZbAfwzriuzM)
- `PlayavidaBonusSubmissions` (`fldL5lPIXgCG3mGIwGs`): `link`; relation: oneMany -> PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)
- `is_demo_content` (`fldHGd9aCxf8dh6KTpM`): `checkbox`
- `needs_review` (`fldQpBN5mHwl5RpXsyc`): `checkbox`
- `cleanup_status` (`fldrz9ktQfvHLf0YaWh`): `singleSelect`; options: `active`, `review_required`, `disabled`, `archived`, `queued_for_purge`, `purged`, `restored`

### EventManagers (tblCCKm0CjWqllQyh4Z)

- `manager_id` (`fld2o1CIlSfZTbDSbfq`): `singleLineText`
- `role` (`fldhfOzOOaQ1Tz4ZCj0`): `singleSelect`; options: `creator`, `owner`, `manager`, `editor`
- `permissions_json` (`fldC7SKJyhLjRkCNsJs`): `longText`
- `created_at` (`fldcMHxfwfco3896NmS`): `createdTime`
- `updated_at` (`fldtRaftrrYH6QqPQm3`): `lastModifiedTime`
- `event_id` (`fld4QRwlrpeADKJCorH`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)
- `user_id` (`fldbsves9hJGADegtYW`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### EventQRIdentities (tblob2Fc8FBUDbYbGf9)

- `qr_id` (`fldaAfyc4emnflFx2kY`): `singleLineText`
- `qr_reference` (`fldJ6m21uGpZYjVeMNY`): `singleLineText`
- `destination_path` (`fldtZ02MQdh7TmLMdsr`): `singleLineText`
- `status` (`fldby8fJnKpQ28Qn9dJ`): `singleSelect`; options: `active`, `inactive`, `revoked`
- `scan_count` (`fldKti8BzRoihzkSPFP`): `number`
- `created_at` (`fldg0KQBKGA3cqqkaAR`): `createdTime`
- `updated_at` (`fldJGjgBxUfBe5ks7th`): `lastModifiedTime`
- `event_id` (`fldvOkWj4dcZEmK7PVi`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)

### EventAnalytics (tblwKstzAdAZYtNrIEE)

- `event_analytics_id` (`fldvyvqAAeXoWmwYYDm`): `singleLineText`
- `event_type` (`fldN4xIhlEsF6cESjXV`): `singleSelect`; options: `page_viewed`, `qr_scanned`, `shared`, `registration_clicked`, `ticket_clicked`, `calendar_clicked`
- `anonymous_session_id` (`fldEAmfLLzndaJRfP8W`): `singleLineText`
- `language` (`fldDt019hD7qfSMGnD1`): `singleSelect`; options: `es`, `en`
- `metadata_json` (`fld4sjJLA5x9rUC6Dk2`): `longText`
- `created_at` (`fldNEq4U1Tj0Vrpfsp2`): `createdTime`
- `event_id` (`fldBeXZMVSQJJ6qP5tt`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)
- `user_id_nullable` (`fldDeO0HWcIzfe96Z0L`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `location_id` (`fldKx8LfeP5dAb2DTs0`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### Groups (tblHILTdHKnZTaHRL3P)

- `group_id` (`flduqTsUULWaNIN5ccE`): `singleLineText`
- `group_reference` (`fldEGxr1AxjNeVru0Bh`): `singleLineText`
- `name_es` (`fld7sqBH964MjmCEGXF`): `singleLineText`
- `name_en` (`fldYzk7A5bQyuLiK4TS`): `singleLineText`
- `description_es` (`fldcsG4U3qEXxwwHq6j`): `longText`
- `description_en` (`fldiIvud4WuufjVRbRN`): `longText`
- `cover_url` (`fldCRdNsYa8ifSSy7BB`): `singleLineText`
- `visibility` (`fldnDzrSYitpAUrOkA6`): `singleSelect`; options: `public`, `private`, `restricted`, `unlisted`
- `join_policy` (`fldCag0WFcqMZuieL0y`): `singleSelect`; options: `open`, `approval`, `invitation`, `invite`
- `status` (`fldxGlriz26pXb4MVWc`): `singleSelect`; options: `draft`, `active`, `suspended`, `archived`
- `created_at` (`fldgkDf2rFzFGpSRdih`): `createdTime`
- `updated_at` (`fldUAIyteG4Wr5SUkDE`): `lastModifiedTime`
- `owner_user_id` (`fld9jb6oGXXpw35GXYN`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `business_id_nullable` (`fldGMIvdVG3dOX0NvWt`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldQfdVeRUvCnTJ2RDu`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `GroupMemberships` (`fld6Ik89JmCh25T8qSv`): `link`; relation: oneMany -> GroupMemberships (tbloXopVSAHrEb16p3t)
- `Posts` (`fldj98jp7yuiRzMaRhD`): `link`; relation: oneMany -> Posts (tblGAutYOeq09yHxIfo)
- `Events` (`fldfq5xVp6jYNvHqDVR`): `link`; relation: oneMany -> Events (tblOA1Eb39I2imf93JV)
- `SponsorCampaigns` (`fld9BRJDgyGm8RCcrnd`): `link`; relation: oneMany -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `translation_status` (`fldqspOiOjW3eFtCRV4`): `singleSelect`; options: `missing`, `partial`, `complete`, `machine_draft`
- `source_language` (`fld4kipLZoJmq1ese6y`): `singleSelect`; options: `es`, `en`
- `machine_translation_status` (`fldir07l0gYa0ZAAOio`): `singleSelect`; options: `none`, `draft`, `reviewed`, `rejected`
- `translation_status_es` (`fldZR22Vd5bn8m6oNKM`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_status_en` (`fldewAw9LyLpegQqcPj`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_source_es` (`fldFocKgLXb1wDfArt6`): `singleLineText`
- `translation_source_en` (`fldoGG3QBT4yy41AWVr`): `singleLineText`
- `translation_reviewed_at_es` (`fldORpH8c03V4XShC7X`): `date`
- `translation_reviewed_at_en` (`fldBdLaW2bnTqI0A984`): `date`
- `objectives_es` (`fldPONpysbjqY6hwhJL`): `longText`
- `objectives_en` (`fldzOrmbBvZU60S6ncs`): `longText`
- `guidelines_es` (`flduxmK9afrC6xsKpSN`): `longText`
- `guidelines_en` (`fldtriC0hOTG6orw3Qp`): `longText`
- `public_member_count` (`fldGizpXM4AGjUHl5ml`): `number`
- `Organizers` (`fldaSLTZXphV4C49oDF`): `link`; relation: oneMany -> Organizers (tblmDooGwHyQGdr5KXn)
- `EventPartnerships` (`fld4Pwyn5tOlSSZ715B`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `is_demo_content` (`fldFSBwm9jRlsPltVTQ`): `checkbox`
- `needs_review` (`fld7mLlyzzXkbv983gH`): `checkbox`
- `cleanup_status` (`fldtBQaKrtW8EMsATI6`): `singleSelect`; options: `active`, `review_required`, `disabled`, `archived`, `queued_for_purge`, `purged`, `restored`

### GroupMemberships (tbloXopVSAHrEb16p3t)

- `membership_id` (`fldCSsEzdSYmXF3W2L0`): `singleLineText`
- `role` (`flda9HGotAUXb6MnZLO`): `singleSelect`; options: `owner`, `admin`, `moderator`, `member`
- `status` (`fldt4xUZX5Xu1thYzzc`): `singleSelect`; options: `pending`, `active`, `banned`, `left`
- `joined_at` (`fldR7FL9vE0JniO8zk9`): `date`
- `approved_at` (`fldxaFTnhM3nB1R3RQj`): `date`
- `banned_at` (`fldgO4Ht88E730qwXrA`): `date`
- `created_at` (`fld08VC2uEbihf83ETG`): `createdTime`
- `updated_at` (`fldSCOtEIXe360UBvLT`): `lastModifiedTime`
- `group_id` (`fld5ZqDstZkqJiiIBRn`): `link`; relation: manyOne -> Groups (tblHILTdHKnZTaHRL3P)
- `user_id` (`fld6kVgllLEFtXA1ZVW`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### Posts (tblGAutYOeq09yHxIfo)

- `post_id` (`fld8IrsgHe4h5MdxHP1`): `singleLineText`
- `post_reference` (`fld2qOjtlfujbnoiKhS`): `singleLineText`
- `content_es` (`fld2B9vwVMJjXCWvuJR`): `longText`
- `content_en` (`fldRLdoqUnoJBec0QGy`): `longText`
- `media_json` (`fldHrTMi7ZC3wfu47PR`): `longText`
- `visibility` (`fld1XyEvZ8AzYobfLkj`): `singleSelect`; options: `public`, `group`, `members`, `private`
- `status` (`fldV9IPnl8DgMOPP87O`): `singleSelect`; options: `draft`, `published`, `hidden`, `removed`
- `created_at` (`fldCeIjXvdccUogTy18`): `createdTime`
- `updated_at` (`fldCSvJuBa01ryEapq6`): `lastModifiedTime`
- `author_user_id` (`fldNxaD9uF8l5GYbGYw`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `group_id_nullable` (`fldLiqQQSbhOwSWvkRZ`): `link`; relation: manyOne -> Groups (tblHILTdHKnZTaHRL3P)
- `business_id_nullable` (`fldEIYI8zqw1OhuD3WQ`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `event_id_nullable` (`fldbd4ZsFtJqkBOIuzU`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)
- `Comments` (`fldH2yeEy81Hq8JFCwJ`): `link`; relation: oneMany -> Comments (tblJla61gciIKagESV2)

### Comments (tblJla61gciIKagESV2)

- `comment_id` (`fldAzG0JJVtM4EKdOnN`): `singleLineText`
- `comment_reference` (`fldGTPoqX38quvxfVD4`): `singleLineText`
- `content` (`fldLoItanHGxX9ykJCU`): `longText`
- `status` (`fldDW7Kuapyat2OVoj1`): `singleSelect`; options: `published`, `hidden`, `removed`
- `created_at` (`fldVTKlfiYzkAIQKCKn`): `createdTime`
- `updated_at` (`fldD6zpWAicJHXjI9gG`): `lastModifiedTime`
- `post_id` (`fld1pjMyA5X3QRhXONS`): `link`; relation: manyOne -> Posts (tblGAutYOeq09yHxIfo)
- `author_user_id` (`fldtkJTpRqcMwZzVCCB`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `parent_comment_id_nullable` (`fldl6DHk2xr3ojoffmR`): `link`; relation: manyOne -> Comments (tblJla61gciIKagESV2)
- `Comments` (`fldczckRZPwUhbPpNdH`): `link`; relation: oneMany -> Comments (tblJla61gciIKagESV2)

### Follows (tblWWTS1GCKsl0k5O67)

- `follow_id` (`fldgNP02C4um8ZExr50`): `singleLineText`
- `target_entity_type` (`fldi2NmYRm9RX3tD3ax`): `singleSelect`; options: `user`, `business`, `event`, `group`, `organizer`
- `target_entity_id` (`fldtcaPIHnCFOv8NBhF`): `singleLineText`
- `status` (`fldJ6sVyp9VXoBHj9eO`): `singleSelect`; options: `active`, `muted`, `unfollowed`
- `created_at` (`fldFLBdUqYqi2UwRZr5`): `createdTime`
- `follower_user_id` (`fld0a6LJufnNqlUDRqN`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### SavedEntities (tblAhSbxUWsQH2oX2Io)

- `save_id` (`fldZJIKXasjoRgA6UP6`): `singleLineText`
- `entity_type` (`fldB5pOobmTNwYJDGuQ`): `singleSelect`; options: `business`, `event`, `group`, `post`, `offer`, `profile`, `organizer`, `sponsor_offer`, `loyalty_program`
- `entity_id` (`fldqeGKxdMptH2iokc9`): `singleLineText`
- `created_at` (`fldrNiTEvGigF0uTfcv`): `createdTime`
- `user_id` (`fldJj3Nm5P8lbIzsvBj`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `entity_reference` (`fldkehBTf9HVCEZGb6a`): `singleLineText`
- `status` (`fld3AlqcTNpvYLMqyys`): `singleSelect`; options: `active`, `removed`
- `updated_at` (`fldcxfauxKmnaUFSI8I`): `lastModifiedTime`

### Reviews (tblKpxxGnkvVJbLLRbF)

- `review_id` (`fldNqgtJEJ8rMF9nbRs`): `singleLineText`
- `review_reference` (`fldyi3fHpfRQwFaXN4E`): `singleLineText`
- `rating` (`fldwpVBRVmCG2nRVcCt`): `rating`
- `content` (`fldIYCAkjirm1zOp0Ok`): `longText`
- `visibility` (`fldwPoIRDxh2XEKZFdE`): `singleSelect`; options: `public`, `private`
- `status` (`fldz5Y5PrB5aWJblrsI`): `singleSelect`; options: `pending`, `published`, `hidden`, `removed`
- `created_at` (`fldcrVODrAKjaImxvOs`): `createdTime`
- `updated_at` (`flddv49kh0t8ts7T9Ju`): `lastModifiedTime`
- `author_user_id` (`fldYE4SkF1w3ccnna0s`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `business_id` (`fldLVHLk15psMZbSnrW`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `ReviewResponses` (`fldzsHe525LYURzfcDc`): `link`; relation: oneMany -> ReviewResponses (tblhocc6wtg3ByqxASA)

### ReviewResponses (tblhocc6wtg3ByqxASA)

- `response_id` (`fld8fkYvbKKanzZrhWO`): `singleLineText`
- `content` (`fldItyDUAtErteiAIoq`): `longText`
- `status` (`fld2Xo0rZJFUlpTQGbN`): `singleSelect`; options: `pending`, `published`, `hidden`, `removed`
- `created_at` (`fldhiIjxxS7MIdmgnXv`): `createdTime`
- `updated_at` (`fldR1oo4NdjwkxXehV8`): `lastModifiedTime`
- `review_id` (`fldF2sWqbTdKe8D3vGa`): `link`; relation: manyOne -> Reviews (tblKpxxGnkvVJbLLRbF)
- `business_id` (`fldZxKGS52KBxFb1L0Y`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `author_user_id` (`fld83QxVtm2ICcbFSR8`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### UserBlocks (tblC9DloBIgtRPaBefP)

- `block_id` (`fldX0fYxqIs4VKQAeUi`): `singleLineText`
- `blocked_entity_type` (`fldWR2uKdW8rMoQxN2j`): `singleSelect`; options: `user`, `business`, `group`, `organizer`
- `blocked_entity_id` (`fldp6CHxQIHHSa7FyXH`): `singleLineText`
- `reason` (`fldmIRZrvQPlutknP4M`): `singleLineText`
- `status` (`fldgI8BN9AIyQt7SsfT`): `singleSelect`; options: `active`, `inactive`
- `created_at` (`fldXt3Z3gjG7gZJOzwG`): `createdTime`
- `updated_at` (`fldpkis7CONcooldegK`): `lastModifiedTime`
- `blocker_user_id` (`fldiqvCWDoEYUjxH4L9`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### Notifications (tbl556QiZgdJyJaa1zi)

- `notification_id` (`fldTshKHK0Okjwzcqbc`): `singleLineText`
- `type` (`fldhSO3YpJsTLBnFe00`): `singleSelect`; options: `follow`, `group`, `comment`, `review`, `event`, `offer`, `loyalty`, `moderation`, `system`
- `entity_type` (`fldtlq3s467ydKNXMAp`): `singleSelect`; options: `user`, `business`, `event`, `group`, `post`, `review`, `offer`, `report`, `loyalty`
- `entity_id` (`fldaQdc79ynIy7yAnhU`): `singleLineText`
- `message_key` (`fld6o0tStcxNVe4aGw4`): `singleLineText`
- `metadata_json` (`fldjkTcrcmnfPuJTqsG`): `longText`
- `read_at` (`fldGaTgCOFbho1qHb5T`): `date`
- `created_at` (`fld8yOuZBOvdfbJKiYk`): `createdTime`
- `recipient_user_id` (`fldzbHDsyc6ANWV5nZF`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `campaign_id_nullable` (`fldddIsMNu94tpOZwKJ`): `link`; relation: manyOne -> NotificationCampaigns (tbl5QQarciJIXc9YMs6)

### Offers (tblf2PeEIunfjiRaoVV)

- `offer_id` (`fldDLhupBgGetIWcYov`): `singleLineText`
- `offer_reference` (`fld9KwV4O34tL3EMp5o`): `singleLineText`
- `title_es` (`fld09Sp5udm4fzvASNQ`): `singleLineText`
- `title_en` (`fldyRpcaJtUWQbwllxC`): `singleLineText`
- `description_es` (`fldM5yBf3MSGdXBMAWK`): `longText`
- `description_en` (`fldLv2O7mXAzTyTc1tH`): `longText`
- `image_url` (`fldXDbytfZIymZu9Ipw`): `singleLineText`
- `terms_es` (`fld8DwBgiLGUCJ4N7Lj`): `longText`
- `terms_en` (`fldNFhiMkAx3aMmImwu`): `longText`
- `start_at` (`fldgpO2LtrEL47xuOf2`): `date`
- `end_at` (`fldnUf4p3bbwkSKmOAx`): `date`
- `redemption_method` (`fldLFvXoHSuqgl8lhz6`): `singleSelect`; options: `qr`, `code`, `show_screen`, `external`
- `offer_qr_reference` (`fldZ4Z8MCqTeYtNQfDD`): `singleLineText`
- `status` (`fld8Um4NUqeJyloLydX`): `singleSelect`; options: `draft`, `active`, `expired`, `paused`, `archived`
- `created_at` (`fldWA21Ms9YCJsvCA1s`): `createdTime`
- `updated_at` (`fldhcXNOGrx76s8SW6I`): `lastModifiedTime`
- `business_id` (`fld4DqVLyIs3l4J3rgZ`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `created_by_user_id` (`fldPTufcHKRqrir57DO`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `OfferAnalytics` (`fldz4bnnN7B2TLE9Mk3`): `link`; relation: oneMany -> OfferAnalytics (tblAYgQlbcInI9iGuAI)
- `translation_status` (`fldU3jLdVbV61qqVpmf`): `singleSelect`; options: `missing`, `partial`, `complete`, `machine_draft`
- `source_language` (`fldC0nEMZl167sfEYX2`): `singleSelect`; options: `es`, `en`
- `machine_translation_status` (`fldlXPqyEeQe4hW8KLJ`): `singleSelect`; options: `none`, `draft`, `reviewed`, `rejected`
- `translation_status_es` (`fldMR7DBjDlRVhMpE8F`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_status_en` (`fldhl7f8K4yejLNu9Ml`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_source_es` (`fldGMsEUPs76PWuoWi1`): `singleLineText`
- `translation_source_en` (`fldjr4PG8WFxuGHDvJl`): `singleLineText`
- `translation_reviewed_at_es` (`fldw0LjzQsh9b0BbH8p`): `date`
- `translation_reviewed_at_en` (`fld8cVApgpxLrHLln1w`): `date`
- `location_id` (`fldrcavyu0NVOVn5fIU`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `EventPartnerships` (`fldad9khElKeofXCuim`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `is_demo_content` (`fldwI5MbpJdju1X1Btj`): `checkbox`

### Sponsors (tbld8kbsDB3c17XO5Dy)

- `sponsor_id` (`fldjFBZq5bgaI1ccoAc`): `singleLineText`
- `sponsor_reference` (`fldKaSRB4DsYxLk0ov0`): `singleLineText`
- `organization_name` (`fldOrKFI0LTUOjojvCF`): `singleLineText`
- `description` (`fldMBy6UnQ0TKBJMNwC`): `longText`
- `logo_url` (`fldOvoH0W0nFp8ivPNW`): `singleLineText`
- `status` (`fldsoXEOYqujodVHxjI`): `singleSelect`; options: `pending`, `active`, `suspended`, `archived`
- `created_at` (`fldvGeOo5FICcmSXSvB`): `createdTime`
- `updated_at` (`fldr8CRzl3FI4DlSRii`): `lastModifiedTime`
- `owner_user_id` (`fldaLE1iTG8scYX5qNT`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `SponsorCampaigns` (`fldtUecHFCdEZcmaW7s`): `link`; relation: oneMany -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `MonetizationPaymentEvents` (`fldhmbubOX4ReiyicGI`): `link`; relation: oneMany -> MonetizationPaymentEvents (tblRYvN9yW1mi6vl55C)
- `SponsorOffers` (`fld8WMuaYxH8YVtjyh9`): `link`; relation: oneMany -> SponsorOffers (tblvWVjcFntkZ3zi5lw)
- `PlatformSubscriptions` (`flddao7kqs3QKli1Bew`): `link`; relation: oneMany -> PlatformSubscriptions (tblniV4rYBKuBjHiPk8)
- `PlatformPaymentEvents` (`fldLXPQMMORsVnUbmjc`): `link`; relation: oneMany -> PlatformPaymentEvents (tbl1TOw9us9ObkXMmHR)
- `contact_name_private` (`fld5DHc7Yn2j2FJLaMF`): `singleLineText`
- `contact_email_private` (`fldihajDaQSL74yv7lf`): `singleLineText`
- `contact_phone_private` (`fldC3XNP2o6ESJjBzuM`): `singleLineText`
- `cover_url` (`fldBQHkMLBlvfBRxEll`): `singleLineText`
- `description_es` (`fld5Z4xYVsHGV7te9Jf`): `longText`
- `description_en` (`fld1oePh1dVZgDGcBFU`): `longText`
- `is_demo_content` (`fldmcRyUciwQXR9552j`): `checkbox`
- `needs_review` (`fldURR0pU6Qh2hKkJ7J`): `checkbox`
- `cleanup_status` (`fld956RTDExqz9ZLJkx`): `singleSelect`; options: `active`, `review_required`, `disabled`, `archived`, `queued_for_purge`, `purged`, `restored`
- `AnalyticsMetricAggregates` (`fldZyU0uhDIf1hIXvRF`): `link`; relation: oneMany -> AnalyticsMetricAggregates (tblKJ3vSsiJJPiMrRfy)

### SponsorCampaigns (tblrauOTshgT1dvx9sg)

- `campaign_id` (`fldgfvrm5Y3O426K5i1`): `singleLineText`
- `campaign_reference` (`fldRHlkZFB4h6xwhC6g`): `singleLineText`
- `placement_type` (`fldEBdRgIcSxcYChzFK`): `singleSelect`; options: `featured_business`, `sponsored_event`, `sponsored_group`, `banner`, `newsletter`
- `creative_json` (`fld1NHIdz7K2PZA0ClE`): `longText`
- `targeting_json` (`fldQq9Z6WlqK4umJ755`): `longText`
- `start_at` (`fldXwJtY7B0W3Lu5AbE`): `date`
- `end_at` (`fldGfZGaE40VJ1oHOEy`): `date`
- `approval_status` (`fldwZJAQWg9Eo3XWAbo`): `singleSelect`; options: `pending`, `approved`, `rejected`
- `campaign_status` (`fldaZRxsFt12ZgveOHe`): `singleSelect`; options: `draft`, `scheduled`, `active`, `paused`, `completed`, `canceled`, `awaiting_content`, `payment_pending`, `paid`, `expired`, `cancelled`, `suspended`, `removed`
- `created_at` (`fld9HRNuQIHPcv8DL0l`): `createdTime`
- `updated_at` (`fldu3Si0RNYB3puhlW2`): `lastModifiedTime`
- `sponsor_id` (`fldKo3E0VrFZeDXjCMg`): `link`; relation: manyOne -> Sponsors (tbld8kbsDB3c17XO5Dy)
- `business_id_nullable` (`fldF2k2kU2FH38RMAno`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `event_id_nullable` (`fldUCfQrc07st2txmo8`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)
- `group_id_nullable` (`fldBVTkwjnVnFaQhXTA`): `link`; relation: manyOne -> Groups (tblHILTdHKnZTaHRL3P)
- `location_id` (`fldTbKBOjgxfEOipkoZ`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `SponsoredPlacements` (`fldakXiU6Q0QZ1HAT2F`): `link`; relation: oneMany -> SponsoredPlacements (tblFcHe1WDlfp0UQadz)
- `SponsorAnalytics` (`fldyyEniBUvCYFOFJBA`): `link`; relation: oneMany -> SponsorAnalytics (tblONPlRsokLKoiQAgV)
- `sponsor_offer_id` (`fldoviqqT6fWjDzGkjJ`): `link`; relation: manyOne -> SponsorOffers (tblvWVjcFntkZ3zi5lw)
- `plan_id` (`fldeunLrV1On75yxUAU`): `link`; relation: manyOne -> BusinessPlans (tblfB89TSYURsaZ267N)
- `subscription_id_nullable` (`fldSGup08b3qeZqp74T`): `link`; relation: manyOne -> PlatformSubscriptions (tblniV4rYBKuBjHiPk8)
- `payment_status` (`fldfGbIjmUQPBsmfBal`): `singleSelect`; options: `pending`, `confirmed`, `failed`, `refunded`, `cancelled`, `expired`
- `content_readiness_status` (`fldNx7SkdQlZ1CYLNNM`): `singleSelect`; options: `empty`, `incomplete`, `ready`, `needs_review`, `blocked`
- `display_priority` (`fldB8c42UjtYYm4Qomz`): `number`
- `is_demo_content` (`fldTN4JTHir0ohbeGWL`): `checkbox`

### SponsoredPlacements (tblFcHe1WDlfp0UQadz)

- `placement_id` (`fldunHprN55i2MAANn3`): `singleLineText`
- `surface` (`fldEbtRVtR50p6i6xCH`): `singleLineText`
- `position` (`fldgeOkphANwyMgLl1M`): `singleLineText`
- `active` (`fld4qiG6A2QyKurN4PX`): `checkbox`
- `created_at` (`fldS6T4amTiTx6TgU1u`): `createdTime`
- `updated_at` (`fldiVGjiTsR7aOTvTnw`): `lastModifiedTime`
- `campaign_id` (`fldMKTm2p3YkFWp77OR`): `link`; relation: manyOne -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `EventPartnerships` (`fldD6YYCSnBtAe3htPU`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `placement_surface` (`fldshU3YajmpSHPk7vD`): `singleSelect`; options: `pwa_top_rail`, `public_user_listing`, `business_listing`, `group_listing`, `event_listing`, `organizer_listing`, `loyalty_listing`, `offer_listing`
- `entity_context_type_nullable` (`fldSD3kVWS345WdVyyc`): `singleLineText`
- `entity_context_id_nullable` (`fldCKCfNP6TEc7IzYtU`): `singleLineText`
- `is_demo_content` (`fldymaD8yTWu4qEuowr`): `checkbox`

### MonetizationPaymentEvents (tblRYvN9yW1mi6vl55C)

- `payment_event_id` (`flddfaa7OtIwMFIXDP8`): `singleLineText`
- `provider` (`fldKRCIsf3BKuHZsgBu`): `singleSelect`; options: `stripe`, `oxxo`, `manual`
- `external_event_id` (`fldUhPNmRzrIUspZYYr`): `singleLineText`
- `event_type` (`fldBjsVVUFGD8znNs42`): `singleLineText`
- `status` (`fldu6wex73xI7DM6Ft5`): `singleSelect`; options: `pending`, `processed`, `failed`, `ignored`
- `processed_at` (`fldUp9UCLJEgVdOkCsH`): `date`
- `created_at` (`fldiYGTAOaJxWdi7CLy`): `createdTime`
- `business_id_nullable` (`fldgczSh9KzBEpO7tGW`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `sponsor_id_nullable` (`fldpU0Jzmxf9YIaWUgf`): `link`; relation: manyOne -> Sponsors (tbld8kbsDB3c17XO5Dy)

### OfferAnalytics (tblAYgQlbcInI9iGuAI)

- `analytics_id` (`fldT1oxGGEBEfSxvCZO`): `singleLineText`
- `event_type` (`fldk9CYOJcygPgvPpA0`): `singleSelect`; options: `viewed`, `clicked`, `shared`, `redeemed`
- `anonymous_session_id` (`flds07Lx8d7jjPC4BLW`): `singleLineText`
- `language` (`fldUXTt25vMPq7ojHDK`): `singleSelect`; options: `es`, `en`
- `created_at` (`fldfSqm524NfmoPgvML`): `createdTime`
- `offer_id` (`fldwEedbDlHbswgg2c0`): `link`; relation: manyOne -> Offers (tblf2PeEIunfjiRaoVV)
- `user_id_nullable` (`fldNdcZtZx02J0TWQSH`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `location_id` (`fldpc9JpS6blbJr4rAh`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### SponsorAnalytics (tblONPlRsokLKoiQAgV)

- `analytics_id` (`fldz4YGIReAZ7lygsxb`): `singleLineText`
- `event_type` (`fldkYNZnZTv4iUNDHBI`): `singleSelect`; options: `viewed`, `clicked`, `converted`
- `anonymous_session_id` (`fldWJqnJUh0cK3mpxaq`): `singleLineText`
- `language` (`fldL80XikTBptPpIXKd`): `singleSelect`; options: `es`, `en`
- `created_at` (`fld5gbNoVFnhD052bim`): `createdTime`
- `campaign_id` (`fldBwzYrSkKT22jSJ4t`): `link`; relation: manyOne -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `user_id_nullable` (`fldsEqGzsF2XeU6XO2z`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `location_id` (`fldNN1lpFWIHs2ogkxg`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)

- `program_id` (`fld1I3QEpzuAdOG6Woo`): `singleLineText`
- `program_reference` (`fld1ry2tAgoLabINCnk`): `singleLineText`
- `name_es` (`fld8A8hA5TykHIldMIO`): `singleLineText`
- `name_en` (`fldZWlNkuAkFgzJRAY1`): `singleLineText`
- `description_es` (`fldATIbgn3QV7rMYTKn`): `longText`
- `description_en` (`fldnXXOWqgSu4Klm7er`): `longText`
- `program_type` (`fldiSLA604wyPlBv4Qe`): `singleSelect`; options: `stamps`, `points`, `visits`, `purchases`, `spend`, `tiers`, `mixed`
- `stamps_required` (`fldCqxYIe96XSGgKD76`): `number`
- `progress_unit` (`fldS7u2bUvn8OOpClKa`): `singleSelect`; options: `stamps`, `points`, `visits`, `purchases`, `spend`, `referrals`, `actions`
- `reset_policy` (`fld5cD2dgD1wpHb8Yhz`): `singleSelect`; options: `never`, `on_reward`, `cycle`
- `repeat_policy` (`fldh2JZblIskS4NVttp`): `singleSelect`; options: `once`, `repeatable`, `limited`
- `current_version_id` (`fldvF5E4pZV28R2FX0T`): `singleLineText`
- `customer_visibility` (`fldgkY6wbJRl3JXC64z`): `singleSelect`; options: `private`, `summary`, `public`
- `staff_limit` (`fldZeORh08nq2OtQRs8`): `number`
- `status` (`fld6YbvbU10H9D61tfa`): `singleSelect`; options: `draft`, `active`, `paused`, `archived`
- `qr_reference` (`fldDI70iaqje6NGP7kf`): `singleLineText`
- `created_at` (`fldzyt3KdjbM7f6XBQI`): `createdTime`
- `updated_at` (`fldECAvpVKN56dw9hWG`): `lastModifiedTime`
- `business_id` (`fldvae9dq2BFvgzhPfX`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldhyx5bW6te3xJRYAx`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `created_by_user_id` (`fldEEikhZe7EQVK3w9e`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlayavidaLoyaltyRewards` (`fld6U0P287ENwi2tdRW`): `link`; relation: oneMany -> PlayavidaLoyaltyRewards (tbl1hAqY1edir4G4tTH)
- `PlayavidaLoyaltyCustomers` (`fldjm1G2CLENk7bJNko`): `link`; relation: oneMany -> PlayavidaLoyaltyCustomers (tblUzmjEEuckEhzvf5W)
- `PlayavidaLoyaltyTransactions` (`fldnaPvW85lIouGVXAE`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)
- `PlayavidaRewardVouchers` (`fldjhkZqSiIf2LjuLn8`): `link`; relation: oneMany -> PlayavidaRewardVouchers (tbldUROYfJl9AhT0q4B)
- `PlayavidaLoyaltyBalances` (`fldPZYPcnx0Acg60faj`): `link`; relation: oneMany -> PlayavidaLoyaltyBalances (tblBnCPs0ymMEgHl4EF)
- `PlayavidaLoyaltyQRs` (`fldGjsadQj1x6ghBVb9`): `link`; relation: oneMany -> PlayavidaLoyaltyQRs (tblf0TqIOWmtXFi6k2K)
- `LoyaltyAnalytics` (`fldzbf3yl4ZZAPWujjD`): `link`; relation: oneMany -> LoyaltyAnalytics (tblOZrYZdyZQqrXvG7F)
- `PlayavidaRewardRules` (`fldJ4heopEeC4V7zevW`): `link`; relation: oneMany -> PlayavidaRewardRules (tblE7RpFT4b6HFSzY8H)
- `PlayavidaStaffActions` (`fld1ivC9eiCVGGLl2uY`): `link`; relation: oneMany -> PlayavidaStaffActions (tblVVKsUd6LQraQKypB)
- `PlayavidaEngagementCampaigns` (`fldX2yCzs9u3ZlkzA4c`): `link`; relation: oneMany -> PlayavidaEngagementCampaigns (tblqyhBcVEn6Ab8owZh)
- `PlayavidaCustomerCards` (`fldcENoaXjEIyie1Il1`): `link`; relation: oneMany -> PlayavidaCustomerCards (tblOVokzPDd71IyedJu)
- `PlayavidaLoyaltyProgress` (`fld4iBwKkxd1pJQ0y8M`): `link`; relation: oneMany -> PlayavidaLoyaltyProgress (tbl8tGEEKD5X75CquuU)
- `translation_status` (`fldTBW1RY4bmnlvzsnT`): `singleSelect`; options: `missing`, `partial`, `complete`, `machine_draft`
- `source_language` (`fld7XcyHz4vug1WlXCA`): `singleSelect`; options: `es`, `en`
- `machine_translation_status` (`fldQ4gy6L7JBrIXyn0A`): `singleSelect`; options: `none`, `draft`, `reviewed`, `rejected`
- `translation_status_es` (`fldvhRViugazktbF5SZ`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_status_en` (`fldX5AKoyyY46lygM7n`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_source_es` (`flddbo7JTovLDaafk21`): `singleLineText`
- `translation_source_en` (`fldRt64YdPEAJPVHPTy`): `singleLineText`
- `translation_reviewed_at_es` (`fld4PJvJSEeIalh4a9J`): `date`
- `translation_reviewed_at_en` (`fldyIiMP40nGcEojj4s`): `date`
- `EventPartnerships` (`fldJvGZ5MnKeFkurAxx`): `link`; relation: oneMany -> EventPartnerships (tblJmefbtJ46XBeFhPD)
- `PlayavidaLoyaltyProgramVersions` (`fld25TYCYfY7xtb20bh`): `link`; relation: oneMany -> PlayavidaLoyaltyProgramVersions (tbl2DdfvdxEUatWEjWV)
- `PlayavidaLoyaltyCardCycles` (`fld7CdRRyuPqA9SBI0q`): `link`; relation: oneMany -> PlayavidaLoyaltyCardCycles (tblaXjpNTunNEk9pvhf)
- `PlayavidaDynamicQRChallenges` (`fldLM7UWBEr9j1MnIZS`): `link`; relation: oneMany -> PlayavidaDynamicQRChallenges (tblPfGTmoL9vWyI7kl0)
- `PlayavidaCustomerActionCompletions` (`fldsYP6Sa2Wt4yyy7yB`): `link`; relation: oneMany -> PlayavidaCustomerActionCompletions (tblorS1uwoPiOy06gAk)
- `no_expiry_default` (`fldZ6TvicKKlZHhpRCA`): `checkbox`
- `transferability` (`fldttA3tpYDovXpMclG`): `checkbox`
- `cash_value` (`fldBklzlCFmdmnqmRCg`): `checkbox`
- `current_program_version_id` (`fldKB84NxJNip7fUiCD`): `singleLineText`
- `reset_behavior` (`fld8y40RuVoDMmQiZhY`): `singleSelect`; options: `create_new_cycle`, `never`
- `business_closure_policy` (`fld22G02RvMDu7klpmk`): `singleSelect`; options: `case_by_case`, `paused_pending_review`
- `is_demo_content` (`fldbH3QYW57UTIN4A63`): `checkbox`
- `needs_review` (`fldnqk8altb2Ij9j7Ke`): `checkbox`
- `cleanup_status` (`fldYV3pCBPqSO5WvQ2p`): `singleSelect`; options: `active`, `review_required`, `disabled`, `archived`, `queued_for_purge`, `purged`, `restored`

### PlayavidaLoyaltyRewards (tbl1hAqY1edir4G4tTH)

- `reward_id` (`fldhS58KJazJom2MeYN`): `singleLineText`
- `reward_reference` (`fld67XMSDgfwF24TlkQ`): `singleLineText`
- `name_es` (`fld7jaafnRRcbPPh5hj`): `singleLineText`
- `name_en` (`fldLkV0ikL7CU2SNw7b`): `singleLineText`
- `description_es` (`fldhMN5Y1kkbJpERYj5`): `longText`
- `description_en` (`fldVPchztewpHhzubyc`): `longText`
- `expiry_days` (`fldTKhytPtJphUhS0d3`): `number`
- `active` (`fld1QRLbMENbpiA9ngn`): `checkbox`
- `created_at` (`fldfmEaxVwqeqTIBlNC`): `createdTime`
- `updated_at` (`fldzPWhPEqnprgDSSWC`): `lastModifiedTime`
- `program_id` (`fldJ5kB3dAY2rE1HUYX`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `PlayavidaRewardVouchers` (`fldTP2uvWKGgJRQotwS`): `link`; relation: oneMany -> PlayavidaRewardVouchers (tbldUROYfJl9AhT0q4B)
- `translation_status` (`fldIM8mH83yOZMku6ql`): `singleSelect`; options: `missing`, `partial`, `complete`, `machine_draft`
- `source_language` (`fldlJSG0SRGMscWU4vE`): `singleSelect`; options: `es`, `en`
- `machine_translation_status` (`fldIF7YCnZQxKVDh0Db`): `singleSelect`; options: `none`, `draft`, `reviewed`, `rejected`
- `translation_status_es` (`fldRFGLnrB3wyoVRDfn`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_status_en` (`fldYUw5rq3FTcj5eVC9`): `singleSelect`; options: `original`, `missing`, `machine_draft`, `machine_reviewed`, `human_translated`, `human_reviewed`
- `translation_source_es` (`fldmCLjZmXzd9yDltFn`): `singleLineText`
- `translation_source_en` (`fldnnIn0PesMFrgNc8c`): `singleLineText`
- `translation_reviewed_at_es` (`fldXCIk7kKVyQz5G7Rb`): `date`
- `translation_reviewed_at_en` (`fldiVOTlACvLsFfbluJ`): `date`
- `program_version_id_nullable` (`fldfq49VmHO6M304kaD`): `link`; relation: manyOne -> PlayavidaLoyaltyProgramVersions (tbl2DdfvdxEUatWEjWV)

### PlayavidaLoyaltyCustomers (tblUzmjEEuckEhzvf5W)

- `enrollment_id` (`fldHOEfUOkMKjiNwhHG`): `singleLineText`
- `customer_reference` (`fldUZWmh46MdSEhsQIN`): `singleLineText`
- `status` (`fldfWC8Onq078fnuW8E`): `singleSelect`; options: `pending`, `active`, `paused`, `left`
- `consent_loyalty` (`fldgR4OULxWbDJmNqj0`): `checkbox`
- `consent_marketing` (`fldvfjVg2HCSsTXvxYW`): `checkbox`
- `enrolled_at` (`fldAOPKi9HRYnHJb3nj`): `date`
- `last_activity_at` (`fldCtg0tTuNqvwYabtY`): `date`
- `created_at` (`fldFTGmH8H6piQBwEj9`): `createdTime`
- `updated_at` (`fld4PVzWv2J0PyDckPS`): `lastModifiedTime`
- `program_id` (`fldwOSH4a622kftw9h2`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `user_id` (`fldTDlHpHj06JrTUwEW`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)

- `transaction_id` (`fldNXb6joSgGltAylyM`): `singleLineText`
- `transaction_reference` (`fld5r6XuIbsmjAx51x4`): `singleLineText`
- `idempotency_key` (`fldfKHKshiSqzFlgq4d`): `singleLineText`
- `event_type` (`fldBZqPpU1opDRrLtZN`): `singleSelect`; options: `enrolled`, `stamp_awarded`, `stamp_reversed`, `points_awarded`, `points_reversed`, `reward_earned`, `reward_redeemed`, `reward_voided`
- `amount` (`fldvOUbRWIJ99JFqKQ5`): `number`
- `source` (`fldVxgmNrXgtXXjO87M`): `singleSelect`; options: `staff_scan`, `customer_qr`, `system`, `import`, `adjustment`
- `metadata_json` (`fldPQYlsuKTf24Z0WTk`): `longText`
- `created_at` (`fldOkm3F3ZiKosng2v8`): `createdTime`
- `program_id` (`fld8EviiKWBvz35J7NJ`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `business_id` (`fldUqHQsrEDelFjFfCu`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldJ77WiBVteCvQ0rvm`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `user_id` (`fldA6FpLhIpAadaCNYE`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `actor_user_id` (`fldgDQH20JRYgz7hKrY`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `staff_id_nullable` (`fldPWlb7rZlunM0ojvO`): `link`; relation: manyOne -> PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)
- `PlayavidaBonusSubmissions` (`fldlS6pDz9gdEShIsfJ`): `link`; relation: oneMany -> PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)
- `card_id` (`fld9Cszm55gmwutezn5`): `link`; relation: manyOne -> PlayavidaCustomerCards (tblOVokzPDd71IyedJu)
- `cycle_id` (`fldDH4SS3XzbJZ4mVXh`): `link`; relation: manyOne -> PlayavidaLoyaltyCardCycles (tblaXjpNTunNEk9pvhf)
- `program_version_id` (`fldzlgxrzBtWkexhw6k`): `link`; relation: manyOne -> PlayavidaLoyaltyProgramVersions (tbl2DdfvdxEUatWEjWV)
- `action_reference_nullable` (`fldSHTrhl0ziIcJrovd`): `singleLineText`

### PlayavidaRewardVouchers (tbldUROYfJl9AhT0q4B)

- `voucher_id` (`fld5jkDF1G2zYVa5h3T`): `singleLineText`
- `voucher_reference` (`fldPTbJ8RP9K156KOQk`): `singleLineText`
- `status` (`fldxJwEuOfPVlk3v1GX`): `singleSelect`; options: `issued`, `active`, `redeemed`, `expired`, `voided`
- `redemption_code_hash` (`fld2lIxqCT8LGveBur1`): `singleLineText`
- `issued_at` (`fld8ah3yF87G763y7DH`): `date`
- `redeemed_at` (`fldRzbxC8ZhZJzPK4bX`): `date`
- `expires_at` (`fldPwX0QKYH5E7g4u9x`): `date`
- `created_at` (`fldqQOUVuncuPj7WgMi`): `createdTime`
- `updated_at` (`fldgT4knGEGnnXnPJJ9`): `lastModifiedTime`
- `reward_id` (`fldSrgL2YQGjg0SqLkR`): `link`; relation: manyOne -> PlayavidaLoyaltyRewards (tbl1hAqY1edir4G4tTH)
- `program_id` (`fld4q7k96C7wAj9XJUG`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `user_id` (`fldM3otBVeJu908vPti`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `redeemed_by_user_id` (`fldgGPDn42CX1Tzb8Fm`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### PlayavidaLoyaltyBalances (tblBnCPs0ymMEgHl4EF)

- `balance_id` (`fldnxbmY6bNzDTFzuuC`): `singleLineText`
- `stamp_balance` (`fldoxIFJugDIlSn34yA`): `number`
- `points_balance` (`fldj1nx9BDS77OWbL6I`): `number`
- `rewards_earned` (`fld3tp4mXkm0FDb2eSJ`): `number`
- `rewards_redeemed` (`fldnMysgkPXhvGATZuX`): `number`
- `updated_at` (`fldVRm0n7nreWqisvGS`): `lastModifiedTime`
- `program_id` (`fldXr7LAsqwt7qvxQeP`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `user_id` (`fldYCD9uVYivgyxoYvJ`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### PlayavidaLoyaltyQRs (tblf0TqIOWmtXFi6k2K)

- `qr_id` (`fldPasrxoAaOKSnZjkT`): `singleLineText`
- `qr_reference` (`fldP2u7ENPknk6vg9tz`): `singleLineText`
- `destination_path` (`fldE8yRtDG3KwYDOJBk`): `singleLineText`
- `status` (`fldjj8XiUmV7fDjngq8`): `singleSelect`; options: `active`, `inactive`, `revoked`
- `created_at` (`fldiUFrdzt3zCAQRCQV`): `createdTime`
- `updated_at` (`fldSYwUiTtzrt3tcXtZ`): `lastModifiedTime`
- `program_id` (`fldpIGxe1I6DjXI7MQA`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `business_id` (`fldBpOsn5KYEzhu4KSQ`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldn2MkhbzgwT48qYIB`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### ExternalLoyaltyConnections (tbl9zi1E9KfuimQocvT)

- `connection_id` (`fldl6wZGYs4Ea34l8LT`): `singleLineText`
- `provider` (`fldnRRcgwwFf0ihr4qn`): `singleLineText`
- `external_account_reference` (`fldC2xCa0fUppkK0wZb`): `singleLineText`
- `external_program_reference` (`fldADWHDaU6x6PAv3ym`): `singleLineText`
- `status` (`fld7gQ6NftJzSaA88Jw`): `singleSelect`; options: `pending`, `active`, `paused`, `error`, `disconnected`
- `last_sync_at` (`fldqBhS8nDgqmrqkeKV`): `date`
- `last_error` (`fldVPdZCAHLyalyz024`): `longText`
- `created_at` (`fldhkmIG94y3YOgSqTP`): `createdTime`
- `updated_at` (`flddRAXpyZfKjGcZdqH`): `lastModifiedTime`
- `playavida_business_id` (`fldmeMi11vVdOIdcYLD`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)

### LoyaltyAnalytics (tblOZrYZdyZQqrXvG7F)

- `analytics_id` (`fldV3zcKbtkQHCTzGtX`): `singleLineText`
- `event_type` (`fldrGsM0FinUTABjpAg`): `singleLineText`
- `language` (`fldBcOW9yU8Z38eg6PH`): `singleSelect`; options: `es`, `en`
- `metadata_json` (`fldF90GtqXi5BsGphd8`): `longText`
- `created_at` (`fld6v2pThteCpaUFbLY`): `createdTime`
- `program_id` (`fldw1BmA2zm3fdQdSC0`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `business_id` (`fldRyAbOtHBq4liDiGe`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `user_id_nullable` (`fld0KviP6DZe7tf05n1`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `location_id` (`fldCZJzuvkFCLwNmtfj`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### PlayavidaRewardRules (tblE7RpFT4b6HFSzY8H)

- `reward_rule_id` (`fldWnmS47XOJzutF76z`): `singleLineText`
- `threshold` (`fldnOEeeTHW9JLzanl2`): `number`
- `progress_unit` (`fldKw61M0sbcaMU1Exq`): `singleSelect`; options: `stamps`, `points`, `visits`, `purchases`, `spend`, `referrals`, `actions`
- `title_es` (`fldYMUDoKFqcpOOtodA`): `singleLineText`
- `title_en` (`fldmRNc5864MFMC7xkq`): `singleLineText`
- `description_es` (`fldqMCd1Vp1IiCJJQxl`): `longText`
- `description_en` (`fld7wksGb3m8mPYQxF8`): `longText`
- `reward_type` (`fld4J1YR2SRgTS2OnBs`): `singleSelect`; options: `voucher`, `discount`, `free_item`, `experience`, `custom`
- `expiry_days` (`fldWvk8cJ7XizeA2WXT`): `number`
- `repeat_policy` (`fld66Lo5IvsCgCc1yH2`): `singleSelect`; options: `once`, `repeatable`, `limited`
- `reset_policy` (`fldpyUaUHAO0HQuHp1j`): `singleSelect`; options: `never`, `on_reward`, `cycle`
- `maximum_earnings_per_cycle` (`fldgunKkdrZseYQNLU8`): `number`
- `active` (`fldKXXPhorA5DriDBSn`): `checkbox`
- `sort_order` (`fldEJWoXkP5nLbePCuW`): `number`
- `created_at` (`fldtdlVXiDCZbupzqUX`): `createdTime`
- `updated_at` (`fldhOFNKbBL3t3hpoAj`): `lastModifiedTime`
- `program_id` (`fldPPVzYF8FJjXRUmqh`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `PlayavidaRewardRuleVersions` (`fldODEwhPHrWWHSMvAe`): `link`; relation: oneMany -> PlayavidaRewardRuleVersions (tblGLvpKNEuksKlAOg9)
- `PlayavidaLoyaltyProgress` (`fldvBD0nf8HaBm0G9rM`): `link`; relation: oneMany -> PlayavidaLoyaltyProgress (tbl8tGEEKD5X75CquuU)

### PlayavidaRewardRuleVersions (tblGLvpKNEuksKlAOg9)

- `reward_rule_version_id` (`fld40pUeubS3RtEyN2q`): `singleLineText`
- `version_number` (`fldiUezYBcpbJgNDTmE`): `number`
- `threshold` (`fldTzUDVge9VzfvuvRz`): `number`
- `reward_content_json` (`fldvVaNlhphxP4FdpM8`): `longText`
- `repeat_policy` (`fldH0lKPkk83dfaSU8V`): `singleSelect`; options: `once`, `repeatable`, `limited`
- `reset_policy` (`fldXVkpX6rPJt5r3hFY`): `singleSelect`; options: `never`, `on_reward`, `cycle`
- `effective_from` (`fldZ1Kl75s1eezIpJu4`): `date`
- `effective_until` (`fldne4FhpHeTlGgg8zI`): `date`
- `created_at` (`fldUKBnZUjpWhYFWmME`): `createdTime`
- `reward_rule_id` (`fld39g4IlRjrfXXoG6d`): `link`; relation: manyOne -> PlayavidaRewardRules (tblE7RpFT4b6HFSzY8H)
- `created_by_user_id` (`fldRVT0zkIKFAgwfHR9`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlayavidaLoyaltyProgress` (`fld6pNNBtlGUYla9crC`): `link`; relation: oneMany -> PlayavidaLoyaltyProgress (tbl8tGEEKD5X75CquuU)

### PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)

- `staff_id` (`fldVQGIrhtwbfQIvMMb`): `singleLineText`
- `staff_reference` (`fldzoHY839vwhrR81mQ`): `singleLineText`
- `display_name` (`fldMZRKEGM7CJbu69XP`): `singleLineText`
- `role` (`fldHLKuIxoVFeO2zaxp`): `singleSelect`; options: `owner`, `admin`, `manager`, `cashier`, `analyst`, `staff`, `supervisor`, `loyalty_manager`
- `status` (`fldQwcXqYFxhnZw9yFx`): `singleSelect`; options: `invited`, `active`, `suspended`, `revoked`, `removed`, `locked`
- `last_login_at` (`fldp03unyMwy2eCm1qL`): `date`
- `created_at` (`fldkKsv3FxqTvrLJvnX`): `createdTime`
- `updated_at` (`fldQ1yRaS1eFpokHwsu`): `lastModifiedTime`
- `business_id` (`fldbSVS9VCEFeDgUkFc`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldF9BrPuou6PRYffsu`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `auth_user_id` (`fld10Qg9ZZGYEwmto0p`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlayavidaStaffActions` (`fld5AwChJZ12Vd9Y43E`): `link`; relation: oneMany -> PlayavidaStaffActions (tblVVKsUd6LQraQKypB)
- `PlayavidaLoyaltyTransactions` (`fldGxxcnxCtCBPLJ9nn`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)
- `PlayavidaBonusSubmissions` (`fldHxroWzGqEPyk4Uvz`): `link`; relation: oneMany -> PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)
- `StaffPinSecurityEvents` (`fldfjWoe5zRvGFqZaxw`): `link`; relation: oneMany -> StaffPinSecurityEvents (tblciuNt63idIfaLnIB)
- `PlayavidaDynamicQRChallenges` (`fldYRG0CaHhvsh8qmWo`): `link`; relation: oneMany -> PlayavidaDynamicQRChallenges (tblPfGTmoL9vWyI7kl0)
- `pin_hash_reference_private` (`fldbbqv8IEQI1UAHes9`): `singleLineText`
- `pin_version` (`fldRJfvAhqh3nd0y75q`): `number`
- `pin_last_reset_at` (`fld0UUjyLWX26420ir7`): `date`
- `pin_failed_attempt_count` (`fldMHnYLFh0inlDbVeb`): `number`
- `pin_locked_until` (`fld0JYsElVGrOVJvkga`): `date`
- `last_sensitive_action_at_nullable` (`fldlpGIsxTstZw6O6Z5`): `date`

### PlayavidaStaffActions (tblVVKsUd6LQraQKypB)

- `staff_action_id` (`fld3j6RCaFBTDCZzJin`): `singleLineText`
- `action_type` (`fldaJFDmTmma7T6KPbG`): `singleSelect`; options: `stamp_awarded`, `stamp_reversed`, `points_awarded`, `points_reversed`, `reward_redeemed`, `reward_voided`, `manual_adjustment`
- `amount` (`flduNGz00gonUkj9QnI`): `number`
- `transaction_reference` (`fldIm95E2s5GAVVOhtU`): `singleLineText`
- `created_at` (`fldGf2MI6D1ymcE3e6j`): `createdTime`
- `staff_id` (`fldCTHoPDlR0vN9HU3E`): `link`; relation: manyOne -> PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)
- `business_id` (`fldYajFBBwohQjSDEoc`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldPL0eJDdxp4RhdlLj`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `customer_user_id` (`fldWJngH8V28ibnjDEZ`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `program_id` (`fldzfw1wCXbfrK7ocMF`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)

### PlayavidaEngagementCampaigns (tblqyhBcVEn6Ab8owZh)

- `campaign_id` (`fldklkFzMFfy8jpYktN`): `singleLineText`
- `campaign_reference` (`fldIP97sVFU91lUw0Wx`): `singleLineText`
- `name_es` (`fldD5MQnGGSd4mki9mW`): `singleLineText`
- `name_en` (`fldy4agPEV2vaOZHGjl`): `singleLineText`
- `status` (`fldGISPZ1TRFFC15jqC`): `singleSelect`; options: `draft`, `scheduled`, `active`, `paused`, `completed`, `archived`
- `created_at` (`fld1FmjMuJEJMiJSKkT`): `createdTime`
- `updated_at` (`fldccLpGWVdJBXp5yIa`): `lastModifiedTime`
- `business_id` (`fldeVkckw4cgforIW6x`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `program_id` (`fldxTKxCVgBaFxjPqx7`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `created_by_user_id` (`fldc3KXgDlJOmGsrxZ2`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlayavidaEngagementCampaignVersions` (`fldQXO9XZBn8yYXBJGm`): `link`; relation: oneMany -> PlayavidaEngagementCampaignVersions (tblQNAoxZbAfwzriuzM)
- `current_version_id` (`fldULCKIdS8xU095piU`): `link`; relation: manyOne -> PlayavidaEngagementCampaignVersions (tblQNAoxZbAfwzriuzM)
- `PlayavidaCustomerActionCompletions` (`fldIcZ5wP2B8XwvR8D0`): `link`; relation: oneMany -> PlayavidaCustomerActionCompletions (tblorS1uwoPiOy06gAk)
- `PlayavidaBonusSubmissions` (`fldaW0eD7WzDrwlNKA3`): `link`; relation: oneMany -> PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)

### PlayavidaEngagementCampaignVersions (tblQNAoxZbAfwzriuzM)

- `campaign_version_id` (`fldT5JuhHeANaVVwUfX`): `singleLineText`
- `version_number` (`fldT3S5Mi1103lKCruY`): `number`
- `action_type` (`fldfdGtDImd0cASWXrS`): `singleSelect`; options: `purchase`, `visit`, `referral`, `event_attendance`, `survey`, `video_watch`, `website_visit`, `social_follow`, `social_share`, `custom`, `website_click`, `survey_completion`, `event_participation`, `video_completion`
- `points_awarded` (`fldCcr7jQLgELHg3jAk`): `number`
- `destination_url` (`fld606FGls71vGy1HvS`): `singleLineText`
- `repeat_rule` (`fldmyHdICEEBEYME7ok`): `singleSelect`; options: `once`, `daily`, `weekly`, `monthly`, `custom`, `one_time`
- `cooldown_seconds` (`fldhssogX8y2uy7Nah1`): `number`
- `maximum_completions` (`fldO9Zgyn8ImHTafP1f`): `number`
- `verification_method` (`fldiKqKTBUUlu2g3rLD`): `singleSelect`; options: `staff_scan`, `signed_callback`, `timed_session`, `manual_review`, `customer_qr_strict`
- `starts_at` (`fldPcflBIPvmIbRL3zQ`): `date`
- `ends_at` (`fldrbRRiD2HAsjkgS87`): `date`
- `created_at` (`flddkHc9oLROwbQ0yow`): `createdTime`
- `campaign_id` (`fldJz6axpUbfWwKGF6n`): `link`; relation: manyOne -> PlayavidaEngagementCampaigns (tblqyhBcVEn6Ab8owZh)
- `created_by_user_id` (`fldpZh94gy1PRduppqv`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlayavidaEngagementCampaigns` (`fldM53x3dGKCXpwxp6Z`): `link`; relation: oneMany -> PlayavidaEngagementCampaigns (tblqyhBcVEn6Ab8owZh)
- `PlayavidaCustomerActionSessions` (`fldMGcKIfRsseBWkfvi`): `link`; relation: oneMany -> PlayavidaCustomerActionSessions (tblQMtLnkxbFGT3btUt)
- `PlayavidaCustomerActionCompletions` (`fldqWRBnO9WieULrl7y`): `link`; relation: oneMany -> PlayavidaCustomerActionCompletions (tblorS1uwoPiOy06gAk)
- `stamps_awarded` (`fldwGvuSVoNJFEik3Cl`): `number`
- `instructions_es` (`fldwMYRRNF9HYmOeriY`): `longText`
- `instructions_en` (`fldfft9BFyFfWUZ1RJB`): `longText`
- `evidence_requirement` (`fldmCZhz3TXXUTRIoTC`): `singleSelect`; options: `none`, `photo`, `staff_attendance`, `photo_and_staff`
- `event_id_nullable` (`flddpNqsox6oKPzVLjr`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)
- `PlayavidaBonusSubmissions` (`fldFBrpUyub3d2ZS7iS`): `link`; relation: oneMany -> PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)

### PlayavidaCustomerActionSessions (tblQMtLnkxbFGT3btUt)

- `session_id` (`fldiLFSm8ynthvXqFcY`): `singleLineText`
- `token_hash` (`fldnbYFReTCAWfPEfHO`): `singleLineText`
- `status` (`fldh4POy2ViimVGgSiv`): `singleSelect`; options: `started`, `pending_verification`, `verified`, `rejected`, `expired`
- `started_at` (`fldiuLI7WnM6IdyixHg`): `date`
- `expires_at` (`fldhEVll5Xdaaoveel2`): `date`
- `verification_status` (`fldAa6pve63EJi30K8R`): `singleSelect`; options: `pending`, `verified`, `rejected`
- `created_at` (`fldrFqcESHQHacK5P4A`): `createdTime`
- `campaign_version_id` (`fldz2D3CargG4vUcKBx`): `link`; relation: manyOne -> PlayavidaEngagementCampaignVersions (tblQNAoxZbAfwzriuzM)
- `customer_user_id` (`fldCFasBCqj1i0cEbJG`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlayavidaCustomerActionCompletions` (`fldVFYqanxxccee0Q0b`): `link`; relation: oneMany -> PlayavidaCustomerActionCompletions (tblorS1uwoPiOy06gAk)

### PlayavidaCustomerActionCompletions (tblorS1uwoPiOy06gAk)

- `completion_id` (`fldbsateA3OlfVmPPi2`): `singleLineText`
- `points_awarded` (`fldC9X78YbNveJ2pXbu`): `number`
- `verification_method` (`fldb1g1GNaWI3zAEO88`): `singleSelect`; options: `staff_scan`, `signed_callback`, `timed_session`, `manual_review`, `customer_qr_strict`
- `completed_at` (`fldWY3ZwHubyKwqLWiy`): `date`
- `status` (`fldK0EoP2KypDsq80OJ`): `singleSelect`; options: `pending`, `accepted`, `rejected`, `reversed`, `duplicate`
- `metadata_json` (`fldacNQ2iv7qIrVhicP`): `longText`
- `session_id` (`fld6pArUAN60y9hdtaN`): `link`; relation: manyOne -> PlayavidaCustomerActionSessions (tblQMtLnkxbFGT3btUt)
- `campaign_id` (`fldJrDERlto7KK1X3dz`): `link`; relation: manyOne -> PlayavidaEngagementCampaigns (tblqyhBcVEn6Ab8owZh)
- `campaign_version_id` (`fldAV2RqHsQc3Nj0sDR`): `link`; relation: manyOne -> PlayavidaEngagementCampaignVersions (tblQNAoxZbAfwzriuzM)
- `customer_user_id` (`fldQaeNAWlgaIY2v8dO`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlayavidaBonusSubmissions` (`fldKi4iU8SrvnqX1M8i`): `link`; relation: oneMany -> PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)
- `program_id` (`fldvtxyrhIrltedS2id`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `business_id` (`fldQx6UkqHHNCljI2MI`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `completion_reference` (`fldqQbkzO96BarRvRUW`): `singleLineText`
- `idempotency_key` (`fldEcwddM2UoyuCjgWs`): `singleLineText`
- `stamps_awarded` (`fldEl0GotwqDJEph7ft`): `number`

### PlayavidaCustomerCards (tblOVokzPDd71IyedJu)

- `card_id` (`fldNkXftX5HvGSlueIt`): `singleLineText`
- `status` (`fldbb6kp3h0123S9l7E`): `singleSelect`; options: `active`, `paused`, `archived`
- `joined_at` (`fld6HqilzmtcC2zK6ND`): `date`
- `last_activity_at` (`fldq3vlgUn9t2H34sS9`): `date`
- `archived_at` (`flduY6SUGVck0EoXu3Z`): `date`
- `user_id` (`fldXIgLaGM6ny96qE1e`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `business_id` (`fldnooKgm4nkrN0FsWY`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `program_id` (`fldYULSFpMSpTVuHL0W`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `created_at` (`fldm8gtn4egVuEuhFcP`): `createdTime`
- `updated_at` (`fldJpO0ENi9wQnfPFiL`): `lastModifiedTime`
- `PlayavidaLoyaltyCardCycles` (`fldxhtQQo9SgzqHR1p2`): `link`; relation: oneMany -> PlayavidaLoyaltyCardCycles (tblaXjpNTunNEk9pvhf)
- `PlayavidaDynamicQRChallenges` (`fldASUt4gGrwwtGHcbC`): `link`; relation: oneMany -> PlayavidaDynamicQRChallenges (tblPfGTmoL9vWyI7kl0)
- `PlayavidaLoyaltyTransactions` (`fldPgWV5gdg9szwM2Jj`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)

### PlayavidaLoyaltyProgress (tbl8tGEEKD5X75CquuU)

- `progress_id` (`fldhZtxaqTDOM557dB0`): `singleLineText`
- `current_progress` (`fldSreUbHEr7Y1kWUPx`): `number`
- `threshold` (`fldQllkw7yEnpoLIdAJ`): `number`
- `status` (`fldULDNgB3JLLDtmxls`): `singleSelect`; options: `earning`, `earned`, `redeemed`, `expired`, `reset`
- `earned_at` (`fldr8D0QlwiwRmMqumj`): `date`
- `redeemed_at` (`fldZmaRFpB01SDOEUKL`): `date`
- `expires_at` (`flduJGJgt5YDn4tF0aV`): `date`
- `updated_at` (`fldOmRAzTnyAS0R07Zi`): `lastModifiedTime`
- `user_id` (`fldgOC5Fcpj5hMBf7aD`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `program_id` (`fldO2GZGXI95AuVHfh7`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `reward_rule_id` (`fldI2ZGXlSUvXLdaTsx`): `link`; relation: manyOne -> PlayavidaRewardRules (tblE7RpFT4b6HFSzY8H)
- `reward_rule_version_id` (`fldCYmZy3lAhL8X3dG1`): `link`; relation: manyOne -> PlayavidaRewardRuleVersions (tblGLvpKNEuksKlAOg9)
- `cycle_reference` (`fldyjjIHWDHYcEnvwFE`): `singleLineText`

### LocationConfigurations (tblcuRKmubtOrykPw3i)

- `configuration_id` (`fld21W27XF553k4exr9`): `singleLineText`
- `brand_name` (`fld4n0g0XwtCJf9wp4Z`): `singleLineText`
- `logo_url` (`fld6pLsEfZvHucitJ4F`): `singleLineText`
- `favicon_url` (`fldln0APtvsMb8VPzdt`): `singleLineText`
- `primary_color` (`fld1MbFyZl03pkFN7Zd`): `singleLineText`
- `secondary_color` (`fldY72TnUmfbxiIcWMl`): `singleLineText`
- `default_language` (`fldyo923tFL1B1XHIQ0`): `singleSelect`; options: `es`, `en`
- `supported_languages_json` (`fldgggpNdFFYj5gBYWo`): `longText`
- `currency` (`flds6BziEyPjybwUlLM`): `singleLineText`
- `timezone` (`fldHijTYs9AWOEYX8zH`): `singleLineText`
- `legal_url` (`fldbArAFK8FPtSaLl3H`): `singleLineText`
- `privacy_url` (`fld2EKgZETt8bktHwwE`): `singleLineText`
- `support_email` (`fldxthTVS3GcqQjXPFg`): `singleLineText`
- `feature_flags_json` (`fldAC4jVR6Q6Jxok1G7`): `longText`
- `created_at` (`fldoERELkdJ5UF9Tl0K`): `createdTime`
- `updated_at` (`fldeA1i3HkcFmB1pTRA`): `lastModifiedTime`
- `location_id` (`fld4wL6PV43kNRX0SKT`): `link`; relation: oneOne -> Locations (tblvc9P1eUHidtcW4tH)
- `map_enabled` (`flduaaD2q1s1QXCKMIG`): `checkbox`
- `public_contact_policy` (`fldoTwZWuFA5hVKsrFf`): `singleSelect`; options: `hidden`, `authenticated_entitled`, `public_entitled`
- `default_event_radius` (`fldlh4i8zZWE11TZUGQ`): `number`
- `default_search_radius` (`fld25cNT9tSd71Owukw`): `number`
- `pwa_manifest_json` (`fldgLj4CjSuCGJIhljU`): `longText`
- `translation_policy_json` (`fldln1h4oNPsAtlYNAE`): `longText`
- `sponsor_policy_json` (`fldtTxzlUi89fLxcjw5`): `longText`
- `legal_configuration_id_nullable` (`fldhFEX6O7wRZMfOKRA`): `link`; relation: manyOne -> LegalConfigurations (tblSYwZm78DAE0JyV2I)
- `brand_tagline_es` (`fld1bCjjoIhh1nftmcb`): `singleLineText`
- `brand_tagline_en` (`fldBnOlZBQsoFNtecEp`): `singleLineText`
- `canonical_host` (`fldPn4zeUzWGB69i0VU`): `singleLineText`
- `country_code` (`fldJmwTStfNvGHjmq6T`): `singleLineText`
- `region_label_es` (`fldJr7Pq45T0ZYxhviN`): `singleLineText`
- `region_label_en` (`fldBhK73Ph4yuhtsiJy`): `singleLineText`
- `city_label_es` (`fldxfGkAe6bADSuS9Ab`): `singleLineText`
- `city_label_en` (`fld3wT8VUUUWRddKHX2`): `singleLineText`
- `location_status_message_es` (`fldFlqkLF2TTbDRsxQ3`): `singleLineText`
- `location_status_message_en` (`fldxEw8CdKjHpErnHkP`): `singleLineText`
- `support_url` (`fld7IBIWhqSYogs8abg`): `singleLineText`
- `public_map_latitude` (`fldrLj5MR5ca8ch2Lix`): `number`
- `public_map_longitude` (`fld5dMdkb72Rw9RCZt7`): `number`
- `public_map_default_zoom` (`fldVGkJ5NqTuTNeI90x`): `number`
- `intro_enabled` (`fldFpUXZxcV69APe1KK`): `checkbox`
- `default_index_enabled` (`fldknt71W84NLOKrgBI`): `checkbox`
- `canonical_protocol` (`fldaD7kq0Z8EW1IUWx7`): `singleSelect`; options: `https`, `http`
- `intro_publish_status` (`fldDQUkvy0CQyecg6j7`): `singleSelect`; options: `draft`, `review`, `published`, `archived`
- `seo_publish_status` (`fldCxDHZdUKuRbjTVn7`): `singleSelect`; options: `draft`, `review`, `published`, `archived`
- `default_robots_policy` (`fldrr96agZXF4sSOjAO`): `singleSelect`; options: `index_follow`, `noindex_follow`, `noindex_nofollow`

### LocationAdministrators (tblTUJ6E6EiRjEtE8Vh)

- `administrator_id` (`fldR2281H3NQSdYxLnl`): `singleLineText`
- `role` (`fldV7gQlFhpRDrZR1v5`): `singleSelect`; options: `owner`, `administrator`, `moderator`, `analyst`
- `permissions_json` (`fldnoHHpFoPbXiWZQ1T`): `longText`
- `status` (`fldedLgWDsjLqs0JYcc`): `singleSelect`; options: `invited`, `active`, `suspended`, `revoked`
- `created_at` (`fldDPJFQliOouiYngiX`): `createdTime`
- `updated_at` (`fld0Y0XWaOZJPeDX0E4`): `lastModifiedTime`
- `location_id` (`fldP1YDrdBzq7QhNFFm`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `user_id` (`fld3blEBJhgo7RYeUl9`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### LocationDomains (tblvNgSexAKVo00mb0D)

- `domain_id` (`fldj0d7RUf8nGt4Wu2G`): `singleLineText`
- `domain` (`fldp9VcWofryrkI2XHV`): `singleLineText`
- `verification_status` (`fldAqxPTaWZWJ6WYK6T`): `singleSelect`; options: `pending`, `verified`, `failed`
- `ssl_status` (`fldsqbFr3U2sfmWRta0`): `singleSelect`; options: `pending`, `active`, `failed`, `expired`
- `created_at` (`flddGGCSPkLcXlWR53I`): `createdTime`
- `updated_at` (`fldzJLkEVo8HZDHTwAP`): `lastModifiedTime`
- `location_id` (`fldInTmvtXtCP9UFxVz`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `domain_type` (`fld38kdclXKM3CUov3R`): `singleSelect`; options: `primary`, `secondary`, `preview`, `staging`, `legacy`
- `canonical` (`fldf1QzMZBhmprbwFRz`): `checkbox`
- `redirect_to_canonical` (`fldfd4pJee3lrHutzNV`): `checkbox`
- `active` (`fldxLwoGAuc9MhaG0T5`): `checkbox`

### ParentBrands (tblaWXXSoWyjRxuDHKT)

- `parent_brand_id` (`fldOj21pVPpMzxFuT6S`): `singleLineText`
- `parent_brand_reference` (`fldUrKBo2pK2i6xazJO`): `singleLineText`
- `name` (`fldvoYuVK0P7fcPIM0w`): `singleLineText`
- `description` (`fldfM4UIsNHj8rPtfcG`): `longText`
- `logo_url` (`fldvJ2DYjKYkYE8BZiS`): `singleLineText`
- `created_at` (`fldkH3CESKhb2On55vZ`): `createdTime`
- `updated_at` (`fldkHd271gK2JVw4lLI`): `lastModifiedTime`
- `BusinessBranches` (`fld3kscHIf2KJOlrpj5`): `link`; relation: oneMany -> BusinessBranches (tblId1kLGb9QDGiYXlt)

### BusinessBranches (tblId1kLGb9QDGiYXlt)

- `branch_id` (`fldEwpWf2wVh7bRgXIA`): `singleLineText`
- `branch_reference` (`fldC7rfN3wY1yFkp6zg`): `singleLineText`
- `status` (`fldOJDhzgxRWB34jVSt`): `singleSelect`; options: `active`, `inactive`, `planned`, `archived`
- `created_at` (`fldk5GCYjzOqzt2nI8M`): `createdTime`
- `updated_at` (`fldpFMh5N2LZMMHrDs9`): `lastModifiedTime`
- `parent_brand_id` (`fldOIqdS1EXZzeF3yxG`): `link`; relation: manyOne -> ParentBrands (tblaWXXSoWyjRxuDHKT)
- `business_id` (`fld7xUapSuFDxs95krY`): `link`; relation: oneOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldG1gFGDGrXlu6Ip0X`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### MlsLinks (tblzMdiFf495i0vaXEd)

- `mls_link_id` (`fldprHpFENHankw0ZSc`): `singleLineText`
- `entity_type` (`fldUbDw7aldMRWvzeMC`): `singleSelect`; options: `business`, `event`, `group`, `offer`, `property_search`
- `entity_id` (`fldpLLaXwA3JTN7smkd`): `singleLineText`
- `destination_url` (`fldJeey9mlWKN2PnVJt`): `singleLineText`
- `label_es` (`fldWT9nml6DWkb12hNx`): `singleLineText`
- `label_en` (`fldOAkczLnZr63eGBvb`): `singleLineText`
- `active` (`fldqjWUIwcIOmg7U639`): `checkbox`
- `click_count` (`fldoMDFCAGtIooubUz2`): `number`
- `created_at` (`fldty2Gcp6M3eASld0z`): `createdTime`
- `updated_at` (`fldtwoshcGK5TJBxNvm`): `lastModifiedTime`
- `location_id` (`fld6Zh6v2C8nZ66Fb9v`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `business_id_nullable` (`fld6DsxNDMjnpdjJxvr`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)

### CloneJobs (tblhoxtYAEeTDEO5r6l)

- `clone_job_id` (`fldL2PtRlDLi4qyEdH1`): `singleLineText`
- `configuration_json` (`fldFWeD8jHU31UbZ2qd`): `longText`
- `status` (`fldFftRCL3OmvQfBh7h`): `singleSelect`; options: `draft`, `validated`, `running`, `completed`, `failed`, `canceled`, `requested`, `dry_run_complete`, `executing`, `rollback_requested`, `rolled_back`
- `dry_run` (`fldibL6xPF1xxTTm6Fo`): `checkbox`
- `started_at` (`fldGCP7Y1SK36qLGlKe`): `date`
- `completed_at` (`fldlLyh693s2aBzk5xh`): `date`
- `error_message` (`fldyyyUq1RtVUy3PFxK`): `longText`
- `created_at` (`fldILO2bCjX8OJLy1EG`): `createdTime`
- `source_location_id` (`fldH9x74ut6wlJLfk8k`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `target_location_id` (`fld5Tr2Jsta5iVYeubd`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `requested_by_user_id` (`fldiktKKBslalJAa9U2`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `target_brand_name` (`fldh6XkQZWfJGbBKCT2`): `singleLineText`
- `target_domain` (`fld9nr5z0FiTJ9g6P6c`): `singleLineText`
- `target_default_language` (`fldNaApA5heqZ80k9Ol`): `singleLineText`
- `target_currency` (`fld1EmZcT4pgwuVtVxC`): `singleLineText`
- `target_locale` (`fldK2RYlJo8codovjOF`): `singleLineText`
- `target_timezone` (`fldfRv1uVusO0jd66yN`): `singleLineText`
- `rollback_reference` (`fldTtGNiMh3909Bh5zC`): `singleLineText`
- `target_supported_languages_json` (`fldXuLzUYwLeVapBA5c`): `longText`
- `validation_result_json` (`fldJV3xNjjtifHkhoWy`): `longText`
- `exclusions_json` (`fldqzyTw4C8VKpElxUO`): `longText`
- `copy_branding` (`fldK6PKSA7zBytXRl8c`): `checkbox`
- `copy_categories` (`fldvkoNbs4inLozgrFO`): `checkbox`
- `copy_plan_templates` (`fldLEhWf0bqBV7OA4Iq`): `checkbox`
- `copy_feature_flags` (`fldNaIqwtdBSy2NqUkQ`): `checkbox`
- `copy_seo_templates` (`fldj8YyfPLbo5q4zoBf`): `checkbox`
- `copy_aeo_templates` (`fldtxJbCLsoKxE4GTU5`): `checkbox`
- `copy_geo_templates` (`fldZjDjnWS88gnvOGRj`): `checkbox`
- `copy_faq_templates` (`fld9l2HdI9Tx8JTpxTh`): `checkbox`
- `copy_intro_template` (`fldOrhVMKCgoNHYKoQt`): `checkbox`
- `copy_guides_as_drafts` (`fldLkPfOAUBvutThBfp`): `checkbox`
- `seed_demo_content` (`fldyeLQRgb9C1WkcXLe`): `checkbox`
- `create_location_admin` (`fldb6hC0UJKVGlInTxj`): `checkbox`
- `error_message_private` (`fldp9AsygKBFGqxNro3`): `longText`

### LocationAnalytics (tbldHRUowetwBdvCq0s)

- `analytics_id` (`fldsVW2HhUOpglEenwn`): `singleLineText`
- `event_type` (`fld1xWap9TwuAFbSM8w`): `singleLineText`
- `entity_type` (`fld7c60w6py3jgPpua2`): `singleSelect`; options: `user`, `business`, `event`, `group`, `offer`, `sponsor`, `loyalty`, `mls_link`
- `entity_id` (`fldhLaYQklE1TswP6aC`): `singleLineText`
- `language` (`fldQTTBMaQF847XrYd0`): `singleSelect`; options: `es`, `en`
- `metadata_json` (`fld6OqF9VGqmyZXwMUQ`): `longText`
- `created_at` (`fldDOYDwy06c0mWK1xa`): `createdTime`
- `location_id` (`fldrEl2xCcXufbFTd4T`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `user_id_nullable` (`fldbW6nArEZOzBP4xlu`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### InterestDefinitions (tblvuVLbXPglY1Pchr6)

- `interest_key` (`fldAI8ZudU27URoEjgF`): `singleLineText`
- `name_es` (`fld3jvxtGYCyrs5cx1G`): `singleLineText`
- `name_en` (`fldmQpW9AfwNKX4wZEQ`): `singleLineText`
- `category` (`fldxCrdM0e0fpOpcOgh`): `singleSelect`; options: `wellness`, `growth`, `sports`, `hobbies`, `food`, `faith`, `adventure`, `technology`, `dance`, `community`
- `active` (`fldcje81wn316GRn16U`): `checkbox`
- `sort_order` (`fldxojUofMVXyAu8qvm`): `number`
- `created_at` (`fldzkd4NEVvQprysy5v`): `createdTime`
- `updated_at` (`fld6MxsdsqGqETfTQ8l`): `lastModifiedTime`
- `UserInterestPreferences` (`fld5fwyfWwRxL3Xj7UX`): `link`; relation: oneMany -> UserInterestPreferences (tblheln1oKP60zBiYSX)
- `interest_definition_id` (`fldZaueEw87ckfBj14j`): `singleLineText`
- `description_es` (`fldSsrYctsKd4nT99m9`): `longText`
- `description_en` (`fldVeyQWHq5uaC1Sk9r`): `longText`
- `icon_key` (`fldmnTxSkLqQop74t4l`): `singleLineText`

### UserInterestPreferences (tblheln1oKP60zBiYSX)

- `preference_id` (`fldw5f4kvynEkZKyCbO`): `singleLineText`
- `score` (`fldRSAZ4xL6ycaPgpwV`): `number`
- `opted_out` (`fldDUgTKM45VTe7sK8R`): `checkbox`
- `updated_at` (`fldmo65gOB9zhujFUAD`): `lastModifiedTime`
- `user_id` (`fldJZNyPFvbDD7UQLEz`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `interest_key` (`fldksZopdKe6zWF6jXR`): `link`; relation: manyOne -> InterestDefinitions (tblvuVLbXPglY1Pchr6)
- `created_at` (`fldIZffv0gciKpbng36`): `createdTime`

### EntityNotificationSubscriptions (tbl3UzWdkBCNCwTV9iZ)

- `subscription_id` (`fldKpHRTNQBEbJUVdW3`): `singleLineText`
- `entity_type` (`fldRuef5fTLnUpSY9GO`): `singleSelect`; options: `business`, `event`, `group`, `organizer`, `loyalty_program`
- `entity_id` (`fldY5RRqn1w0f4KVM3a`): `singleLineText`
- `entity_reference` (`fldl411R3GbKdI14lxC`): `singleLineText`
- `notify_updates` (`fldw7YezMWdlT7Qq6ql`): `checkbox`
- `notify_events` (`fldyelgE3FdpBf2tFcu`): `checkbox`
- `notify_offers` (`fldaceNRWTQT10GQFYq`): `checkbox`
- `notify_loyalty` (`fld7hS2wp2kZPJe8q78`): `checkbox`
- `notify_group_activity` (`fld9skv5bd3Y6ZSCywI`): `checkbox`
- `notify_sponsored` (`fldOUb3YL5XLw4lfmEs`): `checkbox`
- `status` (`fldQRIygcaLKZzzl2nm`): `singleSelect`; options: `active`, `paused`, `revoked`
- `quiet_hours_start` (`fldBPwQICBXeoulnUr4`): `singleLineText`
- `quiet_hours_end` (`fldFTeHdeqPj8SbB4eW`): `singleLineText`
- `timezone` (`fldQAkxxPn0hRHNUETH`): `singleLineText`
- `frequency_cap_per_week` (`fldMWVdDKAGTvqqyeGH`): `number`
- `last_notified_at` (`fldfJnrNJ1PlzArnYHN`): `date`
- `created_at` (`fldjZwDfL1DIyNY4dzY`): `createdTime`
- `updated_at` (`fld8xglZJm4vqHjZagB`): `lastModifiedTime`
- `user_id` (`fldRuDSVoEQYH0ioFsZ`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `NotificationConsentEvents` (`fldwfKivtIAKXs6yV70`): `link`; relation: oneMany -> NotificationConsentEvents (tblWw4I7WjQcMCCMgU5)
- `EventRSVPs` (`fldu1m2ezphj44N7YAj`): `link`; relation: oneMany -> EventRSVPs (tblwzt47e24t1dPGifV)

### NotificationConsentEvents (tblWw4I7WjQcMCCMgU5)

- `consent_event_id` (`fldUDgqMZQRPTgxImAp`): `singleLineText`
- `entity_type` (`fldqh7CV5dfPr9k6sU1`): `singleSelect`; options: `business`, `event`, `group`, `organizer`, `loyalty_program`
- `entity_id` (`fldFpPjy7vS62nesutn`): `singleLineText`
- `category` (`fldCPidkgmLb2ZcRsWt`): `singleSelect`; options: `updates`, `events`, `offers`, `loyalty`, `group_activity`, `sponsored`
- `action` (`fldpC5M9T0UKa1lo7AJ`): `singleSelect`; options: `opted_in`, `opted_out`, `updated`, `revoked`, `migrated`
- `source` (`fldiwgqQgi7DktywfRp`): `singleSelect`; options: `business_page`, `event_page`, `group_page`, `loyalty_wallet`, `profile`, `settings`, `migration`
- `language` (`fld5MO7yBuZlsgR5IPv`): `singleSelect`; options: `es`, `en`
- `created_at` (`fld5wvahufMYgKPBe0n`): `createdTime`
- `user_id` (`fldJ9ZODV8TJYoAiIKy`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `subscription_id` (`fldX1U5fUKD7eGEJkVM`): `link`; relation: manyOne -> EntityNotificationSubscriptions (tbl3UzWdkBCNCwTV9iZ)

### EventRSVPs (tblwzt47e24t1dPGifV)

- `rsvp_id` (`fldidR5o1xsA7AGAqQv`): `singleLineText`
- `status` (`fldjwPgK8YkaU6ZMHbo`): `singleSelect`; options: `interested`, `going`, `not_going`, `withdrawn`
- `party_size` (`fldS21PzKXmGTPm4p9F`): `number`
- `source` (`fld6Q6x8W2dSuKdtyl6`): `singleSelect`; options: `event_page`, `external_link`, `organizer`, `import`
- `created_at` (`fldO3Q2xd9ObZdWCxmP`): `createdTime`
- `updated_at` (`fldbOi0izyryCngXyVp`): `lastModifiedTime`
- `event_id` (`fldEYxnESBCeYrlOqMn`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)
- `user_id` (`fldL5Pw1OJLQIAQOlDA`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `notification_subscription_id` (`fld2PopfrMOgrWttnhb`): `link`; relation: manyOne -> EntityNotificationSubscriptions (tbl3UzWdkBCNCwTV9iZ)
- `receive_event_updates` (`fldiOiA2OmfMsNyvCO3`): `checkbox`
- `receive_organizer_updates` (`fldzhpE4xI9uXc4Puk1`): `checkbox`
- `receive_incentives` (`fldwGzn1pzb9KfJbXiz`): `checkbox`

### NotificationCampaigns (tbl5QQarciJIXc9YMs6)

- `campaign_id` (`fldHOey5QQM8DkOkTP1`): `singleLineText`
- `campaign_reference` (`fldYxydmZHMLAYsKSsG`): `singleLineText`
- `owner_entity_type` (`fldmVzRh8CZKJ9OOFOB`): `singleSelect`; options: `business`, `event`, `group`, `organizer`, `loyalty_program`, `platform`
- `owner_entity_id` (`fld1C8Q3sdoHotrOXxm`): `singleLineText`
- `owner_entity_reference` (`fldLvaxEpoobvj8ZIP2`): `singleLineText`
- `category` (`fldZOfhfzWu2Di3PsHP`): `singleSelect`; options: `updates`, `events`, `offers`, `loyalty`, `group_activity`, `sponsored`
- `title_es` (`fldgiXefNJoSw9SweGv`): `singleLineText`
- `title_en` (`fldV7H3myZBrCibAiZL`): `singleLineText`
- `body_es` (`fldJQdxKQZIh7Fb5RDC`): `longText`
- `body_en` (`fldKBuRvym2AiVgA9Pf`): `longText`
- `audience_filter_json` (`fldwLz9rjjczUD9KJXw`): `longText`
- `status` (`fldsOC0lubkIGvCLAHl`): `singleSelect`; options: `draft`, `scheduled`, `sending`, `sent`, `paused`, `canceled`
- `scheduled_at` (`fldS6pR8Stwa8bpGTKX`): `date`
- `sent_at` (`fld4kdvNXasFWbe3Rfz`): `date`
- `created_at` (`fldYnIegdyic5Nlyjkz`): `createdTime`
- `updated_at` (`fldvdYMahI9jbetHFFk`): `lastModifiedTime`
- `created_by_user_id` (`fld41RzWvZGVmuhim1W`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `location_id` (`fldPcjg70cWlTKyOtI4`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `NotificationDeliveryAggregates` (`fldRUvl3sGD7Xauz8j6`): `link`; relation: oneMany -> NotificationDeliveryAggregates (tblxNrqNnvGWe3YGpAi)
- `Notifications` (`fldoVK9jP0PQAWXFGiL`): `link`; relation: oneMany -> Notifications (tbl556QiZgdJyJaa1zi)

### NotificationDeliveryAggregates (tblxNrqNnvGWe3YGpAi)

- `aggregate_id` (`fldZmMXQ22hrbVYm983`): `singleLineText`
- `reporting_date` (`fldlGIfvUV4Jwpygm7M`): `date`
- `eligible_count` (`fldW1VliN6t2Nn8fovU`): `number`
- `sent_count` (`fldQIOnz6ttpbkRwk0k`): `number`
- `delivered_count` (`fldOufvvnvePAErnQ5O`): `number`
- `opened_count` (`fldT0LE5wYm5yhxeZdI`): `number`
- `clicked_count` (`fldBFxmjVi6bafPGmUV`): `number`
- `unsubscribed_count` (`fldrUa5TE0eofwkyslP`): `number`
- `frequency_limited_count` (`fldJl0b3npjr7HYMlUN`): `number`
- `converted_count` (`fldKlJ0SzXzFti4DmbB`): `number`
- `created_at` (`fldsBR5SJe2lPJr9jCu`): `createdTime`
- `campaign_id` (`fld8g8s0x0e3I6UZdab`): `link`; relation: manyOne -> NotificationCampaigns (tbl5QQarciJIXc9YMs6)
- `location_id` (`fldxJyZLPm4EPX37b2u`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### Organizers (tblmDooGwHyQGdr5KXn)

- `organizer_id` (`fldM69U8bn1AAzou6A9`): `singleLineText`
- `organizer_reference` (`fldGjnzzB4I2FfD1Bxb`): `singleLineText`
- `organizer_type` (`fldD0gU5YKvvzHTf0A5`): `singleSelect`; options: `user`, `business`, `group`, `hybrid`
- `display_name_es` (`fldPX1yWsNRNIBLSP9r`): `singleLineText`
- `display_name_en` (`fldQvDDucKPKSpfk4ms`): `singleLineText`
- `description_es` (`fldKp3jVt1u8JKNuZjs`): `longText`
- `description_en` (`fldponUBGMxKZBwmODe`): `longText`
- `logo_url` (`fld3HpylD5oLJYPDc3W`): `singleLineText`
- `public_visibility` (`fldPVgU1kTG4en4MEmG`): `singleSelect`; options: `public`, `private`, `unlisted`
- `status` (`fldQEZ1PAuxFHJDZHzx`): `singleSelect`; options: `draft`, `active`, `suspended`, `archived`
- `public_follower_count` (`fld2dBwCe2f7doTUims`): `number`
- `created_at` (`fldg0KFpGYVtiHpHxdE`): `createdTime`
- `updated_at` (`fldndYj5S4sG9LPEuGu`): `lastModifiedTime`
- `user_id_nullable` (`fldmLEXLcYYh9oaoqy9`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `business_id_nullable` (`fldJIAxFiEwOVXHxwWA`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `group_id_nullable` (`fldkZKJW4UmRoXdGAEd`): `link`; relation: manyOne -> Groups (tblHILTdHKnZTaHRL3P)
- `location_id` (`fldTB84Ev2NOTLhH5u9`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `OrganizerFollows` (`fldCoyNECjijaourBJ3`): `link`; relation: oneMany -> OrganizerFollows (tblpPnTELmYMBukhGTZ)
- `Events` (`fldXs1Jkl9ayJeKDDYi`): `link`; relation: oneMany -> Events (tblOA1Eb39I2imf93JV)
- `is_demo_content` (`fldiXi0FnakIB8GVXEW`): `checkbox`

### OrganizerFollows (tblpPnTELmYMBukhGTZ)

- `follow_id` (`fldSmyPhVgR7LLn2o8x`): `singleLineText`
- `status` (`fld6gxzrk1xz5AAuvB0`): `singleSelect`; options: `active`, `muted`, `unfollowed`
- `created_at` (`fldC1FtnCtmkEKJDbaw`): `createdTime`
- `updated_at` (`fldYJVV9c9LSNa7AEy7`): `lastModifiedTime`
- `follower_user_id` (`fldzVH1uAilW1TF15UU`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `organizer_id` (`fldOpoBs6ensScZ5ZUm`): `link`; relation: manyOne -> Organizers (tblmDooGwHyQGdr5KXn)

### SearchDocuments (tbld7tEWGDzoEtOJajg)

- `search_document_id` (`fldKQKoyaH1DAM0P2qW`): `singleLineText`
- `entity_type` (`fldEsOivl0dkjzFKrta`): `singleSelect`; options: `business`, `event`, `group`, `organizer`, `offer`, `loyalty_program`, `neighborhood`, `guide`, `faq`
- `entity_id` (`fldnzUugKEHclzIhyUY`): `singleLineText`
- `entity_reference` (`fldQY6vlsgOJNHXlAei`): `singleLineText`
- `title_es` (`fldNx1mrUi2EgaHTwIO`): `singleLineText`
- `title_en` (`fldnjCjReWqqPgV3xlZ`): `singleLineText`
- `content_es` (`fld67qWEl5ByWKIAXwl`): `longText`
- `content_en` (`fld3HuTWWOkdtL0ducl`): `longText`
- `category` (`fldjH95RTUEly2dHE3S`): `singleLineText`
- `tags_json` (`fldGRl6pVrEqrJ7oiWc`): `longText`
- `public_status` (`fldgrzsRaEBUBmcgK0m`): `singleSelect`; options: `published`, `active`, `expired`, `archived`, `suspended`, `private`, `restricted`
- `searchable` (`fldSUqHj8mL7lz76pa4`): `checkbox`
- `freshness_label` (`fldI6HTGRRMLJf9i2tm`): `singleSelect`; options: `new`, `updated`, `recent`, `evergreen`, `stale`
- `last_indexed_at` (`fldaW3LBAGXIRXsuYtE`): `date`
- `created_at` (`fldmIQIMvItQiUoitRD`): `createdTime`
- `updated_at` (`fldYIj7kWujMvtcHTn5`): `lastModifiedTime`
- `location_id` (`fld47LSpYlf3hzRkE0b`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `available_languages` (`fld3rCOHqnd7X8C88eS`): `multipleSelect`; options: `es`, `en`
- `event_start_at` (`fld9tRdhALq4t5v4tQu`): `date`
- `translation_completeness` (`fldlratAUtHrkFkjicl`): `singleSelect`; options: `missing`, `partial`, `complete`
- `is_demo_content` (`fldB7b9Ylyc3CisG5wS`): `checkbox`
- `needs_review` (`fldb2BPXR8kc0Xtt0Z0`): `checkbox`
- `cleanup_status` (`fldwp7BTn1UAQAyI0uh`): `singleSelect`; options: `active`, `review_required`, `disabled`, `archived`, `queued_for_purge`, `purged`, `restored`
- `source_updated_at` (`fldUhnARCz49pTcRYar`): `date`
- `index_status` (`flduLDa82iy3jJEDnzG`): `singleSelect`; options: `current`, `stale`, `pending`, `failed`, `suppressed`
- `index_error_private` (`fldYigx6qugVZFfpPNh`): `longText`
- `reindex_requested_at_nullable` (`fldx3pBvvVlbEY7XYn5`): `date`
- `projection_version` (`fldRLEuCSnxfM7Sr1XY`): `number`

### CoastalMapHubs (tblSJ8SRrWaZYu69fis)

- `hub_id` (`fldHKDWtAQbCaPvVWtF`): `singleLineText`
- `display_order` (`fldvKuyLuzfcsKATlA9`): `number`
- `public_label_es` (`fldmdOu0YI4p7NDW7HM`): `singleLineText`
- `public_label_en` (`fldEpQjEFDUIQW08knv`): `singleLineText`
- `map_latitude_public` (`fldj7DuPVLqsVf9PWgd`): `number`
- `map_longitude_public` (`fldmqBxp2qybkb6eTiY`): `number`
- `map_zoom` (`fldNXTEzmVd6a9yi5od`): `number`
- `active` (`fld255whzUSqEPxq3cI`): `checkbox`
- `created_at` (`fldy9KyI58ziAl5FczZ`): `createdTime`
- `updated_at` (`fldzAjhu8oHLn34gucJ`): `lastModifiedTime`
- `location_id` (`fldv09n1L4hDVEtk08R`): `link`; relation: oneOne -> Locations (tblvc9P1eUHidtcW4tH)

### EventPartnerships (tblJmefbtJ46XBeFhPD)

- `partnership_id` (`fldRDQDWjPLgPQiWX5V`): `singleLineText`
- `role` (`fldQLvfE9FOcZQ3rYi3`): `singleSelect`; options: `co_host`, `sponsor`
- `partner_type` (`fldkNYUVIDIE7GAKgU6`): `singleSelect`; options: `business`, `group`
- `status` (`fldqKArdPQGNA9vUWe4`): `singleSelect`; options: `proposed`, `pending_partner`, `pending_organizer`, `approved`, `rejected`, `withdrawn`
- `display_name_es` (`fldVNp6jV4bk0ExHaFj`): `singleLineText`
- `display_name_en` (`fld56tpzK5cRb9Y9fss`): `singleLineText`
- `banner_image` (`fldzJiECRtyLoFDAMSx`): `attachment`
- `banner_alt_es` (`fldDJWK5u73a8jdXUoc`): `singleLineText`
- `banner_alt_en` (`flda5ashfVhsqpkCcpV`): `singleLineText`
- `pinned` (`fldQGE2vBGsk9ngD36E`): `checkbox`
- `display_order` (`fldQ9cte3xVAu4roB5J`): `number`
- `destination_type` (`fldPdADWHkC2hV5Ulhi`): `singleSelect`; options: `partner`, `offer`, `loyalty_program`
- `proposed_at` (`fldcSZrdXyN3ke3AkCG`): `date`
- `partner_approved_at` (`fldiw252tSoZZy18mK4`): `date`
- `organizer_approved_at` (`fldDFssOEIFgX9Ye1pW`): `date`
- `withdrawn_at` (`fldRLLqH9QhRgnTg5Br`): `date`
- `created_at` (`fld3XEwOuQEGAH1PZtk`): `createdTime`
- `updated_at` (`fldErsGQTBOwqEKxo3k`): `lastModifiedTime`
- `event_id` (`fldSmrlhQO8VnhEbl2R`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)
- `partner_business_id` (`fld01Ry0UwBjoLSD8It`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `partner_group_id` (`fldE6uA17fMaKmzfEIl`): `link`; relation: manyOne -> Groups (tblHILTdHKnZTaHRL3P)
- `destination_offer_id` (`fldEVvcDkoU1ZUojNtv`): `link`; relation: manyOne -> Offers (tblf2PeEIunfjiRaoVV)
- `destination_loyalty_program_id` (`fldAacxSqjp4XJ72Pol`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `sponsored_placement_id` (`fldEQj8KdAvRkzR0v4o`): `link`; relation: manyOne -> SponsoredPlacements (tblFcHe1WDlfp0UQadz)
- `proposed_by_user_id` (`fldEmo04kSGRymthvcq`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `partner_approved_by_user_id` (`fldLvtLI1ienvJLh5Xo`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `organizer_approved_by_user_id` (`fld1JDoBIxCeSQVNyYT`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### PlayavidaBonusSubmissions (tblckGGsvFJzebfPfiy)

- `submission_id` (`fldffwe5ypVOYIQNaVR`): `singleLineText`
- `status` (`fldhLt9iP3OiLmvaK7s`): `singleSelect`; options: `pending_review`, `approved`, `rejected`, `withdrawn`
- `photo_evidence` (`fldv72dZMvJoPMdzSqq`): `attachment`
- `photo_caption` (`fld49uPCxCbOrEYCkgl`): `longText`
- `consent_to_review_photo` (`fld7A4dNO3PPE8TAmvF`): `checkbox`
- `submitted_at` (`fld3KXZij7fNo156ml1`): `createdTime`
- `reviewed_at` (`fldqYPzKPz8oM70FwWq`): `date`
- `retention_until` (`flducUngfQSLy9PEoj2`): `date`
- `idempotency_key` (`fldpGz2XznkByPG0hmf`): `singleLineText`
- `review_notes_private` (`fldnH1AuDc2JEV2rEci`): `longText`
- `updated_at` (`flduaIXU8BOOe8apfor`): `lastModifiedTime`
- `customer_user_id` (`fldioX8JVvA9k1YvK39`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `campaign_id` (`flduRY1gwzbg4fN4wVD`): `link`; relation: manyOne -> PlayavidaEngagementCampaigns (tblqyhBcVEn6Ab8owZh)
- `campaign_version_id` (`fld1182whIMccd1ae1l`): `link`; relation: manyOne -> PlayavidaEngagementCampaignVersions (tblQNAoxZbAfwzriuzM)
- `event_id_nullable` (`fldjs0GGn0Tk1cfCHvO`): `link`; relation: manyOne -> Events (tblOA1Eb39I2imf93JV)
- `business_id` (`fldWvwegK7G4AHGxPTf`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `reviewed_by_staff_id` (`fldI3Gr2sQmjJCyc3UN`): `link`; relation: manyOne -> PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)
- `completion_id_nullable` (`fldErMcfUF4wxCq48Vp`): `link`; relation: manyOne -> PlayavidaCustomerActionCompletions (tblorS1uwoPiOy06gAk)
- `transaction_id_nullable` (`fld3De7R22xYt3iCik8`): `link`; relation: manyOne -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)

### SponsorOffers (tblvWVjcFntkZ3zi5lw)

- `sponsor_offer_id` (`fldjQXMYp5DUyjsOpMn`): `singleLineText`
- `sponsor_offer_reference` (`fld7g8ce7egEHU6zM1n`): `singleLineText`
- `title_es` (`fld09XbzDKfbKtD4fsw`): `singleLineText`
- `title_en` (`fldGSXEhlOJdZVzMY0E`): `singleLineText`
- `description_es` (`fldLkUmjZCTNd0PJgXq`): `longText`
- `description_en` (`fldBICE3E2TFIN8KgYn`): `longText`
- `terms_es` (`fldvnDSq29gVKiBtc7G`): `longText`
- `terms_en` (`fldhCOl7rncmVv76n7H`): `longText`
- `image_url` (`fld7dvPHjMCdpDBVbKx`): `singleLineText`
- `destination_url_private` (`fldH9RiVOcskejQBDOk`): `singleLineText`
- `destination_host` (`fldltvpP3vGgwlrkvZ8`): `singleLineText`
- `content_readiness_status` (`fldA5ZZxGgxFcEcdAEJ`): `singleSelect`; options: `empty`, `incomplete`, `ready`, `needs_review`, `blocked`
- `status` (`fld2LEGY6Gx7P1hzCpO`): `singleSelect`; options: `draft`, `active`, `paused`, `archived`, `removed`
- `created_at` (`flda75mxyvRnrYNDdNF`): `createdTime`
- `updated_at` (`fld7eRNtC5uqWIHMDJ3`): `lastModifiedTime`
- `sponsor_id` (`fldYTzYx8n1fxVTpWy0`): `link`; relation: manyOne -> Sponsors (tbld8kbsDB3c17XO5Dy)
- `location_id_nullable` (`fldDqPk34fGuG3uENIJ`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `SponsorOfferTags` (`fldGPB7XCNug2nTunlp`): `link`; relation: oneMany -> SponsorOfferTags (tblLXIzlQ6k6LUxr3KA)
- `PlatformPaymentEvents` (`fldVhlA5lHSPpN07ODk`): `link`; relation: oneMany -> PlatformPaymentEvents (tbl1TOw9us9ObkXMmHR)
- `SponsorCampaigns` (`fldWa6eNcg41IX4OxdE`): `link`; relation: oneMany -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `ContactAnalyticsEvents` (`fldJ6Pc1r1tj9hEYjYa`): `link`; relation: oneMany -> ContactAnalyticsEvents (tbl7QlJqX4pTlFV8PAv)
- `is_demo_content` (`fld6ew2J1yvt5gSQYmC`): `checkbox`
- `needs_review` (`fldRMUmFONG7TsH7n6V`): `checkbox`
- `cleanup_status` (`fldUx0QryHqBAardsjw`): `singleSelect`; options: `active`, `review_required`, `disabled`, `archived`, `queued_for_purge`, `purged`, `restored`

### SponsorOfferTags (tblLXIzlQ6k6LUxr3KA)

- `sponsor_offer_tag_id` (`fldnXoN1XiccV0Rxez5`): `singleLineText`
- `tag_original` (`fldzQU1gJ7MxzU1Ynx3`): `singleLineText`
- `tag_normalized` (`fld9cStsOll9FKIOZCu`): `singleLineText`
- `active` (`fldB4ASsC30EXJNbmTx`): `checkbox`
- `created_at` (`fld0ZmJdYth4tBaucJk`): `createdTime`
- `updated_at` (`fldcvykOlTDKVBHJukt`): `lastModifiedTime`
- `sponsor_offer_id` (`fld2zGoZy6yC5Dfwh1W`): `link`; relation: manyOne -> SponsorOffers (tblvWVjcFntkZ3zi5lw)

### PlatformSubscriptions (tblniV4rYBKuBjHiPk8)

- `subscription_id` (`fldFP3xnuYDC7Q4MROs`): `singleLineText`
- `provider` (`fldjO41R929KGr85llg`): `singleSelect`; options: `stripe`, `manual`, `no_processor`
- `external_customer_reference` (`fldocZ4zHWTX6uCiMIu`): `singleLineText`
- `external_subscription_reference` (`fld453CL2ReO36pESjp`): `singleLineText`
- `status` (`fldlynemFCPb55ks6NV`): `singleSelect`; options: `pending`, `active`, `past_due`, `cancelled`, `expired`, `suspended`, `manual`
- `current_period_start` (`fldEmzIZJlAtMWdIqsy`): `date`
- `current_period_end` (`fldjJxm12Fh43FPpRWQ`): `date`
- `cancel_at_period_end` (`fldSaLifr0EkIiY6q2s`): `checkbox`
- `canceled_at_nullable` (`fldWPFbymLq2WhYKl3X`): `date`
- `grace_period_start_nullable` (`fldK65kuIXLOV7wl4Q1`): `date`
- `grace_period_end_nullable` (`fldApJtbPrTTPuxfJuM`): `date`
- `created_at` (`fldcuwukl0iLtCSgIjT`): `createdTime`
- `updated_at` (`fldyQeEzqN8FcNHyx3c`): `lastModifiedTime`
- `plan_id` (`fld65C6FhjBzvcM60lZ`): `link`; relation: manyOne -> BusinessPlans (tblfB89TSYURsaZ267N)
- `sponsor_id_nullable` (`fldxjUkhuCiyBRoPMcb`): `link`; relation: manyOne -> Sponsors (tbld8kbsDB3c17XO5Dy)
- `business_id_nullable` (`fldQ0nLrjRSd9rtXb3y`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `owner_user_id` (`fldPist80Yj2QKVjdIO`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlatformPaymentEvents` (`fldAY3llffGa34C1tBb`): `link`; relation: oneMany -> PlatformPaymentEvents (tbl1TOw9us9ObkXMmHR)
- `SponsorCampaigns` (`fldtvob9cFQBdNrOyBr`): `link`; relation: oneMany -> SponsorCampaigns (tblrauOTshgT1dvx9sg)
- `BusinessFeatureEntitlements` (`fldEPnBOZkDkMHaf7Dw`): `link`; relation: oneMany -> BusinessFeatureEntitlements (tblxdmuLBv4TLP5KDVE)
- `payment_verification_status` (`fldIzn6vblrK3EEGgqs`): `singleSelect`; options: `unverified`, `paid`, `failed`, `refunded`, `test_only`
- `last_verified_payment_event` (`fldPlaWIQss2M3AZJna`): `link`; relation: manyOne -> PlatformPaymentEvents (tbl1TOw9us9ObkXMmHR)

### PlatformPaymentEvents (tbl1TOw9us9ObkXMmHR)

- `payment_event_id` (`fldQ8LcZZAsuvCoucEe`): `singleLineText`
- `provider` (`fld9vVfHlFsxFC6K7PA`): `singleSelect`; options: `stripe`, `manual`, `no_processor`
- `external_event_id` (`fldMqPngWTQ1oyqMGUl`): `singleLineText`
- `event_type` (`fldigEi61sqdE3w9iZz`): `singleLineText`
- `status` (`fld1Pja5UF5fpkoWnQ8`): `singleSelect`; options: `pending`, `confirmed`, `failed`, `refunded`, `cancelled`, `expired`
- `payload_summary_json` (`fld6jiIPYm2WeZpz8PJ`): `longText`
- `processing_status` (`fldR4ofF887jZtKLVxU`): `singleSelect`; options: `pending`, `processed`, `failed`, `ignored`
- `processed_at_nullable` (`fldsIO3OiTYddtdILHX`): `date`
- `error_message_private` (`fldsChV0poN2z4QaNRJ`): `longText`
- `created_at` (`fldMSBqHYOe115zMSDc`): `createdTime`
- `plan_id_nullable` (`fld5ojcGmafevvoJHVx`): `link`; relation: manyOne -> BusinessPlans (tblfB89TSYURsaZ267N)
- `subscription_id_nullable` (`fldZHqbabnb38Ifyun4`): `link`; relation: manyOne -> PlatformSubscriptions (tblniV4rYBKuBjHiPk8)
- `sponsor_id_nullable` (`fld06kRr72EW3IdXZsE`): `link`; relation: manyOne -> Sponsors (tbld8kbsDB3c17XO5Dy)
- `sponsor_offer_id_nullable` (`fldxoJNphGZ6VLNd4ok`): `link`; relation: manyOne -> SponsorOffers (tblvWVjcFntkZ3zi5lw)
- `business_id_nullable` (`fldz0dawqrHSGteRNkQ`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `owner_user_id_nullable` (`fld1wiGGynvW8pdn82a`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlatformSubscriptions` (`fldjAfpYhETXBP6xWti`): `link`; relation: oneMany -> PlatformSubscriptions (tblniV4rYBKuBjHiPk8)

### BusinessInquiries (tblVqS6wUBbpH3MBTIF)

- `inquiry_id` (`fldFALNjWiX28No1qd6`): `singleLineText`
- `inquiry_reference` (`flduB07vj6mAbiE2QYH`): `singleLineText`
- `sender_public_reference` (`fldZh1kJ9taJg79aCd4`): `singleLineText`
- `sender_display_name_snapshot` (`fld06RNUftH8C3trwsV`): `singleLineText`
- `subject` (`fldZZWUzShzT7UNh6Zj`): `singleLineText`
- `message` (`fldD6NIhJGCmYH6i4rc`): `longText`
- `preferred_reply_method` (`fld1IZ4IH7bGq40kX11`): `singleSelect`; options: `in_app`, `email`, `whatsapp`
- `sender_email_share_consent` (`fld9NnqEHzLjk2zthy4`): `checkbox`
- `sender_whatsapp_share_consent` (`fldsIHU0CuF4nmowbMv`): `checkbox`
- `sender_external_contact_snapshot_private` (`fldUYMstErcYmcRJXOE`): `longText`
- `status` (`fldnfhiKsSz2Bm0qFdx`): `singleSelect`; options: `new`, `read`, `handled`, `closed`, `spam`, `archived`
- `spam_status` (`fldTMi0FhCj9gk6f3fZ`): `singleSelect`; options: `unchecked`, `clear`, `suspected`, `confirmed`
- `created_at` (`fldB5xJ1bCZJRf3JfPO`): `createdTime`
- `read_at_nullable` (`fldxfIsWwpfqCg6gXC2`): `date`
- `closed_at_nullable` (`fld2qG8LCbZ050aczAb`): `date`
- `last_action_at_nullable` (`fld2vQfmJ1fhIKnVT1M`): `date`
- `business_id` (`fldK4gyUx1OuwC6mfmw`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `sender_user_id` (`fldFnQnA9QvLu0lyoHH`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `assigned_to_user_id_nullable` (`fldduSY0ykhyEn77dI1`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `InquiryEvents` (`fldccjFlpEui6sbaQ81`): `link`; relation: oneMany -> InquiryEvents (tbloUosCMRXyVTZzMjY)

### InquiryEvents (tbloUosCMRXyVTZzMjY)

- `inquiry_event_id` (`fldmj94vKWvbY63R1OF`): `singleLineText`
- `event_type` (`fldL9xVYd8bh5F7ASq2`): `singleSelect`; options: `created`, `read`, `handled`, `closed`, `marked_spam`, `export_requested`, `notification_created`, `report_created`
- `metadata_json` (`fldGge0oVvjn2reP6KU`): `longText`
- `created_at` (`fldBJpgZBHkJqlwkULN`): `createdTime`
- `inquiry_id` (`fldPpu13ziAqnFfopZA`): `link`; relation: manyOne -> BusinessInquiries (tblVqS6wUBbpH3MBTIF)
- `actor_user_id_nullable` (`fldOLMVgESX51IfHFFj`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### AdminNotifications (tblF34hdMYFOtQhCN7P)

- `admin_notification_id` (`fldY7OR3WybbCOcNX1E`): `singleLineText`
- `notification_type` (`fldhGwSA5iRLzouuxXo`): `singleSelect`; options: `new_report`, `high_severity_report`, `report_appeal`, `sponsor_payment_confirmed`, `sponsor_campaign_paused`, `sponsor_content_incomplete`, `business_pro_payment_confirmed`, `business_pro_expired`, `otp_delivery_failure`, `stripe_webhook_failure`, `teable_sync_failure`, `cleanup_review_needed`, `generated_content_review_needed`, `security_alert`, `loyalty_dispute`, `qr_replay_attempt`, `staff_pin_lockout`
- `severity` (`fldIbRIQNKAptmCt8B1`): `singleSelect`; options: `info`, `warning`, `critical`
- `entity_type` (`fldmKOs1OHtulsTuNKf`): `singleLineText`
- `entity_id` (`fldBWYFlTJqgxsxLBe4`): `singleLineText`
- `entity_reference` (`fldABWUk5NCdGDwgCrU`): `singleLineText`
- `title` (`fldgviTJ1EgBWiJ66eU`): `singleLineText`
- `message_private` (`fldGlmbnimVbhsylVJB`): `longText`
- `status` (`fldsufVe3SMe9SqpLxr`): `singleSelect`; options: `unread`, `read`, `resolved`, `archived`
- `created_at` (`fldkmJ7f2G2Gmx1Eww4`): `createdTime`
- `read_at_nullable` (`fld4d8CuJgXPJ8fOxg6`): `date`
- `resolved_at_nullable` (`fldF4fH9uc2t0vRxnF0`): `date`
- `assigned_to_user_id_nullable` (`fld8Uvioni4jucP1RQ4`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `ModerationActions` (`fldvyWaEp9po7CtzuAY`): `link`; relation: oneMany -> ModerationActions (tblR4eJVDk27AQV5zGj)
- `ModerationActions (linked)` (`fldL14hFkNeyqdJX2XW`): `link`; relation: oneMany -> ModerationActions (tblR4eJVDk27AQV5zGj)

### ModerationActions (tblR4eJVDk27AQV5zGj)

- `moderation_action_id` (`fldKpeFnSCaZDr1lI5S`): `singleLineText`
- `target_entity_type` (`fldcE5Afv5EQ6Xz8kM4`): `singleLineText`
- `target_entity_id` (`fldBeKUs4w5ECxTvK08`): `singleLineText`
- `action_type` (`fld4v9k1KsHeiTvTMQ4`): `singleSelect`; options: `content_limited`, `hidden`, `paused`, `suspended`, `removed`, `restored`, `account_restricted`, `account_disabled`, `appeal_opened`, `appeal_resolved`
- `severity` (`fldeVh09GAb7xIpZjIl`): `singleSelect`; options: `minor`, `moderate`, `severe`
- `reason` (`fldJsvmxT11M6USjsfR`): `longText`
- `previous_status` (`fldDqlrri2yta7Jhgdn`): `singleLineText`
- `new_status` (`fldDYS0SlAaYcTAcAwW`): `singleLineText`
- `notes_private` (`fld7G8CaugyLy63oelz`): `longText`
- `created_at` (`fld50NtXF0lpnKYrpYC`): `createdTime`
- `moderator_user_id` (`fldJfiKs5fEfAvD5vSM`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `owner_notification_id_nullable` (`fldfbDVQuLyuFCOZMXK`): `link`; relation: manyOne -> AdminNotifications (tblF34hdMYFOtQhCN7P)
- `reporter_notification_id_nullable` (`fldr7lxUPwbJtF9aq4t`): `link`; relation: manyOne -> AdminNotifications (tblF34hdMYFOtQhCN7P)

### StaffPinSecurityEvents (tblciuNt63idIfaLnIB)

- `event_id` (`fld02OFj2fmTela4Z3l`): `singleLineText`
- `event_type` (`fldxFxlN6uplcr2cNSf`): `singleSelect`; options: `pin_set`, `pin_reset`, `pin_confirmed`, `pin_failed`, `pin_locked`, `pin_unlocked`, `staff_removed`
- `failure_count` (`fldvj7b5JGqAnCBYgoL`): `number`
- `lock_until_nullable` (`fldDh48mSrACZiSclrA`): `date`
- `correlation_id` (`fldAMaPKDTtXVx6fFtu`): `singleLineText`
- `created_at` (`flddq61vwmrciYeP6KT`): `createdTime`
- `staff_id` (`fldlBfKGU2JC3iN9ygo`): `link`; relation: manyOne -> PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)
- `business_id` (`fldvvJqeiUbdEmpTVsX`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)

### PlayavidaLoyaltyProgramVersions (tbl2DdfvdxEUatWEjWV)

- `program_version_id` (`fldQLEIc6qOjlkgwnex`): `singleLineText`
- `version_number` (`fldB7KscVQyvssmIQbQ`): `number`
- `configuration_json` (`fldfbSAQdw3V2wJpDUp`): `longText`
- `effective_from` (`flduFIowOzDc7Cogj7A`): `date`
- `effective_until` (`fld00uY31CJGQDCkPSo`): `date`
- `created_at` (`fldM5yEsONtR4YAdlWu`): `createdTime`
- `program_id` (`fldxg62i7LV2BhZpq5H`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `created_by_user_id` (`fldDUNuDQJ5ZwrWZXvy`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `PlayavidaLoyaltyCardCycles` (`fldoH02uqD9Jm0VAfV1`): `link`; relation: oneMany -> PlayavidaLoyaltyCardCycles (tblaXjpNTunNEk9pvhf)
- `PlayavidaLoyaltyTransactions` (`fld8sSiIhqQ0xdk1uaJ`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)
- `PlayavidaLoyaltyRewards` (`fldDYLAKPJyKKVPG7a6`): `link`; relation: oneMany -> PlayavidaLoyaltyRewards (tbl1hAqY1edir4G4tTH)

### PlayavidaLoyaltyCardCycles (tblaXjpNTunNEk9pvhf)

- `cycle_id` (`fldLmnW7CAbdVHacjwd`): `singleLineText`
- `cycle_reference` (`fldCtiioCtnIDAWBNRd`): `singleLineText`
- `started_at` (`fld4lV7TQ4U8kg5tVml`): `date`
- `completed_at_nullable` (`fldODa5uYVjL9bBXq2s`): `date`
- `claimed_at_nullable` (`fldjAvS3EXNNNJESOp8`): `date`
- `reset_at_nullable` (`fldQ0bdjirmJ3pWGhFi`): `date`
- `status` (`fldqO3mTpLvVM95v208`): `singleSelect`; options: `active`, `complete`, `reward_claimed`, `paused`, `cancelled`, `archived`
- `completion_reason` (`fldqQ92ZwHNqoTEjTBb`): `singleSelect`; options: `threshold_reached`, `reward_claimed`, `program_changed`, `business_closed`, `manual_adjustment`, `other`
- `created_at` (`fldM62vruFl0xUWte9h`): `createdTime`
- `updated_at` (`fldUY6dodxqqf69vGOh`): `lastModifiedTime`
- `card_id` (`fldJ5Y5cCplJO99YIRC`): `link`; relation: manyOne -> PlayavidaCustomerCards (tblOVokzPDd71IyedJu)
- `user_id` (`fld3GVgM23DIJo9SN4D`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `business_id` (`fldfVgOizvFGq8QKx3q`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `program_id` (`fldwTaB6JZauYbfIb5j`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `program_version_id` (`fldwd3WTib20iiWemCr`): `link`; relation: manyOne -> PlayavidaLoyaltyProgramVersions (tbl2DdfvdxEUatWEjWV)
- `PlayavidaLoyaltyTransactions` (`fldHQTRmCdgzoQNXf6b`): `link`; relation: oneMany -> PlayavidaLoyaltyTransactions (tblOMabh3mfkiEc9uBm)

### PlayavidaDynamicQRChallenges (tblPfGTmoL9vWyI7kl0)

- `challenge_id` (`fldcxMJESqn9ysVGw0M`): `singleLineText`
- `challenge_reference` (`fldI9JM4n0Xx860IaxM`): `singleLineText`
- `token_hash` (`fldrvrzrfS7ZlpVxYuY`): `singleLineText`
- `nonce_hash` (`fldgXj5cOSWpxpACdfO`): `singleLineText`
- `purpose` (`fldWVQWlxrmYTX2wzFM`): `singleSelect`; options: `staff_award`, `reward_redemption`, `customer_identity_confirmation`
- `status` (`fldOdoqLmpRbOdgRRAt`): `singleSelect`; options: `issued`, `presented`, `consumed`, `expired`, `rejected`, `revoked`
- `issued_at` (`fldVejjEViFlghqFjh6`): `date`
- `expires_at` (`fldTYKsnGDRlrFdFz2w`): `date`
- `consumed_at_nullable` (`flde6abP54VrBbsHwTv`): `date`
- `attempt_count` (`fldsso5NkMeg0PIgz3L`): `number`
- `created_at` (`fldJ4pT4pzJGLWu2BnM`): `createdTime`
- `updated_at` (`fldOY4jgvJYaYbSJ715`): `lastModifiedTime`
- `user_id` (`fldGzSBSJaq7KC5G9sa`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `card_id` (`flda1hl5I84QVUC1vdw`): `link`; relation: manyOne -> PlayavidaCustomerCards (tblOVokzPDd71IyedJu)
- `program_id` (`fldPjTv95GFLiBN7SsR`): `link`; relation: manyOne -> PlayavidaLoyaltyPrograms (tblo1JGtixvMWJuXHdP)
- `business_id` (`fldiO8l7OoFkt9OnDui`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `location_id` (`fldJQisYSU7kPuI917k`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `consumed_by_staff_id_nullable` (`fldp7xVS8QaRGG8fdY4`): `link`; relation: manyOne -> PlayavidaStaffAccounts (tblFemWKDqyaQtOqDCV)

### ExternalLinks (tblOBFt1oowRmIv0Mp4)

- `external_link_id` (`fldtIZXuJ3SNFRQ8mIZ`): `singleLineText`
- `entity_type` (`fldTQ0yAcyxkiLV2Kll`): `singleSelect`; options: `platform_partner`, `business`, `event`, `group`, `organizer`, `personal_profile`, `sponsor_offer`
- `entity_id` (`fldeMhEDoft4ccMDRGO`): `singleLineText`
- `entity_reference` (`fldykY1ZBR3zUp8LVhU`): `singleLineText`
- `link_type` (`fldTfwIc7Ut3iyn5oJb`): `singleSelect`; options: `accommodation_property_directory`, `website`, `social`, `instagram`, `linkedin`, `whatsapp`, `email`, `phone`, `booking`, `maps`, `directions`, `ticketing`, `registration`, `sponsor_offer`, `personal_website`, `other`
- `destination_url_private` (`fldHd9kEoE3ebJWDO9n`): `singleLineText`
- `destination_host` (`fld0IGjDv5oQzDFXu6W`): `singleLineText`
- `destination_scheme` (`fld5a4VXT0elIsgnmQV`): `singleSelect`; options: `https`, `mailto`, `tel`
- `label_es` (`fldM64nyPdbzGXZqDzn`): `singleLineText`
- `label_en` (`fldXtV1v2tUEz1JXqwn`): `singleLineText`
- `description_es` (`fldi2iAgCwC7UPO9ukN`): `longText`
- `description_en` (`fldQMzROs1bbR54Bi77`): `longText`
- `status` (`fldn3dsBXMnb2pE0OR2`): `singleSelect`; options: `active`, `disabled`, `archived`, `draft`, `expired`, `suspended`, `removed`
- `validation_status` (`fldNZsrlfmB9rHYbc2M`): `singleSelect`; options: `pending`, `valid`, `failed`, `invalid`, `unsafe`, `unreachable`, `blocked`
- `validated_at_nullable` (`fld8aGcLrwXtKwej7js`): `date`
- `last_checked_at_nullable` (`fldabxJhrf5I4cMdlfz`): `date`
- `disabled_reason_private` (`fldzKTbO8IRHKxnxwi3`): `longText`
- `created_at` (`fldymGxVUawqWVWISSi`): `createdTime`
- `updated_at` (`fldB8Zy7xs7e4jt1C39`): `lastModifiedTime`
- `ExternalLinkAnalyticsEvents` (`fldxcxGYvpTtINgCppo`): `link`; relation: oneMany -> ExternalLinkAnalyticsEvents (tblICT2Bcuh5Li3aPIh)
- `ExternalLinkAnalyticsAggregates` (`fld2QnSTL3Ex0tLJIcr`): `link`; relation: oneMany -> ExternalLinkAnalyticsAggregates (tblH4lLgW7JUoTt29KF)
- `LocationFooterLinks` (`fld4qrEc0tCS7eajhYT`): `link`; relation: oneMany -> LocationFooterLinks (tbljWgtF5oJLhFDpAJz)

### ExternalLinkAnalyticsEvents (tblICT2Bcuh5Li3aPIh)

- `analytics_event_id` (`fld3XhtZah3vF9pjLaC`): `singleLineText`
- `event_type` (`fldXrazrl6xQrozuZSh`): `singleSelect`; options: `qrcasas_footer_viewed`, `qrcasas_info_modal_opened`, `qrcasas_login_gate_shown`, `qrcasas_external_link_clicked`, `qrcasas_external_link_resolved`, `qrcasas_external_link_failed`
- `language` (`fldKwzrauyf2kVnd6oF`): `singleSelect`; options: `es`, `en`
- `outcome` (`fldLxR2BdkjxD2vqzUV`): `singleSelect`; options: `shown`, `login_required`, `resolved`, `failed`
- `created_at` (`fldOid1WpM1Yn9fqzt2`): `createdTime`
- `external_link_id` (`fldIjNT7F1ZvCMeASck`): `link`; relation: manyOne -> ExternalLinks (tblOBFt1oowRmIv0Mp4)
- `location_id_nullable` (`fld4SPC94i7DVxjdPCP`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### ExternalLinkAnalyticsAggregates (tblH4lLgW7JUoTt29KF)

- `aggregate_id` (`fld8svRjZXoyDY8uG2F`): `singleLineText`
- `reporting_date` (`fldmafLf5JlaylKyHKT`): `date`
- `event_type` (`fldfsyDKOO0yYiburAV`): `singleSelect`; options: `qrcasas_footer_viewed`, `qrcasas_info_modal_opened`, `qrcasas_login_gate_shown`, `qrcasas_external_link_clicked`, `qrcasas_external_link_resolved`, `qrcasas_external_link_failed`
- `language` (`fldHCODuOWFpzQX603I`): `singleSelect`; options: `es`, `en`
- `event_count` (`fldy79aj6fTOhxeG38t`): `number`
- `created_at` (`fldru4A3a1bALpv1X4d`): `createdTime`
- `external_link_id` (`fld3DOAXk5vrBpYMLTm`): `link`; relation: manyOne -> ExternalLinks (tblOBFt1oowRmIv0Mp4)
- `location_id_nullable` (`fldxlrmemXsHmXiI4b6`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### SchemaChangeLog (tblEWCWe1M0iLsHuPSq)

- `schema_change_id` (`fldAvRFUTnVUB42GTmz`): `singleLineText`
- `change_reference` (`fldIYp00nYTUmos9EKK`): `singleLineText`
- `change_type` (`fldXPZRGGKdLTBc0RMe`): `singleSelect`; options: `table_created`, `table_extended`, `field_added`, `view_created`, `view_updated`, `seed_created`, `seed_updated`, `data_migrated`, `data_archived`, `data_restored`, `validation_run`
- `description` (`fldNCc2agBpSbYHlhEB`): `longText`
- `affected_tables_json` (`fld1jlqf7LOUsQy3RLy`): `longText`
- `affected_views_json` (`fldptRwpofgw8GWSEki`): `longText`
- `migration_status` (`fldGsQm77AppFGIMIAx`): `singleSelect`; options: `planned`, `in_progress`, `completed`, `partial`, `failed`, `rolled_back`
- `executed_by` (`fldsYVTk43a5WG0PcWW`): `user`
- `executed_at` (`fldHSkbIWiUmXkLNICP`): `date`
- `rollback_plan` (`fldNPJft4DuYY5JGW1Z`): `longText`
- `rollback_status` (`fld5XqOeS0tukhu1eFh`): `singleSelect`; options: `not_required`, `not_started`, `ready`, `partial`, `completed`, `blocked`
- `notes_private` (`fldH2lrjrweS5W5cAYE`): `longText`
- `created_at` (`fldzXZw8dTaqfdjKuRl`): `createdTime`

### DataIntegrityIssues (tblgld6aJED9x7z5Vrq)

- `issue_id` (`fldyX6A4pLVw29FxHQw`): `singleLineText`
- `issue_reference` (`fldQCrTsEf1cHQweVTB`): `singleLineText`
- `entity_type` (`fldFs77njGqyI8KiYC3`): `singleLineText`
- `entity_id` (`fldknvzxFCry5lood0Y`): `singleLineText`
- `issue_type` (`fldJSPoPcb5bPvBG2ge`): `singleSelect`; options: `duplicate_user_public_reference`, `duplicate_email_mapping`, `duplicate_staff_mapping`, `duplicate_sponsor_reference`, `duplicate_business_reference`, `duplicate_entity_reference`, `duplicate_transaction_reference`, `duplicate_idempotency_key`, `duplicate_voucher_reference`, `duplicate_campaign_completion`, `invalid_profile_visibility`, `invalid_staff_limit`, `inactive_staff_action`, `inactive_business_pro_action`, `expired_campaign_action`, `stale_search_projection`, `orphaned_relationship`, `missing_location`, `invalid_subscription_state`, `entitlement_without_subscription`, `public_private_field_leak_risk`, `invalid_external_destination`, `other`
- `severity` (`fldRT9yXZZjZG2fUyLl`): `singleSelect`; options: `low`, `medium`, `high`, `critical`
- `details_json` (`fldf88EN6HU3i5DsTv1`): `longText`
- `status` (`fldPXzwS0KgYAJo54uA`): `singleSelect`; options: `open`, `investigating`, `resolved`, `dismissed`
- `detected_at` (`fldoT5zwwurfWXRvNbk`): `date`
- `resolved_at_nullable` (`fldCL9jgupy8z3Um19K`): `date`
- `created_at` (`fldiP7ocMkJbQGk2lvz`): `createdTime`
- `updated_at` (`fldkouf2pXqSsaPRgwd`): `lastModifiedTime`
- `resolved_by_user_id_nullable` (`fldLY86EkpBiAGew62b`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### AnalyticsMetricDefinitions (tblmGSz6oiQAkxUj63f)

- `metric_definition_id` (`fldbY4kl6b2Rwn9Wj9m`): `singleLineText`
- `metric_key` (`fld7O4DajmCcNHF4amY`): `singleLineText`
- `entity_type` (`fldCgpjtUmGeUYXByZl`): `singleSelect`; options: `business`, `sponsor`, `platform`
- `name_es` (`fldM7RxRnPGEqidXXZh`): `singleLineText`
- `name_en` (`flddTRuelDKINM7W0Do`): `singleLineText`
- `description_es` (`fldE88efeHoKvAej9Yx`): `longText`
- `description_en` (`fldtOBDBLmS94EB6Phw`): `longText`
- `calculation_notes` (`fldXSgf2TGUzsppvKjE`): `longText`
- `privacy_classification` (`fldjLmmYmYQXURZxbqF`): `singleSelect`; options: `public`, `aggregate_only`, `private`, `restricted`
- `visible_to_roles_json` (`fld3YJutl6KefSk9aOU`): `longText`
- `active` (`fld3G4Nnba0YksdNoRD`): `checkbox`
- `created_at` (`flds8D44MtV6xAsHZoi`): `createdTime`
- `updated_at` (`fldsWBBJookeibjEt0t`): `lastModifiedTime`

### AnalyticsMetricAggregates (tblKJ3vSsiJJPiMrRfy)

- `aggregate_id` (`fldsZQFBkhfQc1UucGk`): `singleLineText`
- `metric_key` (`fldzqt9svwMTFCth9Ts`): `singleLineText`
- `entity_type` (`fldSgXMY31qtbwRnV15`): `singleSelect`; options: `business`, `sponsor`
- `entity_reference` (`fld6F6BjDBNIhpnj5GX`): `singleLineText`
- `placement_surface` (`fldl3NW2lfUY4cmrCH0`): `singleLineText`
- `language` (`fldsTBI6Fhn395f9QKa`): `singleSelect`; options: `es`, `en`
- `period_start` (`fldeuKu9ZbErY9hFSqu`): `date`
- `period_end` (`fld27NpwW43k8fZV95A`): `date`
- `event_count` (`fldUVKcnP5oGza9ntIS`): `number`
- `aggregation_status` (`fldYdrnnxpso7vziwSM`): `singleSelect`; options: `pending`, `current`, `failed`
- `created_at` (`fldEMuVsMeQiIdVsv2j`): `createdTime`
- `updated_at` (`fldSQSWPO2fBWNoFSUZ`): `lastModifiedTime`
- `business_id_nullable` (`fldmyQAuHRNPBr5PfFp`): `link`; relation: manyOne -> Businesses (tbl8IOboEGdwYHqJck2)
- `sponsor_id_nullable` (`fldX1eO4I3mkw4hKF5U`): `link`; relation: manyOne -> Sponsors (tbld8kbsDB3c17XO5Dy)
- `location_id_nullable` (`fldigkbXzCATF7IKaLJ`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `metric_group` (`fldOprzz20ccwpuHsV6`): `singleSelect`; options: `profile`, `contact`, `loyalty`, `staff`, `sponsor_rail`, `sponsor_contextual`, `sponsor_offer`

### PublicSponsorPlacements (tblAeo0JsssvWXRS2x8)

- `public_placement_reference` (`fld9Eq4HZIV70Fps0Nl`): `singleLineText`
- `sponsor_reference` (`fldrQ0t0D4oxR8rsckz`): `singleLineText`
- `sponsor_name` (`fldHGB7nkoZ2WEql8Ct`): `singleLineText`
- `sponsor_offer_reference` (`fldhwG1OvrIz09XKNDj`): `singleLineText`
- `offer_title_es` (`fldG3ev42070S1LqGHn`): `singleLineText`
- `offer_title_en` (`fldZSFFYnCg4Cb7Up1F`): `singleLineText`
- `description_es` (`fldNOblTEvjRMpKbSxs`): `longText`
- `description_en` (`fldHED2v0mWuzbHils8`): `longText`
- `image_url` (`fldZbPlL3tmS8RsBC2g`): `singleLineText`
- `location_label` (`fldEm8YHxi14VQFcV6K`): `singleLineText`
- `placement_surface` (`fldGJDkJcUPJgjVTGlF`): `singleSelect`; options: `pwa_top_rail`, `public_user_listing`, `business_listing`, `group_listing`, `event_listing`, `organizer_listing`, `loyalty_listing`, `offer_listing`
- `campaign_start_at_nullable` (`fldIdAGXUdenFzYAqez`): `date`
- `campaign_end_at_nullable` (`fldFC36BQAp6QA6eb8l`): `date`
- `display_priority` (`fldX3lNyPnb7IudsYLa`): `number`
- `sponsored_label_es` (`fldo2asXYJFt8GczeEN`): `singleLineText`
- `sponsored_label_en` (`fldY2OabNAqfOa8skVm`): `singleLineText`
- `public_status` (`fldUkXhukrA43RmJ1LG`): `singleSelect`; options: `eligible`, `suppressed`
- `projection_status` (`fldscaLKtYWk5PGwi2G`): `singleSelect`; options: `current`, `stale`, `pending`, `failed`
- `is_demo_content` (`flddRtIONb1hUwY22nr`): `checkbox`
- `created_at` (`fldKOuQaF4D36xg17LZ`): `createdTime`
- `updated_at` (`fldZ3axj3KfshRmQbW4`): `lastModifiedTime`

### LocationBranding (tblPSsHmTFanwWZlzPw)

- `branding_id` (`fldehbjnVRceimaIAsc`): `singleLineText`
- `logo_url` (`fldEHUauW94lWbTl2ZW`): `singleLineText`
- `favicon_url` (`flddfZDL8Yd3J7fMK9A`): `singleLineText`
- `primary_color` (`fldSybsAN9YcOEOZt5p`): `singleLineText`
- `secondary_color` (`fldrvRlgi8H820eCfMI`): `singleLineText`
- `accent_color` (`fld3n1fFTbnwL3UZa2L`): `singleLineText`
- `background_color` (`fldFy9zqSYuik6Hh0FZ`): `singleLineText`
- `surface_color` (`fldeqzItCh4iEdRiQhY`): `singleLineText`
- `text_color` (`fldDJucJKILisDeBumS`): `singleLineText`
- `font_heading` (`fldux5HDRydr5OXoNTi`): `singleLineText`
- `font_body` (`fldLSplo4GLYYqp7nrI`): `singleLineText`
- `fallback_social_image_url` (`flduZzMOO0fXL4vRd93`): `singleLineText`
- `pwa_name` (`fldDwjgCRrQyKKF5x9z`): `singleLineText`
- `pwa_short_name` (`fldcp3PnTUBfaFwLoAn`): `singleLineText`
- `pwa_description_es` (`fldxMgbmwMn3ZvR4C8e`): `longText`
- `pwa_description_en` (`fldyzo6HWqMleoqjy6L`): `longText`
- `pwa_manifest_json` (`fld3dHtKJkHwNapUYa9`): `longText`
- `active` (`fldhiSiAUctpNq7xxHC`): `checkbox`
- `created_at` (`fldAro8n76l68RryaGa`): `createdTime`
- `updated_at` (`fldYCATl4lpmgkhlwvZ`): `lastModifiedTime`
- `location_id` (`fldfeTlofqs5cq9Pyh8`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### LocationLanguageConfigurations (tblb8ZBb23iHPRTk1GV)

- `language_configuration_id` (`flddq9MmaTthZS3Y1gq`): `singleLineText`
- `language_code` (`fldJEbnTnZfBusGkixg`): `singleLineText`
- `locale` (`fldC4H3vO7aAetFQQ24`): `singleLineText`
- `is_default` (`fldpSRITYErMsLKUPHN`): `checkbox`
- `active` (`fld1z5fiMQnzPeoe41I`): `checkbox`
- `fallback_language_code_nullable` (`fldKxzppRSgwzhoj1HM`): `singleLineText`
- `date_format` (`fld4g0HtBdPM1w7dZ3N`): `singleLineText`
- `time_format` (`fld5w71vJUPi3z7qSo0`): `singleLineText`
- `currency_format` (`fldXxfbjRVyhPS4Wr56`): `singleLineText`
- `content_direction` (`fldPnH9MvY6uOFsXRIJ`): `singleSelect`; options: `ltr`, `rtl`
- `created_at` (`fldlx33nFR06QP4Bt8k`): `createdTime`
- `updated_at` (`fldYP1fQB2668gocvbC`): `lastModifiedTime`
- `location_id` (`fldvYyoFGm5Ejs5shXn`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### LocationSeoSettings (tbl6SHVb0Az8mPkwqdk)

- `seo_settings_id` (`fldRSCUqYScEnW7gJ5s`): `singleLineText`
- `language_code` (`fld1X5yVCPPQCIPzqxE`): `singleLineText`
- `site_title_template` (`fld9EhCrxTLCRumYinB`): `singleLineText`
- `homepage_title` (`fldJphPxfFIH2wWWQNf`): `singleLineText`
- `homepage_description` (`fldTSG0Knc9YznPeJBV`): `longText`
- `canonical_url` (`fldTz1SyX85TERw7Sfa`): `singleLineText`
- `robots_policy` (`fld47pKHzcf6K6MQwUq`): `singleSelect`; options: `index_follow`, `noindex_follow`, `noindex_nofollow`
- `index_enabled` (`fld2ajqcraEKL0dkcjt`): `checkbox`
- `sitemap_enabled` (`fldxcmYeHgMX8NrUdMI`): `checkbox`
- `og_title` (`fldPJ6kdRpqVNQ3ZQF1`): `singleLineText`
- `og_description` (`fldWgZmi2Jh7KsSaNNG`): `longText`
- `og_image_url` (`fldzd1VGwPf9hIsnBc8`): `singleLineText`
- `twitter_card_type` (`fldetJIA9xLarCKpL0y`): `singleLineText`
- `twitter_site` (`fldYvX0HHc90nr5jK3j`): `singleLineText`
- `organization_name` (`fld5HELdD37LmpjP6Fd`): `singleLineText`
- `organization_url` (`fldrGn0m9dWOemqfRYM`): `singleLineText`
- `organization_logo_url` (`fldgzyEJAwhlzB8WroG`): `singleLineText`
- `search_action_enabled` (`fldODzBNJM7hzf1bU7p`): `checkbox`
- `structured_data_json` (`fld07U1gqjmwkbv359q`): `longText`
- `created_at` (`fldQmHwbQ2euris56zp`): `createdTime`
- `updated_at` (`fldH2BUHN4gBzoJmpW7`): `lastModifiedTime`
- `location_id` (`fldhs0KAzcXehQ1jURn`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### LocationSeoKeywords (tblH8kjuSFpaBCvNDyc)

- `keyword_id` (`fldHF7ILO9rxKFzs9sL`): `singleLineText`
- `language_code` (`fldXYfR7nNIF8ljDi4E`): `singleLineText`
- `keyword` (`fldV0TsQRybF029exbm`): `singleLineText`
- `normalized_keyword` (`fld9EtyzU5LLd3jNRhw`): `singleLineText`
- `keyword_type` (`fldm2HJFRmHxc5OmF84`): `singleSelect`; options: `brand`, `city`, `neighborhood`, `category`, `service`, `local_term`, `synonym`, `guide_topic`, `question_variant`
- `priority` (`fld4dsBvKce9H0wU65u`): `number`
- `active` (`fldKsYAYvlhSbjeOhZf`): `checkbox`
- `created_at` (`fldndLMrnLEuiP7aqtY`): `createdTime`
- `updated_at` (`fldsBDeSnPOpWHwu0aO`): `lastModifiedTime`
- `location_id` (`fldWnYaJl1zz2QnqPgy`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)

### LocationAeoContent (tblS23pg1qCPsyO5J0W)

- `aeo_content_id` (`fldKIdKsmfHgjAHbduN`): `singleLineText`
- `language_code` (`fld0S1w69o6y0N9PEhq`): `singleLineText`
- `question` (`fldMdPwjwTJztGDpwNS`): `singleLineText`
- `normalized_question` (`fld4MevvPvrRnghMU3Y`): `singleLineText`
- `concise_answer` (`fldftZhG5v08zC4Q4UL`): `longText`
- `expanded_answer` (`fldFAGIww3hv7ymsGvX`): `longText`
- `answer_type` (`fldupC691Gsliaw4VNA`): `singleSelect`; options: `direct_answer`, `local_explainer`, `newcomer_guide`, `service_finder`, `event_discovery`, `safety_note`, `environmental_note`, `community_information`, `other`
- `category` (`fldp1dGgIeoJIOKdU0M`): `singleLineText`
- `related_entity_type_nullable` (`fldUoMcOw9gRuO68Avn`): `singleLineText`
- `related_entity_id_nullable` (`fldlttTfjhbUN8wNddE`): `singleLineText`
- `source_name` (`fldOCJbXDQ8kvtxr2Qy`): `singleLineText`
- `source_url` (`fld3y9numRThy7OzH40`): `singleLineText`
- `editorial_status` (`fldOtqlbe5wQoUmvgiI`): `singleSelect`; options: `draft`, `review`, `approved`, `published`, `archived`
- `last_reviewed_at` (`fldgQGf9zxquyDUYRBs`): `date`
- `review_due_at` (`fldL2WPOThoqYgskOYZ`): `date`
- `created_at` (`fldzo19Vrn8sny5xrfC`): `createdTime`
- `updated_at` (`fldjA4bXIP0eA8V7tXI`): `lastModifiedTime`
- `location_id` (`fldIkcSJ67vt5LPrhch`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `created_by_user_id` (`fldRQ2ZnCUqkQPZrmPC`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `updated_by_user_id` (`fldeUfdDhtmXsCA4r0Q`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### LocationGeoContent (tbl5Cpr3K6ALLbDF76P)

- `geo_content_id` (`fldTLyWmnuRsrOucMcT`): `singleLineText`
- `content_type` (`fldZBD1wpd1rgE80xzZ`): `singleSelect`; options: `neighborhood`, `district`, `nearby_area`, `landmark`, `guide_area`, `transport_area`, `beach`, `protected_area`, `zone`, `other`
- `name_es` (`fldBt4IDRfCy1QlWVtD`): `singleLineText`
- `name_en` (`fldNhFo0jv3KTYR4cBI`): `singleLineText`
- `slug` (`fldO2enx3qOMgvah50E`): `singleLineText`
- `description_es` (`fldWZsryJASj8NNQKEM`): `longText`
- `description_en` (`fldHyFLb5KYpBsZQpsp`): `longText`
- `public_latitude_nullable` (`fld1WSU6WK09kzdGAjc`): `number`
- `public_longitude_nullable` (`fldjS6ocdhtCuUq7Nlj`): `number`
- `public_geometry_json_nullable` (`fldCKbnxCoBHtpM3ynC`): `longText`
- `map_label_es` (`fldvMlFTWTXmszbV8Zg`): `singleLineText`
- `map_label_en` (`fldEs6Swl8vSOvthlen`): `singleLineText`
- `active` (`fldoumobec1A0BE1xpn`): `checkbox`
- `editorial_status` (`fldDsw8cuxE6olUtWZU`): `singleSelect`; options: `draft`, `review`, `published`, `archived`
- `sort_order` (`fldclAzheinv9NJOoWq`): `number`
- `created_at` (`fld6TBwOTOS8GOPqEO7`): `createdTime`
- `updated_at` (`fldijIFWkYq4nGPFf8w`): `lastModifiedTime`
- `location_id` (`fldQ4IfP9ZcqVu6YESK`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `parent_geo_content_id_nullable` (`fld3HImA2G5jvZdbuvb`): `link`; relation: manyOne -> LocationGeoContent (tbl5Cpr3K6ALLbDF76P)
- `LocationGeoContent` (`flduHJORDsis50onRlS`): `link`; relation: oneMany -> LocationGeoContent (tbl5Cpr3K6ALLbDF76P)

### LocationFaqs (tblJv7ZpUOMf4NLu2my)

- `faq_id` (`fldzEVV33yaJF2HZy73`): `singleLineText`
- `language_code` (`fldcbSHlGthGSi4NXMR`): `singleLineText`
- `category` (`fldQsfDyIMiJiFnrAy7`): `singleLineText`
- `question` (`fldmVj0Uof1wkeN5mfR`): `singleLineText`
- `normalized_question` (`fldQz3GVQK05UbCPH0S`): `singleLineText`
- `concise_answer` (`fldhEMbpcQs1W5q7BPy`): `longText`
- `expanded_answer` (`fldxzrZx8gUl7ZpYtZN`): `longText`
- `source_name` (`fldWlnJ8cbqHOATlynR`): `singleLineText`
- `source_url` (`fldq30yfUCmbRaoug1A`): `singleLineText`
- `schema_enabled` (`fldVsLNcOy8dtIAqIQN`): `checkbox`
- `editorial_status` (`fldpE7QKFWdtVXpuQF0`): `singleSelect`; options: `draft`, `review`, `approved`, `published`, `archived`
- `last_reviewed_at` (`fldTOFVmgyWJKkPpvr1`): `date`
- `review_due_at` (`fldgExA3UCfFy7XFhAE`): `date`
- `sort_order` (`fldZrMPSKDgSsymtIoz`): `number`
- `created_at` (`fldhpSd6HtRimVYwUHB`): `createdTime`
- `updated_at` (`fldozGcvz4Htt0eLwKc`): `lastModifiedTime`
- `location_id` (`fldMV06zm7fxShQbMKu`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `created_by_user_id` (`fldb2r9E2EGp3gvXhce`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `updated_by_user_id` (`fldp3fra4aXuwYVfMmo`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### LocationGuides (tblX9SDzD23C2cvtVMk)

- `guide_id` (`fld3aIkUJVn8S6GiLOe`): `singleLineText`
- `guide_reference` (`fldGwAvJnc5q6DK1SSJ`): `singleLineText`
- `category` (`fldxd7bJ7cZO9U2E8X6`): `singleLineText`
- `slug` (`fld6vKKSo57PpUsrWsk`): `singleLineText`
- `title_es` (`fldh5PHmRZkKN3Ea56t`): `singleLineText`
- `title_en` (`fldwo9YQLmd8i8vF3Ep`): `singleLineText`
- `excerpt_es` (`fldCQ7CuOV6aD9hrguY`): `longText`
- `excerpt_en` (`fldslkzCnLwRXwYGhkF`): `longText`
- `content_es` (`fldlqY33cdStR0LFSr0`): `longText`
- `content_en` (`fldIBsWUnVlnTXQzZrW`): `longText`
- `cover_image_url` (`fldo1lp0Fn9geMZX3Kw`): `singleLineText`
- `source_status` (`fldNL8g4gO8bvZnh30O`): `singleSelect`; options: `editorial`, `community_contributed`, `business_contributed`, `imported_with_permission`
- `editorial_status` (`fldWm4keDKBHAMDgeiK`): `singleSelect`; options: `draft`, `review`, `published`, `archived`
- `seo_title_es` (`fld9f63WJvx1P4G49zz`): `singleLineText`
- `seo_title_en` (`fldFMTzJeYd0Vb2Yz8s`): `singleLineText`
- `seo_description_es` (`fldfRLGShpFZz1eRuF5`): `longText`
- `seo_description_en` (`fld53DbMd4Q6v8RLW3V`): `longText`
- `og_image_url` (`fld6a3Cs3jrLxic7ZyP`): `singleLineText`
- `last_reviewed_at` (`fldN7xHqpizj1nxEtJS`): `date`
- `review_due_at` (`fldaidFbiZkSaLVoL5S`): `date`
- `published_at` (`fldQw6ixfnNmCJLJzdS`): `date`
- `created_at` (`fldPiXwbwqRJga2xWOV`): `createdTime`
- `updated_at` (`fldZku0QvOVRgrv5mxL`): `lastModifiedTime`
- `location_id` (`fldZkRuR8prlxczlAxy`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `author_user_id_nullable` (`fldFRFjauvKrE4wy4Mc`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### LocationIntroductionPages (tblDTdvzX5CTxMZFXvW)

- `intro_page_id` (`fldQcui8YTP1Eq6TO3v`): `singleLineText`
- `version` (`fldMFUCbeITC26hCZf5`): `number`
- `language_code` (`fldgl1kKqtBuIvSUuFe`): `singleLineText`
- `hero_title` (`fldj2z4EBwX1htnPmJY`): `singleLineText`
- `hero_subtitle` (`fldHzm5NsrdCfPEC3CX`): `singleLineText`
- `hero_image_url` (`fldQx5DYGuRIL7oztpk`): `singleLineText`
- `hero_cta_label` (`fldwmQTU9E2gg8sUTDX`): `singleLineText`
- `intro_content_json` (`fld3Cgxsh7kAKN7yNdy`): `longText`
- `aeo_content_json` (`fldUbmZSk1M5IBaS8Vd`): `longText`
- `featured_categories_json` (`fldgiPV5FY5dBXOQCDa`): `longText`
- `featured_guides_json` (`fldpE9y62ifdnAIDr1y`): `longText`
- `faq_display_mode` (`fldRFBTrcokExGuKKcO`): `singleSelect`; options: `none`, `selected`, `all`
- `show_language_switcher` (`fldzzTOldV6NGc2ayce`): `checkbox`
- `show_install_prompt` (`fldCnMcamyO9B88DZqb`): `checkbox`
- `show_never_show_again` (`fldPA8RLsjhUv0PHxgY`): `checkbox`
- `footer_links_json` (`fldsuSKihMLSKlE37pl`): `longText`
- `seo_title` (`fldMksMDu1UkAGqPjm4`): `singleLineText`
- `seo_description` (`fldW20J59B3SGGVH26M`): `longText`
- `og_image_url` (`fldqO5XbmviputH86Za`): `singleLineText`
- `publish_status` (`fldh5WLuOTCAyKpKGrd`): `singleSelect`; options: `draft`, `review`, `published`, `archived`
- `published_at` (`fld0qRXvx59AKaEYm3u`): `date`
- `created_at` (`fldAaR7LkDkfSXXKylf`): `createdTime`
- `updated_at` (`fldyM2U4C4lsP7rSoXm`): `lastModifiedTime`
- `location_id` (`fldpKFVW5kvxYCetGCo`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `UserIntroductionPreferences` (`fldSLLRoyD7JRg2GHcj`): `link`; relation: oneMany -> UserIntroductionPreferences (tblwqk6kwZeqQzUIqb6)

### UserIntroductionPreferences (tblwqk6kwZeqQzUIqb6)

- `preference_id` (`fldafDt60v0D692Nvid`): `singleLineText`
- `anonymous_device_id_nullable` (`fldd7vlcWYGv4OoI0Cu`): `singleLineText`
- `intro_version` (`fldRZHPtJMRe8dnL0In`): `number`
- `language_code` (`fldz7oISR6zq1cBRl9p`): `singleLineText`
- `dismissed_at_nullable` (`fldhmZXBAKWeddT7sQQ`): `date`
- `last_seen_at_nullable` (`fldLWYZNKIpNgktA5aP`): `date`
- `created_at` (`fldIGiatmFiGfCOjxEL`): `createdTime`
- `updated_at` (`fldZOFuEmTVaZ2VFPEU`): `lastModifiedTime`
- `location_id` (`fld73O55pgPeHyW4coi`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `user_id_nullable` (`fldGuOBJMfWMxwu5rmk`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)
- `intro_page_id` (`fld59RzID96QTh5khor`): `link`; relation: manyOne -> LocationIntroductionPages (tblDTdvzX5CTxMZFXvW)

### LegalConfigurations (tblSYwZm78DAE0JyV2I)

- `legal_configuration_id` (`fldm55vKhQ5KLPcHo3V`): `singleLineText`
- `name` (`fldfGnp6RUMMHcIGUu5`): `singleLineText`
- `status` (`fldFx5p3U2VIQera2ou`): `singleSelect`; options: `draft`, `review`, `published`, `archived`
- `support_email` (`fldgZe6sM8G5qjVyRi1`): `singleLineText`
- `support_url` (`fldCPFTmmYgNZrJu5QL`): `singleLineText`
- `created_at` (`fldsNrNkwGexqx3Oifz`): `createdTime`
- `updated_at` (`fldk1RGt43Ea2JJ5QTB`): `lastModifiedTime`
- `location_id` (`fldNTpxMjwR2MMqcJZs`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `LegalDocumentVersions` (`fldGDEr4PD2lqQ7w3qr`): `link`; relation: oneMany -> LegalDocumentVersions (tblo5BCNrhdj3QCn8QE)
- `LocationConfigurations` (`fld7VXQQp8axtjN1175`): `link`; relation: oneMany -> LocationConfigurations (tblcuRKmubtOrykPw3i)

### LegalDocumentVersions (tblo5BCNrhdj3QCn8QE)

- `legal_document_version_id` (`fldyMY3WNnR3y86rvnH`): `singleLineText`
- `document_type` (`fldCDHpLzPGH306avSf`): `singleSelect`; options: `privacy_notice`, `terms_and_conditions`, `disclaimer`, `community_guidelines`, `loyalty_terms`, `accessibility_statement`, `external_link_disclosure`, `sponsor_policy`, `contact_support`, `qrcasas_information`
- `language_code` (`fldEv11i6Z1EX5oDTgY`): `singleLineText`
- `version` (`fldZwONln1Wv4kj8pgp`): `number`
- `title` (`fldhu4Cy3KinSBnzrwm`): `singleLineText`
- `content` (`fldeJFwBanIHDOa2QXu`): `longText`
- `editorial_status` (`fldhkfM1tArLOMVByj8`): `singleSelect`; options: `draft`, `review`, `published`, `archived`
- `effective_at` (`fldPtoUHu7aD1ZcXbRp`): `date`
- `published_at` (`fldocxcuoNGiqXFVlM5`): `date`
- `review_due_at` (`fldxWkqhJ8KJ4QWvt0q`): `date`
- `created_at` (`fldg4WUvgTPfgurJknl`): `createdTime`
- `updated_at` (`fldon1hVFc68Zf72JmP`): `lastModifiedTime`
- `location_id` (`fld7xTgv7dpZBG49sUK`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `legal_configuration_id` (`fldtcgudFuH6VbVgC2h`): `link`; relation: manyOne -> LegalConfigurations (tblSYwZm78DAE0JyV2I)
- `LocationFooterLinks` (`fldm7tBcreG2AJn9Qr6`): `link`; relation: oneMany -> LocationFooterLinks (tbljWgtF5oJLhFDpAJz)

### LocationFooterLinks (tbljWgtF5oJLhFDpAJz)

- `footer_link_id` (`fldY2P21Y0efLgr6QE2`): `singleLineText`
- `language_code` (`fldDmI3PgIJvkQ7BwCh`): `singleLineText`
- `label` (`fldurpQG45Di7oxrU55`): `singleLineText`
- `link_type` (`fldncIeLupNRcebLVva`): `singleSelect`; options: `internal`, `legal_document`, `external_controlled`, `intro_reopen`, `sponsor_information`, `qrcasas_information`, `report_issue`
- `internal_path_nullable` (`fldDfuxTAcoyKEAVwXq`): `singleLineText`
- `sort_order` (`fld9wJYthbtEC56HXJG`): `number`
- `active` (`fldZHEL8IB6Zvu7qDV8`): `checkbox`
- `requires_login` (`fldKMuoyh5z3za6iT3V`): `checkbox`
- `opens_modal` (`fldtFaCfJdH7w2ZGMDr`): `checkbox`
- `created_at` (`fld8izAuu2gCzQf57by`): `createdTime`
- `updated_at` (`fld6Le6uq5lItaH1CEp`): `lastModifiedTime`
- `location_id` (`fldTVU2GLIRYmaRB49d`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `external_link_id_nullable` (`fld7RYwibqrc7IUEKED`): `link`; relation: manyOne -> ExternalLinks (tblOBFt1oowRmIv0Mp4)
- `legal_document_version_id_nullable` (`fldtP84n6AgzT8WcrbC`): `link`; relation: manyOne -> LegalDocumentVersions (tblo5BCNrhdj3QCn8QE)

### LocationCategories (tbl7CJ7Yox3tVKwcdid)

- `category_id` (`fldJxiFf5gQa4WqZOB8`): `singleLineText`
- `category_type` (`fldGIw2zSlwN4tCAyDL`): `singleSelect`; options: `business`, `event`, `group`, `guide`, `interest`, `offer`, `sponsor_context`
- `name_es` (`fldz3V9E3BLTtFSjC85`): `singleLineText`
- `name_en` (`fld3eLxkA765gKzlf6D`): `singleLineText`
- `slug` (`fldENkOSI5sEueYCFnJ`): `singleLineText`
- `description_es` (`fld8HZVbBYQjqEQvLji`): `longText`
- `description_en` (`fldjxklHKqrz7f9kD6b`): `longText`
- `icon_key` (`fldPne05se3alIZx9rV`): `singleLineText`
- `active` (`fldpzjalkuzUtMzrHfX`): `checkbox`
- `editorial_status` (`fldigpQNXaMWXHiO6Kd`): `singleSelect`; options: `draft`, `review`, `published`, `archived`
- `sort_order` (`fldxFR5nauMz9utSh37`): `number`
- `created_at` (`fldbeAdzBDCApBE7f4z`): `createdTime`
- `updated_at` (`fldVVYEVFGxOo2viZas`): `lastModifiedTime`
- `location_id` (`fldnxDao5gMtQFF4IkS`): `link`; relation: manyOne -> Locations (tblvc9P1eUHidtcW4tH)
- `parent_category_id_nullable` (`fld0XRGO9LqPH2y2p5d`): `link`; relation: manyOne -> LocationCategories (tbl7CJ7Yox3tVKwcdid)
- `LocationCategories` (`fldbql2ZxqSvRAX5ixe`): `link`; relation: oneMany -> LocationCategories (tbl7CJ7Yox3tVKwcdid)

### AuthenticationOtpChallenges (tblVe1AhQ3zLW3eijnw)

- `otp_challenge_id` (`fldqrWZZx1kOqF85SW6`): `singleLineText`
- `challenge_reference` (`fld9b8ALkGJyEreS0v5`): `singleLineText`
- `email_hash` (`fldMrBXahv8IF2ZfSRq`): `singleLineText`
- `code_hash` (`fldxu0JAKVpnPe1dT4Z`): `singleLineText`
- `purpose` (`fldur8lfsePSLSjRrNU`): `singleSelect`; options: `login`, `email_change`, `account_recovery`
- `status` (`fldJLj85iRMZS5nXaEw`): `singleSelect`; options: `issued`, `consumed`, `expired`, `invalidated`, `attempts_exceeded`, `delivery_failed`
- `issued_at` (`fldynOsn7SehUUbh5BN`): `date`
- `expires_at` (`fldMqPflVIUVtOmD6O2`): `date`
- `consumed_at` (`fldmg8Gc1s38xEDIj2p`): `date`
- `attempt_count` (`fld9YVB0887WgJDGCpF`): `number`
- `max_attempts` (`fld1bI4aBHz3FI1L8uD`): `number`
- `send_window_started_at` (`fldLXfzbtD9kqsV3Mrl`): `date`
- `send_count_in_window` (`fldGPX0Ea2wznF3bRz5`): `number`
- `request_ip_hash` (`fldwe8hvj2WU89HmWRN`): `singleLineText`
- `correlation_id` (`fldhdrTNgfCu8wqpdgK`): `singleLineText`
- `created_at` (`fldI5MR0UIUv0sFamab`): `createdTime`
- `updated_at` (`fldGl2eG7qlDbuTjis8`): `lastModifiedTime`

### AuthenticationSessions (tblap3ykSwQQk276MdN)

- `session_id` (`fldifllwucVGxmFNXk1`): `singleLineText`
- `session_reference` (`fldxCAts0hZr2rNfINT`): `singleLineText`
- `session_token_hash` (`fldl84pPnEaE789o4fb`): `singleLineText`
- `session_version` (`fldIQcKFLYxwiUmaEWS`): `number`
- `status` (`fldQSZKuqBlTqqKJCpV`): `singleSelect`; options: `active`, `revoked`, `expired`, `disabled`
- `issued_at` (`fldWuXufrAWPRx2H4AI`): `date`
- `expires_at` (`fldBV5lfBYmE1JEp6fm`): `date`
- `revoked_at` (`fldRqg9U9BSGCaLjGoz`): `date`
- `revocation_reason` (`fld5qm5gX5Odl0WUYSU`): `singleSelect`; options: `logout`, `user_disabled`, `passwordless_recovery`, `superadmin_revoked`, `session_rotation`, `security_event`, `expired`, `other`
- `last_seen_at` (`fldMtTkpzTKjtpFA81u`): `date`
- `ip_hash` (`fldYF81hVrRFpAj67Tn`): `singleLineText`
- `user_agent_hash` (`fldlQNHgh4WdBvpAOgX`): `singleLineText`
- `created_at` (`fld0ORD0mYI2IKLm7Xu`): `createdTime`
- `updated_at` (`fldNyr8Gjny6JYU8RCq`): `lastModifiedTime`
- `user_id` (`fldLm29Lep2rFZHqaEw`): `link`; relation: manyOne -> Users (tblB6Wiwy4KOx3Tjgui)

### AuthenticationOperationalAggregates (tblARiGin9HMQpGMgQK)

- `aggregate_id` (`fldidqek5YqqX0rQ8pv`): `singleLineText`
- `metric_group` (`fld22Fm0XRgtavkEtZt`): `singleSelect`; options: `health`, `integrity`
- `metric_key` (`fldEZDpAg6CF8zbN4k8`): `singleSelect`; options: `active_session_count`, `active_otp_challenge_count`, `otp_delivery_failed_count`, `expired_otp_cleanup_count`, `revoked_session_count`, `expired_session_cleanup_count`, `multiple_issued_otp_count`, `otp_consumed_after_expiry_count`, `otp_attempts_beyond_max_count`, `active_session_past_expiry_count`, `active_session_disabled_user_count`, `duplicate_session_reference_count`, `missing_user_relation_count`
- `record_count` (`fldifeTJ4otQ0iOeVU3`): `number`
- `as_of` (`fld0wYtG1BNNF7zByPg`): `date`
- `calculation_status` (`fldB4J3wmAwW8KXh1nB`): `singleSelect`; options: `pending`, `current`, `failed`
- `created_at` (`fldNcMGzunNMJ3oEFEu`): `createdTime`
- `updated_at` (`fld1CmE3worKkHrt8kr`): `lastModifiedTime`
