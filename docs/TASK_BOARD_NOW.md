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

# 🔴 NOW — Milestone 5 review priorities

All five 2026-07-20 review priorities are graduated to `CHANGELOG.md` as of 2026-07-21's sweep.
"Photo Mode: animals wander in and out of frame" graduated to `CHANGELOG.md` same-day (2026-07-28) — see
`DECISIONS.md`'s `D-2026-07-28-photo-mode-wandering-animals`. "Blur reflects photo timing, with
per-animal difficulty" graduated same-day too — see `D-2026-07-28-timed-blur-and-photo-difficulty`.

---

## Class/role skills — first real bonus per role — TODO
`RoleSelect.tsx` picks from 6 roles but every bonus is placeholder text ("No role is the best choice");
`selectedRole` is saved but only used to mark onboarding done. Wire in a first real, small,
roughly-equal bonus per role, each hooked into an existing mechanic rather than a new one.
**Effort:** medium · **Risk:** medium — ambiguity (tuning "roughly equal" bonuses across very different
systems), touches several small gameplay surfaces at once though each hook individually is low-risk, no
save-schema change

```text
1. Zoologist: an extra bonus fact tidbit appears after just the first photo of a species, ahead of the
   normal fact-per-variant schedule (src/data/animalFacts.ts / the photo-reveal fact lookup).
2. Wildlife Photographer: a slightly longer Great-Shot glow window than the animal's base
   photoDifficulty would normally give (see `PULSE_DURATIONS` in `CameraPanel.tsx`, shipped by
   `D-2026-07-28-timed-blur-and-photo-difficulty`).
3. Conservation Ranger: nearby location clues (src/components/LocationClues.tsx) are a touch more
   specific/descriptive; consider a gentler hint on the non-native-species habitat quiz.
4. Explorer: hidden locations (e.g. Whisper Grove) or the Discover panel reveal a bit sooner or with
   more detail.
5. Animal Researcher: rare animals (e.g. Rare Owl) get an easier photoDifficulty tier specifically for
   this role - the deliberate place where rarity and photo-difficulty bridge, kept out of the core
   system so it stays this role's unique bonus rather than a universal rule.
6. Custom Character: no fixed bonus for now - its own description already flags it as a future
   pick-your-own-perk slot, not resolved by this task.
7. Thread `saveData.selectedRole` into whichever small helper functions each hook above touches (facts
   lookup, camera glow duration, clue text, discover detail, difficulty lookup) - a simple
   role-id-to-modifier lookup per hook, not a generic "skill system" abstraction (no engine needed for
   six small, distinct nudges).
8. Manually verify each role's bonus is visible and Canon-safe (no combat/competitive edge, none reads
   as strictly better than another) in a real browser.
```
**Done when:** all 5 non-Custom-Character roles have one working, verifiable bonus tied to their
description, `npm run check` passes, and it's verified in a real browser.

---
