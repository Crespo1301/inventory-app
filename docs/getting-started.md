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

## Troubleshooting: Expo Go won't connect (WSL2)

This project is developed inside **WSL2 on Windows**. WSL2 runs Linux in its own
network namespace behind a virtual NAT, so your iPhone **cannot reach Metro's
LAN IP directly** — `npm run start:lan` and plain `npm start` will not work for a
physical phone. The tunnel (`npm run start:tunnel`) or a Windows port-proxy is
required.

If scanning the QR code "does nothing" or the tunnel fails, work through this
checklist **in order**.

### 1. Confirm Expo Go is installed and up to date

The iPhone **Camera app does nothing** with an Expo Go QR code unless Expo Go is
already installed **and** its SDK version matches the project.

- This app is on **Expo SDK 54** (`expo` `~54.0.33` in `package.json`).
- Install/update **Expo Go** from the App Store. The current App Store build of
  Expo Go supports SDK 54. An older Expo Go cannot open an SDK 54 project.
- Open **Expo Go itself** and scan from inside the app (Camera only deep-links
  into Expo Go — it does not load the bundle).

### 2. Use the tunnel, not LAN

```bash
npm run start:tunnel
```

`@expo/ngrok` is already a dev dependency, so no extra install is needed. Wait
for the QR code **and** the `exp://*.exp.direct` URL to print before scanning.
Scan with Expo Go (iOS) or the Expo Go scanner (Android).

### 3. If the tunnel fails

Common causes and fixes:

- **`remote gone away` / `ngrok` disconnects.** Usually a transient ngrok
  outage or flaky network. Stop the server (`Ctrl+C`) and retry. If it persists,
  try a different network (e.g. phone hotspot for the Windows machine).
- **ngrok binary missing or stale.** Reinstall it:
  ```bash
  npm install --save-dev @expo/ngrok@^4.1.3
  ```
- **Corporate / school network or router blocking ngrok.** Switch to a home
  network or hotspot, or use the port-proxy fallback (step 5).
- **Stale Metro cache after a failed start.** Clear it:
  ```bash
  npx expo start --tunnel --clear
  ```

Note: the `start:*` scripts set `EXPO_NO_DEPENDENCY_VALIDATION=1` on purpose —
Expo's remote dependency-validation fetch can fail on the WSL2 network path even
when the tunnel itself is fine. That env var is not the cause of tunnel failures.

### 4. Fallback: type the URL manually

If the QR scan does nothing but the server is running, **open Expo Go on the
iPhone** and use **"Enter URL manually"**. Type the `exp://` URL exactly as
printed in the terminal, for example:

```
exp://abc123.anonymous.inventory-app.exp.direct:80
```

This bypasses the camera/QR deep-link entirely and is the most reliable path
when the tunnel is up.

### 5. Fallback: Windows port-proxy (LAN, no tunnel)

If the tunnel is unavailable, you can expose Metro from WSL2 to your LAN through
Windows. The phone must be on the **same Wi-Fi as the Windows PC**.

1. Get the WSL2 IP (run **inside WSL2**):
   ```bash
   ip addr show eth0 | grep "inet "
   ```
   (At the time of writing this machine reports `172.25.89.159` — the WSL2 IP
   changes on reboot, so re-check it.)

2. In an **Administrator PowerShell on Windows**, forward port 8081 to WSL2 and
   open the firewall:
   ```powershell
   netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=172.25.89.159
   New-NetFirewallRule -DisplayName "Expo Metro 8081" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow
   ```
   Replace `172.25.89.159` with the IP from step 1.

3. Find the Windows LAN IP (`ipconfig` in PowerShell — the Wi-Fi adapter's
   IPv4 address, e.g. `192.168.1.x`).

4. Start Metro in WSL2 bound to all interfaces:
   ```bash
   REACT_NATIVE_PACKAGER_HOSTNAME=<windows-lan-ip> npm run start:lan
   ```

5. In Expo Go, enter the URL manually:
   ```
   exp://<windows-lan-ip>:8081
   ```

To remove the proxy later:
```powershell
netsh interface portproxy delete v4tov4 listenport=8081 listenaddress=0.0.0.0
Remove-NetFirewallRule -DisplayName "Expo Metro 8081"
```

### 6. When to stop fighting it

If none of the above is reliable:

- **Use an Android device or emulator.** Android over the tunnel is generally
  less fussy, and an emulator runs on the Windows/WSL2 side with no networking
  hops. `npm run android` works once the emulator is up.
- **Move to an EAS development build.** A dev build installs as a real app on
  the device and connects without Expo Go entirely. See `docs/eas-build.md` —
  this is the intended path for sustained on-device iOS testing and avoids the
  WSL2 LAN problem long-term.

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
