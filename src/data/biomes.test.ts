import { describe, expect, it } from 'vitest';
import { animals } from './animals';
import { biomes, getBiomeAnimalIds } from './biomes';
import { destinationPreviews } from './destinations';
import { createDefaultSave } from '../state/saveGame';

// Guards the registry: a typo in a new biome entry should fail here, not in the player's hands.
describe('biome registry', () => {
  it('has unique ids, save keys, and screen class names', () => {
    for (const pick of [(b: typeof biomes[number]) => b.id, (b: typeof biomes[number]) => b.saveKey, (b: typeof biomes[number]) => b.screenClassName]) {
      expect(new Set(biomes.map(pick)).size).toBe(biomes.length);
    }
  });

  it('is reachable as a Journey Planner destination, and gives a new game a save field', () => {
    const save = createDefaultSave();
    for (const biome of biomes) {
      expect(destinationPreviews.some((d) => d.id === biome.id)).toBe(true);
      expect(save[biome.saveKey]).toBe(biome.locations[0].name);
    }
  });

  it('only lists real animals, each in exactly one biome section, with habitat matching its section', () => {
    const seen = new Set<string>();
    for (const biome of biomes) {
      expect(new Set(biome.locations.map((l) => l.name)).size).toBe(biome.locations.length);
      for (const location of biome.locations) {
        for (const id of location.animalIds) {
          const animal = animals.find((a) => a.id === id);
          expect(animal, `${id} is not in animals.ts`).toBeDefined();
          expect(animal!.habitat).toBe(location.name);
          expect(seen.has(id), `${id} appears twice`).toBe(false);
          seen.add(id);
        }
      }
      expect(getBiomeAnimalIds(biome).length).toBe(biome.locations.length * 2);
    }
  });
});
