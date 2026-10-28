# Copilot 365 handoff packages

Self-contained spec packages for outsourcing graphics/UI work to GitHub Copilot 365, so Claude Code's
usage stays reserved for integration, testing, and review rather than first-draft generation.

## Why this exists

Copilot 365 can only read ~20 files at a time and can't open `.zip` archives. So each package here is
written to be **read on its own** — it inlines the exact current code Copilot needs to match (component
props, existing CSS classes, file paths) instead of assuming Copilot will browse the repo. Where Copilot
*does* need to open real files (to match code style, or because a file is too long to inline), the
package says exactly which ones, kept well under the 20-file ceiling.

## How to use a package

1. Open the numbered package file (e.g. `01-biome-backgrounds.md`).
2. Follow its own "Handing this to Copilot" section — packages may split into a **Track A** (art brief:
   paste directly into Copilot 365's image generation) and a **Track B** (code spec: paste into Copilot
   365 Chat, attaching only the files the package lists).
3. Bring Copilot's output (generated images, proposed diffs/code) back to Claude for integration:
   dropping images into `public/assets/...`, applying/adjusting the code, running `npm run check`,
   verifying Canon/Scope compliance, and committing.

## Conventions every package follows

- **Canon and Scope boundary** (from `AI.md`) are restated in full in every package — Copilot has no
  other way to know them, and violating either is the one thing `npm run check` won't catch.
- **Art style**: `docs/VISUAL_DIRECTION.md` is the written source-of-truth for style, characters,
  environments and the avoid-list — subordinate to `AI.md`'s Canon/Scope, with a Scope note reconciling
  the two (notably: Forest ≠ Rainforest, and several environments/secret areas it describes are
  long-term/aspirational, not current scope). `public/assets/wild-camper/wild-camper-direction.png`
  (1536×1024 PNG) is the one concrete image anchor that exists today. Attach **both** in Copilot 365
  alongside any Track A art brief so new assets match — don't rely on either alone.
- **Task-board format**: each package ends with a "Done when" block written in this repo's task-board
  format (see `AGENTS.md`), so finished work graduates into `CHANGELOG.md` the same way any other task
  does.
- **Copilot 365 only does Track A (art).** Package 01 found that Copilot 365 Chat couldn't reliably
  complete even a small, fully-specified multi-file code change — Claude implemented it directly instead.
  As of 2026-07-25 that's the standing approach, not a case-by-case fallback: packages still write a full
  Track B spec (it documents the change precisely and is useful either way), but the instructions no
  longer route it through Copilot 365 Chat at all. Send Track A's output straight to Claude and it
  implements Track B directly.

## Index

- `01-biome-backgrounds.md` — Park and Forest screen hero visuals, matching the Camper screen's existing
  pattern. Done (2026-07-25).
- `02-animal-portraits.md` — kept as history, not a live spec. Its Track A art generation succeeded, but
  the mechanic evolved past its Track B code spec (single portrait per animal) into a 5-photo-variant
  collection mechanic — see `DECISIONS.md`'s `D-2026-07-25-photo-collection-mechanic`. Done (2026-07-25).
- `03-park-map.md` — superseded (2026-07-29): its landscape map image was replaced by a portrait one for
  better phone display — see `DECISIONS.md`'s `D-2026-07-29-park-map-portrait`. The clickable-pins-over-
  an-image approach it introduced is unchanged, kept as history for the original prompt/reasoning.
- `04-lake-biome-animals.md` — Lake animal art (6 animals × 5 photos). Generated and now wired in; the Lake
  is playable (`D-2026-10-28-lake-biome-go-ahead`). Kept as history.
- `05-bonus-photo-variants.md` — art prep for the Wildlife Photographer explorer role's bonus 6th photo
  per animal (10 animals × 1 photo). The role's "coming soon" preview slot already shipped; this package
  generates the art a follow-up task needs to wire in the real photo.
- `06-mountains-biome-animals.md` — Mountains animal art (6 animals × 5 photos). The Mountains are playable
  without photos; this art is the missing piece. Wiring is the "Mountains art and photo wiring" board task.
- `07-safari-biome-animals.md` — Safari animal art (6 animals × 5 photos), same shape as 06. Wiring is the
  "Safari art and photo wiring" board task.
- `08-rainforest-biome-animals.md` — Rainforest animal art (6 animals × 5 photos), same shape as 06/07. Wiring is
  the "Rainforest art and photo wiring" board task.
- `09-desert-biome-animals.md` — Desert animal art (6 animals × 5 photos), same shape as 06-08. Wiring is the "Desert art and photo wiring" board task.
- `10-arctic-biome-animals.md` — Arctic animal art (6 animals × 5 photos), same shape as 06-08. Wiring is the "Arctic art and photo wiring" board task.
- `11-coral-reef-biome-animals.md` — Coral Reef animal art (6 animals × 5 photos), same shape as 06-08. Wiring is the "Coral Reef art and photo wiring" board task.
- `12-wetlands-biome-animals.md` — Wetlands animal art (6 animals × 5 photos), same shape as 06-08. Wiring is the "Wetlands art and photo wiring" board task.
- `13-coastal-biome-animals.md` — Coastal animal art (6 animals × 5 photos), same shape as 06-08. Wiring is the "Coastal art and photo wiring" board task.
- `14-grassland-biome-animals.md` — Grassland animal art (6 animals × 5 photos), same shape as 06-08. Wiring is the "Grassland art and photo wiring" board task.
- `15-taiga-biome-animals.md` — Taiga animal art (6 animals × 5 photos), same shape as 06-08. Wiring is the "Taiga art and photo wiring" board task.
- `16-volcanic-highlands-biome-animals.md` — Volcanic Highlands animal art (6 animals × 5 photos), same shape as 06-08. Wiring is the "Volcanic Highlands art and photo wiring" board task.
- `17-alien-planet-biome-animals.md` — Alien Planet animal art (6 imaginary animals × 5 photos). Wiring is the "Alien Planet art and photo wiring" board task.
