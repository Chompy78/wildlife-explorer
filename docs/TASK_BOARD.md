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

All five 2026-07-20 review priorities are graduated to `CHANGELOG.md` as of 2026-07-21's sweep.

---

# 🟠 SOON — housekeeping, process and QA gaps

Found during a 2026-07-20 project status review — not blocked by the Scope boundary, just not done yet.


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
