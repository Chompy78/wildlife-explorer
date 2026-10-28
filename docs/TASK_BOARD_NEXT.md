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
(Mountains/Safari/Rainforest/Alien Planet going live). The Lake went live 2026-10-28 and day/night mood shipped the same day - both graduated to `CHANGELOG.md`.


Also ideas from README.md's Roadmap section — commitments to a direction, not to a timeline:

- **Advanced photography features** — 2026-07-25 brainstorm gave this concrete shape: replace
  `CameraPanel`'s static button list with a live, animated scene per location where the animal wanders
  in and out of view. The smaller wins it was waiting on (facts, quiz, pose-capture) have all shipped,
  and the first slice (animal wandering in/out of frame, composed with the existing pose-capture pulse)
  is now promoted to `docs/TASK_BOARD_NOW.md`'s "Photo Mode: animals wander in and out of frame" task —
  see there for the concrete implementation plan. The bigger day/night layer below stays deferred.
- Expanded Wildlife Journal features
- Cooperative discovery systems
- Progressive Web App support (full — see the SOMEDAY favicon/manifest split below)

---
