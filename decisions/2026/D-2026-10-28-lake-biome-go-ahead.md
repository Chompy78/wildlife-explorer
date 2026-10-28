# D-2026-10-28-lake-biome-go-ahead — Lake becomes the second playable destination

Date: 2026-10-28
Status: Active

- **Context:** `AI.md`'s Scope boundary bars "another playable destination" unless a later milestone
  explicitly requires it. The Lake art (6 animals x 5 photos) had been banked since 2026-07-25 in
  `public/assets/lake/`, waiting on that call.
- **Decision:** the user explicitly asked for the Lake to be built ("build the lake, audio and
  day/night"), which is the explicit milestone call the Scope boundary requires. Only the Lake is
  unlocked; Mountains, Safari, Rainforest and Alien Planet stay preview-only.
- **What was built:** Shoreline / Open Water / Reeds & Shallows (2 animals each), reached from the Wild
  Camper's Journey Planner (`LakeScreen.tsx`, `lakeState.ts`, `lakeLocations.ts`). Same camera, photo
  reveal and 5-photos-and-5-facts collection as Park and Forest. Save schema 9 -> 10 adds `lakeLocation`
  and a `'lake'` play area; the migration defaults both for older saves. Art moved to
  `public/assets/animals/`, with `heron-*` renamed `great-blue-heron-*` to match the animal id.
- **Canon check:** calm observation only; no combat, collecting or harm; all six Lake animals are native
  (no `nonNative` entries). The Red-eared Slider's "where does it belong" answer was already Lake.
- **Decision within the decision:** Lake animals are excluded from `commonMilestoneAnimals`, so the
  tutorial's "Photograph all common animals" item and the Photo Wall tally do not get harder to finish.
- **Not verified visually:** the browser tool could not reach the local dev server, so the Lake screen
  layout was tested by component/state tests only, not by eye. Worth a look on a real device.
- **Status:** Active.
