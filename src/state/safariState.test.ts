import { describe, expect, it } from 'vitest';
import { commonMilestoneAnimals } from '../data/animals';
import { getPhotoVariantCount } from '../data/animalPhotoVariants';
import { createDefaultSave } from './saveGame';
import { enterSafari, moveInSafari, photographSafariAnimal, returnToCamperFromSafari, safariAnimalIds } from './safariState';

const unlocked = { ...createDefaultSave(), wildCamperUnlocked: true };

describe('safariState', () => {
  it('blocks Safari travel before the Wild Camper unlocks', () => {
    const save = createDefaultSave();
    expect(enterSafari(save)).toEqual(save);
  });

  it('enters, moves between sections, and returns to the camper', () => {
    const inSafari = enterSafari(unlocked);
    expect(inSafari.lastPlayArea).toBe('safari');
    expect(inSafari.selectedDestination).toBe('safari');
    expect(moveInSafari(inSafari, 'Acacia Grove').safariLocation).toBe('Acacia Grove');
    expect(returnToCamperFromSafari(inSafari).lastPlayArea).toBe('camper');
  });

  it('records a photographed animal that has no photo art yet, without handing out a variant', () => {
    expect(getPhotoVariantCount('zebra')).toBe(0);
    const save = photographSafariAnimal(unlocked, 'zebra');
    expect(save.photographedAnimals).toContain('zebra');
    expect(save.collectedPhotoVariants).toEqual([]);
    expect(photographSafariAnimal(unlocked, 'duck')).toEqual(unlocked);
  });

  it('has six animals and keeps them out of the tutorial common-animal count', () => {
    expect(safariAnimalIds).toHaveLength(6);
    for (const id of safariAnimalIds) expect(commonMilestoneAnimals.some((a) => a.id === id)).toBe(false);
  });
});
