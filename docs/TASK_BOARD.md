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


## Photo "quality" progression — sharper photos as skill improves — TODO, design confirmed
User idea (2026-07-25): photos should get better over time. Design confirmed 2026-07-25 in the "gameplay
excitement" brainstorm: **option B** (per-species practice counter, independent of which variant is
randomly picked) plus a new **pose-capture layer** — while framing an animal, it cycles through poses with
a soft visual pulse on a "great pose" moment; shooting anytime still works (no fail state), shooting on
the pulse gives a "Great shot!" bonus. Both layer onto the existing photo-collection mechanic
(`DECISIONS.md`'s `D-2026-07-25-photo-collection-mechanic`) without changing the current random-variant
selection.
**Effort:** medium · **Risk:** medium — touches save schema (new per-species practice counters) and
changes the feel of an already-shipped, already-tested photograph interaction.

```text
1. Add a persistent per-species photograph count (new save field, e.g. photographCounts: Partial<Record
   <AnimalId, number>>, bumped every time that species is photographed regardless of which variant is
   picked). Bump CURRENT_SAVE_SCHEMA_VERSION, update saveDefaults.ts/saveMigration.ts in lockstep.
2. Simulate quality with CSS only (filter: blur(Npx) and/or transform/object-position for poor cropping),
   scaling down as the per-species count rises - no new art needed. Verify against a real generated photo
   that the effect reads as intentional.
3. Add the pose-capture cue: while CameraPanel/the photo-mode view is open on an animal, cycle a soft
   visual pulse (e.g. a ring around the shutter/viewfinder) on an interval; capture always succeeds,
   capturing during the pulse marks that specific photo as a "Great shot!" (cosmetic badge/label only).
4. Canon check (AI.md "no harsh failure"): stay encouraging - never label a photo "bad"/"poor quality" in
   visible copy; frame progress positively ("getting steadier!"). Never label a non-pulse shot as a miss.
5. Run npm run check; verify visually in a real browser across several photo captures per species to
   confirm the progression reads clearly, the pulse cue is legible but not stressful, and stays encouraging.
```
**Done when:** photos visibly sharpen with practice per species, the pose-capture pulse works and never
blocks a photo, and `npm run check` passes.


## Animal facts on photograph, shown in Journal, unlocked by photographing — TODO
User idea (2026-07-25), design confirmed same day: each of the 11 animals-with-photo-art gets exactly 5
facts, tied 1:1 to its 5 photo variants — getting photo variant N reveals fact N. No new save field needed
(a fact is "learned" iff its matching key is already in `collectedPhotoVariants`), so this is presentation
+ data only.
**Effort:** medium · **Risk:** low — no save-schema change, additive data + display only.

```text
1. New src/data/animalFacts.ts: a Partial<Record<AnimalId, string[]>> with exactly 5 kid-friendly,
   accurate, Canon-safe facts per animal (duck, frog, butterfly, rabbit, lizard, park-bird, rare-owl,
   forest-wren, forest-wallaby, forest-beetle, lost-puppy). Helpers: getFactForVariant(id, variantNumber),
   getFactForVariantKey(id, variantKey) (derives variant number from the "<id>-<variant>" key format
   already used by collectedPhotoVariants), getLearnedFacts(id, collected) for the Journal.
2. PhotoReveal.tsx: accept an optional fact prop, show it below the photo in the reveal modal.
3. ParkScreen.tsx/ForestScreen.tsx/QuestPanel.tsx (Lost Puppy reunion): when a new variant is revealed,
   look up its fact via getFactForVariantKey and pass it to PhotoReveal.
4. Journal.tsx: show learned facts per animal (e.g. "3 of 5 facts learned" + the list of learned facts),
   next to the existing photo-progress display.
5. Run npm run check; verify in a real browser that a fact appears on photograph and the Journal's fact
   list updates and matches what's been revealed.
```
**Done when:** every photograph of an animal-with-facts shows its matching fact, the Journal shows learned
facts and an accurate progress count, and `npm run check` passes.


## Biome-completion quiz and achievement — TODO
User idea (2026-07-25): finishing a biome (e.g. Tutorial Park's existing completion condition that
already triggers `CompletionCelebration`) should also offer a short, encouraging trivia quiz drawn from
facts the player has already learned, awarding an achievement on completion (participation-based, not
score-gated, per Canon's "no harsh failure").
**Effort:** medium · **Risk:** medium — new `achievements` save field (schema change), and needs the
animal-facts feature above shipped first (quiz content depends on it).
**Depends on:** "Animal facts on photograph" above.

```text
1. Add achievements: string[] to save data (new field, bump schema version, update saveDefaults.ts/
   saveMigration.ts).
2. New src/data/achievements.ts: a small list of achievement ids/labels/icons, starting with one for
   Tutorial Park completion.
3. Reuse HabitatQuiz.tsx's modal/quiz-card pattern for a new BiomeQuiz component: 3-5 questions drawn from
   already-learned facts for that biome's animals, encouraging wrong-answer handling (same pattern as
   HabitatQuiz), awarded achievement on completion regardless of score.
4. Trigger alongside the existing CompletionCelebration condition (Tutorial Park finishing).
5. Show unlocked achievements somewhere in the Journal (extends the existing "Places and Rewards" /
   SpecialEntry pattern).
6. Run npm run check; verify the quiz triggers correctly, awards the achievement once, and displays in
   the Journal.
```
**Done when:** finishing Tutorial Park offers the quiz, completing it awards a visible achievement, and
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
