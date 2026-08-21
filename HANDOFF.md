# Handoff

This file is the single catch-up point for anyone — human or AI — picking up the
project. **It must be kept current.**

## The Handoff Rule

Every working session ends with two updates, no exceptions:

1. **`CHANGELOG.md`** — add what changed under `[Unreleased]`.
2. **`HANDOFF.md`** (this file) — refresh *Current State* and *Next Steps* so the
   next person can continue without re-discovering context.

Leave the repo so a fresh agent can read `README.md` → `HANDOFF.md` and start.

---

## Current State

A working, multi-role restaurant inventory & ordering app on a Supabase backend.
`npm run verify` (lint + typecheck) passes; the iOS bundle exports clean.
Released baseline: `v0.2.0` on 2026-05-18.

**Dependency-audit snapshot (2026-08-21):** `npm audit --omit=dev
--audit-level=high` now reports **25 vulnerabilities (0 critical, 10 high, 15
moderate)**, down from 32 (2 critical / 15 high) after a non-breaking `npm
audit fix`. Every remaining advisory is transitive through the Expo / RN /
Metro / dev-client toolchain (Metro's `image-size`, `postcss`, `ws` in devtools,
`uuid` via `xcode`, the `@expo/*` config chain). None are reachable in the
shipped app bundle; exposure is limited to a developer's laptop while running
the CLI. Force-fixing the rest requires jumping Expo 54 → 57 — deferred as a
Codex-owned upgrade sprint. Full write-up in `docs/dependency-audit.md`.

**Strategic direction as of 2026-08**: Android is now equal priority with
iOS (was secondary); the product is also going to the web via Expo's static
web export (`app.<domain>`), and a standalone marketing site repo
(`/home/cresp3/kitchen-inventory-site`, at the bare `<domain>`) has been
scaffolded. Both app stores will be enrolled as CSolutions Organization
accounts, which is currently blocked on CSolutions becoming a formed legal
entity — see Next Steps item -1 below. See `docs/launch-roadmap.md` for the
full restructured plan.

**Working end to end:**

- Signup creates a company + admin; login; join-a-company by invite code.
- Auth now starts on a clearer chooser screen: **Log In**, **I Have an Invite**,
  or **Create a New Company**, which removes the old confusion where invitees
  looked like they should start by creating a company.
- First-run tutorial: a 5-screen bilingual (EN/ES) welcome walkthrough shows
  once after a user's first sign-in — skippable, with a language toggle that
  also sets the app's Spanish preference. Tracked per user in AsyncStorage.
- Role-aware app: Admin, Manager (location-scoped), Team Member (location-scoped).
- Home dashboard: managers/admins now land on a dedicated home surface with
  operational pulse, quick actions, and recent activity instead of jumping
  straight into stock.
- Stock: one-tap Low/Out capture, EN/ES item-name toggle.
- Order Planner: explainable suggested quantities, manager override, verify,
  export/share. History of verified orders.
- Analytics: managers/admins can compare verified order activity across day,
  week, month, and year views, with current-vs-previous metrics, area mix, top
  movers, and seasonal watchlists.
- Manage: items, locations (every location is editable — tap to edit name and
  address, including the first one created at signup), team members, invitations.
- Plan & Billing: admins see the company's subscription tier, live usage
  against plan limits, and a Starter/Pro/Multi-Location comparison. Billing is
  stubbed — limits are defined but not enforced yet.
- Supabase: Postgres + row-level security + realtime sync across devices.
- In-app account deletion (Account screen) — meets the App Store requirement.
- iOS-native design pass: collapsing large titles, inset grouped lists, modal
  sheets with grabbers/cancel actions, native SF Symbols on iOS, loading
  skeletons.
- Navigation hardening: root Manage pages now expose a visible Close action, and
  tab chrome plus scroll padding are safer around the bottom inset/home
  indicator.
- Offline write queue: flags/orders made offline queue locally and replay on
  reconnect; a banner shows offline/unsynced state, and temp-note replacement
  no longer queues invalid server IDs.
