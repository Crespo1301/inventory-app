# Testing Instructions

## Prerequisites

1. Node 20.19.4+ (`nvm use`), then `npm install`.
2. `.env` present with the Supabase URL and publishable key (see
   [Getting Started](./getting-started.md)).
3. In the Supabase dashboard, **Authentication → Sign In / Providers → Email →
   "Confirm email" OFF** for testing. Otherwise sign-up returns no session.

## Running the App

```bash
npm run start:tunnel
```

Always use **tunnel mode** for device testing. The plain `npm start` serves over
the LAN, which a phone cannot reach on WSL2 or many networks — the QR connects
but then times out. Tunnel routes through a public URL that always works.

- **iPhone:** install **Expo Go** from the App Store, scan the QR with the
  Camera app.
- **Android:** install **Expo Go**, scan the QR from inside Expo Go.
- **iOS Simulator** (macOS only): press `i` in the terminal.
- **Android Emulator:** press `a`.

## Testing the Three Roles

Roles need separate accounts. The fastest path:

1. **Sign up as an admin** — this creates the company and its first location.
2. As the admin, go to **Account → Manage → Team & roles → Invite Team Member**.
   Create one invitation with role *Manager* and one with role *Team Member*.
   Each produces a 6-character code.
3. **Log out**, then use **"Join a company"** on the signup screen with an
   invited email + its code to create the manager and member accounts.
4. Switch roles by logging out and back in. To see realtime sync, run the app on
   two devices/simulators signed in as different roles in the same company.

## Core Test Scenarios

- [ ] Sign up → land in the app as admin with one location.
- [ ] Manage → Items → add items for both BOH and FOH (par level, unit, pack).
- [ ] Manage → Locations → add a second location.
- [ ] Invite a manager and a team member; codes are generated.
- [ ] Join the company with a code; the new user lands scoped to the right
      location and role.
- [ ] As a team member: flag items Low and Out — one tap, with haptic feedback.
- [ ] Confirm a team member sees only Stock + Account (no Orders/History).
- [ ] As a manager: Orders → build the list → adjust quantities → Verify.
- [ ] Export/share the order; check the formatted text.
- [ ] Verified order appears in History.
- [ ] EN/ES toggle switches item names where a Spanish name exists.
- [ ] Realtime: flag an item on one device, see it on another within ~1s.
- [ ] Relaunch the app — the session persists, data reloads.
- [ ] Account → Log Out returns to the login screen.

## Pre-Commit Verification

```bash
npm run verify
```

Runs ESLint and the TypeScript compiler. Both must pass.

A heavier check before a build:

```bash
npx expo export --platform ios --output-dir /tmp/exp-check
```

Confirms the JS bundle builds with no import/resolution errors.

## Known Limitations

- The app is **online-first**. Flagging stock with no connection will fail —
  there is no offline write queue yet.
- "Confirm email" must stay off for frictionless test sign-ups; re-enable it for
  production.
