# D-2026-10-28-safari-biome-go-ahead — Safari becomes the fourth playable destination, without photo art

Date: 2026-10-28
Status: Active

- **Context:** the user asked for "another biome" after Mountains (choice "e2"). Safari is the next
  unbuilt entry in the Journey Planner's list; Rainforest is the one after.
- **Decision:** same recipe as `D-2026-10-28-mountains-biome-go-ahead`, on the shared `BiomeScreen`:
  Waterhole (African Elephant, Hippo), Open Plains (Zebra, Giraffe), Acacia Grove (Meerkat,
  Lilac-breasted Roller). Save schema 11 -> 12 adds `safariLocation` and a `'safari'` play area. All
  animals are native; no combat, collecting or harm.
- **Consequence:** emoji only, no collectible photos, until art is made (board task "Safari art and photo
  wiring"). Excluded from `commonMilestoneAnimals`. Adding a biome now touches about a dozen files because
  each one needs its own save field, state module, journal tab and camper travel prop - a future
  refactor to a single biome registry would cut that, and is worth doing before biome number five.
- **Not verified visually:** the browser could not reach the dev server.
- **Status:** Active.
