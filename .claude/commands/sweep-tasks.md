---
description: Work through every low/medium-risk TODO on the task board — pick, execute, commit, repeat
argument-hint: [batch size, e.g. 4]
---

# Wildlife Explorer — sweep the task board's quick, safe work

Unattended version of `/pick-task` → `/run-task`, looped over eligible tasks. No PR/CI apparatus — this
repo has none yet (see `AGENTS.md`'s *Branch model*).

**Requires `/add-task`'s Effort/Risk tags.** `Risk: high` is never eligible.

## Step 1 — get live state

Read `AI.md`, `AGENTS.md`, and `docs/TASK_BOARD_NOW.md`/`_SOON.md`/`_NEXT.md`/`_SOMEDAY.md` directly.

## Step 2 — build the eligible queue

Filter to `Risk: low`/`medium`. Untagged tasks excluded (list in final report). Order: NOW before NEXT,
Effort ascending as tiebreak.

**Batch size:** `$ARGUMENTS` if a bare positive integer, else ask once via `AskUserQuestion` (default
around 3-5) before doing anything else — the only prompt this skill makes.

If zero eligible, say so and stop.

## Step 3 — execute each task in the queue

Consecutive-failure counter starting at 0. A "failure": bigger-than-expected scope, `npm run check`
failing and not quickly fixable, or a Canon/Scope-boundary violation found during manual verification.
**If the counter reaches 2, stop the sweep immediately.**

For each task: do the work (`/run-task` Step 2), verify (`npm run check` **plus** manual Canon/
Scope-boundary check for anything gameplay-touching — this is not optional even for `Risk: low` tasks
if the task touches game state), commit and push (`/run-task` Step 4: `git pull --rebase` before push,
exact files only). Mark done, reset counter, continue.

If a task turns out bigger than expected, drop it (leave the task-board entry alone), count toward the
circuit breaker, move on.

## Step 4 — new tasks discovered mid-sweep

Format new work in `/add-task`'s house format (including Effort/Risk, self-classified), commit directly
to `main` — skip the clarifying-questions/approval-wait steps, this skill runs unattended by design. If
it clears the Risk bar, fold into this run's queue.

## Step 5 — final report

Table: task · effort/risk · outcome · new tasks discovered. List untagged tasks skipped. Note if the
circuit breaker triggered.

## Step 6 — log the run

Append to `docs/sweep-log.md` (create if needed, `CHANGELOG.md`-style, newest on top): date, batch size,
outcomes, circuit-breaker status. Commit directly to `main` as `docs(sweep-log): record sweep run <date>`.

---

$ARGUMENTS
