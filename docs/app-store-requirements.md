# App Store Requirements

What it takes to ship this app to the Apple App Store (primary target) and Google
Play. Treat this as a living checklist — update it as items are completed.

## 1. Accounts & Programs

- [ ] **Apple Developer Program** — $99/year. Required to build, sign, and submit.
- [ ] **App Store Connect** — create the app record (bundle ID, name, primary
      category: *Business* or *Food & Drink*).
- [ ] **Google Play Console** — one-time $25 registration (Android, secondary).

## 2. Build & Submit Pipeline

The app uses Expo, so builds go through **EAS Build** and **EAS Submit**:

- [x] `eas.json` configured with `development`, `preview`, and `production`
      profiles.
- [x] iOS bundle identifier set (`com.csolutions.inventoryapp`) in
      `app.json` → `ios.bundleIdentifier`.
- [x] Android `package` set in `app.json` → `android.package`.
- [x] App version + build number strategy — `eas.json` uses
      `appVersionSource: remote` with `autoIncrement` on production.
- [ ] First builds go to **TestFlight** (iOS) and **internal testing** (Android)
      before any public release.

## 3. Privacy — the most common rejection area

- [x] **Privacy policy draft** — written at `docs/privacy-policy.md`. Covers
      collected data (account email, restaurant/inventory data), Supabase as
      infrastructure processor, RLS security, and in-app account deletion.
- [ ] **Privacy policy URL** — the draft in `docs/privacy-policy.md` must be
      publicly hosted (e.g. on the support website or a plain HTTPS page) before
      submission. Paste the live URL into App Store Connect and add a reachable
      in-app link (Account screen or Settings → Privacy Policy).
- [ ] **App Privacy details** ("nutrition label") in App Store Connect — declare
      collected data: *Contact Info → email*, *User Content* (inventory/order
      data linked to the account). We do **not** track users or run ads.
- [ ] **Privacy manifest** (`PrivacyInfo.xcprivacy`) — Expo SDK 54 generates a
      baseline; declare reasons for any required-reason APIs used by our
      dependencies. Verify after the first production build.
- [ ] **App Tracking Transparency** — not required; the app does no cross-app
      tracking. Do not add tracking SDKs without revisiting this.

## 4. Account Requirements

- [x] **In-app account deletion** — done. Account screen → "Delete Account"
      removes the profile and auth user; when the last member of a company
      leaves, the company and all its data are removed too.
- [ ] **Sign in with Apple** — only required if we offer third-party social
      login. We use email + password only, so it is **not required**. If a social
      login is ever added, Sign in with Apple must be added alongside it.

## 5. Metadata & Assets

- [ ] **App icon** — 1024×1024 PNG, no transparency, no rounded corners.
- [ ] **Screenshots** — 6.9" iPhone base size **1320×2868 px**, flattened PNG/JPG,
      RGB, no alpha. The app is iPhone-only (`supportsTablet: false`), so **no
      iPad screenshots are required**.
- [ ] App name, subtitle, description, keywords, support URL, marketing URL.
- [ ] **Age rating** questionnaire (this app rates 4+).
- [ ] **Export compliance** — the app uses only standard HTTPS encryption;
      declare the standard exemption.

## 6. Quality Gates (App Review)

- [ ] No crashes, no broken flows; reviewers must be able to use it end to end.
- [ ] Provide a **demo account** (admin + a manager) in App Review notes — the
      app is useless without a signed-in account, so reviewers need credentials.
- [ ] If "Confirm email" is enabled, the demo account must already be confirmed.
- [ ] Every screen must work without placeholder/Lorem content.
- [ ] Minimum iOS version follows Expo SDK 54 (currently iOS 15.1+).

## 7. Our Current Standing

| Requirement | Status |
|-------------|--------|
| Real backend with auth | ✅ Supabase |
| Data isolation / security | ✅ Row-level security |
| No crashes in core flows | ✅ (continue testing) |
| In-app account deletion | ✅ done |
| Privacy policy draft | ✅ `docs/privacy-policy.md` |
| Privacy policy hosted URL | ❌ must host + link in app and App Store Connect |
| App Privacy details | ❌ fill in App Store Connect |
| Icon + screenshots | ❌ produce from real screens |
| EAS build config | ✅ `eas.json` + bundle IDs |
| Demo account for review | ❌ create before submitting |

## Sources

- [Screenshot specifications — Apple Developer](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
- [App Review Guidelines — Apple Developer](https://developer.apple.com/app-store/review/guidelines/)
- [Submitting — App Store — Apple Developer](https://developer.apple.com/app-store/submitting/)
- [Apple App Store Review in 2026 — Lexogrine](https://lexogrine.com/blog/apple-app-store-review-requirements-2026)
