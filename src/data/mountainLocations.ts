import type { AnimalId, MountainLocationName } from '../types/Ids';

export type MountainLocation = { name: MountainLocationName; icon: string; description: string; animalIds: AnimalId[] };

// Three Mountains sections, two animals each. No photo art exists for these animals yet, so they show
// their emoji and award no collectible photo variants until art is generated.
export const mountainLocations: MountainLocation[] = [
  { name: 'Rocky Trail', icon: '🥾', description: 'A stony path where sure-footed climbers and sunbathing marmots live.', animalIds: ['mountain-goat', 'marmot'] },
  { name: 'Alpine Meadow', icon: '🌼', description: 'A cool, flowery meadow among the rocks, full of small busy animals.', animalIds: ['pika', 'mountain-hare'] },
  { name: 'Lookout Ridge', icon: '🏔️', description: 'A high, windy ridge with wide views and birds riding the air.', animalIds: ['golden-eagle', 'mountain-bluebird'] },
];

export const mountainAnimalIds: AnimalId[] = mountainLocations.flatMap((location) => location.animalIds);
