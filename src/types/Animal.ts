import type { DestinationId } from './Destination';
import type { AnimalId, LocationName } from './Ids';

export type AnimalRarity = 'common' | 'rare' | 'quest';

// Present only on animals that don't naturally belong in the habitat they're found in (e.g. an
// introduced/invasive species). Drives the "where does it belong" HabitatQuiz shown after the first
// photograph, and the extra note shown in the Wildlife Journal. Absent on every native animal.
export type NonNativeInfo = {
  correctHabitatId: DestinationId;
  impactNote: string;
};

export type Animal = {
  id: AnimalId;
  name: string;
  rarity: AnimalRarity;
  habitat: LocationName;
  activeTime: string;
  funFact: string;
  behaviours: string[];
  emoji: string;
  availableInMilestone: boolean;
  nonNative?: NonNativeInfo;
};
