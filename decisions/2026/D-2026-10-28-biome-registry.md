# D-2026-10-28-biome-registry — one registry for the data-driven biomes

Date: 2026-10-28
Status: Active

- **Context:** after the Lake, Mountains and Safari, each new biome meant a new save field, state module,
  data file, screen wrapper, Journal tab, App route and camper travel prop - about a dozen files, flagged in
  `D-2026-10-28-safari-biome-go-ahead` as worth fixing before biome number five.
- **Decision:** `src/data/biomes.ts` is now the single list of data-driven biomes (id, save key, three
  sections of two animals, ambient sound, screen text, Journal text). One generic `BiomeScreen`,
  `state/biomeState.ts`, journal tab generator, camper travel button and migration loop all read from it.
  Nine per-biome files were deleted. The Forest and Park keep their own screens.
- **Save compatibility:** the SaveData field names (`lakeLocation`, `mountainLocation`, `safariLocation`)
  and schema version 12 are unchanged, so existing saves load as before. Biome location fields are now
  plain strings, validated against the registry in migration.
- **How to add a biome now:** add the id to `BiomeId` and its field to `BiomeLocationKey`
  (`types/Biome.ts`), the field to `SaveData`, the animal ids to `AnimalId` (`types/Ids.ts`), the animals to
  `animals.ts`, and one entry to `biomes.ts`. `data/biomes.test.ts` checks the entry is consistent.
- **Verification:** all pre-existing Lake/Mountains/Safari tests pass unchanged; the per-biome state tests
  were replaced by one table-driven `biomeState.test.ts`.
- **Status:** Active.
