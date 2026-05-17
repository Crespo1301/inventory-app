# Getting Started

## 1. Install the Required Runtime

This project needs Node `20.19.4` or newer. The current Expo/React Native stack warns on `20.19.0`.

```bash
cd /home/cresp3/inventory-app
nvm install
nvm use
node -v
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start the App

```bash
npm start
```

Options:

- Press `a` for Android emulator/device.
- Press `i` for iOS simulator on macOS.
- Scan the QR code with Expo Go for quick device testing.
- Run `npm run web` for rough browser checks, but mobile behavior is the priority.

## 4. Verify Before Committing

```bash
npm run verify
```

## 5. Check AI Tooling

```bash
npm run mcp:doctor
```

Copy `.mcp.example.json` to `.mcp.json` only if it is missing. Real keys should live in `/home/cresp3/.env.ai.local` or local `.env.ai.local`.

## 6. First Product Build Path

1. Replace the starter Expo tabs with app-specific tabs:
   - Notes
   - Inventory
   - Order
   - History
   - Settings
2. Add SQLite schema and migrations.
3. Build low-stock note capture.
4. Build item master list with par levels and units.
5. Build order suggestion logic.
6. Add export/share order list.
7. Test in a real kitchen workflow for one week.

## 7. App Store Direction

- Android: create a Google Play Console developer account, then build an Android App Bundle with EAS Build.
- iOS: enroll in the Apple Developer Program, then build and submit with EAS Build/Submit.
- Keep the first release private/internal until the kitchen workflow feels reliable.
