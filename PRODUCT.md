# Product Brief

## Working Name

Inventory App

## Vision

A universal inventory and ordering app for restaurants and food businesses — from
a single cafe to a multi-location operator. It turns the messy, whiteboard-based
ordering process into a fast, shared, explainable workflow that any team member
can use and any manager can trust.

The app is built for real kitchens first: fast, bright, and one-handed. It ships
to the Apple App Store and Google Play and grows into a paid product with
subscription tiers.

## The Problem

Restaurants track low inventory on a whiteboard or from memory. The person placing
the order has to guess what was missed, how much is needed, and whether the team
is over- or under-ordering. This causes missed ingredients, emergency runs, food
waste, inconsistent ordering, and stress during prep.

The deeper problem is adoption. Any ordering tool that is slower than the
whiteboard will be ignored. So the team-member experience has to be *faster* than
writing on the board — that is the bar.

## Target Users

- Restaurant owners running one or many locations
- Kitchen managers and prep leads who place orders
- Line cooks and FOH cashiers who notice low stock during service
- Multi-location operators who need a shared picture across sites

## How It Works

### Business structure

```
Company  →  Locations  →  Service Areas (FOH / BOH)
```

A company owns multiple locations. Each location has front-of-house and
back-of-house ordering tracked separately, because they buy different things from
different vendors.

### Roles

| Role | Can do | Scope |
|------|--------|-------|
| **Admin** | Everything: company, locations, items, people, invites | Whole company |
| **Manager** | Build, adjust, and verify orders; manage items | Assigned locations only |
| **Team Member** | Flag items low or out | Assigned locations only |

Admins create a company at sign-up. They invite managers and team members, who
join with a code and are scoped to the locations the admin grants them. Managers
cannot change company information (locations, hours, branding).

### Core surfaces

1. **Stock** — the item list for a location and service area. One tap flags an
   item *Low* or *Out*. An optional EN/ES toggle translates item names.
2. **Order Planner** — turns the team's flags into a suggested order with
   explainable quantities. Managers adjust and verify.
3. **History** — past verified orders, for week-to-week comparison.
4. **Manage** — items and par levels, locations, and team members.
5. **Account** — profile, working location, role, preferences.

## Order Suggestion Logic — V1

Deterministic and explainable. Every suggestion shows its reason:

```
needed     = max(par_level - on_hand, 0)
urgent     = high-urgency flag ? safety_buffer : 0
suggested  = round_up_to_pack_size(needed + urgent)
```

> *"Suggested 3 cases: par is 4 cases, on-hand is 1 case, rounded up to a
> 1-case pack."*

Managers can override any suggestion. Future versions can layer in sales volume,
day-of-week history, events, menu mix, and vendor lead times.

## Platform & Sync

The app runs on a Supabase backend — Postgres, authentication, row-level
security, and realtime sync. Multiple devices in the same company stay current
with each other automatically. Data is scoped so a user only ever sees their
company, and managers and team members only see their assigned locations.

## Business Direction

Launch as a practical mobile product, prove it in real kitchens for a full order
cycle, then move to paid subscription tiers — sized for single restaurants up to
multi-location operators.
