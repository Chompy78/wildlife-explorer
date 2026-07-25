import { getAnimalById } from './animalState';
import type { AnimalId } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
export const forestAnimalIds: AnimalId[] = ['forest-wren', 'forest-wallaby', 'forest-beetle', 'cane-toad'];
export function enterForest(save: SaveData): SaveData { return save.wildCamperUnlocked ? { ...save, selectedDestination: 'forest', lastPlayArea: 'forest' } : save; }
export function moveInForest(save: SaveData, forestLocation: 'Forest Arrival' | 'Fern Trail'): SaveData { return { ...save, forestLocation }; }
export function returnToCamperFromForest(save: SaveData): SaveData { return { ...save, lastPlayArea: 'camper', camperVisited: true }; }
export function photographForestAnimal(save: SaveData, id: AnimalId): SaveData {
  if (!forestAnimalIds.includes(id)) return save;
  const animal = getAnimalById(id);
  return {
    ...save,
    discoveredAnimals: [...new Set([...save.discoveredAnimals, id])],
    photographedAnimals: [...new Set([...save.photographedAnimals, id])],
    reportedInvasiveSpecies: animal?.nonNative ? [...new Set([...save.reportedInvasiveSpecies, id])] : save.reportedInvasiveSpecies,
  };
}
