# Wildlife Explorer — Session Log

**Session date:** 20 July 2026
**User:** John Chow
**Session:** Claude Code on the web, branch `claude/project-status-review-26absr`

## AI Quick Summary

This session ran a full status review of the repo, verified the Milestone 5 baseline actually builds
and passes as documented, discovered mid-session that a separate local session had ported PACT's
`AGENTS.md` workflow scaffold directly onto `main`, and expanded `docs/TASK_BOARD.md` with 21
previously-untracked items surfaced by the review.

## What we did

1. **Full status review.** Read `AI.md`, `START_HERE.md`, `README.md`, `CURRENT_CODE_REVIEW.md`,
   `MILESTONE_5_NOTES.md`, and the existing session log, then independently verified the claims: ran
   `npm install`, `npm run typecheck`, `npm run test` (7 files / 18 tests), `npm run build`, and
   `npm run check:encoding`. All passed, matching the documented Milestone 5 baseline exactly.
2. **Corrected a mid-session reporting error.** The first status report incorrectly said `AI.md` was
   empty; re-verification with `git show` confirmed `AI.md` had the full Milestone 5 content all along —
   `CHANGELOG.md` was the file that was actually empty. Caught and corrected once challenged.
3. **Discussed whether the existing documentation scaffold (AI.md, START_HERE.md, the Base64 restart-pack
   workflow described in the existing session log) was worth keeping.** Conclusion: the durable rules
   (Canon, Scope boundary, verification command) are valuable and should stay; the Base64/tar.exe
   restart-pack machinery was solving a problem specific to the old no-repo-access workflow and is pure
   overhead now that Claude Code has direct git access.
4. **Discovered the AGENTS.md scaffold port.** When asked to reassess and look for an `AGENTS.md`,
   `git fetch` showed `origin/main` had moved 2 commits ahead of this session's branch: a new session
   log (`SESSION_LOG_2026-07-19.md`) and a full port of PACT's AI-agent workflow scaffold — `AGENTS.md`,
   `CLAUDE.md`, `.github/copilot-instructions.md`, `DECISIONS.md`, `docs/TASK_BOARD.md`, 7
   `.claude/commands/*.md` skills, and a session-start hook. Fast-forwarded this session's branch onto
   `origin/main` to pick it up — a clean fast-forward since this branch had no commits of its own yet.
5. **Compiled a 21-item punch list** of things missing from `docs/TASK_BOARD.md`: housekeeping found
   during the review (a critical `npm audit` vulnerability in vitest, a stale `README.md.txt`, lockfile
   drift on a clean install, a session-log naming inconsistency), process gaps the new `AGENTS.md`
   scaffold itself surfaced (a real conflict between its "commit straight to `main`" decision and this
   session's own branch-pinned instructions, the CI-wiring revisit trigger it already flags, unverified
   ported `.claude/commands`, an undecided browser-test tooling choice, missing corrupted-save test
   coverage, missing per-milestone notes files for 3.2/4.0/4.1), README's existing Roadmap ideas that had
   never been itemized on the board, and longer-term someday ideas (hosting, a privacy statement, PWA
   manifest, i18n, audio).
6. **Added all 21 items to `docs/TASK_BOARD.md`** in three sections: a new 🟠 SOON tier for the
   actionable items, itemized bullets under the existing 🟡 NEXT tier for the Roadmap ideas, and a new
   🟢 SOMEDAY tier for the long-horizon ideas. Ran `npm run check` (docs-only change, still passed),
   committed, and pushed to `claude/project-status-review-26absr` (commit `afee9e5`).

## Decisions made

- Followed this session's branch-pin instruction rather than pushing straight to `main` per
  `AGENTS.md`'s existing `D-2026-07-20-branch-model` decision, and logged the conflict as a
  `docs/TASK_BOARD.md` item instead of resolving it unilaterally. See `DECISIONS.md`'s
  `D-2026-07-20-web-session-branch-override`.

## New tasks discovered

All 21 — see `docs/TASK_BOARD.md`'s 🟠 SOON, 🟡 NEXT, and 🟢 SOMEDAY sections added this session.

## Blockers

None. The one open question — which branch-model convention actually governs day-to-day work — is
tracked as a SOON task-board item, not a blocker to further work.

## Next session should start with

- Resolving the branch-model conflict (`docs/TASK_BOARD.md`'s "Reconcile branch-model conflict" item) —
  decide whether `claude/project-status-review-26absr` (currently ahead of `main` by this session's
  commits) should be merged/PR'd into `main`, since `main` doesn't yet reflect the task-board expansion.
- Whichever 🔴 NOW or 🟠 SOON item gets picked next; the critical vitest audit vulnerability is the most
  time-sensitive of the SOON items.
