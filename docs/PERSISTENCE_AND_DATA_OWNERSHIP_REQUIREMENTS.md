Status: visual/product specification only. Secure server/API, Teable, authentication, payment verification, ownership, and entitlement enforcement remain required before production activation.

# Persistence and Data Ownership Requirements

This document outlines the data that must be managed by a secure server API and Teable database in production, rather than the current localStorage implementation.

## Server-Authoritative Data
The following must persist through secure server API writes:
- User profile (photo, interests, language preference, areas)
- Published records (Businesses, Groups, Events, Sponsors)
- Entitlements (Community Initiative status, Pro access, Paid subscriptions)
- Member interactions (Favorites, join requests, memberships, group invitations, reports)
- Loyalty ledger (if loyalty is enabled)

## Persistence Rules
1. **LocalStorage usage**: Restricted to non-authoritative UI preferences, temporary draft recovery, and demo/visual mode.
2. **Source of Truth**: The server API MUST be the sole source of truth for identity, ownership, payment, entitlement, approval, membership, and published records.
3. **Session Enforcement**: Reload/session restore MUST retrieve real, authorized data from the server API, never localStorage.
4. **Ownership & Visibility**: Server MUST enforce ownership and public visibility constraints before exposing data to the frontend.
