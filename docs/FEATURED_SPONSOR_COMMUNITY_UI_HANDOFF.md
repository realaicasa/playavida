Status: visual/product specification only. Secure server/API, Teable, authentication, payment verification, ownership, and entitlement enforcement remain required before production activation.

# Featured Sponsor and Community Initiatives Handoff

This document outlines the visual prototype handoff for the Featured Placements, Sponsor, and Community Initiatives features.

## Visual Mock States
- **Featured Strips**: Homepage carousels for Partners, Businesses, Groups, and Events.
- **Sponsor Creation**: Dashboard modal for sponsor profile creation (Visual Mock).
- **Community Initiatives**: Category selection modal in creation flows with pending approval status.

## Future Server Requirements
- Backend must handle payment confirmation (Stripe) to trigger featured status.
- Superadmin approval workflow required for Community Initiatives.
- Contact visibility MUST enforce strict entitlement checks (Server-Side).

## Important Constraints
- **NO real persistence.**
- **NO real Stripe integration.**
- **NO real approval notifications.**
- **NO real contact data exposure.**
- **ALL states are development/demo only.**

## Contact Visibility Rule
- Logged-in Visitor + (Paid Pro OR Community Initiative Access) = Contact Details Visible.
- All other cases = Access Denied message.
