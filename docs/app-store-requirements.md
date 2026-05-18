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

- [ ] `eas.json` configured with `development`, `preview`, and `production`
      profiles.
- [ ] iOS bundle identifier set (e.g. `com.csolutions.inventoryapp`) in
      `app.json` → `ios.bundleIdentifier`.
- [ ] Android `package` set in `app.json` → `android.package`.
- [ ] App version + build number strategy (`expo-build-properties` /
      `autoIncrement`).
- [ ] First builds go to **TestFlight** (iOS) and **internal testing** (Android)
      before any public release.

## 3. Privacy — the most common rejection area

- [ ] **Privacy policy URL** — publicly hosted, linked in App Store Connect and
      reachable in-app. Must describe what data is collected (account email,
      restaurant/inventory data) and that it is stored on Supabase.
- [ ] **App Privacy details** ("nutrition label") in App Store Connect — declare
      collected data: *Contact Info → email*, *User Content* (inventory/order
      data linked to the account). We do **not** track users or run ads.
- [ ] **Privacy manifest** (`PrivacyInfo.xcprivacy`) — Expo SDK 54 generates a
      baseline; declare reasons for any required-reason APIs used by our
      dependencies. Verify after the first production build.
- [ ] **App Tracking Transparency** — not required; the app does no cross-app
      tracking. Do not add tracking SDKs without revisiting this.

## 4. Account Requirements — action needed

- [ ] **In-app account deletion is mandatory.** Any app that supports account
      creation must let the user delete their account *from inside the app*, and
      the path must be easy to find. **The app does not have this yet — it must
      be built before submission.** (Account screen → "Delete account", which
      removes the profile and signs out; for an admin who owns a company, decide
      whether deletion also removes the company.)
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
| In-app account deletion | ❌ **must build** |
| Privacy policy | ❌ must write + host |
| App Privacy details | ❌ fill in App Store Connect |
| Icon + screenshots | ❌ produce from real screens |
| EAS build config | ❌ set up `eas.json` + bundle IDs |
| Demo account for review | ❌ create before submitting |

## Sources

- [Screenshot specifications — Apple Developer](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
- [App Review Guidelines — Apple Developer](https://developer.apple.com/app-store/review/guidelines/)
- [Submitting — App Store — Apple Developer](https://developer.apple.com/app-store/submitting/)
- [Apple App Store Review in 2026 — Lexogrine](https://lexogrine.com/blog/apple-app-store-review-requirements-2026)
