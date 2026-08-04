# D-2026-07-29-sweep-tasks-queue-and-push-hardening — Port 2 more of PACT's 15 sweep-tasks review fixes: backfill on drop, rebase-before-push

- **Context:** Following up on `D-2026-07-29-sweep-tasks-arguments-hardening` (which ported 1 of 15 fixes
  from PACT's `D-GH-2026-07-17-sweep-tasks-review-fixes`), checked the remaining 14 against
  wildlife-explorer's `sweep-tasks.md` directly, rather than assuming they're all PACT-specific:
  - **11 confirmed not applicable**, verified by reading the actual current files, not just inferred:
    worktree leak/cleanup and stale-branch-name fixes (no worktrees here — `run-task.md` explicitly has
    none); pre-flight branch-existence check for newly-discovered tasks (no per-task branches; `pick-
    task.md` already states "no concurrent-session collision risk today"); review-tier bump to `ultra` and
    PR-number-capture (no code-review-tier step or PRs in this flow); diff-size-check mechanical-batch
    exception (no diff-size check exists here); Ambiguity-High cross-tool-migration naming (this is a
    single app, not PACT's three parallel UI tools); `TaskList` stuck-at-`in_progress` fix (this
    `sweep-tasks.md` doesn't use `TaskCreate`/`TaskList` at all, so there's no state machine to get stuck).
  - **2 genuine analogs found, both orthogonal to the worktree/PR machinery:**
    1. Step 3's drop-on-bigger-than-expected path had no backfill — same shape as PACT's original bug,
       where a dropped/parked task silently shrinks the actually-attempted count below the requested
       batch size.
    2. Steps 4 and 6 (new-task-discovered and sweep-log commits, both direct-to-`main`) had no
       pull-before-push or retry-on-rejection discipline — Step 3's task commits already delegate this to
       `/run-task`'s Step 4 (`git pull --rebase` before push), but Steps 4 and 6 never restated or
       inherited that care for their own direct commits.
  - **1 checked and correctly left alone:** cross-file step-number references (`/run-task` Step 2/Step 4
    cited from `sweep-tasks.md`) were checked against the actual current step numbering in `run-task.md`
    and found accurate — no drift, unlike PACT's stale "Step 4.5" bug. Nothing to fix here.
  - **1 deferred, not a bug:** PACT's fix documenting `/add-task`/`/sweep-tasks` as exceptions to a
    "single writer" task-board rule has no analog to port — this repo has no such rule yet (solo project,
    per `AGENTS.md`'s "Multiple sessions — not yet a real scenario"). Adding the exception before the rule
    exists would be inventing structure this repo doesn't need yet.
- **Decision:** Ported the 2 genuine fixes. Backfill checks the circuit breaker first (matching PACT's own
  second-pass correction to this same fix, where the first version of the backfill logic forgot that
  check). The Step 6 push-discipline text points at Step 4's instructions rather than repeating them —
  matching PACT's own self-correction on this exact duplication after its first fix pass introduced it.
- **Why:** Both gaps are genuine correctness issues independent of branch model — a silently-short batch
  and an unhandled rejected push can happen in any git repo, worktrees or not. No reason to make this repo
  rediscover them independently when PACT already paid to find and fix them once.
- **Status:** Active.
