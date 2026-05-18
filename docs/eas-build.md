# EAS Build & TestFlight

How to turn the project into an installable iOS build. EAS builds in the cloud,
so **no Mac is required** — but an Apple Developer account is.

## What's already configured

- `eas.json` — `development`, `preview`, and `production` build profiles.
- `app.json` — `ios.bundleIdentifier` and `android.package` set to
  `com.csolutions.inventoryapp`.
- Supabase keys are in `.env` (committed, `EXPO_PUBLIC_`-prefixed) and are
  picked up automatically at build time.

## One-time setup

1. **Accounts**
   - A free **Expo account** (expo.dev).
   - The **Apple Developer Program** ($99/year) — required for any iOS build
     that installs on a device or goes to TestFlight.

2. **Install the CLI**
   ```bash
   npm install -g eas-cli
   eas login
   ```

3. **Link the project**
   ```bash
   eas init
   ```
   This writes `extra.eas.projectId` (and `owner`) into `app.json`. Commit that
   change — do not hand-edit the project ID.

## Build profiles

| Profile | Use | Install path |
|---------|-----|--------------|
| `development` | A dev client with the debugging menu — replaces Expo Go once custom native modules are added. | Internal / registered devices |
| `preview` | A release-style build for testers, no dev tooling. | Internal / registered devices |
| `production` | The build that goes to TestFlight and the App Store. | App Store Connect |

## Getting onto a real iPhone via TestFlight

```bash
# 1. Build the production app in the cloud
eas build --profile production --platform ios

# 2. Upload it to App Store Connect (creates the app record on first run)
eas submit --profile production --platform ios
```

`eas submit` prompts for Apple ID / team / app details the first time. After
Apple finishes processing (a few minutes to ~an hour), the build appears in
**TestFlight** — invite testers from App Store Connect.

For a quick non-TestFlight device test, use the `preview` profile and register
the device when prompted:

```bash
eas build --profile preview --platform ios
```

## Before a public App Store submission

These are tracked in [app-store-requirements.md](./app-store-requirements.md):

- Replace the placeholder app icon with a real 1024×1024 icon.
- Capture 6.9″ iPhone screenshots from real screens.
- Host a privacy policy and fill in App Privacy details.
- Provide a confirmed demo account (admin + manager) in App Review notes.
- Re-enable "Confirm email" in Supabase for production.

## Versioning

`eas.json` uses `appVersionSource: "remote"` — EAS manages the iOS build number
and auto-increments it for production builds. The user-facing version is
`expo.version` in `app.json` (currently `0.1.0`); bump it for each release.
