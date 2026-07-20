import type { ParkLocation } from '../types/Location';

export const parkLocations: ParkLocation[] = [
  {
    id: 'park-entrance',
    name: 'Park Entrance',
    icon: '🌿',
    status: 'available',
    description: 'A friendly sign welcomes new wildlife explorers to Tutorial Park.',
    gameplayNote: 'Start exploring, check the journal, and talk to the puppy owner here.',
  },
  {
    id: 'duck-pond',
    name: 'Duck Pond',
    icon: '🦆',
    status: 'available',
    description: 'Clear water, lily pads, ducks, frogs, and quiet animal sounds.',
    gameplayNote: 'Photograph ducks and frogs here.',
  },
  {
    id: 'open-meadow',
    name: 'Open Meadow',
    icon: '🌼',
    status: 'available',
    description: 'A sunny meadow with flowers, butterflies, rabbits, and soft grass.',
    gameplayNote: 'Photograph butterflies and rabbits here. Pawprints may appear during the Lost Puppy quest.',
  },
  {
    id: 'forest-trail',
    name: 'Forest Trail',
    icon: '🌲',
    status: 'available',
    description: 'A gentle trail with logs, leaves, lizards, park birds, and puppy clues.',
    gameplayNote: 'Photograph lizards and park birds here. Quest clues can be found here too.',
  },
  {
    id: 'strange-old-tree',
    name: 'Strange Old Tree',
    icon: '🌳',
    status: 'available',
    description: 'A rare natural tree with unusual branches, special leaves, bark marks, and a quiet owl perch.',
    gameplayNote: 'Spot and photograph the Rare Owl here. This tree is natural, not magical.',
  },
  {
    id: 'whisper-grove',
    name: 'Whisper Grove',
    icon: '🌺',
    status: 'hidden',
    description: 'A hidden quiet flower and wildlife area tucked behind natural vegetation.',
    gameplayNote: 'A peaceful secret place discovered from the Strange Old Tree area.',
  },
];
