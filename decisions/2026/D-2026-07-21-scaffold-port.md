# D-2026-07-21-scaffold-port · port PACT's scaffold additively, keep AI.md as the real entry point

Date: 2026-07-21
Status: Active

- **Context:** the user wanted the same `AGENTS.md`/task-board/`DECISIONS.md`/`CHANGELOG.md`/
  `docs/sessions/`/`.claude/commands/*.md` system used on `chompy78/PACT` (and, moments earlier the same
  session, ported to `chompy78/family-hub`) replicated here too. Unlike family-hub (which had product-
  planning docs but zero AI-workflow governance), this repo already has a real, actively-used governance
  file — `AI.md` — plus a genuinely working `npm run check` test/build gate (18 passing tests) and an
  established, verbose `docs/sessions/` narrative style. This is much closer to PACT's own prior
  `homelife` port (mature repo, existing real conventions) than to family-hub's shape.
- **Options:** (1) treat this port identically to family-hub — build `AGENTS.md` as the primary entry
  point, relegate `AI.md` to a legacy/product doc. (2) Add `AGENTS.md`/`DECISIONS.md`/task-board/skills
  purely additively: `AI.md` stays the real "read this first" entry point (it's genuinely good at what
  it does — Canon, Scope boundary, verification command), `AGENTS.md` adds only the process layer
  (task-board format, decision logging, communication conventions) that `AI.md` doesn't cover, and
  explicitly says so rather than pretending to be the sole entry point. (3) Merge `AGENTS.md`'s content
  directly into `AI.md` instead of creating a second file.
- **Decision:** option 2. `AI.md` untouched. `AGENTS.md` created but scoped narrowly — its own first
  line tells a reader to go read `AI.md` first, and it never restates Canon/Scope-boundary/verification
  content `AI.md` already owns.
- **Why:** option 1 would have meant either duplicating `AI.md`'s content into `AGENTS.md` (drift risk —
  exactly the "too many docs pointing at each other" problem family-hub's own port explicitly fixed by
  *removing* competing files) or worse, writing an `AGENTS.md` that quietly ignored real, working
  conventions (Canon, Scope boundary, the encoding-audit gate) this repo already depends on. Option 3
  (merge into `AI.md`) was rejected because `AI.md`'s own stated purpose — a source-of-truth rule for
  project state — is a different concern from PACT-style process conventions (task format, decision
  logging, communication style); folding them into one file risks the same kind of file bloat PACT's own
  `AGENTS.md` already manages by keeping `CLAUDE.md`/`copilot-instructions.md` as thin stubs rather than
  full copies.
- **Consequence:** `CLAUDE.md`/`.github/copilot-instructions.md` both explicitly tell the reader to read
  `AI.md` first, `AGENTS.md` second. `docs/TASK_BOARD.md` was seeded from `CURRENT_CODE_REVIEW.md`'s
  "Next detailed review priorities" (left in place, untouched — it's a milestone-baseline record, a
  different purpose than an open-work tracker). `CHANGELOG.md` (existed as an empty file) was filled in
  with a backfill from the Milestone 3.2–5 history already documented in
  `docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md`. The new session note for this port uses
  this repo's own naming convention (`WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20-scaffold-port.md`), not
  PACT's `<date>-<topic>.md` pattern — matching the existing style rather than importing a new one.
- **See also:** `chompy78/PACT`'s `DECISIONS.md` `D-GH-2026-07-16-agents-workflow-reconcile` (the
  original "read the target's real state, adapt vs. build fresh" precedent, from PACT's own reconciliation
  with an external standard); `chompy78/family-hub`'s `DECISIONS.md` `D-2026-07-21-scaffold-port` (this
  port's immediate predecessor, same session, opposite shape — build-fresh there, additive here).
- **Status:** Active.
