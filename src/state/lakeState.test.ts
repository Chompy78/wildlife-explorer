import { describe, expect, it } from 'vitest';
import { commonMilestoneAnimals } from '../data/animals';
import { getFactCount } from '../data/animalFacts';
import { getPhotoVariantCount } from '../data/animalPhotoVariants';
import { lakeAnimalIds } from '../data/lakeLocations';
import { createDefaultSave } from './saveGame';
import { enterLake, moveInLake, photographLakeAnimal, returnToCamperFromLake } from './lakeState';

const unlocked = { ...createDefaultSave(), wildCamperUnlocked: true };

describe('lakeState', () => {
  it('blocks Lake travel before the Wild Camper unlocks', () => {
    const save = createDefaultSave();
    expect(enterLake(save)).toEqual(save);
  });

  it('enters the Lake, moves between sections, and returns to the camper', () => {
    const inLake = enterLake(unlocked);
    expect(inLake.lastPlayArea).toBe('lake');
    expect(inLake.selectedDestination).toBe('lake');
    expect(moveInLake(inLake, 'Open Water').lakeLocation).toBe('Open Water');
    expect(returnToCamperFromLake(inLake).lastPlayArea).toBe('camper');
  });

  it('photographing a Lake animal records it and hands out one new photo variant', () => {
    const save = photographLakeAnimal(unlocked, 'loon');
    expect(save.photographedAnimals).toContain('loon');
    expect(save.discoveredAnimals).toContain('loon');
    expect(save.collectedPhotoVariants).toHaveLength(1);
    expect(save.collectedPhotoVariants[0]).toMatch(/^loon-[1-5]$/);
    expect(save.photographCounts.loon).toBe(1);
  });

  it('never hands out a duplicate variant and ignores non-Lake animals', () => {
    let save = unlocked;
    for (let i = 0; i < 8; i++) save = photographLakeAnimal(save, 'beaver');
    expect(new Set(save.collectedPhotoVariants).size).toBe(5);
    expect(photographLakeAnimal(unlocked, 'duck')).toEqual(unlocked);
  });

  it('gives every Lake animal 5 photos and 5 facts, and keeps them out of the tutorial common-animal count', () => {
    expect(lakeAnimalIds).toHaveLength(6);
    for (const id of lakeAnimalIds) {
      expect(getPhotoVariantCount(id)).toBe(5);
      expect(getFactCount(id)).toBe(5);
      expect(commonMilestoneAnimals.some((a) => a.id === id)).toBe(false);
    }
  });
});