- EAS build config committed; privacy policy drafted (`docs/privacy-policy.md`).
- Expo app config is now variant-aware: development, preview, and production
  builds use distinct names / bundle identifiers so a live build and a dev build
  can be installed side by side on one device.
- Invite email delivery is scaffolded through a Supabase Edge Function with
  manual code-share fallback when the function secrets are not configured yet.
- App Store readiness: privacy policy finalized, an in-app Privacy Policy +
  Contact Support section is on the Account screen, and export compliance is
  pre-declared in `app.config.ts`. Remaining store work is account-gated
  (Apple Developer Program, screenshots, demo account, hosting the policy).

**Architecture map:**

- `app/` — screens (Expo Router). `(auth)`, `(tabs)`, `manage/`.
- `components/ui/` — design-system components.
- `constants/design.ts` — design tokens.
- `src/domain/` — types, suggestion engine, permissions, analytics, billing,
  export.
- `src/onboarding/onboarding-store.tsx` — first-run tutorial gate (per-user
  AsyncStorage flag). `app/onboarding.tsx` — the tutorial screen.
- `scripts/make-icon.js` — regenerates the app icon set from authored geometry.
- `src/supabase/` — client. `src/data/repo.ts` — data layer. `src/auth/` — auth.
- `src/store/app-store.tsx` — in-memory store, realtime-synced.

**Environment:**

- Supabase project ref `lnzoguygntryxzcyakot`; keys in `.env`.
- Run with `npm run start:tunnel` (tunnel required on WSL2). The start scripts
  skip Expo's remote dependency validation because that API fetch can fail on
  this WSL2/network path after the tunnel is already connected.
- Local web preview currently needs the repo's pinned Node `20.19.4`; this
  shell was on `20.19.0`, and `npm run web` crashed in Expo/Metro with
  `configs.toReversed is not a function`.
- If tunnel fails with ngrok `remote gone away`, use `npm run start:lan` for
  same-network testing or `npm start` for local/browser work, then retry tunnel
  later. Full WSL2 Expo Go troubleshooting (QR does nothing, tunnel fails,
  manual `exp://` entry, Windows `portproxy` fallback) is in
  `docs/getting-started.md` → "Troubleshooting: Expo Go won't connect (WSL2)".
- One-time: disable "Confirm email" in the Supabase dashboard for test signups.
- EAS build config is committed (`eas.json`, `app.config.ts`); see
  `docs/eas-build.md`. `app.config.ts` is the sole Expo config — `app.json`
  was removed to stop EAS's "Cannot automatically write to dynamic config"
  failure. `extra.eas.projectId` is declared explicitly inside it.

## Next Steps (priority order)

-1. **CSolutions entity formation — start immediately, not a hard deadline.**
   Both Apple Developer Program and Google Play Console will be enrolled as
   **Organization (CSolutions)**, not Individual — matches the existing
   `com.csolutions.inventoryapp` bundle ID and skips Google's 12-tester/
   14-day closed-testing gate. This is blocked on CSolutions being a real
   legal entity. Chain, tracked in
   `/home/cresp3/Portfolio/business/compliance-register.csv`:
   1. Decide the exact legal name (must match identically across WA SOS,
      D&B, IRS, and both store filings — name mismatch is the most common
      rejection cause), registered agent, and management structure.
   2. File the WA Certificate of Formation online ($180 + $20 processing,
      ~5 business days standard, or +$100 for ~3-business-day expedited).
   3. Get the EIN same-day from IRS.gov, free, once the LLC is approved.
   4. Request the D-U-N-S number from Dun & Bradstreet immediately after —
      free, but this is the long pole: budget realistically for several
      weeks, not days.
   5. In parallel (no dependency): verify the marketing-site domain in
      Google Search Console once it's live (see item -0.5 below), and set
      up an org-domain email for the Apple account.
   6. Once the D-U-N-S number lands, submit Apple org enrollment ($99/yr,
      1–2 weeks review) and Google org verification ($25 one-time, 1–7 days
      doc review) in parallel.
