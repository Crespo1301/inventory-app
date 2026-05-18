# AGENTS.md

Guidance for Codex and other coding agents working in this repository.

## Project Role

`inventory-app` is a mobile inventory and ordering app for restaurants and
multi-location food businesses. It helps teams capture low-stock notes throughout
the week, turn those notes into an order list with explainable suggested
quantities, and verify orders before they go out — across both FOH and BOH.

This is a real mobile product intended for the Apple App Store and Google Play,
growing into a paid app with subscription tiers. It is universal: nothing is
hardcoded for any one restaurant.

## Stack

- Expo SDK 54, React Native 0.81, React 19
- TypeScript, Expo Router
- Supabase — Postgres, Auth, row-level security, realtime sync
- Zod for runtime validation

Use Node `20.19.4` or newer. The repo includes `.nvmrc`.

## Product Principles

- Adoption first. Flagging an item must be faster than writing on the whiteboard,
  or the team will not use it.
- Order suggestions must be explainable. Always show the reason behind a quantity.
- Roles are real boundaries. Enforce access in the database (RLS), not just the UI.
- Universal by design. Each company defines its own locations, items, par levels,
  vendors, and team — no built-in assumptions.
- Kitchen-speed UI: bright, flat, large touch targets, one-handed use.

## Business Structure

```
Company  →  Locations  →  Service Areas (FOH / BOH)
```

Roles: **Admin** (whole company), **Manager** (assigned locations, ordering +
verification), **Team Member** (assigned locations, flag low/out only).

## Core Surfaces

1. **Stock** — one-tap low/out capture, with an EN/ES item-name toggle.
2. **Order Planner** — suggested quantities, manual override, manager verify.
3. **History** — past verified orders.
4. **Manage** — items and par levels, locations, people and invitations.
5. **Account** — profile, working location, role, preferences.

## Data Model (Supabase / Postgres)

`companies`, `profiles`, `locations`, `user_locations`, `vendors`, `items`,
`low_stock_notes`, `order_lists`, `order_list_lines`, `invitations`.

Row-level security is enabled on every table and scopes data by company, role,
and location access. Schema changes go through Supabase migrations. Keep data
access in `src/data/` — do not scatter queries through screens.

## Agent Workflow

- Read `README.md`, `HANDOFF.md`, `docs/architecture.md`, and
  `docs/ios-design-guidelines.md` before large changes.
- Use `.mcp.example.json` as the committed MCP shape. `.mcp.json` is local-only.
- Keep app code TypeScript-first and mobile-accessibility aware.
- Run `npm run verify` before handing off.

## Mandatory Handoff

Every working session — human or AI — must end by updating two files:

1. `CHANGELOG.md` — what changed, under `[Unreleased]`.
2. `HANDOFF.md` — refresh *Current State* and *Next Steps*.

This keeps the project pick-up-able for the next contributor. Do not skip it.

## Boundaries

- Do not weaken row-level security or move access enforcement to the client only.
- Do not commit secrets. Only the Supabase URL and publishable key belong in the
  client; service-role keys never enter the repo.
- Units, categories, and vendors are configurable per company — never assume one
  universal system.
- Do not build a marketing landing page before the core mobile workflow is solid.
