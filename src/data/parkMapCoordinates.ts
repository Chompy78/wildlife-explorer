import type { LocationName } from '../types/Ids';

// Percentage position of each location's pin within the .park-map image, as (top, left) from the
// top-left corner. Tuned by eye against the actual generated public/assets/tutorial-park/park-map.jpg
// (1024x1536, portrait 2:3, path winds bottom-to-top) - re-tune here if the art is ever regenerated at
// a different layout. Whisper Grove has no distinct clearing in this generated art (unlike the other 5
// zones) - pinned near the stone-step side path in the upper right, the closest visual candidate.
export const parkMapCoordinates: Record<LocationName, { top: string; left: string }> = {
  'Park Entrance': { top: '82%', left: '50%' },
  'Duck Pond': { top: '63%', left: '18%' },
  'Open Meadow': { top: '64%', left: '80%' },
  'Forest Trail': { top: '42%', left: '50%' },
  'Strange Old Tree': { top: '12%', left: '24%' },
  'Whisper Grove': { top: '26%', left: '72%' },
};
