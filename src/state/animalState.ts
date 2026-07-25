import { animals, commonMilestoneAnimals } from '../data/animals';
import type { Animal } from '../types/Animal';
import type { AnimalId, LocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { checkTutorialCompletion } from './progressionState';
import { addUnique } from './stateUtils';

export function getAnimalById(animalId: AnimalId): Animal | undefined {
  return animals.find((animal) => animal.id === animalId);
}

export function getAnimalsForLocation(locationName: LocationName, saveData?: SaveData): Animal[] {
  return animals.filter((animal) => {
    if (animal.habitat !== locationName) return false;
    if (animal.id === 'rare-owl') return Boolean(saveData?.rareOwlSpotted);
    return animal.availableInMilestone && animal.rarity === 'common';
  });
}

export function hasPhotographedAnimal(saveData: SaveData, animalId: AnimalId): boolean {
  return saveData.photographedAnimals.includes(animalId);
}

export function photographAnimal(saveData: SaveData, animalId: AnimalId): SaveData {
  const animal = getAnimalById(animalId);
  if (!animal) return saveData;
  if (animal.id === 'rare-owl' && !saveData.rareOwlSpotted) return saveData;
  if (animal.rarity !== 'common' && animal.id !== 'rare-owl') return saveData;

  return checkTutorialCompletion({
    ...saveData,
    discoveredAnimals: addUnique(saveData.discoveredAnimals, animalId),
    photographedAnimals: addUnique(saveData.photographedAnimals, animalId),
    reportedInvasiveSpecies: animal.nonNative ? addUnique(saveData.reportedInvasiveSpecies, animalId) : saveData.reportedInvasiveSpecies,
  });
}

export function getCommonPhotoCount(saveData: SaveData): number {
  return saveData.photographedAnimals.filter((animalId) =>
    commonMilestoneAnimals.some((animal) => animal.id === animalId)
  ).length;
}
