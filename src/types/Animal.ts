import type { AnimalId, LocationName } from './Ids';

export type AnimalRarity = 'common' | 'rare' | 'quest';

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
};