-0.5. **Marketing site** — scaffolded 2026-08 at `/home/cresp3/kitchen-inventory-site`
   (Next.js 16 / Tailwind 4), pushed to GitHub
   (https://github.com/Crespo1301/kitchen-inventory-site) and live on Vercel
   at https://kitchen-inventory-site.vercel.app. Deploys at the bare product
   domain once registered; this app's own Expo web export deploys at the
   `app.` subdomain. Needed for: the support/marketing URLs both stores
   require, and the live business website Google checks via Search Console
   during org verification. Remaining: connect the Vercel project to the
   GitHub repo (Vercel dashboard → Settings → Git) so pushes auto-deploy —
   today's deploy was a one-off direct upload, not git-linked — then
   register the real domain, fill in the `TODO`s in that repo's
   `src/data/site.ts`, and attach the domain in Vercel.
0. **Get the app on one real restaurant device — free, no Apple Developer.**
   The cheapest live-in-a-kitchen path that does **not** require us to run a
   dev server every shift is an **EAS Android internal build**:
   `eas login` → `eas init` → `eas build --profile preview --platform android`.
   The build runs in EAS cloud, you get an installable `.apk`/`.aab` URL,
   the restaurant scans the QR and installs it on any Android device,
   and it talks straight to Supabase — no Mac, no Apple ID, no laptop on the
   counter. For iPhone-only kitchens with no $99 Apple budget the only free
   path stays **Expo Go via `npm run start:tunnel`**, which does need the dev
   server reachable. Pick one Android device per pilot restaurant; if iOS is
   non-negotiable, budget for Apple Developer Program enrollment and use the
   TestFlight path in step 2.
1. **Auth + shell device QA** — re-run device QA on Node `20.19.4`, focusing on:
   auth home path clarity (login vs invite vs new company), Home ↔ Stock ↔
   Analytics tab flow, Manage close paths, and lower-edge spacing on iPhones
   with a home indicator.
2. **First EAS build** — config is in place: `eas.json` plus variant-aware
   `app.config.ts` (development / preview / production profiles). Remaining is
   account-gated and interactive: run
   `eas login` → `eas init` → `eas build --profile production --platform ios`
   → `eas submit` to reach TestFlight. Needs an Expo account and the Apple
   Developer Program.
   For a side-by-side non-Expo-Go demo build, use `eas build --profile preview`
   first; for your own installed dev client, use `eas build --profile development`.

   **Environment constraint (2026-05-18):** the dev machine is Windows-only and
   the Apple ID `crespo1301@gmail.com` is NOT enrolled in the Apple Developer
   Program. Consequences:
   - An iOS device build is blocked until the $99/yr Apple Developer Program
     enrollment is done (the EAS Apple login succeeds but reports "no team").
   - An iOS Simulator build is pointless here — the Simulator only runs on
     macOS.
   - **For iOS testing now, use Expo Go**: `npx expo start`, scan the QR with
     Expo Go on a physical iPhone. The app's deps are all Expo-Go-compatible,
     so the full Stock → Order Planner → Analytics flow is testable with no
     Mac, no build, no Apple account.
   - Android dev builds (`eas build --profile development --platform android`)
     work fully on Windows with no Apple account.
   - The iOS EAS *build* runs in Apple's cloud and never needs a local Mac;
     only Developer Program enrollment is the gate.
3. **Host the privacy policy** — `docs/privacy-policy.md` is now finalized
   (Carlos Crespo, crespo.csolutions@gmail.com, effective May 18 2026) and the
   Account screen already links to it ("About → Privacy Policy"). Remaining:
   publish the policy at a public HTTPS URL, then update `PRIVACY_POLICY_URL`
   in `constants/app-meta.ts` and paste the same URL into App Store Connect.
   The placeholder URL is `https://carloscrespo.info/kitchen-inventory/privacy`.
4. **App Store Connect prep** — listing copy is drafted in
   `docs/app-store-listing.md` (name, subtitle, keywords, description, review
   notes, App Privacy declarations). The app icon is now final — the
   clipboard-and-check mark in `assets/images/icon.png`, generated by
   `scripts/make-icon.js` (edit the geometry there and re-run to revise).
   Remaining: capture 6.9" (1320×2868) screenshots from real screens, create a
   confirmed admin+manager demo account, and fill the support/marketing URLs.
5. **Deploy invite email delivery** — the app now invokes
   `supabase/functions/send-invitation-email`, but Supabase still needs the
   function deployed plus `RESEND_API_KEY` and `INVITE_EMAIL_FROM` secrets (and
   optionally `INVITE_EMAIL_REPLY_TO` / `INVITE_EMAIL_APP_NAME`) before invites
   send automatically.
6. **Subscription tiers — finish billing** — the tier model
   (`src/domain/billing.ts`) and the in-app Plan & Billing screen are built,
   but billing is stubbed and limits are not enforced. Remaining, after
   real-kitchen testing: add a `companies.plan` text column (default
   `'starter'`) via a Supabase migration so the chosen plan persists — this
   touches the `companies` table and its RLS; failure mode is a company stuck
   on the Starter default — wire a payment provider, and enforce the limits in
   `canAddWithinPlan()` at the `addLocation` / `createInvitation` call sites.

7. **Full multi-language support** — the app is bilingual EN/ES today, but in
   two narrow ways: the tutorial (`app/onboarding.tsx`, with inline `en`/`es`
   copy) and item names (`Item.name` + optional `Item.nameEs`, toggled by the
   `showSpanish` boolean in `app-store`). The stated goal is more languages.
   That needs: a real locale setting (replace the `showSpanish` boolean with a
   `locale` value), a proper i18n layer for all UI strings (today they are
   inline literals across screens), and per-language item names (replace
   `name`/`nameEs` with a translations map — a schema change on `items`,
   affecting RLS and the data layer). Scope this before adding a third
   language; each new language then only needs translated copy.

Done: in-app account deletion, the iOS-native design pass (large titles, grouped
lists, sheets, SF Symbols, skeletons), the offline write queue, EAS build config,
the privacy policy draft, the final app icon, the subscription-tier model +
Plan & Billing screen, the first-run bilingual tutorial, a design-polish
pass across all screens, an HTML-injection fix in the invite-email Edge
Function, and a `.code-review-graphignore` so the graph stops indexing
vendored skill scripts.

See `docs/launch-roadmap.md` for the phased plan and `docs/app-store-requirements.md`
for the full submission checklist.

## Known Limitations

- Offline capture works via the outbox; `createInvitation` is intentionally
  online-only (an invite code needs a real server row).
- Offline item/location creation queues immediately but does not surface a temp
  row; the new record appears after reconnect and sync.
- Invite delivery falls back to manual code sharing until the Supabase Edge
  Function is deployed with its email secrets.
- Expo web preview is currently blocked in shells still on Node `20.19.0`; use
  the repo target `20.19.4`.
- "Confirm email" is expected OFF during testing.

---

## Catch-Up Message for Codex

Paste this to bring Codex up to speed:

> The `inventory-app` repo has moved well past the original scaffold. It is now a
> multi-role restaurant inventory & ordering app on a **Supabase** backend
> (Postgres + Auth + row-level security + realtime). The old offline-first /
> local-SQLite / no-backend direction in the early docs was scaffolding and has
> been removed — do not reintroduce it.
>
> Read `README.md`, `HANDOFF.md`, `AGENTS.md`, `docs/architecture.md`, and
> `docs/ios-design-guidelines.md` before changing anything.
>
> Key facts: Company → Locations → FOH/BOH; roles Admin/Manager/Team Member;
> data access is enforced by RLS in the database, not just the UI; the data
> layer is `src/data/repo.ts` (no SQL in screens); design is light-mode,
> bright, flat — **no gradients, no translucency/glass**; the app is
> iPhone-focused and should feel like a native Apple app.
>
> Build/test: `npm run start:tunnel`, `.env` holds Supabase keys, disable
> "Confirm email" in Supabase for test signups. Verify with `npm run verify`.
>
> Current priorities are in `HANDOFF.md` → Next Steps (start with the first EAS
> build / TestFlight path, then host the privacy policy).
>
> When you finish any change, update `CHANGELOG.md` and `HANDOFF.md` before
> handing back. That rule is mandatory for every session.
