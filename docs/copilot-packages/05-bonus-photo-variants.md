# Package 05 — Wildlife Photographer bonus photo variant (art prep)

**Status:** ready to hand to Copilot 365 for Track A. The "coming soon" preview slot (Track B, partial)
is already implemented and live — this package is really just the art brief needed to finish it.
**Track A:** art brief (image generation, 10 animals × 1 bonus photo each = 10 images). **Track B:**
already shipped in a preview-only form; a small follow-up (below) wires the real photo in once art lands.
**Scope:** generates one additional collectible photo per animal for the Wildlife Photographer explorer
role's bonus (see `DECISIONS.md`'s `D-2026-07-28-explorer-role-bonuses`). No gameplay, save-schema, or
Canon/Scope changes beyond what's already shipped.

---

## 0. Context Copilot needs (read this whole section — it replaces browsing the repo)

**Stack:** React + TypeScript + Vite, same conventions as every prior package.

**Canon (never violate, from `AI.md`)** — calm observation only, no combat, never catch/collect/harm
animals, Lost Puppy is helped and reunited (never collected), Mountains/Lake/Safari/Rainforest/Alien
Planet stay preview-only.

**Scope boundary** — this is one extra photo per already-shipped animal, not a new animal, location, or
mechanic. Do not add new species or destinations.

