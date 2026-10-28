import { getAnimalById } from './animalState';
import { bumpCount } from './stateUtils';
import { pickRandomUncollectedVariant } from '../data/animalPhotoVariants';
import { getBiome, getBiomeAnimalIds } from '../data/biomes';
import type { BiomeId } from '../types/Biome';
import type { AnimalId } from '../types/Ids';
import type { SaveData } from '../types/SaveData';

export function enterBiome(save: SaveData, id: BiomeId): SaveData {
  return save.wildCamperUnlocked ? { ...save, selectedDestination: id, lastPlayArea: id } : save;
}

// Ignores a section name the biome doesn't have.
export function moveInBiome(save: SaveData, id: BiomeId, locationName: string): SaveData {
  const biome = getBiome(id);
  if (!biome || !biome.locations.some((location) => location.name === locationName)) return save;
  return { ...save, [biome.saveKey]: locationName };
}

export function returnToCamperFromBiome(save: SaveData): SaveData {
  return { ...save, lastPlayArea: 'camper', camperVisited: true };
}

// Ignores animals that don't belong to the biome. An animal with no photo art yet is still recorded as
// photographed/discovered - it just hands out no collectible variant.
export function photographInBiome(save: SaveData, biomeId: BiomeId, id: AnimalId): SaveData {
  const biome = getBiome(biomeId);
  if (!biome || !getBiomeAnimalIds(biome).includes(id)) return save;
  const animal = getAnimalById(id);
  const variant = pickRandomUncollectedVariant(id, save.collectedPhotoVariants);
  return {
    ...save,
    discoveredAnimals: [...new Set([...save.discoveredAnimals, id])],
    photographedAnimals: [...new Set([...save.photographedAnimals, id])],
    reportedInvasiveSpecies: animal?.nonNative ? [...new Set([...save.reportedInvasiveSpecies, id])] : save.reportedInvasiveSpecies,
    collectedPhotoVariants: variant ? [...new Set([...save.collectedPhotoVariants, `${id}-${variant}`])] : save.collectedPhotoVariants,
    photographCounts: bumpCount(save.photographCounts, id),
  };
}
