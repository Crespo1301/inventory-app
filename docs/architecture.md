# Architecture

## Product Shape

A mobile-first, multi-company app on a Supabase backend. Postgres is the source of
truth; the app talks to it through a typed data layer and stays current across
devices via realtime subscriptions.

## App Layers

- `app/` — Expo Router screens and navigation.
  - `app/(auth)/` — login, signup, join-a-company.
  - `app/(tabs)/` — Stock, Orders, History, Account (tabs vary by role).
  - `app/manage/` — items, locations, people, invitations.
- `components/ui/` — the design-system component library.
- `constants/design.ts` — design tokens (color, spacing, typography, motion).
- `src/domain/` — domain types, the order-suggestion engine, role permissions.
- `src/supabase/` — the Supabase client.
- `src/data/` — the data layer: typed queries that map database rows to domain
  types. Screens never write SQL or call Supabase directly.
- `src/auth/` — authentication state (Supabase Auth).
- `src/store/` — the in-memory app store that loads a company snapshot, mirrors
  mutations back to Supabase, and subscribes to realtime changes.

## Backend

Supabase provides Postgres, authentication, row-level security (RLS), and
realtime.

### Data model

- `companies` — the top-level tenant.
- `profiles` — a user within a company, with a role.
- `locations` — a company's sites.
- `user_locations` — which locations a manager/member may act on.
- `vendors` — suppliers.
- `items` — the per-company catalog (par level, unit, pack size, service area).
- `low_stock_notes` — the whiteboard replacement: a team member's low/out flag.
- `order_lists` / `order_list_lines` — order sessions and their suggested vs.
  final quantities.
- `invitations` — pending invites with a join code, role, and location access.
- `supabase/functions/send-invitation-email` — optional Edge Function that
  emails newly created invitation codes; the app falls back to manual sharing if
  the function is unavailable.

### Access control

Row-level security is enabled on every table. Policies scope reads and writes by
company, role, and location access:

- A user only ever sees their own company's data.
- Admins see every location; managers and members see only assigned locations.
- Item and order edits require the manager or admin role.
- Company, location, and people management require the admin role.

A database trigger (`handle_new_user`) provisions a new company + profile +
location on admin sign-up, or attaches an invited user to an existing company.

### Sync

The app loads a full company snapshot on sign-in and subscribes to Postgres
changes, so a flag raised on one device appears on others within about half a
second. Server-side RLS is the real access boundary — client-side role checks are
only for showing and hiding UI.

## Recommendation Engine V1

Deterministic and explainable (`src/domain/suggestions.ts`):

```text
needed    = max(par_level - on_hand, 0)
urgent    = high-urgency flag ? safety_buffer : 0
suggested = round_up_to_pack_size(needed + urgent)
```

Every line carries a plain-language reason the manager can read and trust.
