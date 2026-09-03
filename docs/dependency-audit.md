# Dependency Audit — 2026-09-03

Baseline for the pre-pilot security triage. Updated whenever the audit picture
materially changes. Run `npm audit --omit=dev --audit-level=high` to refresh.

## Current State

- Baseline before this pass: **32 vulnerabilities** (2 critical, 15 high, 14
  moderate, 1 low) reported by Codex on 2026-08-13.
- After the non-breaking `npm audit fix` on 2026-08-21: **25 vulnerabilities**
  (0 critical, 10 high, 15 moderate).
- After the non-breaking `npm audit fix` on 2026-09-03: **30 vulnerabilities**
  (0 critical, 9 high, 21 moderate). The lockfile changed again as the Expo /
  React Native / Metro transitive tree shifted, but no direct dependency,
  app-runtime source, Expo SDK, or React Native version was intentionally
  upgraded.
- Both **criticals** (`shell-quote` DoS/injection, `tar` parser/DoS chain) are
  resolved. `@babel/core` low and the `brace-expansion`, `fast-uri`, `js-yaml`,
  `nanoid`, `undici` highs are resolved.
- Only `package-lock.json` moved in both non-force passes; `package.json` is
  unchanged.
- `npm run verify` (lint + typecheck) is green after the 2026-09-03 fix.
- This shell used Node `20.19.0`; Expo/RN packages now warn that the pinned
  local runtime should be Node `20.19.4` or newer. That engine mismatch did not
  block verification, but local preview/build work should use the pinned Node.

## Remaining Advisories (30)

Every remaining advisory is transitive through the Expo / React Native / Metro
/ dev-client toolchain. None are direct app-runtime imports we control, and
none of the known affected code paths ship in the compiled mobile bundle.

| Root package        | Sev  | Reachable at                    | Notes                                                                  |
| ------------------- | ---- | ------------------------------- | ---------------------------------------------------------------------- |
| `decode-uri-component` | mod | Expo Router / React Navigation query parsing | No non-force fix available in the current Expo 54 tree. |
| `image-size`        | high | Metro bundler (build/dev only)  | ICNS/JXL/HEIF DoS in parsers. Only exercised when bundling assets.     |
| `postcss`           | high | `@expo/metro-config` CSS xform  | XSS / path traversal / source-map disclosure advisories; build-time only. |
| `metro`, `metro-config`, `metro-transform-worker` | high | Bundler | Pulled in by `image-size`/`postcss`. Not shipped to device.            |
| `@expo/metro`, `@expo/metro-config`, `@expo/cli`  | high | Dev CLI/bundler | Chained on the same Metro/image-size/postcss finds.                    |
| `uuid` (<11)        | mod  | `xcode` via `@expo/config-plugins` | Buffer bounds check. Only touched during native iOS prebuild.       |
| `expo`, `expo-router`, `expo-constants`, `expo-linking`, `expo-splash-screen`, `expo-manifests`, `expo-updates`, `expo-asset`, `expo-dev-client`, `expo-dev-launcher` | mod | Depend on above | These packages are *runtime*, but their vulnerable subpath is the config/prebuild/metro chain — dev-time. The runtime code they ship is not itself flagged. |

## Classification

- **Resolved in prior non-force passes:** `shell-quote`, `tar`,
  `brace-expansion`, `fast-uri`, `js-yaml`, `nanoid`, `undici`, and
  `@babel/core`. Delivered by non-breaking `npm audit fix` — package-lock only.
- **Temporarily accepted (30 advisories):** everything above. The high-severity
  advisories are concentrated in Expo / Metro build tooling. The moderate
  query-string / React Navigation chain is app-adjacent, but the current audit
  offers no non-force fix inside Expo 54.
- **Runtime-reachable, unfixed:** none.
- **Requires Expo upgrade:** the force-fix path. `npm audit fix --force`
  proposes `expo@57.0.19`, a **three-major-version jump** from our current
  `expo@54.0.37`. That is not a lockfile-only change — it drags RN, Metro, the
  Babel preset, and every `expo-*` module with it, and would need a full Expo
  upgrade sprint with device QA and a build-tested TestFlight/EAS run before we
  can call it safe. See "Upgrade Path" below.
- **Needs Codex / security review:** the Expo 54 → 57 upgrade sprint (owner:
  Codex, per the repo role split for large mechanical work).

## Upgrade Path (recommended, not yet executed)

1. Cut a branch (e.g. `chore/expo-57-upgrade`).
2. Run `npx expo install expo@~57` and then `npx expo install --check` to
   realign every `expo-*` peer.
3. Update `react-native` and `react` to Expo 57's targets; regenerate the
   babel preset config; re-run `npx expo prebuild` if any `ios/`/`android/`
   artifacts get regenerated (they should not — we are managed workflow).
4. Re-run `npm run verify`. Fix any TS/lint fallout — likely candidates are
   `expo-router` (v6→v?) and `expo-updates` type shape changes.
5. Smoke-test on Expo Go + one EAS `development` build on Android before
   promoting to `preview`/`production`.
6. Re-run `npm audit --omit=dev --audit-level=high` and re-classify.

Blocking pieces that make "just do the upgrade now" a bad trade:

- Android is now equal-priority (per launch roadmap Phase 0), and the pilot
  device path in HANDOFF Next Steps item 0 is an EAS Android internal build.
  Doing a three-major Expo upgrade *and* the first EAS build simultaneously
  would confuse the failure surface.
- CSolutions entity formation, Apple/Google org verification, and the D-U-N-S
  wait are the actual gating path to public release. Nothing in the current
  advisory set exposes end-user devices, so no user-visible risk grows during
  that wait.

## Guardrails

- Do not run `npm audit fix --force` on `main` without executing the upgrade
  path above end-to-end on a branch first.
- Do not add a new direct runtime dependency without re-running
  `npm audit --omit=dev --audit-level=high` and updating this document.
- Re-check this file before every release and after any Expo SDK bump.
