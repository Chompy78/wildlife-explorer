# D-2026-07-28-wildlife-explorer-task-board-split — Split docs/TASK_BOARD.md into NOW/SOON/NEXT/SOMEDAY

- **Context:** `docs/TASK_BOARD.md` (35KB) was split by its existing four bands (🔴 NOW, 🟠 SOON, 🟡 NEXT,
  🟢 SOMEDAY — this project's own band names, not the generic NOW/NEXT/LATER used elsewhere) into
  `TASK_BOARD_NOW.md`/`_SOON.md`/`_NEXT.md`/`_SOMEDAY.md`. This was meant to happen alongside
  `DECISIONS.md`'s own split to `decisions/2026/D-*.md` (`D-2026-07-21-scaffold-port` /
  `ec1cc5f`/`ff2d9ef`) but was missed at the time — caught during a cross-project verification sweep.
- **Options:** (i) leave `docs/TASK_BOARD.md` as a single file, now inconsistent with DECISIONS.md's
  already-split shape and with every other project this scaffold was ported to; (ii) split it now,
  reusing the same pattern.
- **Decision:** (ii).
- **Why:** No reason to leave one half of the pair migrated and the other not — DECISIONS.md's index
  already assumes the split-file convention is this repo's standard going forward. Every `.claude/
  commands/*.md` file's `docs/TASK_BOARD.md` references were updated to the new band-file names in the
  same change (they had not yet been hardened to check for either shape, unlike PACT's own commands).
- **Status:** Active. Verified every line of the original file's content is preserved verbatim across
  the four new files before removing `docs/TASK_BOARD.md`.
