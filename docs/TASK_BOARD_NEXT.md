# Wildlife Explorer — Task Board

> Written for agentic assistants (Claude Code, GitHub Copilot). Read `AI.md` first, then `AGENTS.md`.
> Each task ends with a **Done when** check.
>
> **Rules for this file** (see `AGENTS.md`):
> 1. Holds only **open / planned** work. When a task is DONE, **move it into `CHANGELOG.md`**.
> 2. Solo project today — no single-writer concern yet.
> 3. Commit straight to `main` — no branch-per-task.
>
> Tasks below are reformatted from `CURRENT_CODE_REVIEW.md`'s "Next detailed review priorities" — not
> newly invented. `CURRENT_CODE_REVIEW.md` itself is left as-is (it's this repo's existing milestone
> baseline record, a different purpose than an open-work tracker).

---

> **Format note (2026-07-28):** split from a single `docs/TASK_BOARD.md` into `TASK_BOARD_NOW.md`/`_SOON.md`/`_NEXT.md`/`_SOMEDAY.md` by the existing four bands — see `decisions/2026/D-2026-07-28-wildlife-explorer-task-board-split.md`. Same rules apply to all four files.

---

# 🟡 NEXT — deferred by Scope boundary (see AI.md)

Not started until a later milestone explicitly requires it: full Forest biome expansion, complex quests,
rare Forest animals, companions, inventory, crafting, shops, economy, another playable destination
(Mountains/Lake/Safari/Rainforest/Alien Planet going live).

- **Lake biome art is generated and banked, waiting to be wired in** — `docs/copilot-packages/04-lake-
  biome-animals.md` covers 6 animals (Great Blue Heron, Beaver, Rainbow Trout, Loon, Dragonfly, Painted
  Turtle) × 5 photo variants, proposed across 3 sections (Shoreline / Open Water / Reeds & Shallows). All
  30 images generated 2026-07-25, converted PNG→JPEG (72.7MB→9.0MB, same treatment as Park/Forest) and
  renamed to `<animal-id>-<variant>.jpg`, sitting at `public/assets/lake/` — a dedicated folder, kept
  separate from `public/assets/animals/` (the folder `animalPhotoVariants.ts` actually reads from) so
  nothing is accidentally wired in early. No Lake locations/data model exist yet — this is art prep only,
  ready to convert into real `AnimalId`/`Animal` entries and move into `public/assets/animals/` whenever a
  milestone builds Lake out for real, same pattern as Tutorial Park/Forest's photo-collection mechanic.

Also ideas from README.md's Roadmap section — commitments to a direction, not to a timeline:

- **Advanced photography features** — 2026-07-25 brainstorm gave this concrete shape: replace
  `CameraPanel`'s static button list with a live, animated scene per location where the animal wanders
  in and out of view (rather than always being available to photograph on demand), with a "photo mode"
  timing beat layered on top of the pose-capture mechanic above. By far the biggest of the 2026-07-25
  ideas — deliberately deferred until the smaller wins (facts, quiz, pose-capture) ship first, since it
  needs its own design pass: what renders the "scene" (new per-location art vs. animating existing photo
  art over a simple backdrop), and how animal appearance timing interacts with the pose-capture pulse.
- **Day and night wildlife behaviour** — 2026-07-25 brainstorm: time-of-day/weather selection **inside**
  the (not-yet-built) photo mode above, cosmetic only — it changes the mood/backdrop while framing a shot,
  but which photo variant you get stays random-from-uncollected as it already is (deliberately not tied to
  a real day/night clock or a deterministic variant picker, to avoid undermining the existing "no
  duplicates, surprise reveal" collection design). Depends on the photo-mode rework above existing first.
- Expanded Wildlife Journal features
- Cooperative discovery systems
- Progressive Web App support (full — see the SOMEDAY favicon/manifest split below)

---
