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

# 🟠 SOON — housekeeping, process and QA gaps

Found during a 2026-07-20 project status review — not blocked by the Scope boundary, just not done yet.


## Add a second non-native animal per biome — TODO
The invasive-species habitat quiz shipped 2026-07-25 with one non-native animal per playable biome
(Red-eared Slider Turtle at Duck Pond, Cane Toad at Forest Trail/Fern Trail). The user said "at least one
... maybe even two" — a second one per biome was deferred to prove the mechanic first.
**Effort:** low · **Risk:** low — same established pattern (`Animal.nonNative`, `HabitatQuiz.tsx`,
`reportedInvasiveSpecies`), no new architecture, just more data entries.

```text
1. Pick two more real, kid-friendly, non-predator-framed invasive species (avoid describing hunting/
   harm-to-other-animals directly, per the precedent set by the Slider Turtle/Cane Toad picks — stick to
   competition-for-resources or toxicity-if-eaten framing) — one for Tutorial Park, one for Forest.
   Grey Squirrel (Open Meadow, correct answer: Forest) was already suggested for Park as an easy pick.
2. Add each as a new AnimalId + Animal entry (with nonNative.correctHabitatId/impactNote) following the
   exact pattern of red-eared-slider/cane-toad in src/data/animals.ts.
3. Add the Forest one to forestAnimalIds in forestState.ts if applicable.
4. Add both ids to validAnimals in saveMigration.ts.
5. Run npm run check; verify the quiz and Journal note for both in a real browser.
```
**Done when:** two more animals are photographable, trigger the habitat quiz correctly, and
`npm run check` passes.


## Decide whether to introduce a PR-gated workflow — TODO
Now that CI (`npm run check` via GitHub Actions) is wired up, `DECISIONS.md`'s `D-2026-07-21-branch-model`
"CI gets added" revisit trigger has fired (see `D-2026-07-21-ci-added`) — decide whether to keep
committing straight to `main` or introduce a PR-gated workflow.
**Effort:** low · **Risk:** medium — a process/workflow decision, not a code change; the ambiguity is
real (no single objectively-correct answer) even though nothing here touches gameplay/save-schema.

```text
1. Present tiered options to the user: (A) keep commit-straight-to-main (no PR gate) - matches current
   solo-dev, low-friction practice; CI now catches regressions either way. (B) introduce a PR-gated
   workflow - CI-required checks before merge, meaningful once a second contributor or higher-stakes
   changes become more likely.
2. Get an explicit decision from the user; do not auto-decide.
3. Log the outcome as a DECISIONS.md entry and update AGENTS.md's Branch model section to match.
```
**Done when:** the user has explicitly chosen an option; `AGENTS.md` and `DECISIONS.md` reflect it.

---
