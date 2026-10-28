import { describe, expect, it } from 'vitest';
import { commonMilestoneAnimals } from '../data/animals';
import { getFactCount } from '../data/animalFacts';
import { getPhotoVariantCount } from '../data/animalPhotoVariants';
import { biomes, getBiomeAnimalIds } from '../data/biomes';
import { createDefaultSave } from './saveGame';
import { enterBiome, moveInBiome, photographInBiome, returnToCamperFromBiome } from './biomeState';

const unlocked = { ...createDefaultSave(), wildCamperUnlocked: true };

describe.each(biomes)('biome: $name', (biome) => {
  const ids = getBiomeAnimalIds(biome);
  const [first, second] = biome.locations;

  it('has three sections with two animals each, and starts in the first section', () => {
    expect(biome.locations).toHaveLength(3);
    for (const location of biome.locations) expect(location.animalIds).toHaveLength(2);
    expect(createDefaultSave()[biome.saveKey]).toBe(first.name);
  });

  it('blocks travel before the Wild Camper unlocks', () => {
    const save = createDefaultSave();
    expect(enterBiome(save, biome.id)).toEqual(save);
  });

  it('enters, moves between sections, ignores unknown sections, and returns to the camper', () => {
    const inBiome = enterBiome(unlocked, biome.id);
    expect(inBiome.lastPlayArea).toBe(biome.id);
    expect(inBiome.selectedDestination).toBe(biome.id);
    expect(moveInBiome(inBiome, biome.id, second.name)[biome.saveKey]).toBe(second.name);
    expect(moveInBiome(inBiome, biome.id, 'The Moon')).toEqual(inBiome);
    expect(returnToCamperFromBiome(inBiome).lastPlayArea).toBe('camper');
  });

  it('photographing records the animal; ignores animals from elsewhere', () => {
    const save = photographInBiome(unlocked, biome.id, ids[0]);
    expect(save.photographedAnimals).toContain(ids[0]);
    expect(save.discoveredAnimals).toContain(ids[0]);
    expect(save.photographCounts[ids[0]]).toBe(1);
    expect(photographInBiome(unlocked, biome.id, 'duck')).toEqual(unlocked);
  });

  it('hands out a variant exactly when the animal has photo art, and never a duplicate', () => {
    let save = unlocked;
    for (let i = 0; i < 8; i++) save = photographInBiome(save, biome.id, ids[0]);
    const count = getPhotoVariantCount(ids[0]);
    expect(save.collectedPhotoVariants).toHaveLength(count);
    expect(new Set(save.collectedPhotoVariants).size).toBe(count);
    if (count > 0) expect(getFactCount(ids[0])).toBe(count);
  });

  it('keeps its animals out of the tutorial common-animal count', () => {
    for (const id of ids) expect(commonMilestoneAnimals.some((a) => a.id === id)).toBe(false);
  });
});
