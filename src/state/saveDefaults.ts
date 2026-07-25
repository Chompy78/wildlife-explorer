import type { LostPuppyQuestProgress } from '../types/Quest';
import { CURRENT_SAVE_SCHEMA_VERSION, type SaveData } from '../types/SaveData';

export const defaultLostPuppyQuestProgress: LostPuppyQuestProgress = {
  started: false, foundPawprints: false, foundToy: false, foundPuppy: false, completed: false,
};

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
  reportedInvasiveSpecies: [],
  collectedPhotoVariants: [],
  photographCounts: {},
};

export function createDefaultSave(): SaveData {
  return {
    ...defaultSaveData,
    discoveredAnimals: [], photographedAnimals: [], discoveredLocations: ['Park Entrance'],
    questProgress: { lostPuppy: { ...defaultLostPuppyQuestProgress } },
    reportedInvasiveSpecies: [],
    collectedPhotoVariants: [],
    photographCounts: {},
  };
}
