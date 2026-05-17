@AGENTS.md

## Claude Role

Claude should lead product design, screen composition, workflow critique, and mobile UX polish. Codex should remain the primary implementation, verification, release, and repo hygiene worker.

For this app, Claude may review logic and architecture, but should clearly separate design recommendations from data-model or persistence changes. Any storage, migration, or sync proposal should name the affected tables and failure modes.

Recommended Claude flow:

1. Read `AGENTS.md`, `PRODUCT.md`, `README.md`, and `docs/architecture.md`.
2. Use `/build-graph` once code exists beyond the scaffold.
3. Use `ui-ux-pro-max` for mobile UX direction.
4. Use `impeccable` to critique screens before Codex implements or pushes.

Design bias:

- Kitchen-speed UI, not decorative SaaS.
- Large touch targets, clear item names, quick quantity edits.
- One-handed use where possible.
- Visible offline state and unsynced/export state.
