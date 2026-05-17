# Architecture

## Product Shape

This is a local-first mobile app. The first release should work on one device without requiring a server account.

## App Layers

- `app/`: Expo Router screens and navigation.
- `components/`: reusable visual and interaction components.
- `constants/`: theme and static constants.
- `hooks/`: reusable React hooks.
- `src/db/`: future SQLite connection, migrations, and repositories.
- `src/domain/`: future inventory, ordering, and suggestion logic.
- `src/validation/`: future Zod schemas shared by forms and imports.

## Storage Direction

Use SQLite as the source of truth. Keep persistence behind repository/helper modules so screens do not directly own SQL.

Suggested first tables:

- `items`
- `vendors`
- `low_stock_notes`
- `inventory_counts`
- `order_lists`
- `order_list_lines`

## Sync Direction

Do not build sync first. Start with:

1. Local SQLite.
2. Manual CSV/JSON export.
3. Manual import/restore.
4. Later: optional self-hosted sync API if product testing proves the need.

## Recommendation Engine V1

Keep suggestions deterministic and explainable:

```text
needed = max(par_level - current_on_hand, 0)
urgent_bonus = note_urgency == "high" ? safety_buffer : 0
suggested = round_up_to_pack_size(needed + urgent_bonus)
```

Every suggestion should show a reason like:

`Suggested 3 cases because current count is 1 case, par is 4 cases, and vendor sells by full case.`
