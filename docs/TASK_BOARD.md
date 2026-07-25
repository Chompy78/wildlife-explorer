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


## Integrate illustrated Park Map with location pins — TODO
`docs/copilot-packages/03-park-map.md` is a ready-to-run handoff package (art brief + code spec)
replacing `ParkScreen.tsx`'s plain grid of location button-cards with a single illustrated map image and
clickable pins. Waiting on the user to run Track A through Copilot 365 and bring back the map image.
**Effort:** medium · **Risk:** medium — touches the core Park screen's primary navigation UI (still the
same underlying `goToLocation`/`visitLocation` logic, no state changes) and needs care to keep pins
keyboard-accessible and correctly positioned against whatever the generated art actually looks like.

```text
1. Receive the generated park-map.png from the user; place at public/assets/tutorial-park/park-map.png.
2. Implement Track B directly (per Packages 01/02's experience): create src/data/parkMapCoordinates.ts,
   add the .park-map/.map-pin CSS, and replace ParkScreen.tsx's .location-grid block per the package's
   B1-B3.
3. Open the actual generated map image and tune the placeholder pin coordinates to match where each
   location actually appears in the art.
4. Verify all 6 locations still navigate correctly, including the existing hidden-Whisper-Grove message,
   and that pins are keyboard-focusable.
5. Verify Canon/Scope compliance on the generated art (Strange Old Tree/Whisper Grove read as natural,
   not magical).
6. Run npm run check; visually verify in a real browser (screenshot) at both desktop and a narrow mobile
   width, not just the test suite.
```
**Done when:** the package's own "Done when" section (bottom of
`docs/copilot-packages/03-park-map.md`) is satisfied and `npm run check` passes.


## Add a second non-native animal per biome — TODO
The invasive-species habitat quiz shipped 2026-07-25 with one non-native animal per playable biome
(Red-eared Slider Turtle at Duck Pond, Cane Toad at Forest Trail/Fern Trail). The user said "at least one
... maybe even two" — a second one per biome was deferred to prove the mechanic first.
**Effort:** low · **Risk:** low — same established pattern (`Animal.nonNative`, `HabitatQuiz.tsx`,
`reportedInvasiveSpecies`), no new architecture, just more data entries.

```text
1. Pick two more real, kid-friendly, non-predator-framed invasive species (avoid describing hunting/
   harm-to-other-animals directly, per the precedent set by the Slider Turtle/Cane Toad picks — stick to
   competition-for-resources or toxicity-if-eaten framing) — one for Tutorial Park, one for Forest.
   Grey Squirrel (Open Meadow, correct answer: Forest) was already suggested for Park as an easy pick.
2. Add each as a new AnimalId + Animal entry (with nonNative.correctHabitatId/impactNote) following the
   exact pattern of red-eared-slider/cane-toad in src/data/animals.ts.
3. Add the Forest one to forestAnimalIds in forestState.ts if applicable.
4. Add both ids to validAnimals in saveMigration.ts.
5. Run npm run check; verify the quiz and Journal note for both in a real browser.
```
**Done when:** two more animals are photographable, trigger the habitat quiz correctly, and
`npm run check` passes.


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
