# Changelog

All notable changes to this project are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/). The project is pre-release (0.x).

Every working session — human or AI — must add its changes here before handing
off. See [HANDOFF.md](./HANDOFF.md).

## [Unreleased]

### Security

- 2026-09-03 weekly automation: ran another non-breaking `npm audit fix`.
  The current audit is **30 vulnerabilities** (0 critical, 9 high, 21
  moderate). Only `package-lock.json` changed; `package.json`, app code, Expo
  SDK, and React Native stayed unchanged. `npm run verify` still passes, and
  `npm audit fix --force` remains deferred because it proposes Expo
  `57.0.19`, a major upgrade that needs a dedicated branch and device/EAS QA.
  This shell also emitted Node engine warnings on `20.19.0`; use the pinned
  `20.19.4` or newer runtime for preview/build work.
- Ran the non-breaking `npm audit fix`. Advisory count dropped from 32 → 25
  (2 critical → 0, 15 high → 10, 14 moderate → 15, 1 low → 0). Both criticals
  (`shell-quote`, `tar`) plus the `@babel/core`, `brace-expansion`, `fast-uri`,
  `js-yaml`, `nanoid`, and `undici` findings are resolved. Only
  `package-lock.json` changed; no direct dep bumped, no Expo SDK move,
  `npm run verify` stays green.
- Every remaining advisory (25) is transitive through the Expo/RN/Metro/
  dev-client toolchain and does not ship in the compiled iOS/Android bundle.
  Force-fixing them requires jumping Expo 54 → 57 (three major versions);
  documented as a scheduled upgrade sprint, deferred behind the current
  entity-formation and pilot-device work.

### Docs

- Updated `docs/dependency-audit.md` and `HANDOFF.md` with the 2026-09-03
  dependency-audit snapshot, current advisory count, force-upgrade boundary,
  and Node engine warning.
- New `docs/dependency-audit.md` — baseline of the 2026-08-21 audit pass:
  fixes applied, per-package classification of what remains (all dev/build
  tooling), and the recommended Expo 57 upgrade path with guardrails.
- Restructured `docs/launch-roadmap.md` and `docs/app-store-requirements.md`:
  Android is now equal priority with iOS (was "secondary"), added Phase 0
  (CSolutions entity formation — LLC/EIN/D-U-N-S — blocking Organization
  enrollment on both stores), Phase 4 (Expo web export at `app.<domain>`),
  and Phase 5 (standalone marketing-site repo at the bare domain). Updated
  `AGENTS.md`'s marketing-page boundary to explicitly authorize the
  standalone marketing site repo, since Apple/Google org verification both
  require a live business website.

### Added

- A first-run tutorial (`app/onboarding.tsx`) — a 5-screen welcome walkthrough
  shown once after a user's first sign-in (new admins and invited team members
  alike), built for non-tech-savvy kitchen staff: one idea per screen, large
  icons and text, large buttons, an always-available Skip, and Back/Next.
  Fully bilingual (English / Spanish) with an in-tutorial language toggle; the
  language choice also sets the app's Spanish-item-name preference. Completion
  is tracked per user in AsyncStorage via `src/onboarding/onboarding-store.tsx`
  and gated in `app/_layout.tsx`; the gate fails open so a storage error can
  never trap a user on the tutorial. The Account screen gains a "How the app
  works" entry that replays the tutorial at any time.
- Subscription tiers (`src/domain/billing.ts`) — Starter, Pro, and
  Multi-Location plans with per-plan capacity limits (locations, team members,
  history retention), premium-feature flags, and helpers for usage meters,
  per-action limit checks, and recommending the cheapest fitting plan.
- A **Plan & Billing** screen (`app/manage/plan.tsx`, Account → Plan & billing,
  admin only) showing the current plan, live usage meters against plan limits,
  an over-capacity warning with the recommended upgrade, and a comparison of
  all plans. Billing is stubbed — selecting a plan explains it goes live with
  the first paid release; no limits are enforced yet.
- The final Kitchen Inventory app icon set — a flat clipboard-and-check mark on
  brand green — replacing the Expo placeholder. `scripts/make-icon.js`
  generates the iOS master, Android adaptive foreground/background/monochrome,
  splash icon, and favicon reproducibly from authored geometry.
- A true manager/admin home dashboard (`app/(tabs)/index.tsx`) with operational
  pulse cards, quick actions, recent activity, and direct routes into stock,
  orders, analytics, and management.
- A dedicated Stock tab (`app/(tabs)/stock.tsx`) so home/dashboard and the
  whiteboard-replacement workflow are separate, instead of overloading one tab.
- A first analytics surface (`app/(tabs)/analytics.tsx`,
  `src/domain/analytics.ts`) with day/week/month/year period views, current vs.
  previous period comparisons, area mix, top movers, and seasonal pressure
  watchlists based on verified order history.
- Invite email delivery scaffold via Supabase Edge Function
  (`supabase/functions/send-invitation-email`) with Resend-based sending and a
  client-side manual-share fallback when the function or secrets are not yet
  configured.
