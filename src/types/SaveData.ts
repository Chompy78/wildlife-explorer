import type { DestinationId } from './Destination';
import type { LostPuppyQuestProgress } from './Quest';
import type { AnimalId, LocationName } from './Ids';

export const CURRENT_SAVE_SCHEMA_VERSION = 8 as const;
export type GameScreen = 'start' | 'role-select' | 'park' | 'camper' | 'forest';
export type PlayArea = 'park' | 'camper' | 'forest';

export type SaveData = {
  schemaVersion: typeof CURRENT_SAVE_SCHEMA_VERSION;
  selectedRole: string | null;
  discoveredAnimals: AnimalId[];
  photographedAnimals: AnimalId[];
  discoveredLocations: LocationName[];
  currentLocation: LocationName;
  questProgress: { lostPuppy: LostPuppyQuestProgress };
  rareOwlSpotted: boolean;
  whisperGroveDiscovered: boolean;
  wildCamperUnlocked: boolean;
  camperVisited: boolean;
  camperIntroductionSeen: boolean;
  selectedDestination: DestinationId | null;
  lastPlayArea: PlayArea;
  forestLocation: 'Forest Arrival' | 'Fern Trail';
  reportedInvasiveSpecies: AnimalId[];
  // Collected photo variants, one entry per collected shot, e.g. "duck-3". See data/animalPhotoVariants.ts.
  collectedPhotoVariants: string[];
  // Times each species has been photographed via the camera (not the Lost Puppy reunion keepsake) -
  // drives the photo-quality progression in data/photoQuality.ts. Independent of collectedPhotoVariants,
  // so it keeps rising even once every variant for a species is collected.
  photographCounts: Partial<Record<AnimalId, number>>;
};
