import { getAnimalById } from './animalState';
import { bumpCount } from './stateUtils';
import { pickRandomUncollectedVariant } from '../data/animalPhotoVariants';
import type { AnimalId } from '../types/Ids';
import type { SaveData } from '../types/SaveData';

// Shared photograph step for the data-driven biomes (Lake, Mountains). Ignores animals that don't belong
// to the biome. An animal with no photo art yet is still recorded as photographed/discovered - it just
// hands out no collectible variant.
export function photographBiomeAnimal(save: SaveData, id: AnimalId, biomeAnimalIds: readonly AnimalId[]): SaveData {
  if (!biomeAnimalIds.includes(id)) return save;
  const animal = getAnimalById(id);
  const variant = pickRandomUncollectedVariant(id, save.collectedPhotoVariants);
  return {
    ...save,
    discoveredAnimals: [...new Set([...save.discoveredAnimals, id])],
    photographedAnimals: [...new Set([...save.photographedAnimals, id])],
    reportedInvasiveSpecies: animal?.nonNative ? [...new Set([...save.reportedInvasiveSpecies, id])] : save.reportedInvasiveSpecies,
    collectedPhotoVariants: variant ? [...new Set([...save.collectedPhotoVariants, `${id}-${variant}`])] : save.collectedPhotoVariants,
    photographCounts: bumpCount(save.photographCounts, id),
  };
}
