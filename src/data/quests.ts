import type { Quest } from '../types/Quest';

export const lostPuppyQuest: Quest = {
  id: 'lost-puppy',
  name: 'Lost Puppy',
  description: 'A friendly puppy wandered away from its owner. The puppy is not in danger. Follow gentle clues and help the puppy get back.',
  tone: 'Helpful, gentle, positive, safe, and calm.',
  steps: [
    'Talk to the owner at Park Entrance.',
    'Find pawprints in Open Meadow.',
    'Find the chew toy on Forest Trail.',
    'Find the puppy on Forest Trail.',
    'Return to Park Entrance for a gentle reunion.',
  ],
};
