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

# 🔴 NOW — Milestone 5 review priorities

## Browser-level travel and Continue restoration tests — TODO
Forest travel and the Continue-game flow need real browser-level verification, not just unit tests.
**Effort:** medium · **Risk:** medium — damage likelihood is medium (nothing automated currently proves
Continue restores the correct play area after Forest travel; `npm run check`'s existing tests may not
cover this specific path — verify before assuming they do).

```text
1. Check what testing/tests currently cover for travel + Continue restoration (search src/ for existing
   test files touching this).
2. Add browser-level (or expanded unit-level, if that's this repo's actual practice) tests for: Forest
   travel completing correctly, Continue restoring the correct lastPlayArea after Forest travel.
3. Run npm run check.
```
**Done when:** Forest travel and Continue-after-Forest-travel are covered by a real, passing test;
`npm run check` passes.

## New game and reset edge cases after Forest travel — TODO
**Effort:** medium · **Risk:** medium — same reasoning: save-schema/state edge cases are exactly what
`npm run check`'s existing suite may not yet cover for the newest (Forest) content.

```text
1. Identify what "new game" and "reset" actually do to persisted state (check saveMigration.ts /
   saveDefaults.ts per MILESTONE_5_NOTES.md's architecture).
2. Test: starting a new game after having visited Forest; resetting after Forest travel. Confirm no
   stale Forest state leaks into a fresh game.
3. Run npm run check.
```
**Done when:** both edge cases have a passing test; `npm run check` passes.

## Responsive Forest layout review — TODO
**Effort:** low · **Risk:** low — visual/CSS review, `npm run check`'s build step plus manual check
catches regressions; no state/save-schema risk.

```text
1. Manually review Forest Arrival and Fern Trail screens at mobile and desktop widths.
2. Fix any layout issues found, following the same responsive patterns already used for the Wild Camper
   (per MILESTONE_5_NOTES.md's "Keyboard focus handling, responsive styling and reduced-motion support").
```
**Done when:** Forest screens verified responsive at both widths; `npm run check` passes.

## Keyboard and screen-reader review of Forest interactions — TODO
**Effort:** low · **Risk:** low — the reusable modal-focus-hook pattern already exists (see
MILESTONE_5_NOTES.md / the Camper's accessibility work) — this is applying/verifying an established
pattern, not designing a new one.

```text
1. Manually keyboard-navigate Forest Arrival and Fern Trail interactions.
2. Check screen-reader announcements match the pattern already used for Camper/Journal (live status
   messages, focus trapping where a dialog is involved).
3. Fix any gaps against that existing pattern.
```
**Done when:** Forest interactions keyboard/screen-reader verified against the existing accessibility
pattern; `npm run check` passes.

## Ensure non-Forest destinations remain preview-only — TODO
A Canon/Scope-boundary check, not a feature — see `AI.md`'s Scope boundary: Mountains, Lake, Safari,
Rainforest and Alien Planet must stay preview-only.
**Effort:** low · **Risk:** medium — damage likelihood is medium (this is exactly the kind of thing
`npm run check` won't catch — it's a design-intent check, not a type/test/build check).

```text
1. Audit every non-Forest destination card/route for any way a player could actually enter it (not just
   preview it) — a regression here would violate AI.md's Canon, not just be a bug.
2. Fix any found; add a regression test if the codebase's testing patterns support it cleanly.
```
**Done when:** manually confirmed no non-Forest destination is enterable; `npm run check` passes.

---

# 🟡 NEXT — deferred by Scope boundary (see AI.md)

Not started until a later milestone explicitly requires it: full Forest biome expansion, complex quests,
rare Forest animals, companions, inventory, crafting, shops, economy, another playable destination
(Mountains/Lake/Safari/Rainforest/Alien Planet going live).
