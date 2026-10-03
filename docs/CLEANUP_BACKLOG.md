Status: visual/product specification only. Secure server/API, Teable, authentication, payment verification, ownership, and entitlement enforcement remain required before production activation.

# Cleanup Backlog

This document tracks items that require future secure backend integration or UI refinement, moving beyond the visual prototype phase.

- [ ] Remove all mock/demo listing data from production homepage.
- [ ] Implement secure Auth for all dashboard/creation actions.
- [ ] Implement real Stripe webhook integration for payment confirmation.
- [ ] Implement robust server-side ownership checks for business/group/event edits.
- [ ] Move Community Initiative approval to a secure superadmin API.
- [ ] Replace localStorage-based state with server-side API calls for user preferences (interests, language, profile photo).
- [ ] Implement real rate-limiting for join requests and invite codes.
- [ ] Finalize secure loyalty program ledger and QR-code validation.
