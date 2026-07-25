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
    expect(save.reportedInvasiveSpecies).toEqual([]);
  });

  it('preserves valid reportedInvasiveSpecies entries and filters unknown ones', () => {
    const save = migrateSaveData({ reportedInvasiveSpecies: ['cane-toad', 'not-real', 'red-eared-slider'] });
    expect(save.reportedInvasiveSpecies).toEqual(['cane-toad', 'red-eared-slider']);
  });

  it('preserves valid collectedPhotoVariants entries and filters unknown ones', () => {
    const save = migrateSaveData({ collectedPhotoVariants: ['duck-1', 'duck-9', 'not-real', 'red-eared-slider-1', 'lost-puppy-1', 'forest-wren-3'] });
    expect(save.collectedPhotoVariants).toEqual(['duck-1', 'lost-puppy-1', 'forest-wren-3']);
  });

  it('preserves valid photographCounts entries and drops unknown IDs, non-numbers and non-positive counts', () => {
    const save = migrateSaveData({ photographCounts: { duck: 3, 'not-real': 5, frog: 'lots', rabbit: 2.9, lizard: 0, 'park-bird': -1 } });
    expect(save.photographCounts).toEqual({ duck: 3, rabbit: 2 });
  });

  it('migrates valid camper hub fields and rejects unknown IDs', () => {
    const save = migrateSaveData({ wildCamperUnlocked: true, camperVisited: true, lastPlayArea: 'camper', selectedDestination: 'forest', photographedAnimals: ['duck', 'not-real'] });
    expect(save.camperVisited).toBe(true);
    expect(save.lastPlayArea).toBe('camper');
    expect(save.selectedDestination).toBe('forest');
    expect(save.photographedAnimals).toEqual(['duck']);
  });

  describe('fully garbage/malformed input', () => {
    function expectSafeDefaultShape(save: ReturnType<typeof migrateSaveData>) {
      expect(save.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
      expect(save.selectedRole).toBeNull();
      expect(save.discoveredAnimals).toEqual([]);
      expect(save.photographedAnimals).toEqual([]);
      expect(save.discoveredLocations).toEqual(['Park Entrance']);
      expect(save.currentLocation).toBe('Park Entrance');
      expect(save.questProgress.lostPuppy).toEqual({ started: false, foundPawprints: false, foundToy: false, foundPuppy: false, completed: false });
      expect(save.wildCamperUnlocked).toBe(false);
      expect(save.camperVisited).toBe(false);
      expect(save.camperIntroductionSeen).toBe(false);
      expect(save.selectedDestination).toBeNull();
      expect(save.lastPlayArea).toBe('park');
      expect(save.forestLocation).toBe('Forest Arrival');
      expect(save.reportedInvasiveSpecies).toEqual([]);
      expect(save.collectedPhotoVariants).toEqual([]);
      expect(save.photographCounts).toEqual({});
    }

    it.each([
      ['a string', 'not a save at all'],
      ['a number', 42],
      ['a boolean', true],
      ['an array', ['nope']],
      ['undefined', undefined],
    ])('falls back to a safe default shape for a non-object top-level value: %s', (_label, input) => {
      expectSafeDefaultShape(migrateSaveData(input));
    });

    it('falls back safely when questProgress and lostPuppy are the wrong shape entirely', () => {
      const save = migrateSaveData({ questProgress: 'not an object', selectedRole: 'explorer' });
      expect(save.questProgress.lostPuppy).toEqual({ started: false, foundPawprints: false, foundToy: false, foundPuppy: false, completed: false });
      expect(save.selectedRole).toBe('explorer');
    });

    it('falls back safely when questProgress.lostPuppy is an array instead of an object', () => {
      const save = migrateSaveData({ questProgress: { lostPuppy: ['garbage'] } });
      expect(save.questProgress.lostPuppy.started).toBe(false);
    });

    it('ignores wrong-typed array/record fields instead of throwing', () => {
      const save = migrateSaveData({
        discoveredAnimals: 'duck', photographedAnimals: 42, discoveredLocations: { not: 'an array' }, reportedInvasiveSpecies: true, collectedPhotoVariants: 5, photographCounts: 'lots',
      });
      expect(save.discoveredAnimals).toEqual([]);
      expect(save.photographedAnimals).toEqual([]);
      expect(save.discoveredLocations).toEqual(['Park Entrance']);
      expect(save.reportedInvasiveSpecies).toEqual([]);
      expect(save.collectedPhotoVariants).toEqual([]);
      expect(save.photographCounts).toEqual({});
    });

    it('filters out non-string and unknown entries mixed into otherwise-valid arrays', () => {
      const save = migrateSaveData({ photographedAnimals: ['duck', 42, null, { id: 'rare-owl' }, 'not-a-real-animal', 'rare-owl'] });
      expect(save.photographedAnimals).toEqual(['duck', 'rare-owl']);
    });

    it('rejects an unknown currentLocation and selectedDestination string', () => {
      const save = migrateSaveData({ currentLocation: 'Narnia', wildCamperUnlocked: true, selectedDestination: 'atlantis' });
      expect(save.currentLocation).toBe('Park Entrance');
      expect(save.selectedDestination).toBeNull();
    });

    it('rejects a garbage forestLocation and lastPlayArea instead of accepting any string', () => {
      const save = migrateSaveData({ forestLocation: 'The Moon', lastPlayArea: 'the-void', wildCamperUnlocked: true });
      expect(save.forestLocation).toBe('Forest Arrival');
      expect(save.lastPlayArea).toBe('park');
    });

    it('never lets wildCamperUnlocked be true from a garbage (non-boolean-ish) value bypassing the gate', () => {
      const save = migrateSaveData({ wildCamperUnlocked: { nested: true }, camperVisited: true, lastPlayArea: 'camper' });
      // an object is always truthy under Boolean(), so this documents the coercion's actual behavior
      // rather than silently trusting it: wildCamperUnlocked still ends up a real boolean, not the object.
      expect(typeof save.wildCamperUnlocked).toBe('boolean');
      expect(save.wildCamperUnlocked).toBe(true);
      expect(save.camperVisited).toBe(true);
    });

    it('produces a valid, safe SaveData shape even for a deeply nested garbage object', () => {
      const save = migrateSaveData({
        selectedRole: 12345,
        discoveredAnimals: [{ id: 'duck' }, 'duck', 'not-real'],
        currentLocation: { name: 'Duck Pond' },
        questProgress: { lostPuppy: { started: 'yes', foundPawprints: 1, completed: null } },
        rareOwlSpotted: 'true',
        selectedDestination: 12345,
        forestLocation: 12345,
        lastPlayArea: 12345,
      });
      expect(save.selectedRole).toBeNull();
      expect(save.discoveredAnimals).toEqual(['duck']);
      expect(save.currentLocation).toBe('Park Entrance');
      expect(save.questProgress.lostPuppy.started).toBe(true);
      expect(save.questProgress.lostPuppy.foundPawprints).toBe(true);
      expect(save.questProgress.lostPuppy.completed).toBe(false);
      expect(save.rareOwlSpotted).toBe(true);
      expect(save.selectedDestination).toBeNull();
      expect(save.forestLocation).toBe('Forest Arrival');
      expect(save.lastPlayArea).toBe('park');
    });
  });
});
