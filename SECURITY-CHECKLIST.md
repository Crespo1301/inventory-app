# Security Checklist

Use this as the baseline before each release or major product test.

## Local Data

- [ ] Store app data in SQLite, not scattered async storage keys.
- [ ] Keep schema migrations explicit and reversible where practical.
- [ ] Do not store API keys, tokens, or private credentials in SQLite.
- [ ] Use SecureStore for device-local sensitive settings.
- [ ] Make export files intentional and user-initiated.

## Input Safety

- [ ] Validate all forms with shared schemas before writing to storage.
- [ ] Trim item names, units, vendor names, and notes.
- [ ] Set reasonable length limits on notes and item names.
- [ ] Treat imported files as untrusted and validate every row.

## Privacy

- [ ] Do not collect personal data unless the feature truly needs it.
- [ ] Do not add analytics that capture ingredient lists or vendor details without explicit review.
- [ ] Keep backups and exports clear about what data they contain.

## Mobile Release

- [ ] Confirm iOS and Android app permissions are minimal.
- [ ] Test offline startup, offline edits, and app restart recovery.
- [ ] Test large inventories without slow screens.
- [ ] Confirm no secrets are committed in `.env`, `.mcp.json`, or app config.

## Future Sync

- [ ] Use per-restaurant workspace boundaries.
- [ ] Add auth only when multi-device/team sync is ready.
- [ ] Encrypt transport with HTTPS.
- [ ] Keep server-side authorization separate from client-side UI checks.