**Why this exists:** the Wildlife Photographer explorer role (chosen at game start, `RoleSelect.tsx`)
gets a bonus 6th photo to collect for every animal, on top of the normal 5 (`src/data/
animalPhotoVariants.ts`'s `PHOTO_VARIANT_COUNTS`, currently `5` for every animal with art). Since that
art doesn't exist yet, the feature currently ships as an honest "locked, coming soon" preview tile in the
Photo Album (`PhotoAlbum.tsx`'s `.bonus-slot`) rather than a real unlockable photo — visible only when
Wildlife Photographer is the selected role, never wired into actual collection/completion logic. This
package generates the missing art so a follow-up change can wire it in for real.

**The animal roster** — all 10 animals that currently have photo art, **except `lost-puppy`** (its single
variant is a one-off quest reunion keepsake, not a huntable collectible, so it's deliberately excluded
from the bonus-photo feature): `duck`, `frog`, `butterfly`, `rabbit`, `lizard`, `park-bird`, `rare-owl`,
`forest-wren`, `forest-wallaby`, `forest-beetle`.

**Existing file naming convention:** `public/assets/animals/<id>-<variant>.jpg`, variants numbered 1-5
today. The bonus photo would be `<id>-6.jpg` once wired in (do not add these files to the repo yet as
part of Track A — hand the raw generated images to Claude, who converts PNG→JPEG and places them, same
as every prior batch).

---

## Track A — Art brief (image generation, 10 animals × 1 photo = 10 images)

Generate 10 square images, **1024×1024** (or any square 1:1 ratio — Claude resizes/converts on the way
in, same as every prior batch), no text/logos/watermarks, no border or frame baked into the image.

**Master style prompt — use this exact wording as the shared preamble for every animal below, then add
the one-line subject description for that animal:**

> Bright, colourful, storybook-realistic wildlife adventure art — same style as the Wildlife Explorer
> reference art (attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`): warm digital
> painting, cute but believable and recognisable animals, fine painterly texture, warm natural lighting
> (not flat vector cartoon, not photographic). Square close-up portrait composition: the animal is the
> clear, centered subject filling most of the frame in a natural, characteristic pose, distinctly
> different in pose/angle/lighting from this animal's existing 5 photos so it reads as a genuinely new
> "bonus" shot, not a duplicate. No people, no text, no cages, no distress. The animal must be unclothed,
> not talking, not posed unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (bonus shot) | Subject line to append to the master prompt |
|---|---|---|
| `duck` | `duck-6.png` | A duck taking flight just above the pond's surface, wings spread wide, water droplets catching the light. |
| `frog` | `frog-6.png` | A frog mid-leap over a lily pad, legs extended, caught in a dynamic action pose. |
| `butterfly` | `butterfly-6.png` | A butterfly in flight above a meadow flower, wings mid-flutter, soft motion blur at the wingtips. |
| `rabbit` | `rabbit-6.png` | A rabbit mid-hop over a low patch of grass, ears up, an alert and joyful "binky" leap. |
| `lizard` | `lizard-6.png` | A lizard basking on a sunlit rock with its head tilted up, close-up on its textured scales. |
| `park-bird` | `park-bird-6.png` | A small park bird mid-song, beak open, perched on a thin branch with leaves framing it. |
| `rare-owl` | `rare-owl-6.png` | A rare owl in silent flight between branches at dusk, wings fully spread, a magical quiet moment. |
| `forest-wren` | `forest-wren-6.png` | A forest wren foraging low in leaf litter, tail cocked up, caught looking directly at the camera. |
| `forest-wallaby` | `forest-wallaby-6.png` | A forest wallaby mid-hop through dappled forest shade, alert and in motion. |
| `forest-beetle` | `forest-beetle-6.png` | A shiny forest beetle close-up on a leaf, shell catching the light, antennae visible. |

**Why "distinctly different" matters more here than in prior batches:** every other 5-variant batch just
needed 5 photos that felt like different sightings of the same species. This one bonus photo is a
*reward* shown only to one explorer role, so it should read as the most exciting or dynamic shot of the
bunch (action/flight/motion poses above, contrasting with the calmer resting/basking poses already used
for variants 1-5) rather than another calm portrait indistinguishable from the existing set.

---

## Track B — code spec (already shipped in preview form; this is the follow-up once art lands)

**What's already live (2026-07-28):** `src/data/roleBonuses.ts`'s `getsBonusPhotoSlot()`, `PhotoAlbum.tsx`
renders a `.bonus-slot` locked "Bonus photo — coming soon" tile for Wildlife Photographer, and
`RoleSelect.tsx`'s description already promises it. None of this touches `PHOTO_VARIANT_COUNTS`,
`isCollectionComplete()`, or `pickRandomUncollectedVariant()` — those all still only know about 5 real
variants, so nothing is at risk of a broken image load in the meantime.

**Follow-up once the 10 images above exist** (not part of this package's Track A hand-off, a later task):
1. Add the 10 new `<id>-6.jpg` files to `public/assets/animals/` (Claude converts PNG→JPEG the same way
   as every prior batch).
2. Change `PHOTO_VARIANT_COUNTS` in `src/data/animalPhotoVariants.ts` from a flat number to a per-role
   lookup, or add a parallel `getEffectivePhotoVariantCount(id, selectedRole)` used everywhere
   `getPhotoVariantCount` is currently called in gameplay logic (not just display) - variant 6 should
   only ever be reachable for a Wildlife Photographer save.
3. Remove `PhotoAlbum.tsx`'s hardcoded `.bonus-slot` "coming soon" tile once slot 6 is a real, sometimes-
   collected slot driven by the same `collected.includes(...)` logic as slots 1-5.
4. Re-verify `isCollectionComplete()`'s semantics deliberately: for a Wildlife Photographer, "complete"
   should mean 6 of 6, not 5 of 5 - decide whether that's the intended feel (a slightly longer collection
   goal for that role, matching "encourages playthrough") before shipping, since it changes what the
   Journal calls "collection complete" for that role.
5. Add tests covering: variant 6 is only ever offered to a Wildlife Photographer save,
   `isCollectionComplete` requires 6 for that role and 5 for every other role/no role, and the album's
   6th slot behaves exactly like slots 1-5 (locked until collected, then shows the real photo).
6. Manually verify in a real browser: a Wildlife Photographer save can eventually collect and see photo 6
   in the album; any other role never sees it as collectible, only as the existing "coming soon" tile
   collapses away entirely (i.e. that visual should only be shown for Wildlife Photographer + the art not
   yet existing - once art exists, it becomes a normal locked/unlocked slot, not a permanent preview).

**Done when (for this package's actual scope, Track A only):** 10 bonus photos generated, converted, and
placed at `public/assets/animals/<id>-6.jpg`; `npm run check` still passes (no code depends on these
files existing yet, so nothing should break either way); the Track B follow-up is logged as its own
task-board entry once art lands, not assumed to happen automatically.
