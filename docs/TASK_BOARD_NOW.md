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
`DECISIONS.md`'s `D-2026-07-28-photo-mode-wandering-animals`.

---

## Blur reflects photo timing, with per-animal difficulty — TODO
Today's photo blur (`src/data/photoQuality.ts`) is driven only by a per-species practice count — the
existing "Great Shot!" glow-timing bonus has zero effect on how clear the photo looks. Redesign so
timing matters (encourages retrying to nail the glow) while keeping the encouraging practice-count
progression as a floor, and give each animal its own glow difficulty instead of one shared global timer.
**Effort:** medium-high · **Risk:** medium — ambiguity in tuning difficulty values per animal, no
save-schema change, stays within Canon (no harsh failure — see steps below)

```text
1. Add a `photoDifficulty: 'easy' | 'medium' | 'hard'` field to the `Animal` type
   (src/types/Animal.ts) and assign a value to every existing animal in src/data/animals.ts, roughly by
   its `behaviours` flavor (calm/stationary animals like Duck/Rabbit/Frog = easy; twitchy/fast ones like
   Butterfly/Rare Owl = hard; everything else = medium). Map each tier to a glow on/off duration pair
   (easy = longer glow, shorter dark gap; hard = short glow, longer dark gap) - keep a safe minimum glow
   window so "hard" never tips into feeling unfair for younger players.
2. Move the glow-pulse timer in CameraPanel.tsx from one global `posePulse` boolean into the same
   per-animal loop structure Photo Mode already added for the in-frame gate: each animal's own loop
   tracks its in-frame presence AND, only while in frame, its own glow on/off cycle using its
   photoDifficulty-derived durations. Replace the single `posePulse` state with a per-animal record,
   mirroring the existing `inFrame` state shape.
3. Update `getPhotoQualityStyle` (src/data/photoQuality.ts) to take both `photographCount` (today's
   4-tier floor, unchanged) and `greatShot` (this specific shot's timing hit): a Great Shot nudges the
   displayed tier one step sharper than the floor; missing the glow nudges it one step blurrier -
   clamped so it's never sharper than "Crisp and sharp!" or blurrier than the bottom tier. Wire the
   already-flowing `greatShot` value (PhotoReveal already receives it, just doesn't use it for blur yet)
   into this call in PhotoReveal.tsx.
4. Reduced-motion: Photo Mode's existing in-frame-always-true fallback is unaffected. Confirm the glow's
   box-shadow pulse is a transition/animation (not a transform/movement) so the repo's existing global
   prefers-reduced-motion CSS rule (collapses animation/transition durations) already neutralizes it
   without extra logic.
5. Update CameraPanel.component.test.tsx: the two existing pulse tests assumed one global 900ms/1500ms
   cycle - adapt to the duck's assigned difficulty tier's actual durations. Add photoQuality.test.ts
   cases for the greatShot-modifier clamping (floor tier 0 + miss stays at 0, floor tier 3 + great shot
   stays at 3, a middle tier shifts by exactly one step either way).
6. Manually verify in a real browser: an easy animal's glow is noticeably more forgiving than a hard
   animal's, and a Great Shot vs. a missed-glow photo visibly differ in blur on the reveal screen.
```
**Done when:** blur responds to this shot's timing (not just practice count), animal difficulty visibly
varies the glow window, `npm run check` passes, and it's verified in a real browser.

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
   photoDifficulty would normally give (depends on the blur/difficulty task above landing first) - or,
   if that hasn't landed yet, the practice-count floor rises one tier faster for this role.
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
