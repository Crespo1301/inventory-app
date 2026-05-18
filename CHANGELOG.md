# Changelog

All notable changes to this project are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/). The project is pre-release (0.x).

Every working session — human or AI — must add its changes here before handing
off. See [HANDOFF.md](./HANDOFF.md).

## [Unreleased]

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
