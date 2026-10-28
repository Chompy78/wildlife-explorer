import type { AnimalId, SafariLocationName } from '../types/Ids';

export type SafariLocation = { name: SafariLocationName; icon: string; description: string; animalIds: AnimalId[] };

// Three Safari sections, two animals each. No photo art exists for these animals yet, so they show their
// emoji and award no collectible photo variants until art is generated.
export const safariLocations: SafariLocation[] = [
  { name: 'Waterhole', icon: '💧', description: 'A shared waterhole where big, gentle animals come to drink and cool off.', animalIds: ['african-elephant', 'hippo'] },
  { name: 'Open Plains', icon: '🌾', description: 'Wide golden grassland stretching to the horizon, with herds grazing in the distance.', animalIds: ['zebra', 'giraffe'] },
  { name: 'Acacia Grove', icon: '🌳', description: 'Flat-topped acacia trees casting shade over small, busy animals and bright birds.', animalIds: ['meerkat', 'lilac-breasted-roller'] },
];

export const safariAnimalIds: AnimalId[] = safariLocations.flatMap((location) => location.animalIds);
