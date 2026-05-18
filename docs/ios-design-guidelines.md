# iOS Design Guidelines

The app is designed to feel like a native Apple application. Most users will be
on iPhone, so iOS is the reference platform — Android inherits the same system,
adjusted only where Android conventions clearly differ.

## Non-Negotiables

- **No gradients.** Flat fills only.
- **No translucency, blur, or glassmorphism.** Solid surfaces, opaque overlays.
- **Bright, high-contrast palette.** A kitchen phone is used fast, in bad light.
- Depth comes from **subtle, single-direction shadows and hairline borders** —
  never from transparency.

These hold everywhere, including modals, sheets, and navigation bars.

## Apple Design Principles, Applied

Apple's Human Interface Guidelines rest on **clarity** and **deference** (content
first, chrome quiet). We follow both. We deliberately drop the third HIG pillar,
*depth-through-translucency* — depth here is flat elevation only.

| HIG idea | How we apply it |
|----------|-----------------|
| Large titles | Each primary screen opens with a large, bold title that collapses to a standard nav title on scroll. |
| Content first | Quiet chrome: white surfaces, hairline separators, no decorative color. |
| Native navigation | Bottom tab bar; modals slide up from the bottom; back-swipe always works. |
| Grouped lists | Settings/Manage screens use inset grouped lists with section headers. |
| Deference | Color is reserved for status and the primary action — not decoration. |

## Navigation

- **Tab bar** at the bottom, 3–4 tabs, SF-style icons, labels always visible.
  Tabs adapt to role (a Team Member sees fewer).
- **Large title** on each tab's root screen; standard inline title after scroll.
- **Modals** (flag item, item form, invite) present as **sheets that slide up**,
  with a visible grabber and a clear Cancel/Close in the top-left and the
  primary action bottom-anchored.
- **Back-swipe** gesture must work on every pushed screen.
- Push for drill-down (Manage → Items → Item); present modally for create/edit
  tasks that should feel separate from browsing.

## Lists & Grouped Content

- Manage and Account screens use **inset grouped lists**: rounded section cards,
  uppercase or sentence-case section headers, hairline row separators inset from
  the leading edge, and a chevron on rows that drill in.
- Row height ≥ 44pt; comfortable rows for primary content use 56–64pt.
- Destructive actions use the system-red treatment and always confirm.

## Typography

- Use the **system font** (San Francisco on iOS) — already wired in
  `constants/design.ts`.
- Respect **Dynamic Type**: do not hard-cap font scaling; layouts must survive
  larger accessibility text sizes. Test at XL sizes.
- Type scale: large title → title → heading → body → label → caption. One scale,
  used consistently.

## Color

- Bright, flat palette in `constants/design.ts`. Light mode only — the app sets
  `userInterfaceStyle: light`.
- Semantic color only: green = primary action / in-stock, amber = low, red =
  out / urgent / destructive, blue = info / FOH, orange = BOH.
- Contrast ≥ 4.5:1 for text. Never use color as the *only* signal — pair it with
  an icon, label, or shape.

## Controls & Touch

- Minimum touch target **44pt** (HIG); primary controls use 48–64pt.
- Segmented controls for mutually exclusive choices (area, status, urgency).
- Steppers for quantity edits — large +/− targets for one-handed use.
- Primary action is a **full-width, bottom-anchored button** above the home
  indicator, in the thumb zone.

## Motion & Haptics

- Micro-interactions 120–260ms. Snappy, never sluggish.
- Press feedback: a quick spring scale on every tappable surface.
- Haptics: selection tick on toggles/steppers, success notification on a
  completed flag or verified order. Match iOS feel — subtle, not constant.
- Respect Reduce Motion.

## Icons

- Use **SF Symbols on iOS** for the most native look — the `expo-symbols`
  package is available and the scaffold already includes a symbol component.
  Ionicons are an acceptable cross-platform fallback; prefer SF Symbols on iOS
  where it matters (tab bar, nav, list rows).
- One icon family per surface; consistent weight and size.

## Screen Polish Punch List

A focused critique of the current screens and the iOS-native upgrades to make:

- **Stock** — adopt a large collapsing title; make flagged items a clear inset
  group; ensure the one-tap Low/Out targets stay ≥44pt with comfortable spacing.
- **Flag sheet** — present with a grabber; Cancel top-left, primary action
  bottom-anchored; field groups as inset cards.
- **Orders** — large title; order lines as a grouped list; keep the reason text
  legible; bottom-anchored Verify.
- **Account & Manage** — convert to true inset grouped lists with section
  headers and chevrons (the iOS Settings pattern).
- **Auth screens** — center the mark, generous spacing, single-column fields,
  bottom-safe primary button.
- Add proper **loading skeletons** and **empty states** with SF Symbols.

## Design Toolchain

When doing a design pass, use:

- **`ui-ux-pro-max`** — mobile UX direction and the React Native stack rules.
- **`impeccable`** — critique screens before implementing; run a polish pass after.
- **Magic / 21st.dev MCP** — component shaping and refinement.
- **Stitch MCP** — screen prototyping and visual reference.

Always re-check against the Non-Negotiables above before merging a design change.
