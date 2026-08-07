# Personal TODO — Carlos

Short, dated action list for things only you can do (device testing,
account-gated launch steps). Code/feature work is tracked in `HANDOFF.md`.

## 2026-05-19

- [ ] **Verify the Locations fix** — Manage → Locations: tap your original
      company location and add its business address, then tap a second
      location and confirm edits save. This was the bug you found: the first
      location (created at signup) had no address and could not be edited.
- [ ] **Check the new Plan & Billing screen** — Account → Plan & billing
      (admin only). Confirm the usage meters, plan comparison, and "billing
      coming soon" message read correctly on-device.
- [ ] **Walk the new first-run tutorial** — sign up as a brand-new test user;
      you should land on the 5-screen tutorial. Test the EN/ES toggle, the
      Skip button, and Back/Next. Picking Español should leave the app in
      Spanish. (It only shows once per user — to see it again, sign up fresh.)
- [ ] **Device QA sweep** — run the full flow once on the iPhone via Expo Go:
      auth chooser (log in / invite / new company) → tutorial → Home → Stock →
      Order Planner → Analytics → Manage. Note anything that feels off.
- [ ] **Confirm the new app icon** — it only shows in a real EAS build, not
      Expo Go. Decide whether to do a `preview` build to see it on the home
      screen (needs the Apple Developer Program — see below).
- [ ] **Decide on Apple Developer Program** — $99/yr enrollment is the gate
      for any iOS build/TestFlight. Until then, iPhone testing stays on
      Expo Go. Decide today whether to enroll this week.
- [ ] **Privacy policy hosting** — pick where to host `docs/privacy-policy.md`
      publicly (e.g. `carloscrespo.info/kitchen-inventory/privacy`). Once
      hosted, update `PRIVACY_POLICY_URL` in `constants/app-meta.ts`.

## 2026-05-20 — Getting off Expo Go into a real, installable app

Goal: stop testing in Expo Go and produce a **standalone app** you can hand to
clients. The build still runs in Expo's **EAS Build** cloud (no Mac needed) —
"without Expo" means the output is a real installable app, not the Expo Go
sandbox. What **you** must provide / decide tomorrow:

**Accounts & money**
- [ ] **Apple Developer Program** — enroll at developer.apple.com, **$99/yr**.
      Required for any iOS install beyond Expo Go (TestFlight, App Store, or
      ad-hoc). This is the single biggest gate — start the enrollment early,
      Apple identity verification can take a day or more.
- [ ] **Google Play Console account** — **$25 one-time** at
      play.google.com/console. Required to distribute the Android app.
- [ ] **Free Expo account** — create one and run `eas login` so EAS Build can
      run. (Free tier is enough to start; builds queue.)

**Decisions you must make**
- [ ] **How clients receive it** — pick per platform:
      - iOS: **TestFlight** (easiest for early clients — invite by email, up to
        10,000 testers, needs the Developer Program) **or** full App Store
        release.
      - Android: **Play Store internal/closed testing** track, or just send the
        `.aab`/`.apk` file directly.
- [ ] **Final app name** — confirm the public name ("Kitchen Inventory" is the
      current working name) before the store listing is locked.
- [ ] **Paid vs. free at launch** — if charging, Apple/Google need banking +
      tax forms filled in (this takes time; decide now even if launch is free).

**Assets you must supply**
- [ ] **Screenshots** — 6.9" iPhone (1320×2868) from real screens; Android
      phone screenshots too. Capture once the tutorial + screens look final.
- [ ] **Support email + a marketing/website URL** for the store listings.
- [ ] **Hosted privacy policy URL** (carried over from 5/19).
- [ ] **A demo account** (admin + manager logins) for Apple's review team.

**Then the build itself** (Claude/Codex can run these once accounts exist)
- [ ] `eas build --profile preview` — a real installable build to confirm the
      icon, splash, and tutorial on a device.
- [ ] `eas build --profile production` + `eas submit` — store-ready builds.

## Backlog / future

- [ ] **More languages** — the app is bilingual EN/ES today (tutorial + item
      names). Adding e.g. Portuguese, French means: provide the translated
      copy, and the app needs a real locale setting (not today's EN/ES
      boolean) and per-language item names. Tracked in `HANDOFF.md`.

## Done

- [x] 2026-05-19 — Reported the un-editable first-location bug → fixed.