- A dedicated auth home screen (`app/(auth)/index.tsx`) that separates the
  three starting paths: existing user login, invite claim, and new company
  signup.
- Variant-aware Expo app config (`app.config.ts`) so `development`, `preview`,
  and `production` builds can install side by side with distinct app names and
  bundle identifiers.
- In-app **Privacy Policy** and **Contact Support** links in an "About" section
  on the Account screen, satisfying Apple's reachable-privacy-link requirement.
- `constants/app-meta.ts` holding `SUPPORT_EMAIL` and `PRIVACY_POLICY_URL`
  (the URL is a placeholder until the policy is publicly hosted).
- WSL2 Expo Go troubleshooting guide in `docs/getting-started.md` — ordered
  checklist for the "QR does nothing" / tunnel-fails case, including the
  manual `exp://` entry and Windows `portproxy` fallbacks.
- App Store Connect listing draft (`docs/app-store-listing.md`) — app name,
  subtitle, keywords, promotional text, full description, review notes,
  App Privacy declarations, and the icon/screenshot specs.
- App icon design brief (`docs/archive/icon-brief.md`) — concept direction,
  brand colors, composition grid, technical specs, and an acceptance checklist
  for replacing the Expo placeholder icon. Now fulfilled and archived.

### Changed

- `app.config.ts` is now the single Expo config source of truth; the static
  `app.json` was removed. The dynamic config inlines all former `app.json`
  values and declares `extra.eas.projectId` explicitly, so EAS no longer fails
  with "Cannot automatically write to dynamic config" during `eas build`.
- `app.config.ts` now declares `ios.infoPlist.ITSAppUsesNonExemptEncryption:
  false`, resolving the EAS dynamic-config write prompt and pre-answering the
  App Store export-compliance question.
- Privacy policy (`docs/privacy-policy.md`) finalized — placeholders filled
  (Carlos Crespo, crespo.csolutions@gmail.com, effective May 18 2026) and the
  app name corrected to "Kitchen Inventory" throughout.
- App Store / EAS docs corrected: stale `app.json` references in
  `docs/app-store-requirements.md` and `docs/eas-build.md` now point to
  `app.config.ts`; export-compliance item checked off.
- The tab shell is now safe-area-aware at the bottom, reducing the clipped /
  too-low feel on devices with a home indicator.
- Shared screen frames now add more bottom breathing room so lower content and
  actions sit cleanly above the tab bar and device inset.
- Root manage pages now have an explicit Close action in the header, so Team,
  Items, and Locations always have a visible way back to the main app even when
  stack history is shallow.
- Manage modal forms now use the in-app iOS-style sheet header, giving Item and
  Invite flows an explicit Cancel path instead of relying on native modal chrome.
- Add Item / Edit Item closes safely even when opened without stack history by
  falling back to the Items screen.
- Invite creation now attempts to email the invite automatically and then shows
  either an "Invitation emailed" or manual-share confirmation instead of always
  assuming code-only delivery.
- Auth copy now makes the invite path explicit on login and signup, and the join
  screen is framed as claiming an invite instead of generically joining a
  company.
- `Company` gains an optional `plan` field (`src/domain/index.ts`); `repo.ts`
  maps it from the `companies` row when present. The Supabase column does not
  exist yet — until a `companies.plan` migration lands, `planFor()` defaults
  every company to Starter.
- Android adaptive-icon `backgroundColor` is now brand green (`#15A150`) instead
  of the old placeholder light blue, matching the new icon background layer.
- Hardcoded `borderRadius` values in the Stock, Analytics, and Home screens now
  use the `radius` design tokens for consistency.
- Design-polish pass across the app's screens (spacing rhythm, alignment,
  token consistency, UX copy) with no behavior changes:
  - Stock/Orders/History: tokenized remaining raw sizes, fixed quick-button
    touch targets, baseline-aligned the order list header, clearer date
    formatting and singular/plural copy in History.
  - `app/flag.tsx`: the "item not found" case now uses the standard
    `EmptyState` inside the sheet shell instead of a bare message.
  - Home/Analytics: standalone section headings aligned to the same optical
    column as inset-list section headers; tightened metric-row rhythm.
  - Account: the "Delete Account" control now meets the 48 pt touch-target
    minimum.
  - Manage/Auth: the people-screen remove/cancel buttons now meet the 48 pt
    minimum (were ~26 pt); auth screens normalized for accent color and
    heading spacing.

### Fixed

- The Manage → Locations screen is now editable. Every location — including
  the first one created during company signup, which previously had no address
  and no way to edit it — can be tapped to update its name and address. The
  screen reuses its form card in an "Edit location" mode with Save / Cancel.
- `supabase/functions/send-invitation-email` now HTML-escapes every
  user-supplied field (company name, inviter name, invitee email, invite code,
  location names, reply line, app name) before interpolating them into the
  outbound email body. Closes an HTML-injection vector where a malicious
  company name could embed markup or links in invite emails.

### Tooling

