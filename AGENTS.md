# Wildlife Explorer — instructions for AI coding agents

> **Two files, two jobs.** `AI.md` is this repo's existing source-of-truth doc — project state, Canon,
> Scope boundary, and the verification command. Read it first, always. **This file adds the process
> layer** (task board, decision logging, communication conventions) ported from `chompy78/PACT` that
> `AI.md` doesn't cover — it does not duplicate or override anything in `AI.md`. `CLAUDE.md` imports
> this file (`@AGENTS.md`); `.github/copilot-instructions.md` is a stub that points here.

## Start here, in order
1. `AI.md` — project state, Canon, Scope boundary, verification command. **This is still the real
   entry point** — nothing here changes that.
2. `docs/TASK_BOARD.md` — current open work (new; previously tracked informally in
   `CURRENT_CODE_REVIEW.md`'s "Next detailed review priorities").
3. This file — process conventions for logging, task format, and communication style.

## Branch model — commit straight to `main`, no PR gate (revisit later)
Same reasoning as `chompy78/family-hub` (another repo this scaffold was ported to): solo development,
no CI configured to run automatically, only one branch (`main`) in this repo's history. Agents work
directly on `main`: pull latest, make the change, run `npm run check`, commit, push.

**This repo is one step closer to changing this than family-hub was** — `npm run check` (typecheck +
vitest + build + encoding audit) already exists and genuinely works (18 passing tests as of Milestone
5). Wiring it into GitHub Actions CI would be a small lift, not a redesign, and would immediately make a
PR-gated workflow worth the overhead. See `DECISIONS.md`'s `D-2026-07-20-branch-model` for the explicit
revisit trigger — don't wait to be asked twice if you're the session that ends up adding CI.

**If your harness pins you to a working branch** (e.g. Claude Code on the web given an explicit branch
to develop on) — that's still fine, but it doesn't change the policy. Once the change is verified, fast-
forward-merge (or otherwise land) that branch into `main` before finishing the session, same as any
other commit. Don't introduce a PR gate just because a branch happened to exist. See `DECISIONS.md`'s
`D-2026-07-20-branch-model-confirmed`.

## Task format (for `docs/TASK_BOARD.md`)
```
## <Short title> — TODO
<one-line of what + where>.
**Effort:** low|medium|high · **Risk:** low|medium|high — <one clause: why this rating>

```text
<paste-ready steps for the implementing agent>
```

**Done when:** <one objective, checkable condition — usually ends in "npm run check passes">
```

**Risk** — rate three factors (ambiguity, damage scale, damage likelihood), each low/medium/high, take
the worst as the overall rating. Anything touching save-schema migration, the Canon (no combat/
collecting/harming animals), or the Scope boundary (no full Forest biome, quests, companions, etc. until
a milestone explicitly calls for it) is **always** at least Risk: medium — regressing a save-migration
path or breaking Canon is exactly the kind of thing `npm run check` won't catch.

## Communication conventions
Ported from PACT as-is — see `chompy78/PACT`'s `AGENTS.md` for the fully worked rationale if needed;
summarized here:
- **Tiered options** (A/A1/A2, B/B1/B2...) when presenting a real decision with distinct paths. State
  the recommendation upfront with a reason; give every option a one-line reason, not just the winner.
- **Fix depth** — when a shallow fix and a deeper fix both exist, present both with a tradeoff each,
  don't silently pick the cheap one.
- **`AskUserQuestion` tool errors are not answers** — retry once, never substitute a default as if it
  were the user's reply.
- **Follow-up actions get tagged** Recommended / Not recommended — with a reason, defaulting to
  Recommended unless the action is destructive, a judgment call only the user can make, or missing
  information.

## Log as you go
- **`CHANGELOG.md`** — *what* changed, one line, newest on top.
- **`DECISIONS.md`** — *why*, on any architectural/process choice.
- **`docs/sessions/<name>.md`** — the discussion, when it's worth keeping. This repo's existing session
  logs use a verbose, narrative style (see `docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md`
  for the pattern) — match that style, don't switch to PACT's terser format mid-repo.
- **Graduate:** when a `docs/TASK_BOARD.md` task is DONE, move it into `CHANGELOG.md` in the same change.

## Multiple sessions — not yet a real scenario
Solo project today. Revisit if a second contributor starts working here concurrently — see PACT's
`AGENTS.md` *Multiple sessions* section as the worked example if that happens.

## Per-change checklist
1. `npm run check` passes (typecheck + tests + build + encoding audit).
2. Verify Canon/Scope-boundary compliance for anything touching gameplay — `npm run check` won't catch a
   Canon violation (e.g. adding combat, or letting an animal be "collected").
3. Update `CHANGELOG.md` (always) · `DECISIONS.md` (if non-obvious *why*) · a `docs/sessions/` note (if
   the session had real discussion or a pivot). Graduate the task off `docs/TASK_BOARD.md` if done.
4. Commit as `type(scope): summary`, push directly to `main`.
