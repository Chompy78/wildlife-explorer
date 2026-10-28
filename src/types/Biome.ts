// The data-driven biomes (everything except the Park and the Forest, which have their own screens).
// To add one: add its id here, its save field below, then a single entry in src/data/biomes.ts.
export type BiomeId = 'lake' | 'mountains' | 'safari' | 'rainforest' | 'desert' | 'arctic' | 'coral-reef' | 'wetlands' | 'coastal' | 'grassland' | 'taiga' | 'volcanic-highlands' | 'alien-planet';

// The SaveData field that remembers which section of each biome the player was last in.
export type BiomeLocationKey = 'lakeLocation' | 'mountainLocation' | 'safariLocation' | 'rainforestLocation' | 'desertLocation' | 'arcticLocation' | 'coralReefLocation' | 'wetlandsLocation' | 'coastalLocation' | 'grasslandLocation' | 'taigaLocation' | 'volcanicHighlandsLocation' | 'alienPlanetLocation';
