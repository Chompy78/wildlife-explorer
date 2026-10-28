import { photographBiomeAnimal } from './biomeState';
import { lakeAnimalIds } from '../data/lakeLocations';
import type { AnimalId, LakeLocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';

export { lakeAnimalIds };
export function enterLake(save: SaveData): SaveData { return save.wildCamperUnlocked ? { ...save, selectedDestination: 'lake', lastPlayArea: 'lake' } : save; }
export function moveInLake(save: SaveData, lakeLocation: LakeLocationName): SaveData { return { ...save, lakeLocation }; }
export function returnToCamperFromLake(save: SaveData): SaveData { return { ...save, lastPlayArea: 'camper', camperVisited: true }; }
export function photographLakeAnimal(save: SaveData, id: AnimalId): SaveData { return photographBiomeAnimal(save, id, lakeAnimalIds); }
