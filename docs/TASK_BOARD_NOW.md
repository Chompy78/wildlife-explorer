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

---

## Day/night mood in the Camera panel — TODO
Add a cosmetic Day / Dusk / Night mood picker to `CameraPanel.tsx` (new `src/data/timeOfDay.ts`).
**Effort:** low · **Risk:** low — UI-only, held in component state (not saved), so no save-schema change; photo-variant selection and Great Shot timing are untouched, which keeps the "no duplicates, surprise reveal" collection design intact.

```text
1. Create src/data/timeOfDay.ts: type TimeOfDay = 'day' | 'dusk' | 'night'; a moods list (id, label, icon,
   one-line description); and isActiveAt(animal, time) matching Animal.activeTime text, used only to show a
   small "Most active now" note.
2. In CameraPanel.tsx add a three-button mood picker (aria-pressed) and a mood class on .camera-card.
   Keep state local. Do NOT change onPhotographAnimal, pickRandomUncollectedVariant or FOCUS_TUNING.
3. Add .camera-card.mood-dusk / .mood-night styles in src/styles.css (calm tints, readable contrast).
4. Add tests: picker switches mood; photographing still calls onPhotographAnimal identically in every mood.
```

**Done when:** the picker changes the panel mood, photo results are unaffected by mood, and `npm run check` passes.

---
