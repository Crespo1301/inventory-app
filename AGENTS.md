# AGENTS.md

Guidance for Codex and other coding agents working in this repository.

## Project Role

`inventory-app` is a mobile-first kitchen and restaurant inventory assistant. The product helps teams capture low-stock notes throughout the week, turn those notes into an order list, and eventually suggest quantities based on usage history, par levels, vendor pack sizes, and upcoming demand.

This is not a website template. The main deliverable is a real mobile app intended for Google Play and iOS App Store release. A marketing website can be added later, but mobile reliability comes first.

## Current Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router
- SQLite via `expo-sqlite`
- Secure local secrets/preferences via `expo-secure-store`
- Zod for runtime validation

Use Node `20.19.4` or newer. The repo includes `.nvmrc`.

## Product Principles

- Offline-first. A kitchen should be able to record inventory notes even with bad Wi-Fi.
- Fast capture beats perfect forms. The first workflow should feel as quick as writing on a whiteboard.
- Order suggestions must be explainable. Show the reason behind suggested quantities.
- Self-dependent by default. Prefer local-first storage and file exports before paid services.
- No vendor lock-in in the first version. Keep sync/export boundaries clean.

## Core MVP Surfaces

1. **Low Stock Notes**: quick item entry, quantity, unit, station/category, urgency, optional note.
2. **Inventory Count**: current on-hand, par level, unit, last count time.
3. **Order Planner**: suggested order quantity, manual override, vendor grouping.
4. **History**: previous counts, orders, missed items, over-order notes.
5. **Settings**: restaurant profile, units, categories, vendors, export/import.

## Suggested Local Data Model

- `items`: ingredient/product master list.
- `inventory_counts`: dated count snapshots.
- `low_stock_notes`: whiteboard replacement entries.
- `vendors`: supplier names and order preferences.
- `order_lists`: weekly order sessions.
- `order_list_lines`: item-level suggested and final quantities.
- `usage_events`: optional future table for sales/prep usage signals.

Keep migrations explicit and versioned. Do not scatter storage logic through screens.

## Agent Workflow

- Read `README.md`, `PRODUCT.md`, `docs/architecture.md`, and `docs/getting-started.md` before large changes.
- Use `.mcp.example.json` as the committed MCP shape. `.mcp.json` is local-only.
- Use `code-review-graph` after meaningful code exists:
  - `code-review-graph build --repo /home/cresp3/inventory-app`
  - `code-review-graph status --repo /home/cresp3/inventory-app`
- Use `ui-ux-pro-max` and `impeccable` for design passes, especially mobile workflows.
- Keep app code TypeScript-first and mobile-accessibility aware.
- Before handing off, run `npm run verify` when the local Node version is compatible.

## Boundaries

- Do not add a paid backend unless the owner explicitly approves it.
- Do not add authentication before the single-device MVP needs it.
- Do not store secrets in committed files.
- Do not build a marketing landing page before the core mobile inventory flow exists.
- Do not assume restaurants use one universal unit system. Units must be configurable.
