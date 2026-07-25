import { describe, expect, it } from 'vitest';
import { completeLostPuppyQuest, discoverWhisperGrove, findChewToy, findLostPuppy, findPawprints, photographAnimal, spotRareOwl, startLostPuppyQuest } from './gameState';
import { createDefaultSave } from './saveGame';

describe('Tutorial Park progression', () => {
  it('enforces the Lost Puppy sequence', () => {
    let save = createDefaultSave();
    expect(findChewToy(save)).toEqual(save);
    save = startLostPuppyQuest(save);
    save = findPawprints(save);
    save = findChewToy(save);
    save = findLostPuppy(save);
    save = completeLostPuppyQuest(save);
    expect(save.questProgress.lostPuppy.completed).toBe(true);
    expect(save.discoveredAnimals).toContain('lost-puppy');
  });

  it('awards a reunion photo when the Lost Puppy quest completes, and never a duplicate on repeated calls', () => {
    let save = createDefaultSave();
    save = startLostPuppyQuest(save);
    save = findPawprints(save);
    save = findChewToy(save);
    save = findLostPuppy(save);
    save = completeLostPuppyQuest(save);
    const puppyVariants = save.collectedPhotoVariants.filter((key) => key.startsWith('lost-puppy-'));
    expect(puppyVariants.length).toBe(1);
    // already completed - a second call is a no-op guarded by the quest-state checks, not a re-award
    const again = completeLostPuppyQuest(save);
    expect(again.collectedPhotoVariants).toEqual(save.collectedPhotoVariants);
  });

  it('blocks Rare Owl photography until the owl is spotted', () => {
    let save = createDefaultSave();
    expect(photographAnimal(save, 'rare-owl').photographedAnimals).not.toContain('rare-owl');
    save = { ...save, currentLocation: 'Strange Old Tree' };
    save = spotRareOwl(save);
    save = photographAnimal(save, 'rare-owl');
    expect(save.photographedAnimals).toContain('rare-owl');
  });

  it('unlocks the Wild Camper after all three objectives', () => {
    let save = createDefaultSave();
    save = { ...save, currentLocation: 'Strange Old Tree', questProgress: { lostPuppy: { started: true, foundPawprints: true, foundToy: true, foundPuppy: true, completed: true } } };
    save = spotRareOwl(save);
    save = photographAnimal(save, 'rare-owl');
    save = discoverWhisperGrove(save);
    expect(save.wildCamperUnlocked).toBe(true);
  });

  it('logs a non-native animal as reported the first time it is photographed, and does not duplicate on a retake', () => {
    let save = createDefaultSave();
    save = photographAnimal(save, 'red-eared-slider');
    expect(save.reportedInvasiveSpecies).toEqual(['red-eared-slider']);
    save = photographAnimal(save, 'red-eared-slider');
    expect(save.reportedInvasiveSpecies).toEqual(['red-eared-slider']);
  });

  it('does not report a native animal as invasive', () => {
    const save = photographAnimal(createDefaultSave(), 'duck');
    expect(save.reportedInvasiveSpecies).toEqual([]);
  });

  it('collects a random photo variant on each new photograph, with no duplicates ever, capped at the total available', () => {
    let save = createDefaultSave();
    for (let i = 0; i < 10; i++) save = photographAnimal(save, 'duck');
    const duckVariants = save.collectedPhotoVariants.filter((key) => key.startsWith('duck-'));
    expect(duckVariants.length).toBe(5);
    expect(new Set(duckVariants).size).toBe(5);
    expect(duckVariants.sort()).toEqual(['duck-1', 'duck-2', 'duck-3', 'duck-4', 'duck-5']);
  });

  it('does not add photo variants for an animal with no photo art', () => {
    const save = photographAnimal(createDefaultSave(), 'red-eared-slider');
    expect(save.collectedPhotoVariants).toEqual([]);
  });
});
