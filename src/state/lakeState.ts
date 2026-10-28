import { getAnimalById } from './animalState';
import { bumpCount } from './stateUtils';
import { lakeAnimalIds } from '../data/lakeLocations';
import { pickRandomUncollectedVariant } from '../data/animalPhotoVariants';
import type { AnimalId, LakeLocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';

export { lakeAnimalIds };
export function enterLake(save: SaveData): SaveData { return save.wildCamperUnlocked ? { ...save, selectedDestination: 'lake', lastPlayArea: 'lake' } : save; }
export function moveInLake(save: SaveData, lakeLocation: LakeLocationName): SaveData { return { ...save, lakeLocation }; }
export function returnToCamperFromLake(save: SaveData): SaveData { return { ...save, lastPlayArea: 'camper', camperVisited: true }; }
export function photographLakeAnimal(save: SaveData, id: AnimalId): SaveData {
  if (!lakeAnimalIds.includes(id)) return save;
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
