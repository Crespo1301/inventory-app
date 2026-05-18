# AI Workflow

This repo overrides the default workspace role split.

## Claude

Claude sets product direction **and implements it**. That includes product and
UX decisions, screen composition, the design system, data model, Supabase
backend, and feature code. Claude owns the build end to end.

Good Claude work:

- Decide product direction and screen flows.
- Build screens, navigation, and the design system.
- Design and apply database schema, RLS, and migrations.
- Implement features and validation.
- Run `npm run verify`.
- Update `CHANGELOG.md` and `HANDOFF.md` every session.

## Codex

Codex is the second set of eyes — review and release, not primary
implementation.

Good Codex work:

- Review Claude's changes for correctness, security, and consistency.
- Catch regressions and flag risky data or auth changes.
- Push commits, create tags, and prepare releases.
- Keep repo hygiene (lockfiles, branch state) clean.

To bring Codex up to speed, use the catch-up message in `HANDOFF.md`.

## Shared Tools

- `ui-ux-pro-max` — mobile UX direction and the React Native stack rules.
- `impeccable` — interface critique and polish.
- Magic / 21st.dev MCP — component shaping and refinement.
- Stitch MCP — screen prototyping reference.
- `build-graph` — codebase indexing and impact review.

## Handoff

Every session ends by updating `CHANGELOG.md` and `HANDOFF.md` so the next
contributor — human or AI — can continue cleanly. This is mandatory.
