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

# 🟠 SOON — housekeeping, process and QA gaps

Found during a 2026-07-20 project status review — not blocked by the Scope boundary, just not done yet.

## Fix critical vitest audit vulnerability — TODO
`npm audit` reports a critical advisory for `vitest <4.1.0` (arbitrary file read/execute when the Vitest
UI server is listening). `npm audit fix --force` would install `vitest@4.1.10`, outside the currently
pinned range.
**Effort:** low · **Risk:** medium — damage likelihood is low (UI server isn't used in this workflow),
but a version bump outside the stated range could shift test behavior — verify `npm run check` still
passes cleanly, not just that the install succeeds.

```text
1. Run npm audit for full advisory detail.
2. Upgrade vitest (and any peer deps it drags along) to a patched version.
3. Run npm run check; fix any test-runner behavior changes the bump introduces.
```
**Done when:** `npm audit` shows no critical vulnerabilities; `npm run check` passes.

## Remove stale README.md.txt — TODO
Leftover pre-cleanup draft of `README.md` from the Base64 transfer era, not referenced anywhere.
**Effort:** low · **Risk:** low — pure deletion of an unreferenced file.

```text
1. Confirm nothing references README.md.txt (grep the repo).
2. Delete it.
```
**Done when:** file is removed; `npm run check` passes.

## Regenerate a clean package-lock.json — TODO
A fresh `npm install` on a clean clone currently produces a lockfile diff, meaning the committed lockfile
isn't perfectly reproducible.
**Effort:** low · **Risk:** low — dependency-resolution only, no source change.

```text
1. Delete node_modules and package-lock.json.
2. Run npm install fresh.
3. Confirm npm run check passes and commit the regenerated lockfile.
```
**Done when:** a clean `npm install` from the committed lockfile produces no diff.

## Normalize session-log file naming — TODO
`docs/sessions/SESSION_LOG_2026-07-19.md` lacks the `WILDLIFE_EXPLORER_SESSION_LOG_` prefix used by the
other two session-log files.
**Effort:** low · **Risk:** low — a rename, no content change.

```text
1. Rename docs/sessions/SESSION_LOG_2026-07-19.md to match the WILDLIFE_EXPLORER_SESSION_LOG_ convention.
2. Check for and update any links to the old filename.
```
**Done when:** all files under docs/sessions/ follow one naming convention.

## Wire npm run check into CI — TODO
Logged as an explicit revisit trigger in `DECISIONS.md`'s `D-2026-07-21-branch-model`: a working
`npm run check` gate already exists, so adding GitHub Actions CI is a small lift, and would make a
PR-gated workflow worth the overhead.
**Effort:** low · **Risk:** low — additive CI config, doesn't change application behavior.

```text
1. Add a GitHub Actions workflow that runs npm ci && npm run check on push/PR.
2. Confirm it passes on the current main.
```
**Done when:** CI runs `npm run check` automatically and is green on `main`.

## Verify the ported .claude/commands actually work here — TODO
`add-task`, `close-session`, `cold-plan-review`, `log-lesson`, `pick-task`, `run-task`, `sweep-tasks`
were ported from `chompy78/PACT` in the 2026-07-21 scaffold port but haven't been exercised against this
repo's actual `docs/TASK_BOARD.md` format or session-log convention yet.
**Effort:** medium · **Risk:** low — using an assistant command, not touching game code.

```text
1. Run each ported command at least once against this repo's real files.
2. Fix any assumptions that don't match this repo's conventions (task format, file naming, etc.).
```
**Done when:** all 7 commands have been run at least once here without producing wrong output.

## Add a favicon — TODO
`index.html` has no favicon at all.
**Effort:** low · **Risk:** low — presentation only.

```text
1. Add a favicon asset and link it from index.html.
```
**Done when:** the browser tab shows a favicon in dev and in the production build.

## Decide on browser-level test tooling — TODO
The existing "Browser-level travel and Continue restoration tests" NOW item doesn't specify what runs
those tests. Playwright is already available in this environment.
**Effort:** low · **Risk:** low — a tooling decision, not an implementation.

```text
1. Decide whether Playwright (or another tool) is adopted for browser-level tests.
2. Document the choice (README.md's Validation Commands, or AGENTS.md) and add the relevant script.
```
**Done when:** a browser-level test tool is chosen, documented, and runnable via an npm script.

## Add test coverage for corrupted/malformed save data — TODO
`saveMigration.ts` defensively handles missing/malformed fields, but no test currently feeds it fully
garbage input (wrong types, unexpected shape, non-object JSON) to confirm the fallbacks actually hold.
**Effort:** low · **Risk:** medium — damage likelihood is medium; a silent migration bug here would
corrupt a player's save, which `npm run check`'s current suite may not catch.

```text
1. Add tests feeding migrateSaveData garbage/malformed/non-object input.
2. Confirm it always returns a valid, safe SaveData shape.
```
**Done when:** malformed-save-input tests exist and pass; `npm run check` passes.

## Backfill missing milestone-notes files — TODO
Only `MILESTONE_5_NOTES.md` exists in-repo; Milestones 3.2, 4.0 and 4.1 notes currently live only in
`docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md`, not as their own files.
**Effort:** low · **Risk:** low — documentation backfill, no behavior change.

```text
1. Extract the Milestone 3.2 / 4.0 / 4.1 sections from the existing session log.
2. Write MILESTONE_3_2_NOTES.md, MILESTONE_4_0_NOTES.md, MILESTONE_4_1_NOTES.md following
   MILESTONE_5_NOTES.md's format.
```
**Done when:** each shipped milestone has its own notes file, consistent with MILESTONE_5_NOTES.md.

---

# 🟡 NEXT — deferred by Scope boundary (see AI.md)

Not started until a later milestone explicitly requires it: full Forest biome expansion, complex quests,
rare Forest animals, companions, inventory, crafting, shops, economy, another playable destination
(Mountains/Lake/Safari/Rainforest/Alien Planet going live).

Also ideas from README.md's Roadmap section — commitments to a direction, not to a timeline:

- Advanced photography features
- Expanded Wildlife Journal features
- Cooperative discovery systems
- Day and night wildlife behaviour
- Progressive Web App support (full — see the SOMEDAY favicon/manifest split below)

---

# 🟢 SOMEDAY — long-term, no current plan

Not urgent, not scheduled, but worth keeping on record so they aren't lost.

- **Deployment/hosting configuration** — no hosting target (Pages, Vercel, etc.) is defined yet; matters
  once this needs to reach an actual child player rather than just `npm run dev`.
- **Privacy/data-handling statement** — all state is currently local-storage only (good, low risk), but
  given the target audience (ages 8-14, families) a short written statement that no data leaves the
  device would be worth having before this is ever made public, and especially before any cloud-save
  feature is considered.
- **PWA manifest and install icons** — the full Progressive Web App roadmap item, beyond just the
  favicon housekeeping task above.
- **Localization / i18n** — not mentioned anywhere; only relevant if the game grows beyond English.
- **Sound/audio system** — no audio exists or is planned; a natural fit for a calm nature game
  eventually, but genuinely not started.
