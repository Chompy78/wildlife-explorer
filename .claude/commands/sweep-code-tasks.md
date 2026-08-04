---
description: Work through every low/medium-risk TODO on the task board — pick, execute, commit, repeat
argument-hint: [batch size, e.g. 4]
---

# Wildlife Explorer — sweep the task board's quick, safe work

Unattended version of `/pick-code-task` → `/run-code-task`, looped over eligible tasks. No PR/CI
apparatus — this repo has none yet (see `AGENTS.md`'s *Branch model*).

**Requires `/add-code-task`'s Effort/Risk tags.** `Risk: high` is never eligible.

## Step 1 — get live state

Read `AI.md`, `AGENTS.md`, and `docs/TASK_BOARD_NOW.md`/`_SOON.md`/`_NEXT.md`/`_SOMEDAY.md` directly.

## Step 2 — build the eligible queue

Filter to `Risk: low`/`medium`. Untagged tasks excluded (list in final report). Order: NOW before NEXT,
Effort ascending as tiebreak.

**Batch size:** use `$ARGUMENTS` as the cap only if, after trimming whitespace, it is a **bare positive
integer and nothing else** (e.g. `4`). Any other shape — free-form text that happens to contain a digit
(a version number, an issue reference), multiple numbers, zero, or a negative number — does **not** count
as "includes a number"; treat it the same as no number given. If not, ask once via `AskUserQuestion` —
"How many tasks should this sweep attempt?" with a recommended default around 3-5 and an option for a
custom number — before doing anything else. This is the only prompt this skill makes to the user;
everything after this point runs unattended.

If zero eligible, say so and stop.

## Step 3 — execute each task in the queue

Consecutive-failure counter starting at 0. A "failure": bigger-than-expected scope, `npm run check`
failing and not quickly fixable, or a Canon/Scope-boundary violation found during manual verification.
**If the counter reaches 2, stop the sweep immediately.**

For each task: do the work (`/run-code-task` Step 2), verify (`npm run check` **plus** manual Canon/
Scope-boundary check for anything gameplay-touching — this is not optional even for `Risk: low` tasks
if the task touches game state), commit and push (`/run-code-task` Step 4: `git pull --rebase` before
push, exact files only). Mark done, reset counter, continue.

If a task turns out bigger than expected, drop it (leave the task-board entry alone) and count it toward
the circuit breaker. **Check the circuit breaker first:** if this drop just brought the counter to 2, stop
per this step's rule instead of backfilling. Otherwise, pull the next eligible task from the remaining
queue (same NOW-before-NEXT, Effort-ascending order from Step 2) so the number of tasks actually attempted
stays at or near the requested batch size instead of silently shrinking. Note in the final report whenever
a backfill happened.

## Step 4 — new tasks discovered mid-sweep

Format new work in `/add-code-task`'s house format (including Effort/Risk, self-classified), commit directly
to `main` — skip the clarifying-questions/approval-wait steps, this skill runs unattended by design. If
it clears the Risk bar, fold into this run's queue.

**Before pushing:** `git pull --rebase` first. If the push is rejected as non-fast-forward, pull --rebase
and retry once. If it still fails, note in the final report that this new task's entry didn't land, rather
than losing it silently.

## Step 5 — final report

Table: task · effort/risk · outcome · new tasks discovered. List untagged tasks skipped. Note if the
circuit breaker triggered.

## Step 6 — log the run

Append to `docs/sweep-log.md` (create if needed, `CHANGELOG.md`-style, newest on top): date, batch size,
outcomes, circuit-breaker status. Commit directly to `main` as `docs(sweep-log): record sweep run <date>`,
using the same pull --rebase-first, retry-once-on-rejection care as Step 4 — don't restate it, follow it.
If it still fails after the retry, surface that in your final reply to the user (Step 5's report has
already been delivered by this point in the run, so it can't carry this failure), so the run record isn't
silently lost.

---

$ARGUMENTS
