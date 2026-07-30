# Wildlife Explorer — Session Log

**Session date:** 28–30 July 2026 (one continuous conversation, closed out on the 30th)
**Current verified release:** Milestone 5 (schema v9, unchanged throughout this session)

## AI Quick Summary

This session started right after Photo Mode (animals wandering in/out of frame) shipped, and covers
everything from there through today's close-out: two rounds of timing/blur mechanics work, a full
per-role bonus system, a user-supplied portrait Park Map replacing the landscape one, a full rethink of
the photo-taking interaction after blunt negative feedback ("the photo system is terrible"), a further
refinement of that redesign's blur model, a second non-native animal per biome, and a process decision
on whether to introduce a PR-gated workflow. Along the way, three real bugs in already-shipped code were
found and fixed: an untracked glow-timeout variable, a `ForestScreen.tsx` camera implementation that had
silently missed every camera upgrade since Photo Mode, and 13 CSS rules a concurrent session's commit had
truncated mid-value (which broke the production build outright, though not the test suite). Every round
followed the established loop: implement → `npm run check` → real-browser verification (Playwright, via
the globally-installed binary) → log → commit → push to `main`. By the end of the session the test suite
had grown to 130 passing tests across 19 files; the save schema stayed at v9 throughout — no save-schema
change was needed for any of this work.

## 1. Photo blur reacts to timing, glow difficulty varies per animal

User feedback after Photo Mode shipped: "the blur should relate to the photo timing so the kid keeps
trying to get it right. some animals should be easier, some harder." Previously `getPhotoQualityStyle`
was driven only by a per-species practice count; the Great Shot glow-timing flag existed but had zero
effect on the displayed blur, and every animal shared one global 900ms-on/1500ms-off glow timer.

Three options were considered: (A) per-shot only, discarding the practice-count progression entirely;
(B) a hybrid where practice count still sets a rising floor tier, and this shot's own timing nudges the
displayed tier one step sharper or blurrier, clamped at both ends; (C) a rolling per-species hit-rate,
the only option needing new save state. The user picked B - it keeps the encouraging practice-count
progression for a total beginner while still making a Great Shot visibly worth chasing on any given
photo, with no harsh-failure state (a miss costs one tier, never resets progress) and no save-schema
change needed.

A new `Animal.photoDifficulty: 'easy' | 'medium' | 'hard'` field was added per-species (calm/stationary
animals like Duck and Cane Toad easy; twitchy ones like Butterfly and Rare Owl hard; everything else
medium) - deliberately kept separate from `rarity`, since how twitchy an animal is to photograph isn't
the same thing as how rare it is, and conflating them would risk feeling like double-punishing a kid for
finding something rare. A real concurrency bug was caught while wiring this in: the glow loop's own
pending timeout wasn't actually being tracked anywhere, so cancelling it when an animal wandered
off-frame did nothing - fixed by having the glow loop assign its timeout id to a per-animal variable the
presence loop could actually cancel. Verified in a real browser: an easy animal's glow visibly stays on
longer than a hard one's, and a Great Shot vs. a missed-glow photo produce different blur on the reveal
screen. Logged as `D-2026-07-28-timed-blur-and-photo-difficulty` (later simplified further - see §4).

## 2. Explorer role bonuses - working out what each class actually does

The user asked to work out what each of the 6 explorer roles actually does (every bonus had been
placeholder text since the roles were introduced), and whether 6 roles is too many in the first place.
Answer on role count: no - five of the six map to five genuinely distinct existing systems (facts,
camera timing, clues, map exploration, rarity), no redundancy to trim; the sixth (Custom Character)
already tells the truth about itself as a placeholder rather than pretending to be finished.

Bonus mechanics were iterated with the user across several rounds, with the user redirecting two of the
initial proposals:
- **Zoologist** - reveals the animal's existing `funFact` as a bonus card on the very first photo of a
  species. No new content needed.
- **Wildlife Photographer** - originally proposed as an easier glow window; the user redirected this to
  a bonus 6th photo slot per animal instead, specifically because a 5-photo album grid "sits awkwardly"
  and 6 lays out cleanly, and a role-exclusive bonus photo "encourages playthrough" (replaying with a
  different role to complete the fuller collection). Since no image-generation tool exists in this
  session and the real 6th-variant art doesn't exist yet, this shipped as an honest "coming soon" locked
  preview tile rather than faking content or blocking on art - the art brief for the real follow-up lives
  at `docs/copilot-packages/05-bonus-photo-variants.md`, not yet promoted to a task-board entry.
- **Conservation Ranger** - originally proposed as extra clue detail; the user redirected this to double
  facts (10 total) for common animals - each photo-reveal for this role pairs the normal fact N with a
  bonus fact N from a new 50-entry pool, rather than inventing a second unlock timeline.
