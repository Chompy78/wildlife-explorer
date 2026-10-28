import type { LostPuppyQuestProgress } from '../types/Quest';
import { biomes } from '../data/biomes';
import type { BiomeLocationKey } from '../types/Biome';
import { CURRENT_SAVE_SCHEMA_VERSION, type SaveData } from '../types/SaveData';

export const defaultLostPuppyQuestProgress: LostPuppyQuestProgress = {
  started: false, foundPawprints: false, foundToy: false, foundPuppy: false, completed: false,
};

// Every data-driven biome starts in its first section.
export function defaultBiomeLocations(): Pick<SaveData, BiomeLocationKey> {
  return Object.fromEntries(biomes.map((biome) => [biome.saveKey, biome.locations[0].name])) as Pick<SaveData, BiomeLocationKey>;
}

export const defaultSaveData: SaveData = {
  schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
  selectedRole: null,
  discoveredAnimals: [],
  photographedAnimals: [],
  discoveredLocations: ['Park Entrance'],
  currentLocation: 'Park Entrance',
  questProgress: { lostPuppy: { ...defaultLostPuppyQuestProgress } },
  rareOwlSpotted: false,
  whisperGroveDiscovered: false,
  wildCamperUnlocked: false,
  camperVisited: false,
  camperIntroductionSeen: false,
  selectedDestination: null,
  lastPlayArea: 'park',
  forestLocation: 'Forest Arrival',
  ...defaultBiomeLocations(),
  reportedInvasiveSpecies: [],
  collectedPhotoVariants: [],
  photographCounts: {},
  achievements: [],
};

export function createDefaultSave(): SaveData {
  return {
    ...defaultSaveData,
    discoveredAnimals: [], photographedAnimals: [], discoveredLocations: ['Park Entrance'],
    questProgress: { lostPuppy: { ...defaultLostPuppyQuestProgress } },
    reportedInvasiveSpecies: [],
    collectedPhotoVariants: [],
    photographCounts: {},
    achievements: [],
  };
}
