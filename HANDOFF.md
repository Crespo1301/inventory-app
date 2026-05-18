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
Released baseline: `v0.1.0` on 2026-05-17.

**Working end to end:**

- Signup creates a company + admin; login; join-a-company by invite code.
- Role-aware app: Admin, Manager (location-scoped), Team Member (location-scoped).
- Stock: one-tap Low/Out capture, EN/ES item-name toggle.
- Order Planner: explainable suggested quantities, manager override, verify,
  export/share. History of verified orders.
- Manage: items, locations, team members, invitations.
- Supabase: Postgres + row-level security + realtime sync across devices.
- In-app account deletion (Account screen) — meets the App Store requirement.
- iOS-native design pass: collapsing large titles, inset grouped lists, modal
  sheets with grabbers, native SF Symbols on iOS, loading skeletons.
- Offline write queue: flags/orders made offline queue locally and replay on
  reconnect; a banner shows offline/unsynced state.
- EAS build config committed; privacy policy drafted (`docs/privacy-policy.md`).

**Architecture map:**

- `app/` — screens (Expo Router). `(auth)`, `(tabs)`, `manage/`.
- `components/ui/` — design-system components.
- `constants/design.ts` — design tokens.
- `src/domain/` — types, suggestion engine, permissions, export.
- `src/supabase/` — client. `src/data/repo.ts` — data layer. `src/auth/` — auth.
- `src/store/app-store.tsx` — in-memory store, realtime-synced.

**Environment:**

- Supabase project ref `lnzoguygntryxzcyakot`; keys in `.env`.
- Run with `npm run start:tunnel` (tunnel required on WSL2). The start scripts
  skip Expo's remote dependency validation because that API fetch can fail on
  this WSL2/network path after the tunnel is already connected.
- If tunnel fails with ngrok `remote gone away`, use `npm run start:lan` for
  same-network testing or `npm start` for local/browser work, then retry tunnel
  later.
- One-time: disable "Confirm email" in the Supabase dashboard for test signups.
- EAS build config is committed (`eas.json`, bundle IDs); see `docs/eas-build.md`.

## Next Steps (priority order)

1. **First EAS build** — config is in place: `eas.json` (development / preview /
   production profiles), iOS `bundleIdentifier` + Android `package`, and
   `docs/eas-build.md`. Remaining is account-gated and interactive: run
   `eas login` → `eas init` → `eas build --profile production --platform ios`
   → `eas submit` to reach TestFlight. Needs an Expo account and the Apple
   Developer Program.
2. **Host the privacy policy** — `docs/privacy-policy.md` is drafted; fill its
   placeholders (`[Effective date]`, `[Company name]`, `[support email]`), host
   it at an HTTPS URL, link it in App Store Connect and from the Account screen.
3. **App Store Connect prep** — App Privacy details, app icon, 6.9" screenshots,
   a confirmed demo account for review.
4. **Invite email delivery** — currently a shareable code; add an Edge Function
   to email invitations.
5. **Subscription tiers** — gating and billing, after real-kitchen testing.

Done: in-app account deletion, the iOS-native design pass (large titles, grouped
lists, sheets, SF Symbols, skeletons), the offline write queue, EAS build config,
and the privacy policy draft.

See `docs/launch-roadmap.md` for the phased plan and `docs/app-store-requirements.md`
for the full submission checklist.

## Known Limitations

- Offline capture works via the outbox; `createInvitation` is intentionally
  online-only (an invite code needs a real server row).
- Invite delivery is a code to share manually, not an email.
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
> Current priorities are in `HANDOFF.md` → Next Steps (start with in-app account
> deletion — it is an App Store blocker).
>
> When you finish any change, update `CHANGELOG.md` and `HANDOFF.md` before
> handing back. That rule is mandatory for every session.
