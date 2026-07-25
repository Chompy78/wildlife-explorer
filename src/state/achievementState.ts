import { addUnique } from './stateUtils';
import type { AchievementId } from '../types/Achievement';
import type { SaveData } from '../types/SaveData';

export function unlockAchievement(saveData: SaveData, id: AchievementId): SaveData {
  return { ...saveData, achievements: addUnique(saveData.achievements, id) };
}
