# D-2026-10-28-rainforest-biome — Rainforest becomes the fifth playable destination, via the registry

Date: 2026-10-28
Status: Active

- **Context:** the user asked for "f3" after the registry refactor and Safari art brief. The original F3
  option was "build Rainforest without the refactor"; because the user asked for F1 (refactor) first, it
  was built on the registry instead, which is cheaper and was the point of doing F1 first.
- **Decision:** Forest Floor (Tapir, Poison Dart Frog), Canopy Walk (Sloth, Scarlet Macaw), River Bank
  (Capybara, Green Iguana). Save schema 12 -> 13 adds `rainforestLocation`. Emoji only until art is made.
- **What it took:** one registry entry; the new id in `BiomeId` / `BiomeLocationKey`; one `SaveData` field;
  six `AnimalId`s; six `animals.ts` entries; an ambient sound recipe; destination text; a CSS background.
  The save migration's list of valid animals is now derived from `animals.ts`, so that edit is gone for
  future biomes. The table-driven biome tests and registry integrity test covered Rainforest automatically.
- **Canon check:** calm observation only; all six animals are native to the habitat shown. The Cane Toad's
  "where does it belong" answer was already Rainforest.
- **Not verified visually:** the browser could not reach the dev server.
- **Status:** Active.
