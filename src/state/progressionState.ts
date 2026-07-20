import type { SaveData } from '../types/SaveData';

export function isTutorialComplete(saveData: SaveData): boolean {
  return saveData.questProgress.lostPuppy.completed
    && saveData.whisperGroveDiscovered
    && saveData.photographedAnimals.includes('rare-owl');
}

export function checkTutorialCompletion(saveData: SaveData): SaveData {
  if (saveData.wildCamperUnlocked || !isTutorialComplete(saveData)) return saveData;
  return { ...saveData, wildCamperUnlocked: true };
}
