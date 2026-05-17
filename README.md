# Inventory App

Mobile-first inventory and weekly ordering assistant for restaurants and kitchens.

The first version is intentionally local-first: fast capture, SQLite storage, and explainable ordering suggestions before any paid backend or team-sync dependency.

## Why This Exists

Kitchen teams often write low-stock items on a whiteboard during the week. When it is time to order, the manager has to rely on memory, rough guesses, and incomplete notes. This app is meant to turn that messy workflow into:

- quick low-stock capture
- reliable inventory counts
- weekly order planning
- suggested order quantities
- exportable order lists

## Stack

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- SQLite with `expo-sqlite`
- Secure device storage with `expo-secure-store`
- Zod validation

## Quick Start

```bash
cd /home/cresp3/inventory-app
nvm install
nvm use
npm install
npm start
```

Run checks:

```bash
npm run verify
```

AI/MCP sanity check:

```bash
npm run mcp:doctor
```

## Development Notes

- Use Node `20.19.4` or newer.
- Keep SQLite as the app source of truth for the MVP.
- Keep screens simple enough for one-handed kitchen use.
- Build mobile first. Web is useful for rough checks, but it is not the primary target.
- Do not add authentication, paid cloud services, or sync until the local single-device workflow proves itself.

## Documentation

- [Product Brief](./PRODUCT.md)
- [Architecture](./docs/architecture.md)
- [Getting Started](./docs/getting-started.md)
- [Security Checklist](./SECURITY-CHECKLIST.md)
- [AI Workflow](./AI-WORKFLOW.md)
- [Agent Instructions](./AGENTS.md)

## First Milestone

The first useful test build should include:

1. low-stock note capture
2. item list with units and par levels
3. basic inventory count screen
4. order planner with explainable suggestions
5. export/share order list

After that, test it in a real kitchen for a full order cycle before adding heavier features.
