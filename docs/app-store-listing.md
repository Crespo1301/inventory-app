# App Store Connect Listing — Draft

Draft copy for the **Kitchen Inventory** App Store Connect record. Character
limits are Apple's; counts shown are for the drafted text. Edit before
submission, then paste field-by-field into App Store Connect.

> Status: draft. Nothing here is final until reviewed against real screens and
> the hosted privacy policy URL.

---

## App Information

| Field | Value | Limit |
|-------|-------|-------|
| **App Name** | `Kitchen Inventory` | 30 chars (17 used) |
| **Subtitle** | `Restaurant stock & ordering` | 30 chars (27 used) |
| **Primary Category** | Business | — |
| **Secondary Category** | Food & Drink | — |
| **Bundle ID** | `com.csolutions.inventoryapp` | matches `app.config.ts` |
| **SKU** | `kitchen-inventory-001` | internal, any unique string |
| **Age Rating** | 4+ | no objectionable content |

---

## Promotional Text

*Up to 170 characters. Can be updated anytime without a new app review — use it
for current messaging.*

```
Replace the kitchen whiteboard. Flag low stock in one tap, build vendor orders
with explainable quantities, and verify before they go out.
```

(148 characters)

---

## Description

*Up to 4000 characters. This needs a new review to change.*

```
Kitchen Inventory replaces the messy whiteboard and group texts restaurants use
to track what's running low. The team flags low and out-of-stock items as they
work, and managers turn those flags into clean vendor orders — fast enough that
people actually use it.

BUILT FOR REAL KITCHENS
- One-tap low / out capture — faster than writing on the board.
- English / Spanish item-name toggle for mixed-language teams.
- Large touch targets and one-handed use, designed for a busy line.
- Works front-of-house and back-of-house, across multiple locations.

EXPLAINABLE ORDERING
- Suggested order quantities based on par levels and recent activity.
- Every suggested quantity shows the reason behind it — no black box.
- Managers can override any quantity and verify the order before it's sent.
- Export or share the finished order with your vendor.

ROLES THAT MATCH YOUR TEAM
- Admins manage the whole company.
- Managers handle ordering and verification for their locations.
- Team members flag low stock for the locations they work.
- Access is enforced at the database level, not just hidden in the app.

UNIVERSAL BY DESIGN
Nothing is hardcoded for one restaurant. Each company defines its own
locations, service areas, items, par levels, units, and vendors. Whether you
run one cafe or several locations, the app adapts to how you already work.

STAYS IN SYNC
Changes sync across your team's devices in real time. Flags and orders made
on a bad kitchen connection are queued and sent automatically when you're back
online — you always know whether an action landed.

Kitchen Inventory is built for restaurants, cafes, bars, and multi-location
food businesses that want ordering to be quick, accurate, and accountable.
```

(~1,500 characters)

---

## Keywords

*Up to 100 characters total, comma-separated. No spaces after commas (saves
characters). Do not repeat words already in the app name.*

```
restaurant,ordering,stock,par level,vendor,supplies,prep,low stock,food cost,BOH,FOH
```

(83 characters)

---

## URLs

| Field | Value |
|-------|-------|
| **Support URL** | *required* — a public page or contact page. Placeholder: `https://carloscrespo.info/kitchen-inventory/support` |
| **Marketing URL** | *optional* — `https://carloscrespo.info/kitchen-inventory` |
| **Privacy Policy URL** | *required* — host `docs/privacy-policy.md` publicly; placeholder: `https://carloscrespo.info/kitchen-inventory/privacy` (keep in sync with `PRIVACY_POLICY_URL` in `constants/app-meta.ts`) |

---

## App Review Information

- **Sign-in required:** Yes — the app is unusable without an account.
- **Demo account:** create one admin and one manager on a confirmed company,
  with "Confirm email" already satisfied. Put both sets of credentials in the
  review notes.
- **Review notes (draft):**

```
Kitchen Inventory requires a signed-in account. Demo credentials:

Admin — email: [demo-admin@...]  password: [...]
Manager — email: [demo-manager@...]  password: [...]

The admin account has a sample company with two locations, items with par
levels, and a few low-stock flags so order suggestions are visible. Start on
the Stock tab to flag items, then open Order Planner to see suggested
quantities and verify an order.

The app uses email + password auth only (no third-party / social login), so
Sign in with Apple is not applicable. No tracking, no ads.
```

---

## Required-Reason / Privacy (cross-reference)

See `docs/app-store-requirements.md` for the full submission checklist. The
App Privacy "nutrition label" in App Store Connect should declare:

- **Contact Info → Email address** — for account creation and sign-in. Linked
  to identity. Not used for tracking.
- **User Content** — the inventory/order data the team enters. Linked to
  identity. Not used for tracking.
- **Tracking:** No. The app uses no analytics or advertising SDKs.

---

## App Icon

- 1024 × 1024 px PNG, sRGB/P3, 8-bit, **square corners**.
- `assets/images/icon.png` is the final Kitchen Inventory mark — a flat
  clipboard-and-check on brand green — generated by `scripts/make-icon.js`.
  EAS strips the alpha channel for the App Store build.
- Design: flat, bright, solid background, no gradient, no translucency — per
  `docs/ios-design-guidelines.md`. Expo generates all smaller iOS sizes from
  this single master.

## Screenshots

- 6.9" iPhone, **1320 × 2868 px**, flattened PNG/JPG, RGB, no alpha.
- iPhone-only app (`supportsTablet: false`) — no iPad screenshots needed.
- Capture from real screens with real (non-placeholder) data: Stock capture,
  Order Planner with explained quantities, History, Analytics, Account.
