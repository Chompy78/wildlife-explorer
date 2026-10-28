import type { AnimalId, LakeLocationName } from '../types/Ids';

export type LakeLocation = { name: LakeLocationName; icon: string; description: string; animalIds: AnimalId[] };

// The three Lake sections, two animals each - the same grouping the Lake art was generated under
// (docs/copilot-packages/04-lake-biome-animals.md).
export const lakeLocations: LakeLocation[] = [
  { name: 'Shoreline', icon: '🏞️', description: 'A quiet bank where herons stand watch and beavers rest.', animalIds: ['great-blue-heron', 'beaver'] },
  { name: 'Open Water', icon: '🌊', description: 'Calm, open water where loons float and trout glint below.', animalIds: ['loon', 'rainbow-trout'] },
  { name: 'Reeds & Shallows', icon: '🌾', description: 'Sheltered reeds and warm shallows, busy with small life.', animalIds: ['dragonfly', 'painted-turtle'] },
];

export const lakeAnimalIds: AnimalId[] = lakeLocations.flatMap((location) => location.animalIds);
