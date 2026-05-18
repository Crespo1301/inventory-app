# Getting Started

## 1. Install the Runtime

Node `20.19.4` or newer. The repo includes an `.nvmrc`.

```bash
cd /home/cresp3/inventory-app
nvm use
node -v
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Supabase

The app connects to a Supabase project. Connection values live in `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_xxx
```

Copy `.env.example` to `.env` if it is missing. The publishable key is safe to
ship in a client build — row-level security is what protects data.

### One-time: allow sign-up without email confirmation (for testing)

New Supabase projects require email confirmation, which blocks sign-in during
local testing. In the Supabase dashboard:

> **Authentication → Sign In / Providers → Email → turn off "Confirm email"**

Re-enable it before a public release.

## 4. Run the App

```bash
npm run start:tunnel
```

Use `start:tunnel` so a physical phone can reach the dev server — this is required
on WSL2 and any setup where the phone and computer are not on a directly routable
network. Then:

- Install **Expo Go** on the device.
- Scan the QR code with the iPhone Camera, or with Expo Go on Android.
- `npm start` (no tunnel) works only when the device is on the same routable LAN.
- Press `a` / `i` for an Android emulator or iOS simulator.

## 5. Verify Before Committing

```bash
npm run verify
```

Runs lint and TypeScript checks.

## 6. Store Submission

- **Android:** create a Google Play Console account, then build an Android App
  Bundle with EAS Build.
- **iOS:** enroll in the Apple Developer Program, then build and submit with EAS
  Build / Submit.
- Keep the first release in internal/closed testing until the kitchen workflow
  is proven.
