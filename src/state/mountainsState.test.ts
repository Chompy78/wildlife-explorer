import { describe, expect, it } from 'vitest';
import { commonMilestoneAnimals } from '../data/animals';
import { getPhotoVariantCount } from '../data/animalPhotoVariants';
import { createDefaultSave } from './saveGame';
import { enterMountains, mountainAnimalIds, moveInMountains, photographMountainAnimal, returnToCamperFromMountains } from './mountainsState';

const unlocked = { ...createDefaultSave(), wildCamperUnlocked: true };

describe('mountainsState', () => {
  it('blocks Mountains travel before the Wild Camper unlocks', () => {
    const save = createDefaultSave();
    expect(enterMountains(save)).toEqual(save);
  });

  it('enters, moves between sections, and returns to the camper', () => {
    const inMountains = enterMountains(unlocked);
    expect(inMountains.lastPlayArea).toBe('mountains');
    expect(inMountains.selectedDestination).toBe('mountains');
    expect(moveInMountains(inMountains, 'Lookout Ridge').mountainLocation).toBe('Lookout Ridge');
    expect(returnToCamperFromMountains(inMountains).lastPlayArea).toBe('camper');
  });

  it('records a photographed animal that has no photo art yet, without handing out a variant', () => {
    expect(getPhotoVariantCount('marmot')).toBe(0);
    const save = photographMountainAnimal(unlocked, 'marmot');
    expect(save.photographedAnimals).toContain('marmot');
    expect(save.discoveredAnimals).toContain('marmot');
    expect(save.collectedPhotoVariants).toEqual([]);
    expect(save.photographCounts.marmot).toBe(1);
    expect(photographMountainAnimal(unlocked, 'duck')).toEqual(unlocked);
  });

  it('has six animals and keeps them out of the tutorial common-animal count', () => {
    expect(mountainAnimalIds).toHaveLength(6);
    for (const id of mountainAnimalIds) expect(commonMilestoneAnimals.some((a) => a.id === id)).toBe(false);
  });
});
