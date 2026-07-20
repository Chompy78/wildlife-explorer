import type { SaveData } from '../types/SaveData';
import { checkTutorialCompletion } from './progressionState';
import { addUnique } from './stateUtils';

export function hasHelpedLostPuppy(saveData: SaveData): boolean {
  return saveData.questProgress.lostPuppy.completed;
}

export function startLostPuppyQuest(saveData: SaveData): SaveData {
  if (saveData.questProgress.lostPuppy.completed) return saveData;
  return patchLostPuppyQuest(saveData, { started: true });
}

export function findPawprints(saveData: SaveData): SaveData {
  const quest = saveData.questProgress.lostPuppy;
  if (!quest.started || quest.completed) return saveData;
  return patchLostPuppyQuest(saveData, { foundPawprints: true });
}

export function findChewToy(saveData: SaveData): SaveData {
  const quest = saveData.questProgress.lostPuppy;
  if (!quest.started || !quest.foundPawprints || quest.completed) return saveData;
  return patchLostPuppyQuest(saveData, { foundToy: true });
}

export function findLostPuppy(saveData: SaveData): SaveData {
  const quest = saveData.questProgress.lostPuppy;
  if (!quest.started || !quest.foundPawprints || !quest.foundToy || quest.completed) return saveData;
  return patchLostPuppyQuest(saveData, { foundPuppy: true });
}

export function completeLostPuppyQuest(saveData: SaveData): SaveData {
  const quest = saveData.questProgress.lostPuppy;
  if (!quest.started || !quest.foundPawprints || !quest.foundToy || !quest.foundPuppy) return saveData;
  const updated = patchLostPuppyQuest(saveData, { completed: true });
  return checkTutorialCompletion({
    ...updated,
    discoveredAnimals: addUnique(updated.discoveredAnimals, 'lost-puppy'),
  });
}

export function getLostPuppyQuestHint(saveData: SaveData): string {
  const quest = saveData.questProgress.lostPuppy;
  if (quest.completed) return 'The puppy has been reunited. Great helping!';
  if (quest.foundPuppy) return 'Return to Park Entrance for the gentle reunion.';
  if (quest.foundToy) return 'Look carefully on the Forest Trail. The puppy may be nearby.';
  if (quest.foundPawprints) return 'The pawprints point toward the Forest Trail. Look for a chew toy.';
  if (quest.started) return 'Search Open Meadow for gentle pawprint clues.';
  return 'Talk to the owner at Park Entrance to start helping.';
}

function patchLostPuppyQuest(saveData: SaveData, patch: Partial<SaveData['questProgress']['lostPuppy']>): SaveData {
  return {
    ...saveData,
    questProgress: {
      ...saveData.questProgress,
      lostPuppy: { ...saveData.questProgress.lostPuppy, ...patch },
    },
  };
}
