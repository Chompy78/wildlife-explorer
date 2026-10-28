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
"Class/role skills" graduated same-day too — see `D-2026-07-28-explorer-role-bonuses`. A real follow-up
was logged from that work: `docs/copilot-packages/05-bonus-photo-variants.md`'s Track B (wiring the
Wildlife Photographer's bonus 6th photo in for real once its art lands) is not yet a task-board entry —
add one when that art is generated.
"Day/night mood in the Camera panel" graduated to `CHANGELOG.md` 2026-10-28.

---

## Mountains art and photo wiring — TODO
Generate 30 Mountains photos (6 animals x 5) and wire them in so Mountains gets the same collection, reveal and facts as Park, Forest and Lake.
**Effort:** medium · **Risk:** low — additive: animals already exist and work without photos; only the art counts and the fact lists are added.

```text
1. Art brief is written: docs/copilot-packages/06-mountains-biome-animals.md. Hand it to Copilot.
2. Generate 5 square variants per animal; convert PNG -> JPEG; name <animal-id>-<n>.jpg in public/assets/animals/.
3. Add each id with count 5 to PHOTO_VARIANT_COUNTS in src/data/animalPhotoVariants.ts.
4. Add 5 facts per animal to ANIMAL_FACTS in src/data/animalFacts.ts (NOT BONUS_FACTS).
5. Update the App test in src/App.test.tsx that expects no photo dialog for the Marmot (the table-driven
   biomeState.test.ts already handles animals with photos).
```

**Done when:** all six Mountains animals reveal a photo and a fact when photographed, and `npm run check` passes.

## Safari art and photo wiring — TODO
Generate 30 Safari photos (6 animals x 5) and wire them in, same as the Mountains task.
**Effort:** medium · **Risk:** low — additive: the animals already work without photos.

```text
1. Art brief is written: docs/copilot-packages/07-safari-biome-animals.md. Hand it to Copilot.
2. Generate 5 square variants per animal; convert PNG -> JPEG; name <animal-id>-<n>.jpg in public/assets/animals/.
3. Add each id with count 5 to PHOTO_VARIANT_COUNTS (src/data/animalPhotoVariants.ts).
4. Add 5 facts per animal to ANIMAL_FACTS (src/data/animalFacts.ts, NOT BONUS_FACTS).
5. No test change needed; biomeState.test.ts handles animals with photos.
```

**Done when:** all six Safari animals reveal a photo and a fact when photographed, and `npm run check` passes.

---

---
