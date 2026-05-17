# AI Workflow

## Codex

Use Codex for implementation, repo organization, testing, release hygiene, and code review. Codex should keep the app buildable and keep documentation aligned with the current product direction.

Good Codex tasks:

- Set up storage and migrations.
- Build screens and navigation.
- Add validation and tests.
- Run `npm run verify`.
- Prepare commits, tags, and releases.

## Claude

Use Claude for mobile UX, product critique, screen copy, workflow simplification, and design polish.

Good Claude tasks:

- Critique the order-planning flow.
- Design the low-stock capture experience.
- Suggest screen hierarchy and empty states.
- Review whether the app feels fast enough for a kitchen.

## Shared Tools

- `build-graph`: codebase indexing and impact review.
- `ui-ux-pro-max`: mobile UX direction and design systems.
- `impeccable`: interface critique and polish.
- Stitch MCP: design prototyping reference.
- Magic MCP: component/design inspiration.

## Token-Saving Pattern

Give agents one narrow task at a time:

1. Product decision or screen goal.
2. Exact files they may edit.
3. What must remain unchanged.
4. Verification command.
5. Expected handoff summary.
