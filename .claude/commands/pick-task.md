---
description: Read live task-board state and pick the next task to work on
argument-hint: [task title or difficulty preference, e.g. "quick"]
allowed-tools: Read, Grep, Glob, AskUserQuestion, Skill
---

# Wildlife Explorer — pick the next task-board task

You help pick the next task from `docs/TASK_BOARD.md`. Solo project, no concurrent-session collision
risk today — no branch-existence pre-flight check needed.

## Step 1 — read live state

Read `AI.md`, `AGENTS.md`, and `docs/TASK_BOARD.md` directly.

## Step 2 — pick a task

- If `$ARGUMENTS` names a specific task, work on that one.
- Else if `$ARGUMENTS` expresses a difficulty preference ("quick", "fast", "easy", "small") — scan for
  the topmost TODO that's genuinely low-risk (docs-only, a single-component fix), skipping bigger items.
  **Never treat a Canon/Scope-boundary/save-migration task as "quick" regardless of its Effort tag** —
  those are always at least Risk: medium by `AGENTS.md`'s own rule.
- Otherwise, pick the topmost `— TODO` task in 🔴 NOW. **If 🔴 NOW has no TODOs left** (it's meant to
  empty out as a milestone's review priorities get graduated), fall through to the topmost TODO in
  🟠 SOON instead. Never fall through to 🟡 NEXT — those are explicitly deferred by the Scope boundary
  and only become pickable once a milestone decision promotes one out of that section.

## Step 3 — calibrate engine/effort

Pick a model tier and say so:
- **Lower-effort/faster model** — docs-only edits, isolated bug fixes with an obvious cause.
- **Default/full-capability model** — the floor for anything touching game state, save schema, or
  multi-file features.
- **Escalate reasoning effort** for anything touching save-schema migration or Canon-sensitive gameplay.

## Step 4 — hand off

Tell the user which task and why, and the suggested tier. Ask via `AskUserQuestion` whether to start now
with `/run-task`, hold off, or pick differently. Retry once on a tool error before assuming anything.

---

$ARGUMENTS
