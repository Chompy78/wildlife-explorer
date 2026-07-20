import type { SaveData } from '../types/SaveData';
import { createDefaultSave, defaultLostPuppyQuestProgress, defaultSaveData } from './saveDefaults';
import { migrateSaveData } from './saveMigration';

export { defaultLostPuppyQuestProgress, defaultSaveData, createDefaultSave, migrateSaveData };

export const SAVE_KEY = 'wildlife-explorer-save-v5';
export const OLD_SAVE_KEYS = [
  'wildlife-explorer-save-v4-1',
  'wildlife-explorer-save-v4',
  'wildlife-explorer-save-v3-2',
  'wildlife-explorer-save-v3-tutorial-complete',
  'wildlife-explorer-save-v2-1-clean',
  'wildlife-explorer-save-v2-lost-puppy',
  'wildlife-explorer-save-v1-5-1',
  'wildlife-explorer-save-v1-5',
  'wildlife-explorer-save-v1',
];

export function loadSave(): SaveData {
  const raw = localStorage.getItem(SAVE_KEY) ?? findOldSave();
  if (!raw) return createDefaultSave();
  try {
    return migrateSaveData(JSON.parse(raw));
  } catch {
    return createDefaultSave();
  }
}

export function saveGame(data: SaveData): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
  OLD_SAVE_KEYS.forEach((key) => localStorage.removeItem(key));
}

function findOldSave(): string | null {
  for (const key of OLD_SAVE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) return raw;
  }
  return null;
}
