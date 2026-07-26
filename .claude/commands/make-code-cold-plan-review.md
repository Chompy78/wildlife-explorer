---
description: Turn a task/idea into a self-contained plan formatted for a cold AI/human reviewer
argument-hint: [task or idea — omit to use this session's existing plan]
allowed-tools: Read, Grep, Glob, Edit, Bash(git add *), Bash(git commit *)
disallowed-tools: Bash(git push *)
---

# Wildlife Explorer — draft a plan for cross-AI review

Turn a task or idea into a written plan, saved as a self-contained markdown file for a *different* AI or
human reviewer with no shared context to read cold and critique.

## Step 1 — figure out what needs a plan

`$ARGUMENTS`, or this session's existing plan if empty.

**Trigger rule:** only run this when a wrong approach would cost more than one implementation cycle to
undo. Reach for it especially for anything touching save-schema migration or the Canon/Scope boundary —
getting those wrong is exactly the kind of thing `npm run check` won't catch, which raises the cost of a
wrong approach.

## Step 2 — check for an existing plan

Look in `docs/plans/` for overlap; if revising, add `Supersedes: docs/plans/<old-file>.md`.

## Step 3 — do the actual planning

Research what the plan touches; check `AI.md` (Canon, Scope boundary), `AGENTS.md`, `docs/TASK_BOARD.md`,
`DECISIONS.md` for constraints. Work out goal, approach (concrete files/functions), alternatives
considered, out of scope, risks, files touched.

Assume the reviewer has no repo access — quote constraints inline. Never inline secrets/`.env` values.

## Step 4 — package it for a cold reviewer

```markdown
# Plan: <short title>

<Supersedes: docs/plans/<old-file>.md — only if applicable>

## Goal
<what and why, assume zero prior context>

## Context
<constraints quoted/paraphrased inline — including any relevant Canon/Scope-boundary constraint>

## Assumptions vs. verified facts
- **Verified:** <confirmed facts>
- **Assumed:** <unconfirmed guesses>

## Proposed approach
1. <step>
...

## Files involved
- <path — what and why, by name not line number>

## Out of scope
- <deliberately not attempted>

## Alternatives considered
- <alternative> — rejected because <reason>

## Risks / open questions
- <genuinely uncertain>

## Verification
<npm run check passing, plus manual Canon/Scope-boundary verification for anything gameplay-touching,
plus any task-specific manual check.>

## Done when
<objective, checkable condition(s)>

---

## Reviewer instructions
**State which AI model and settings you are, first line.**

Review cold, no repo access. Judge logic/clarity/scope/risk, not code correctness you can't verify.
1. Does the approach achieve the goal?
2. Which assumptions look shaky?
3. Is an alternative actually better?
4. What's missing — edge case, risk, verification step?
5. Are Verification/Done-when objectively checkable?
6. Should this be split?

Plain list of findings. If a section's solid, say so briefly.

**Deliver as a Markdown file**, led by the model line, named `<plan-topic>-review-<your-model>.md`.

---

## Review outcome (fill in after review + implementation)
- Reviewers (models): <...>
- Findings: <N> → accept <A> / reject <R> / defer <C>
- Materially changed the plan? <yes/no>
- Without the review: <one line>
```

## Step 5 — show it before writing anything

Show the drafted content, ask for approval. **Four-backtick fence** for the copy-paste block (the plan
body has three-backtick blocks inside it).

## Step 6 — write the file

`docs/plans/<date>-<slug>.md` once approved. Ask separately about committing (docs-only, `main`), then
separately about pushing.

## Step 7 — handle returned review feedback

Loosely-formatted, possibly multiple reviewers — ask if there's more before triaging. Note agreement/
disagreement across reviewers. Apply low-risk clearly-correct findings directly; stop and ask before
acting on anything touching secrets, Canon/Scope-boundary, or an existing `DECISIONS.md` entry. Fill in
the plan's "Review outcome" stub.

---

$ARGUMENTS
