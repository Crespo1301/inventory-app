@AGENTS.md

## Role Split (overrides the workspace default for this repo)

For `inventory-app`, the standard workspace role split does not apply:

- **Claude** sets product direction **and implements it** — design, screens,
  data model, backend, and feature code.
- **Codex** is the second set of eyes: it reviews Claude's work and handles
  pushing, versioning, and release hygiene. Codex is not the primary implementer
  here.

Claude owns the build. Storage, migration, and sync changes should still name
the affected tables and failure modes for Codex's review.

Recommended Claude flow:

1. Read `README.md`, `HANDOFF.md`, `AGENTS.md`, and `docs/ios-design-guidelines.md`.
2. Use `/build-graph` once code exists beyond the scaffold.
3. Use `ui-ux-pro-max` for mobile UX direction.
4. Use `impeccable` to critique screens before Codex implements or pushes.
5. End every session by updating `CHANGELOG.md` and `HANDOFF.md` (mandatory).

The app is iPhone-focused and must feel like a native Apple application — see
`docs/ios-design-guidelines.md`. No gradients, no translucency or glass effects.

Design bias:

- Kitchen-speed UI, not decorative SaaS.
- Large touch targets, clear item names, quick quantity edits.
- One-handed use where possible.
- Clear sync and save state — the team should always know an action landed.
