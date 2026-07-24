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
- **Task-board format**: each package ends with a "Done when" block written in this repo's
  `docs/TASK_BOARD.md` task format (see `AGENTS.md`), so finished work graduates into `CHANGELOG.md` the
  same way any other task does.
- **Track B may need to fall back to Claude.** Package 01 found that Copilot 365 Chat couldn't reliably
  complete a small, fully-specified multi-file code change — Claude implemented it directly instead.
  Later packages plan for that as the likely outcome rather than a surprise; Track A (art, which Claude
  can't do) stays Copilot's job either way.

## Index

- `01-biome-backgrounds.md` — Park and Forest screen hero visuals, matching the Camper screen's existing
  pattern. Done (2026-07-25).
- `02-animal-portraits.md` — real portrait art for all 11 animals, replacing emoji in the Wildlife
  Journal, Camera Panel, Photo Wall, and Forest photo buttons.
