# D-2026-07-29-sweep-tasks-arguments-hardening — Tighten sweep-tasks.md's $ARGUMENTS batch-size parsing to match PACT's post-review fix

- **Context:** While reviewing `.claude/commands/sweep-tasks.md` for staleness against its PACT origin,
  found its batch-size clause ("`$ARGUMENTS` if a bare positive integer, else ask") was the pre-review
  wording. PACT's own `sweep-code-tasks.md` was adversarially reviewed on 2026-07-17
  (`D-GH-2026-07-17-sweep-tasks-review-fixes`, PACT's own decisions log), which found: *"a stray version
  number like `v0.107` would silently become the cap"* and tightened the spec to require a bare positive
  integer and nothing else, explicitly excluding a digit embedded in free-form text, multiple numbers,
  zero, and negative numbers. This repo's scaffold port (`D-2026-07-21-scaffold-port`) happened four days
  *after* that PACT fix landed, but the ported `sweep-tasks.md` never picked up the hardened wording —
  likely lost in the broader simplification this file already applies (dropping PACT's worktree/PR/
  code-review-tier machinery, which doesn't apply here per this repo's no-PR branch model). The
  $ARGUMENTS-parsing fix is orthogonal to that simplification and applies equally regardless of branch
  model, so there was no reason for it to have been dropped.
- **Options:** (i) leave it as-is — the ambiguity is narrow (a stray digit in free text misread as the
  batch cap) and hasn't caused a known incident here yet; (ii) port PACT's hardened wording, adapted to
  this repo (drop the "PR reference" example since this repo has no PRs; keep the version-number example,
  directly relevant to a game project; keep this repo's own 3-5 default instead of PACT's 5-8).
- **Decision:** (ii).
- **Why:** This is a live automation file an agent executes literally and unattended (`sweep-tasks.md`'s
  whole point) — an ambiguous cap-parsing rule is exactly the kind of gap that stays invisible until it
  actually misfires (e.g. `/sweep-tasks v0.12` silently running a much larger batch than intended). PACT
  already paid the cost of finding and fixing this once; there's no reason for this repo to independently
  rediscover it.
- **Status:** Active.
