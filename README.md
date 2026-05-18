# Inventory App

A mobile inventory and ordering assistant for restaurants and multi-location food
businesses. It replaces the back-of-house whiteboard with a fast, shared,
role-aware ordering workflow that covers both back of house (BOH) and front of
house (FOH).

## The Problem

Restaurants track low stock on a whiteboard or from memory. Whoever places the
weekly order guesses what was missed and how much to buy. The result is emergency
supply runs, food waste, inconsistent ordering, and stress during prep.
Multi-location operators have it worse — every location runs its own informal
process and there is no shared picture.

## What the App Does

- **Fast capture** — any team member flags an item *Low* or *Out* in one tap. It
  is faster than writing on the whiteboard, which is the only way a kitchen will
  actually adopt it.
- **Explainable suggestions** — the order planner suggests quantities from par
  levels, vendor pack sizes, and the team's flags, and shows the reason behind
  every number.
- **Manager verification** — a manager reviews, adjusts, and verifies the order
  before it goes out.
- **Multi-location** — one company, many locations, each with its own stock and
  order lists.
- **FOH + BOH** — front- and back-of-house ordering are tracked as separate
  service areas.
- **Bilingual** — an EN/ES translation toggle on item names for kitchens where
  BOH staff speak Spanish.

## Business Structure

```
Company  →  Locations  →  Service Areas (FOH / BOH)
```

## Roles

- **Admin** — the business owner. Manages the company, locations, items, and
  people; invites other admins, managers, and team members.
- **Manager** — runs ordering for the locations granted to them. Builds and
  verifies orders. Scoped to assigned locations; cannot change company settings.
- **Team Member** — line cooks and cashiers. Flags items low or out. The simplest
  possible role, intentionally.

## Stack

- Expo SDK 54, React Native, TypeScript, Expo Router
- Supabase — Postgres, Auth, row-level security, realtime sync
- Zod for runtime validation

## Quick Start

```bash
cd /home/cresp3/inventory-app
nvm use
npm install
npm run start:tunnel
```

Use `start:tunnel` so a physical device can reach the dev server (required on
WSL2 and any network where the phone and computer are not directly routable).
Scan the QR code with the iPhone Camera or Android Expo Go.

See [Getting Started](./docs/getting-started.md) for the one-time Supabase setup
step.

## Product Direction

The app is built to ship to the Apple App Store and Google Play, and to grow into
a paid product with subscription tiers for single restaurants up to multi-location
operators. It is universal by design — nothing is hardcoded for any one
restaurant; each company defines its own locations, items, par levels, and team.

## Documentation

- [Handoff](./HANDOFF.md) — current state and next steps; **start here**
- [Changelog](./CHANGELOG.md)
- [Product Brief](./PRODUCT.md)
- [Architecture](./docs/architecture.md)
- [Getting Started](./docs/getting-started.md)
- [Testing](./docs/testing.md)
- [iOS Design Guidelines](./docs/ios-design-guidelines.md)
- [App Store Requirements](./docs/app-store-requirements.md)
- [Launch Roadmap](./docs/launch-roadmap.md)
- [Security Checklist](./SECURITY-CHECKLIST.md)
- [AI Workflow](./AI-WORKFLOW.md)
- [Agent Instructions](./AGENTS.md)
