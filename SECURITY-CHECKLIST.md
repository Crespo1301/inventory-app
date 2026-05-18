# Security Checklist

Baseline to review before each release or major product test.

## Backend & Access Control

- [ ] Row-level security is enabled on every table.
- [ ] Policies scope data by company — no cross-company reads or writes.
- [ ] Managers and team members are limited to their assigned locations.
- [ ] Item, order, location, and people changes are gated by role server-side.
- [ ] `SECURITY DEFINER` helper functions are not callable by anonymous users.
- [ ] Client-side role checks are treated as UI only, never as the access
      boundary.

## Authentication

- [ ] Email confirmation is enabled for public releases.
- [ ] Passwords meet a minimum length.
- [ ] Sessions persist securely on-device and refresh correctly.
- [ ] Invitation codes are single-company scoped and expire or can be revoked.

## Secrets & Config

- [ ] Only the Supabase URL and publishable key ship in the client.
- [ ] Service-role keys and other secrets never appear in the repo or client
      bundle.
- [ ] `.env` and `.mcp.json` contain no committed private credentials.

## Input Safety

- [ ] Validate all forms with shared schemas before writing.
- [ ] Trim item names, units, vendor names, and notes; set length limits.
- [ ] Treat any imported data as untrusted and validate every row.

## Privacy

- [ ] Collect personal data only where a feature truly needs it.
- [ ] Do not add analytics that capture ingredient lists or vendor details
      without explicit review.
- [ ] Exports clearly state what data they contain.

## Mobile Release

- [ ] iOS and Android permissions are minimal.
- [ ] Large inventories render without slow screens.
- [ ] App relaunch restores the session and current data correctly.
