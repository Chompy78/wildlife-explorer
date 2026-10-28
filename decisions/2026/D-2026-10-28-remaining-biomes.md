# D-2026-10-28-remaining-biomes — the other eight biomes become playable at once

Date: 2026-10-28
Status: Active

- **Context:** after Rainforest the user chose option G2 and added "make all the remaining biomes". That
  is the explicit go-ahead the Scope boundary asks for, for every preview destination that was a real
  habitat. Same reasoning as `D-2026-10-28-biome-registry` and `D-2026-10-28-rainforest-biome`.
- **Decision:** Desert, Arctic, Coral Reef, Wetlands, Coastal, Grassland, Taiga and Volcanic Highlands each
  get three sections with two animals (48 new animals). Save schema 13 -> 14 adds one remembered-section
  field per biome. Emoji only until art exists; eight art briefs (09-16) and board tasks were written.
- **Left out on purpose:** Alien Planet. Its own preview text calls it a "special far-future mystery" that
  is "not part of the current playable build", so it is a different kind of destination, not another
  habitat. It stays preview-only.
- **Overlap:** Wetlands is close to the Lake, and Grassland is close to the Safari. They were kept
  distinct by animals and sections (marsh, mangrove and mudflat species; North American prairie species).
- **What it took:** the registry made each biome a data entry plus type lines, an ambient recipe, a
  CSS background and six animals. Tests: the Camper no-travel list now holds only Alien Planet; new
  table-driven App travel/Continue and save-migration tests run over the eight new biomes.
- **Canon check:** calm observation only. The larger animals (polar bear, lynx, moose) are shown at a
  respectful distance; nothing hunts, fights or gets collected. All animals are native to the habitat.
- **Not verified visually:** the browser could not reach the dev server.
- **Status:** Active.
