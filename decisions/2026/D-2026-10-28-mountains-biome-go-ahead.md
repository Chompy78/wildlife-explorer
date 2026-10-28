# D-2026-10-28-mountains-biome-go-ahead — Mountains becomes the third playable destination, without photo art

Date: 2026-10-28
Status: Active

- **Context:** after the Lake shipped, the user said "do the next biome" without naming one. Mountains is
  the next entry in the Journey Planner's list.
- **Options:** (A) build Mountains now with emoji in place of photos, then add art later; (B) wait until
  30 photos exist. Chose A: the game already falls back to emoji for animals without photo art, and the
  user asked for progress without being asked questions.
- **Decision:** Rocky Trail (Mountain Goat, Marmot), Alpine Meadow (Pika, Mountain Hare), Lookout Ridge
  (Golden Eagle, Mountain Bluebird). Save schema 10 -> 11 adds `mountainLocation` and a `'mountains'` play
  area. Lake and Mountains now share one config-driven `BiomeScreen` and `photographBiomeAnimal`; the
  Forest screen was deliberately left alone.
- **Consequence:** these animals can be photographed and are recorded in the Journal, but hand out no
  collectible photos or per-photo facts. The photo-less case shows the animal's fun fact in the message
  box instead. Mountains has no `nonNative` animals. Excluded from `commonMilestoneAnimals`, as with the
  Lake. Follow-up: a board task to generate and wire the art.
- **Canon check:** calm observation only; no combat, collecting or harm.
- **Not verified visually:** same limitation as the Lake - the browser could not reach the dev server.
- **Status:** Active.
