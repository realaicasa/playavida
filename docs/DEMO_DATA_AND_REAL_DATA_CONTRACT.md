Status: visual/product specification only. Secure server/API, Teable, authentication, payment verification, ownership, and entitlement enforcement remain required before production activation.

# Demo Data vs. Real Data Contract

This project serves as a visual prototype and frontend reference. It is vital to maintain a clear distinction between the demo state and future production functionality.

## A. Demo/Preview Mode
- **Purpose**: Visual presentation, PWA experience demonstration.
- **Data**: Clearly fictional sample cards, random ordering (on load only), non-functional interactions.
- **Constraints**: Never imply live backend, payment, membership, or verification.
- **Labeling**: Use "Demo listing" / "Publicación de demostración" where applicable.

## B. Future Production Mode
- **Purpose**: Real user interaction, data persistence, and community functionality.
- **Data**: Only real, server-projected, authorized records.
- **Behavior**: If no records exist, show empty states. Never mix demo data into real user profiles, dashboards, or favorites.
