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

- **Lake biome art is generated and banked, waiting to be wired in** — `docs/copilot-packages/04-lake-
  biome-animals.md` covers 6 animals (Great Blue Heron, Beaver, Rainbow Trout, Loon, Dragonfly, Painted
  Turtle) × 5 photo variants, proposed across 3 sections (Shoreline / Open Water / Reeds & Shallows). All
  30 images generated 2026-07-25, converted PNG→JPEG (72.7MB→9.0MB, same treatment as Park/Forest) and
  renamed to `<animal-id>-<variant>.jpg`, sitting at `public/assets/lake/` — a dedicated folder, kept
  separate from `public/assets/animals/` (the folder `animalPhotoVariants.ts` actually reads from) so
  nothing is accidentally wired in early. No Lake locations/data model exist yet — this is art prep only,
  ready to convert into real `AnimalId`/`Animal` entries and move into `public/assets/animals/` whenever a
  milestone builds Lake out for real, same pattern as Tutorial Park/Forest's photo-collection mechanic.

Also ideas from README.md's Roadmap section — commitments to a direction, not to a timeline:

- **Advanced photography features** — 2026-07-25 brainstorm gave this concrete shape: replace
  `CameraPanel`'s static button list with a live, animated scene per location where the animal wanders
  in and out of view (rather than always being available to photograph on demand), with a "photo mode"
  timing beat layered on top of the pose-capture mechanic above. By far the biggest of the 2026-07-25
  ideas — deliberately deferred until the smaller wins (facts, quiz, pose-capture) ship first, since it
  needs its own design pass: what renders the "scene" (new per-location art vs. animating existing photo
  art over a simple backdrop), and how animal appearance timing interacts with the pose-capture pulse.
- **Day and night wildlife behaviour** — 2026-07-25 brainstorm: time-of-day/weather selection **inside**
  the (not-yet-built) photo mode above, cosmetic only — it changes the mood/backdrop while framing a shot,
  but which photo variant you get stays random-from-uncollected as it already is (deliberately not tied to
  a real day/night clock or a deterministic variant picker, to avoid undermining the existing "no
  duplicates, surprise reveal" collection design). Depends on the photo-mode rework above existing first.
- Expanded Wildlife Journal features
- Cooperative discovery systems
- Progressive Web App support (full — see the SOMEDAY favicon/manifest split below)

---

# 🟢 SOMEDAY — long-term, no current plan

Not urgent, not scheduled, but worth keeping on record so they aren't lost.

- **Privacy/data-handling statement** — all state is currently local-storage only (good, low risk), but
  given the target audience (ages 8-14, families) a short written statement that no data leaves the
  device would be worth having, especially before any cloud-save feature is considered.
  **Note (2026-07-25):** this item's original trigger — "before this is ever made public" — has now fired
  (GitHub Pages deployment shipped, see `DECISIONS.md`'s `D-2026-07-25-github-pages-deployment`). Not
  auto-promoted to SOON/actioned without being asked, since a live game page today is exactly the low-risk
  scenario the trigger anticipated (no data collected, family/friends-only audience), but worth a
  deliberate call rather than staying buried here indefinitely.
- **PWA manifest and install icons** — the full Progressive Web App roadmap item, beyond just the
  favicon housekeeping task above.
- **Localization / i18n** — not mentioned anywhere; only relevant if the game grows beyond English.
- **Sound/audio system** — no audio exists or is planned; a natural fit for a calm nature game
  eventually, but genuinely not started.
