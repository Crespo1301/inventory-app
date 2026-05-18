# Launch Roadmap

The goal: a universal restaurant ordering app on the App Store and Google Play,
growing into a paid product with subscription tiers.

## Phase 1: Working Product (current)

Prove the app is faster and more reliable than a whiteboard.

- Company / location / FOH-BOH structure.
- Admin, manager, and team-member roles with scoped access.
- One-tap low-stock capture.
- Item catalog with par levels, units, and pack sizes.
- Explainable order suggestions, manager verification, and export/share.
- Supabase backend with authentication, row-level security, and realtime sync.
- Invite flow for managers and team members.

## Phase 2: Real-Kitchen Testing

Install on real devices and run a full order cycle.

- Configure EAS for Android preview builds and iOS TestFlight.
- Test across multiple roles and at least two locations.
- Capture feedback after every order day and tighten the capture flow.
- Add an offline write queue so capture survives bad kitchen Wi-Fi.

## Phase 3: Store Preparation

- App name, icon, and screenshots from real screens.
- Short description, privacy policy, and support contact.
- Minimal permissions.
- Internal or closed testing first.

## Phase 4: Paid Tiers

Once the product is proven in real kitchens:

- Define subscription tiers — single restaurant up to multi-location operator.
- Gate by location count, team size, and history retention.
- Add billing and plan management.
- Invite emails delivered through a backend function.

## Cost Notes

- Google Play Console has a one-time developer registration fee.
- The Apple Developer Program is an annual membership.
- The Supabase free tier covers early development and testing; paid tiers scale
  with real usage.
