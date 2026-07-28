import type { DestinationId } from './Destination';
import type { AnimalId, LocationName } from './Ids';

export type AnimalRarity = 'common' | 'rare' | 'quest';

// How forgiving this species' Camera-panel "Great Shot" glow timing is - independent of rarity (a rare
// animal isn't automatically harder to time, and vice versa). Maps to glow on/off durations in
// CameraPanel.tsx.
export type PhotoDifficulty = 'easy' | 'medium' | 'hard';

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
  photoDifficulty: PhotoDifficulty;
  nonNative?: NonNativeInfo;
};
