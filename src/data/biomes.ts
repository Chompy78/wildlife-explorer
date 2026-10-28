import type { AmbientKind } from '../audio/sound';
import type { BiomeId, BiomeLocationKey } from '../types/Biome';
import type { AnimalId } from '../types/Ids';

export type BiomeLocation = { name: string; icon: string; description: string; animalIds: AnimalId[] };

export type BiomeDef = {
  id: BiomeId; // also the DestinationId it is reached by
  name: string;
  saveKey: BiomeLocationKey;
  locations: BiomeLocation[]; // the first one is where a new game starts
  ambient: AmbientKind;
  screenClassName: string;
  eyebrow: string;
  screenTitle: string;
  arrivalMessage: string;
  aboutTitle: string;
  aboutText: string;
  journalIcon: string;
  journalTitle: string;
};

// Each biome has three sections with two animals each. Animals with no entry in PHOTO_VARIANT_COUNTS
// (src/data/animalPhotoVariants.ts) show their emoji and award no collectible photos.
export const biomes: BiomeDef[] = [
  {
    id: 'lake',
    name: 'Lake',
    saveKey: 'lakeLocation',
    ambient: 'lake',
    screenClassName: 'lake-screen',
    eyebrow: 'Lake',
    screenTitle: 'Lake Arrival',
    arrivalMessage: 'You have arrived quietly at the lake shore.',
    aboutTitle: 'A calm lake',
    aboutText: 'Visit the Shoreline, Open Water, and Reeds & Shallows, and photograph the six animals that live here. Watch quietly - every animal stays wild and free.',
    journalIcon: '🌊',
    journalTitle: 'Lake Animals',
    locations: [
      { name: 'Shoreline', icon: '🏞️', description: 'A quiet bank where herons stand watch and beavers rest.', animalIds: ['great-blue-heron', 'beaver'] },
      { name: 'Open Water', icon: '🌊', description: 'Calm, open water where loons float and trout glint below.', animalIds: ['loon', 'rainbow-trout'] },
      { name: 'Reeds & Shallows', icon: '🌾', description: 'Sheltered reeds and warm shallows, busy with small life.', animalIds: ['dragonfly', 'painted-turtle'] },
    ],
  },
  {
    id: 'mountains',
    name: 'Mountains',
    saveKey: 'mountainLocation',
    ambient: 'mountains',
    screenClassName: 'mountains-screen',
    eyebrow: 'Mountains',
    screenTitle: 'Mountain Arrival',
    arrivalMessage: 'You have arrived quietly on the mountain trail.',
    aboutTitle: 'High country',
    aboutText: 'Walk the Rocky Trail, Alpine Meadow, and Lookout Ridge, and photograph the six animals that live here. Move slowly and watch from a distance - every animal stays wild and free.',
    journalIcon: '⛰️',
    journalTitle: 'Mountain Animals',
    locations: [
      { name: 'Rocky Trail', icon: '🥾', description: 'A stony path where sure-footed climbers and sunbathing marmots live.', animalIds: ['mountain-goat', 'marmot'] },
      { name: 'Alpine Meadow', icon: '🌼', description: 'A cool, flowery meadow among the rocks, full of small busy animals.', animalIds: ['pika', 'mountain-hare'] },
      { name: 'Lookout Ridge', icon: '🏔️', description: 'A high, windy ridge with wide views and birds riding the air.', animalIds: ['golden-eagle', 'mountain-bluebird'] },
    ],
  },
  {
    id: 'safari',
    name: 'Safari',
    saveKey: 'safariLocation',
    ambient: 'safari',
    screenClassName: 'safari-screen',
    eyebrow: 'Safari',
    screenTitle: 'Safari Arrival',
    arrivalMessage: 'You have arrived quietly at the edge of the savanna.',
    aboutTitle: 'The wide savanna',
    aboutText: 'Visit the Waterhole, Open Plains, and Acacia Grove, and photograph the six animals that live here. Keep a respectful distance and stay quiet - every animal stays wild and free.',
    journalIcon: '🦒',
    journalTitle: 'Safari Animals',
    locations: [
      { name: 'Waterhole', icon: '💧', description: 'A shared waterhole where big, gentle animals come to drink and cool off.', animalIds: ['african-elephant', 'hippo'] },
      { name: 'Open Plains', icon: '🌾', description: 'Wide golden grassland stretching to the horizon, with herds grazing in the distance.', animalIds: ['zebra', 'giraffe'] },
      { name: 'Acacia Grove', icon: '🌳', description: 'Flat-topped acacia trees casting shade over small, busy animals and bright birds.', animalIds: ['meerkat', 'lilac-breasted-roller'] },
    ],
  },
];

export function getBiome(id: string | null | undefined): BiomeDef | undefined {
  return biomes.find((biome) => biome.id === id);
}

export function isBiomeId(value: unknown): value is BiomeId {
  return biomes.some((biome) => biome.id === value);
}

export function getBiomeAnimalIds(biome: BiomeDef): AnimalId[] {
  return biome.locations.flatMap((location) => location.animalIds);
}

// Every animal that belongs to a data-driven biome, for keeping them out of the Park / Forest lists.
export const allBiomeAnimalIds: AnimalId[] = biomes.flatMap(getBiomeAnimalIds);
