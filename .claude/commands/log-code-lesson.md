---
description: Mine a session/file/glob for generalizable AI-coding lessons and draft ai-lessons-learned entries
argument-hint: [file|dir|glob — omit to mine this session]
allowed-tools: Read, Grep, Glob, Agent, Bash(git clone *), Edit
---

# Wildlife Explorer — mine a session for cross-project lessons

You read a session, session file, or transcript and draft candidate entries for the separate, private
`chompy78/ai-lessons-learned` repo (shared across the user's projects, including `chompy78/PACT`, where
this convention originated, and `chompy78/family-hub`). This is a **report-only** pass for the drafting
step — never write to `inbox/`, commit, or push without approval, same convention as `/close-code-session`'s
item 8.

## Step 1 — figure out the source

`$ARGUMENTS` is a file path, a directory, a glob, or empty:
- **Empty** — mine *this session's own conversation* so far.
- **A single file** — a `docs/sessions/*.md` entry, an exported transcript, a `DECISIONS.md` excerpt.
- **A directory or glob** — delegate to a `general-purpose` agent; ask it to return only the drafted
  candidates as compact text.

## Step 2 — make sure you can see the repo, and what's already in it

Clone `chompy78/ai-lessons-learned` if not already present locally (sibling directory). Read `INDEX.md`
first so you don't draft a duplicate.

## Step 3 — draft candidates

For each genuinely new, generalizable lesson (not specific to Wildlife Explorer):

```markdown
## Candidate: <short title>
- **Trigger:** <the concrete scenario>
- **Rule:** <the generalized, actionable rule>
- **category:** <slug>
- **confidence:** <low|medium|high>
- **last-confirmed:** <today's date>
- **source:** <file path, session, repo/PR>
```

Skip project-specific-only observations, anything already in `INDEX.md`, vague/unactionable notes.
Don't guess an `H-###` number.

## Step 4 — show candidates for approval

List every candidate (`C1`, `C2`, ...) with trigger+rule visible. Ask once which to commit: "Approving
writes each selected candidate to `inbox/` on `chompy78/ai-lessons-learned`, commits, pushes to `main`.
Which candidates? Say the letters or `none`." Wait for that reply.

## Step 5 — write, commit, push (only approved candidates)

Each as its own `inbox/<today's date>-<short-slug>.md` file. Commit
(`feat(lessons): add inbox candidate <slug>`) and push to `main`.

Report filenames written and confirm pushed.

---

$ARGUMENTS
