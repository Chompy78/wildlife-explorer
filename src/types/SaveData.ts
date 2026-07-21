import type { DestinationId } from './Destination';
import type { LostPuppyQuestProgress } from './Quest';
import type { AnimalId, LocationName } from './Ids';

export const CURRENT_SAVE_SCHEMA_VERSION = 5 as const;
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
};
