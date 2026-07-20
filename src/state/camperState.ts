import type { DestinationId } from '../types/Destination';
import type { SaveData } from '../types/SaveData';

export function enterWildCamper(saveData: SaveData): SaveData {
  if (!saveData.wildCamperUnlocked) return saveData;
  return { ...saveData, camperVisited: true, lastPlayArea: 'camper' };
}
export function returnToTutorialPark(saveData: SaveData): SaveData { return { ...saveData, lastPlayArea: 'park' }; }
export function acknowledgeCamperIntroduction(saveData: SaveData): SaveData {
  if (!saveData.wildCamperUnlocked) return saveData;
  return { ...saveData, camperIntroductionSeen: true };
}
export function selectDestinationPreview(saveData: SaveData, destinationId: DestinationId): SaveData {
  if (!saveData.wildCamperUnlocked) return saveData;
  return { ...saveData, selectedDestination: destinationId };
}
export function clearDestinationPreview(saveData: SaveData): SaveData {
  if (!saveData.wildCamperUnlocked) return saveData;
  return { ...saveData, selectedDestination: null };
}
