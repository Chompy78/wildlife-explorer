# Wildlife Explorer — Task Board

> Written for agentic assistants (Claude Code, GitHub Copilot). Read `AI.md` first, then `AGENTS.md`.
> Each task ends with a **Done when** check.
>
> **Rules for this file** (see `AGENTS.md`):
> 1. Holds only **open / planned** work. When a task is DONE, **move it into `CHANGELOG.md`**.
> 2. Solo project today — no single-writer concern yet.
> 3. Commit straight to `main` — no branch-per-task.
>
> Tasks below are reformatted from `CURRENT_CODE_REVIEW.md`'s "Next detailed review priorities" — not
> newly invented. `CURRENT_CODE_REVIEW.md` itself is left as-is (it's this repo's existing milestone
> baseline record, a different purpose than an open-work tracker).

---

# 🔴 NOW — Milestone 5 review priorities

All five 2026-07-20 review priorities are graduated to `CHANGELOG.md` as of 2026-07-21's sweep.

---

# 🟠 SOON — housekeeping, process and QA gaps

Found during a 2026-07-20 project status review — not blocked by the Scope boundary, just not done yet.


## Integrate Copilot-drafted Park/Forest biome background visuals — TODO
`docs/copilot-packages/01-biome-backgrounds.md` is a ready-to-run handoff package (art brief + code spec)
for adding hero visuals to `ParkScreen.tsx` and `ForestScreen.tsx`, matching the existing Camper screen
pattern. Waiting on the user to run it through Copilot 365 and bring back the generated images/diffs.
**Effort:** low · **Risk:** low — additive visual-only change (new images + a CSS class rename + two
inserted JSX sections), no state/save-schema/gameplay logic touched.

```text
1. Receive the two generated PNGs and Copilot's proposed diffs from the user.
2. Place the PNGs at public/assets/tutorial-park/park-direction.png and
   public/assets/forest/forest-direction.png per the package's B5 step.
3. Apply/adjust the code diffs (styles.css shared .biome-visual class, CamperScreen.tsx class rename,
   new hero sections in ParkScreen.tsx and ForestScreen.tsx) per the package's Track B.
4. Verify Canon/Scope compliance on the generated art and copy (no combat/collection imagery, no
   preview-only destination depicted as playable).
5. Run npm run check; visually confirm the Camper screen still renders identically after the rename.
```
**Done when:** the package's own "Done when" section (bottom of
`docs/copilot-packages/01-biome-backgrounds.md`) is satisfied and `npm run check` passes.


## Decide whether to introduce a PR-gated workflow — TODO
Now that CI (`npm run check` via GitHub Actions) is wired up, `DECISIONS.md`'s `D-2026-07-21-branch-model`
"CI gets added" revisit trigger has fired (see `D-2026-07-21-ci-added`) — decide whether to keep
committing straight to `main` or introduce a PR-gated workflow.
**Effort:** low · **Risk:** medium — a process/workflow decision, not a code change; the ambiguity is
real (no single objectively-correct answer) even though nothing here touches gameplay/save-schema.

```text
1. Present tiered options to the user: (A) keep commit-straight-to-main (no PR gate) - matches current
   solo-dev, low-friction practice; CI now catches regressions either way. (B) introduce a PR-gated
   workflow - CI-required checks before merge, meaningful once a second contributor or higher-stakes
   changes become more likely.
2. Get an explicit decision from the user; do not auto-decide.
3. Log the outcome as a DECISIONS.md entry and update AGENTS.md's Branch model section to match.
```
**Done when:** the user has explicitly chosen an option; `AGENTS.md` and `DECISIONS.md` reflect it.

---

# 🟡 NEXT — deferred by Scope boundary (see AI.md)

Not started until a later milestone explicitly requires it: full Forest biome expansion, complex quests,
rare Forest animals, companions, inventory, crafting, shops, economy, another playable destination
(Mountains/Lake/Safari/Rainforest/Alien Planet going live).

Also ideas from README.md's Roadmap section — commitments to a direction, not to a timeline:

- Advanced photography features
- Expanded Wildlife Journal features
- Cooperative discovery systems
- Day and night wildlife behaviour
- Progressive Web App support (full — see the SOMEDAY favicon/manifest split below)

---

# 🟢 SOMEDAY — long-term, no current plan

Not urgent, not scheduled, but worth keeping on record so they aren't lost.

- **Deployment/hosting configuration** — no hosting target (Pages, Vercel, etc.) is defined yet; matters
  once this needs to reach an actual child player rather than just `npm run dev`.
- **Privacy/data-handling statement** — all state is currently local-storage only (good, low risk), but
  given the target audience (ages 8-14, families) a short written statement that no data leaves the
  device would be worth having before this is ever made public, and especially before any cloud-save
  feature is considered.
- **PWA manifest and install icons** — the full Progressive Web App roadmap item, beyond just the
  favicon housekeeping task above.
- **Localization / i18n** — not mentioned anywhere; only relevant if the game grows beyond English.
- **Sound/audio system** — no audio exists or is planned; a natural fit for a calm nature game
  eventually, but genuinely not started.