- Added `.code-review-graphignore` so the code-review-graph stops indexing
  `.agents/skills/`, `.claude/skills/`, `.claude/worktrees/`, `.expo/`,
  `assets/`, and `docs/archive/`. Without it the graph was inflated with
  vendored skill scripts (~85% of "large functions" were skill-tool code, not
  app code). Run `code-review-graph build --skip-flows` after pulling to
  refresh the local DB; `.code-review-graph/` itself stays gitignored.

### Docs

- Added `TODO.md` — a dated personal action list for owner-only launch tasks
  (device QA, account-gated steps), separate from the code-focused `HANDOFF.md`.
- Archived the fulfilled app icon brief to `docs/archive/icon-brief.md` and
  added `docs/archive/README.md`. Updated `eas-build.md`,
  `app-store-requirements.md`, `app-store-listing.md`, and `launch-roadmap.md`
  to mark the icon done and point at `scripts/make-icon.js`.

## [0.2.0] - 2026-05-18

### Added

- EAS build setup: `eas.json` with `development` / `preview` / `production`
  profiles, iOS `bundleIdentifier` and Android `package`
  (`com.csolutions.inventoryapp`), and a build/TestFlight guide
  (`docs/eas-build.md`).
- Offline write queue: connectivity detection (`@react-native-community/netinfo`)
  and a persistent outbox (`src/data/outbox.ts`). Mutations that fail offline
  keep their optimistic state, queue, and replay on reconnect; a `SyncBanner`
  shows offline / unsynced / syncing state.
- Native SF Symbols on iOS via a cross-platform `Icon` component (used by the
  tab bar and list rows); Ionicons remain the Android/web fallback.
- Loading skeletons (`components/ui/skeleton.tsx`) replace plain spinners on
  cold start and tab load.
- Privacy policy draft (`docs/privacy-policy.md`), ready to host.

### Changed

- Expo start scripts now set `EXPO_NO_DEPENDENCY_VALIDATION=1` so WSL2/tunnel
  sessions do not crash when Expo's remote dependency-version check cannot
  reach the Expo API.
- Added `npm run start:lan` as a fallback when Expo's ngrok tunnel reports
  `remote gone away`.
- Offline note replacement/removal no longer queues impossible server writes for
  temp note IDs; unsynced note edits now reconcile safely when connectivity
  returns.
- Offline item/location creation no longer fabricates temp records with IDs that
  can be referenced before Supabase assigns a real row; those entries now appear
  after the queued write syncs.

## [0.1.0] - 2026-05-17

### Added

- Design system and component library: bright, flat tokens in
  `constants/design.ts` and reusable UI in `components/ui/` (Button, Card,
  Badge, Screen, Segmented, TextField, QuantityStepper, PressableScale, etc.).
- Domain model in `src/domain/` — company/location/role types, the explainable
  order-suggestion engine, role-permission rules, and order export formatting.
- Role-aware navigation: tabs adapt to Admin / Manager / Team Member.
- Stock screen with one-tap Low/Out capture and an EN/ES item-name toggle.
- Flag detail sheet, Order Planner (build / override / verify / share), History.
- Manage screens: items, item form, locations, people, invitations.
- Supabase backend: project `inventory-app`, full Postgres schema with
  row-level security, a `handle_new_user` provisioning trigger, and realtime.
- Supabase integration: client, typed data layer (`src/data/repo.ts`),
  Supabase Auth, and a realtime-synced app store.
- Auth screens: login, signup (creates a company), join-a-company by invite code.
- Invite flow: admins invite managers/members; invitees join with a 6-char code.
- Tunnel script (`npm run start:tunnel`) for device testing on WSL2/restricted
  networks.
- Documentation: App Store requirements, iOS design guidelines, testing guide,
  this changelog, and the handoff process.
- In-app account deletion (App Store requirement): a `delete_my_account` RPC and
  a destructive action on the Account screen. Deleting the last member of a
  company also removes the company and all its data.
- iOS-native design pass: a collapsing large-title screen (`LargeTitleScreen`),
  an inset grouped-list kit (`ListSection` / `ListRow`), and a modal sheet
  header with a grabber and top-left Cancel (`SheetHeader`).

### Changed

- Stock, Orders, History, and Account adopt iOS collapsing large titles.
- Account and the Items/Locations manage screens use inset grouped lists; the
  Spanish-names preference is now a native switch.
- Flag, Item, and Invite modals present as iOS sheets with a grabber; the manage
  screens no longer double-pad under the navigation bar.

- Project direction documented as a universal, multi-company restaurant ordering
  app on Supabase, heading for the App Store / Google Play with paid tiers.
- App is iPhone-focused: `userInterfaceStyle: light`, `supportsTablet: false`.
- AI role split for this repo: Claude sets direction **and** implements; Codex
  reviews and pushes. Documented in `CLAUDE.md` and `AI-WORKFLOW.md`.

### Removed

- Mexican-cafe seed/sample data — the app is universal; managers define items.
- The interim local SQLite + on-device password-hash auth layer, replaced by
  Supabase. Unused `expo-sqlite`, `expo-secure-store`, and `expo-crypto`
  dependencies removed.
