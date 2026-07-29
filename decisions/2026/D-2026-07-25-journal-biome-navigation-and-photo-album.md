# D-2026-07-25-journal-biome-navigation-and-photo-album · Biome-select navigation and a real photo grid

Date: 2026-07-25
Status: Implemented

- **Context:** user feedback after using the shipped photo-collection/facts/quiz features: "The journal
  doesn't have any option to see the photos" - the Journal only ever showed one small circular thumbnail
  per animal (the lowest-collected variant), never the actual set of up to 5 photos being collected.
  Requested flow: open Journal, select a biome, scroll to the animal, press a button to open its photo
  album.
- **Decision 1 — how animals are grouped into a "biome":** there's no explicit biome field on `Animal` -
  every animal's `habitat` is a Tutorial Park `LocationName`, and the four real Forest animals
  (forest-wren, forest-wallaby, forest-beetle, cane-toad) all reuse `'Forest Trail'` as their nominal
  habitat too (a pre-existing quirk - `LocationName` only models Park locations, so Forest animals just
  reuse a Park location string for display purposes). Grouping instead reuses the already-authoritative
  `forestAnimalIds` list from `forestState.ts`: everything in it is "Forest", everything else in
  `animals` is "Tutorial Park". Lake has no animals wired in yet (art is banked, not playable), so it
  isn't offered as a category - matches Scope boundary.
- **Decision 2 — navigation shape:** a `JournalView` state (`'biomes' | 'park' | 'forest' | 'rewards'`)
  inside `Journal.tsx` itself, rather than a new modal-of-modals. Opening the Journal always starts on a
  3-card biome-select screen (Tutorial Park / Forest / Places & Rewards, each showing "X of Y discovered"),
  selecting one shows that category's existing content with a "← Back to biomes" button. Places and
  Rewards (Whisper Grove, Wild Camper) and the new Achievements section from the same day's quiz feature
  both moved under the third "Places & Rewards" card, since neither is animal- or biome-specific.
- **Decision 3 — the photo album is a real photo grid, not a bigger thumbnail:** new
  `src/components/PhotoAlbum.tsx`, a small modal (same `useModalFocus` pattern as every other modal this
  session) showing one grid cell per photo variant - the real collected image via `getPhotoVariantUrl` for
  each collected one, a 🔒 for each not-yet-collected one. Reads directly from
  `saveData.collectedPhotoVariants` - no new save state at all. A "View Photos" button appears on a
  `JournalEntry` only once the animal is discovered and has photo art (`getPhotoVariantCount(id) > 0`),
  reusing the exact discovery logic (`hasPhotographedAnimal`/Lost-Puppy-helped/Rare-Owl-spotted) that
  already governed the rest of that entry's display.
- **Status:** Implemented. `npm run check` passes (103 tests across 18 files - new dedicated
  `Journal.component.test.tsx` covering biome selection counts, per-biome filtering, Back navigation, the
  Places & Rewards/Achievements category, and the photo album opening with the correct collected/locked
  slots). Verified in a real browser: biome-select screen shows correct discovered counts per category,
  selecting Tutorial Park/Forest shows only that biome's animals, View Photos opens a grid showing exactly
  the collected variants as real photos and the rest as locked slots, and Back returns cleanly to biome
  selection.
