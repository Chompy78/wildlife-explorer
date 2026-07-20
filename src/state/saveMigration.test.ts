import { describe, expect, it } from 'vitest';
import { migrateSaveData } from './saveMigration';
import { CURRENT_SAVE_SCHEMA_VERSION } from '../types/SaveData';

describe('save migration', () => {
  it('normalizes a legacy partial save', () => {
    const save = migrateSaveData({ selectedRole: 'explorer', currentLocation: 'Duck Pond', photographedAnimals: ['duck'] });
    expect(save.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(save.selectedRole).toBe('explorer');
    expect(save.currentLocation).toBe('Duck Pond');
    expect(save.photographedAnimals).toEqual(['duck']);
    expect(save.questProgress.lostPuppy.completed).toBe(false);
  });

  it('falls back safely for malformed data', () => {
    const save = migrateSaveData(null);
    expect(save.currentLocation).toBe('Park Entrance');
    expect(save.discoveredAnimals).toEqual([]);
    expect(save.camperVisited).toBe(false);
    expect(save.selectedDestination).toBeNull();
  });

  it('migrates valid camper hub fields and rejects unknown IDs', () => {
    const save = migrateSaveData({ wildCamperUnlocked: true, camperVisited: true, lastPlayArea: 'camper', selectedDestination: 'forest', photographedAnimals: ['duck', 'not-real'] });
    expect(save.camperVisited).toBe(true);
    expect(save.lastPlayArea).toBe('camper');
    expect(save.selectedDestination).toBe('forest');
    expect(save.photographedAnimals).toEqual(['duck']);
  });
});