- **Animal Researcher** - easier photo difficulty for rare animals, plus the same double-facts mechanism
  as Ranger but scoped to rare animals - deliberately the one place rarity and photo-difficulty bridge,
  kept out of the core difficulty system so it stays this role's unique bonus.
- **Explorer** - originally proposed as "hidden locations reveal sooner"; checking the actual discovery
  logic showed reveals are already instant/binary once conditions are met, so this was corrected to: a
  still-locked Park Map pin shows its real icon instead of a generic padlock for this role.
- **Custom Character** - no bonus, unchanged, called out explicitly as the deliberate exception.

A real gap was found and fixed while wiring this up: `ForestScreen.tsx` had its own separate,
un-refactored inline camera implementation (a hardcoded global 900ms/1500ms pulse, no wandering gate at
all) that predated Photo Mode and had never been migrated to the shared `CameraPanel` component, despite
that migration being an explicit step in Photo Mode's own original task. Replaced with `<CameraPanel>`,
so Forest retroactively gained wandering animals, timed blur, per-animal difficulty, and all 6 role
bonuses for free, matching Park. New `src/data/roleBonuses.ts` now centralizes every role-eligibility
check. Verified all 5 active bonuses in a real browser. Logged as `D-2026-07-28-explorer-role-bonuses`.

## 3. Portrait Park Map - user-supplied art

User reported "the background image no longer appears on my phone." Before root cause was confirmed,
the user pivoted directly to requesting a portrait-oriented map instead, offering to generate the art
themselves - a landscape 3:2 map forced into the narrow-phone CSS fallback (a fixed 3:2 box) rendering
very short on a tall phone screen is a plausible explanation for the original report, though it was never
independently confirmed since the redesign superseded the investigation. **This was later confirmed by
the user (30 July) to have actually been a wifi issue, unrelated to any code** - the portrait map switch
still shipped as its own genuine improvement, but wasn't the fix for that particular report.

Wrote a portrait (~2:3) art prompt reusing the same six zones and spatial logic as the original landscape
prompt, reflowed to read bottom-to-top. The user generated the art externally and pasted it into the
conversation (1024×1536 WebP) - extracted via the conversation's own transcript file (no direct
"save this pasted image" tool exists), then converted WebP→JPEG at quality 85 (~590KB, an 82% reduction
from the original 3.28MB PNG) after comparing 90/85/80 for visible artifacts. All 6 location pins were
re-tuned by eye against the actual generated art.

A real bug was found and fixed while wiring this in: pairing `.park-map`'s new `aspect-ratio: 2/3` with
`object-fit: contain` worked correctly on the narrow-phone fallback but broke on desktop, where the box
still stretched wide (`aspect-ratio: auto`) - `contain` avoided cropping but letterboxed the image inside
the wider box, and since every pin's position is a CSS percentage of the *box* rather than the *visible
image*, every pin except ones at exactly 50% left silently drifted into the letterbox margins. Fixed by
keeping `.park-map`'s box at the image's native 2:3 ratio everywhere (centered via `align-self: center`
on desktop) instead of letting it stretch - removes the mismatch at its root rather than patching pin
coordinates per breakpoint. Verified in a real browser at desktop and two phone-portrait sizes. Logged as
`D-2026-07-29-park-map-portrait`.

## 4. "The photo system is terrible" - Focus the Shot, then a dynamic band

Blunt feedback: "the photo system is terrible. we need to rethink it." Asked what specifically felt bad;
the answer was a holistic "it just doesn't feel satisfying," not a specific mechanical complaint. The
diagnosis: the interaction loop was almost entirely passive watching (wait for an animal to wander back
into frame, then wait for an unpredictable on/off glow) with the actual reward only appearing afterward
in a separate reveal modal - the moment of pressing the shutter itself carried no immediate feedback.

Four redesign directions were presented: (A) simplify + add "juice" to the existing pulse; (B) active
control - replace both the wander gate and the glow timer with one direct mini-interaction the player
continuously tracks and reacts to; (C) double down on wildlife-feels-alive with real tracked movement,
Pokémon-Snap style (blocked this session - no image-generation tool available for the art it would need);
(D) make photographing itself trivial and pour the "juice" into the reveal/collection side instead. The
user picked B (given C's art blocker, under this session's "make the reasonable call" guidance).

`CameraPanel.tsx` was rewritten: removed the wander gate entirely (every animal always visible and always
shootable again), replaced the binary on/off glow with a continuously moving marker sweeping a small
track under each animal's name, crossing a highlighted "sweet spot" twice per cycle. Tapping the shutter
always works; it lands a Great Shot only when the marker is inside the sweet spot at that instant. Sweep
speed and sweet-spot width still varied by `photoDifficulty` and the Animal Researcher bonus.
`prefers-reduced-motion` falls back to the prior calm on/off glow. Logged as `D-2026-07-29-focus-the-shot`
(supersedes `D-2026-07-28-photo-mode-wandering-animals`).

