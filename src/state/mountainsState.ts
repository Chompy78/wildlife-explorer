import { photographBiomeAnimal } from './biomeState';
import { mountainAnimalIds } from '../data/mountainLocations';
import type { AnimalId, MountainLocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';

export { mountainAnimalIds };
export function enterMountains(save: SaveData): SaveData { return save.wildCamperUnlocked ? { ...save, selectedDestination: 'mountains', lastPlayArea: 'mountains' } : save; }
export function moveInMountains(save: SaveData, mountainLocation: MountainLocationName): SaveData { return { ...save, mountainLocation }; }
export function returnToCamperFromMountains(save: SaveData): SaveData { return { ...save, lastPlayArea: 'camper', camperVisited: true }; }
export function photographMountainAnimal(save: SaveData, id: AnimalId): SaveData { return photographBiomeAnimal(save, id, mountainAnimalIds); }
