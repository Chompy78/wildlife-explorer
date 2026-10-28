import { photographBiomeAnimal } from './biomeState';
import { safariAnimalIds } from '../data/safariLocations';
import type { AnimalId, SafariLocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';

export { safariAnimalIds };
export function enterSafari(save: SaveData): SaveData { return save.wildCamperUnlocked ? { ...save, selectedDestination: 'safari', lastPlayArea: 'safari' } : save; }
export function moveInSafari(save: SaveData, safariLocation: SafariLocationName): SaveData { return { ...save, safariLocation }; }
export function returnToCamperFromSafari(save: SaveData): SaveData { return { ...save, lastPlayArea: 'camper', camperVisited: true }; }
export function photographSafariAnimal(save: SaveData, id: AnimalId): SaveData { return photographBiomeAnimal(save, id, safariAnimalIds); }