The user came back positive but with a specific refinement: "it should always return a blurry one until
it's within the good shot band. that good shot band shou[ld] start narrow and expand the more shots on
that animal, and also slowly expand for total photos taken and class may impact." This replaced the
existing blur tiering (still riding on the older practice-count-floor/timing-nudge hybrid from §1) with a
strict binary - blurry unless the tap lands inside the sweet spot, crisp if it does - and moved all the
"getting better with practice" feel into the sweet-spot band's *width* instead: starting at 35% of its
difficulty tier's ceiling width on a fresh species, growing linearly to the full ceiling over 5 photos of
that species (matching a full photo collection, the natural reachable mastery point), plus a smaller,
slower bonus as the save's total photograph count across every species grows toward 60. Class/role
effects still apply via the same difficulty-tier selection as before.

Two real bugs were found and fixed while building this: the 50ms sample tick (inherited from Focus the
Shot) was too coarse for the narrowest reachable bands (~27ms true crossing time), risking the window
being skipped on unlucky tick alignment - tightened to 20ms, with `.focus-marker`'s CSS transition
tightened to match. And the species-mastery threshold was initially set to 8 photos, which is
structurally unreachable since every animal caps at 5 collectible variants and the shutter disables once
a collection completes - fixed to 5. Verified in a real browser: sweet-spot width measured at 14.7% fresh,
36.96% after 4 photos of the same species. Logged as `D-2026-07-29-dynamic-focus-band`.

## 5. Restoring 13 CSS rules a concurrent commit had truncated

While merging in a concurrent session's commits (already on `main` - "photography tips"/`isNewFact`
work) to start the next task below, `npm run check`'s build step failed outright:
`lightningcss` couldn't minify the stylesheet, erroring on an "Unexpected token SquareBracketBlock."
Investigation found the concurrent commit had silently truncated 13 long CSS rule values mid-token and
appended a literal `[...]` marker in their place - e.g. `.role-card`'s value ending in
`border-radi[...]` instead of the real `border-radius: 22px; ...`. Typecheck and the test suite had both
still passed, since neither touches CSS syntax, so the break was silent until a real `npm run build`.
Restored each affected rule's exact original value from the last known-good commit; the genuinely new
rules that same commit had added (`.photography-tip`, `.great-shots-progress`, two new `@keyframes`
blocks) were untouched by the truncation and needed no changes. Shipped as its own fix commit ahead of
the feature work below, since it was unrelated to this session's own task.

## 6. A second non-native animal per biome

Picked from `docs/TASK_BOARD_SOON.md` via `/pick-code-task` once §4's work was fully logged and pushed -
the invasive-species habitat quiz had shipped 2026-07-25 with one non-native animal per playable biome
(Red-eared Slider Turtle, Cane Toad), with a second per biome explicitly deferred to prove the mechanic
first. Added Grey Squirrel (Tutorial Park, Open Meadow, correct habitat: Forest) and European Starling
(Forest biome, Fern Trail, correct habitat: Grassland), following the exact `Animal.nonNative`/
`HabitatQuiz`/`reportedInvasiveSpecies` pattern the first two established - both use
competition-for-resources framing (out-competing native species for food/nesting sites), no hunting or
harm-to-other-animals language, matching precedent. Neither has photo art yet, same as the first two
non-natives - emoji only for now. Verified in a real browser: Grey Squirrel is photographable at Open
Meadow and correctly triggers the habitat quiz with Forest as the right answer.

## 7. PR-gated workflow - deferred, not decided against

`D-2026-07-21-branch-model`'s "CI gets added" revisit trigger had already fired once GitHub Actions was
wired up, putting "decide whether to introduce a PR-gated workflow" on `docs/TASK_BOARD_SOON.md` as an
explicit user-only call (not something to auto-decide). Asked; the user said "don't introduce pr gated
workflow for a while yet." Logged as a deferral, not a permanent close - the original revisit trigger (a
second contributor joins, or a change feels too risky for a direct `main` push) still stands, and
`AGENTS.md`'s Branch model section now notes explicitly that this was reconsidered and reaffirmed on
30 July, not merely never revisited. Logged as `D-2026-07-30-pr-gate-still-deferred`.

## Canon and Scope preserved

- Every mechanic across this whole session stays photography/observation-flavored - no combat, no
  catching/collecting/harming animals, and no harsh-failure state anywhere (a missed shot is always just
  blurry, never a penalty; the two new non-native animals use competition-for-resources or
  toxicity-if-eaten framing, never hunting/harm language).
- No new playable destination, quest, companion, or economy mechanic was introduced - the Scope boundary
  in `AI.md` is unchanged, and the Wildlife Photographer's real 6th-photo art remains a deliberately
  deferred follow-up, not built ahead of the art existing.
- No save-schema change occurred anywhere in this session (schema stayed at v9) - `photographCounts` and
  `reportedInvasiveSpecies` were both existing fields, reused rather than extended.
