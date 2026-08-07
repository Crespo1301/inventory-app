# App Icon Design Brief — Kitchen Inventory

> **Archived 2026-05-19 — fulfilled.** The placeholder icon has been replaced
> with the flat clipboard-and-check mark described below. The icon set is now
> generated reproducibly by `scripts/make-icon.js` (the durable source — edit
> the geometry there and re-run `node scripts/make-icon.js`). This brief is
> kept for design rationale and the acceptance criteria.

A brief for the production app icon. The current `assets/images/icon.png` is the
Expo placeholder (blue "A", construction guides, a gradient) and must be
replaced before App Store / Play submission.

---

## 1. What the icon must do

- Be instantly recognizable on a busy iPhone home screen at small sizes.
- Read clearly at **60 × 60 px** — the smallest size users actually see.
- Say "inventory / stock / checklist for a kitchen" without any text.
- Match the app's design language: flat, bright, confident — **no gradient,
  no translucency, no glass**, per `docs/ios-design-guidelines.md`.
- Feel like a native, professional Apple app — not a clip-art logo.

This is a kitchen-speed operations tool, not a decorative consumer app. The
icon should feel **clean and dependable**, closer to Reminders or Notes than to
a playful game icon.

---

## 2. Concept direction

**Primary concept — Clipboard with a check.**
A simple, bold clipboard mark with a single check (or one checked line) on it.
The clipboard is the clearest universal symbol for inventory and stock-taking,
and a check communicates the app's core verb: an item handled / flagged / an
order verified. It survives shrinking to 60px better than a multi-item list.

Recommended composition:

- Solid **brand-green** background, full bleed.
- A single **white** clipboard shape, centered, optically balanced.
- One bold check mark inside it — white knocked out of the green, or green
  knocked out of a white clipboard. Keep it to **one** check, not a list of
  rows (rows turn to mud at small sizes).
- No outline strokes thinner than ~3% of the canvas width.

**Alternate concepts** (use only if the clipboard feels too generic):

1. **Crate / open box** — a simple front-facing crate, communicating stock and
   supply. Risk: reads as "shipping" or "archive" more than "kitchen."
2. **Check mark alone** — a single confident check in a rounded square. Very
   legible, very calm, but less specific to inventory.
3. **Clipboard + one low-stock dot** — clipboard with a small amber/red dot,
   nodding to the low-stock flag. Adds meaning but also small-size clutter;
   only attempt at large sizes and test at 60px.

Avoid: chef hats, forks/knives, plates, restaurant clichés. The product is an
ops tool, not a food/recipe app — cutlery imagery would mislead.

---

## 3. Color

Pull exact values from `constants/design.ts` so the icon matches in-app brand:

| Role | Hex | Use |
|------|-----|-----|
| Brand green (primary) | `#15A150` | Icon background |
| Green pressed (darker) | `#10833F` | Optional subtle depth edge — flat, not a gradient |
| White | `#FFFFFF` | The clipboard / check mark |
| Ink | `#16181D` | Avoid as a large fill; only fine detail if ever needed |

Rules:

- **Solid background fill only.** No gradient ramp. If depth is wanted, a
  single flat darker-green shape (a clean shadow block, hard edge) is allowed —
  not a soft blur, not a sheen.
- Two-color icon is ideal: green + white. Three colors maximum.
- High contrast between mark and background so it pops in both light and dark
  home-screen wallpapers.

---

## 4. Composition & grid

- **Canvas:** 1024 × 1024 px.
- **Corners:** draw on a full square. Do **not** round the corners and do
  **not** add an inner shadow for the rounding — Apple applies the rounded mask
  (the iOS "squircle") automatically.
- **Safe area:** keep the primary mark within the centered ~80% of the canvas
  (≈820 px). The outer ~10% margin can be background color, since the squircle
  mask clips the corners.
- **Optical centering:** center the mark optically, not just mathematically —
  a clipboard's clip at the top makes it look top-heavy if math-centered.
- The mark should be **large and confident** — fill the safe area generously.
  Timid, small marks look like a mistake at home-screen size.

---

## 5. Technical specs (hard requirements)

| Spec | Requirement |
|------|-------------|
| Master size | 1024 × 1024 px, exact |
| Format | PNG (flattened) |
| Color space | sRGB or Display P3, 8-bit |
| Alpha channel | **None** — must be fully opaque |
| Corners | Square (no pre-rounding) |
| Background | Fully opaque, edge to edge |
| File | replaces `assets/images/icon.png` |

Expo generates every smaller iOS size from this single 1024² master, so only
one file is needed for iOS. The same image is uploaded to App Store Connect.

### Android (already wired, keep consistent)

`app.config.ts` references a separate Android adaptive-icon set in
`assets/images/`:

- `android-icon-foreground.png` — the mark, on a transparent background, with
  generous padding (Android crops adaptive icons to a circle/squircle/etc.).
- `android-icon-background.png` — the green background layer.
- `android-icon-monochrome.png` — single-color silhouette for themed icons.

When the iOS icon is redesigned, regenerate these three so Android matches.
`favicon.png` (web) and `splash-icon.png` should also be refreshed to the new
mark for a consistent brand.

---

## 6. Do / Don't

**Do**
- Keep it to one clear idea, two colors, large mark.
- Test by exporting to 60 px and 120 px and viewing on a real home screen.
- Keep strokes thick and shapes simple.

**Don't**
- No gradients, no glossy highlights, no glass/blur, no drop shadows on the
  whole icon.
- No text or letterforms in the icon (no "KI", no "Kitchen Inventory").
- No photographic elements, no skeuomorphic textures.
- No thin lines or a multi-row list that disappears at small sizes.
- No transparency in the final iOS PNG.
- Don't round the corners yourself.

---

## 7. Deliverables

1. `icon-1024.png` — 1024 × 1024, the iOS / App Store master → replaces
   `assets/images/icon.png`.
2. Updated `android-icon-foreground.png`, `android-icon-background.png`,
   `android-icon-monochrome.png`.
3. Updated `splash-icon.png` and `favicon.png`.
4. Source file (SVG or layered) kept somewhere durable for future edits.

After dropping in the new files, run `npx expo prebuild --clean` is **not**
needed for a managed build — EAS regenerates icons at build time. Just verify
the icon in the next `eas build` or in Expo Go.

---

## 8. Acceptance check

- [ ] Recognizable and legible at 60 px.
- [ ] Solid background, no gradient/gloss/blur.
- [ ] Two (max three) colors, brand green + white.
- [ ] 1024², sRGB/P3, 8-bit, no alpha, square corners.
- [ ] No text, no cutlery/food clichés.
- [ ] Android adaptive set, splash, and favicon updated to match.
- [ ] Looks at home next to Apple's own utility icons.
