import type { LocationName } from '../types/Ids';

// Percentage position of each location's pin within the .park-map image, as (top, left) from the
// top-left corner. Tuned by eye against the actual generated public/assets/tutorial-park/park-map.png
// (1536x1024, 3:2) - re-tune here if the art is ever regenerated at a different layout.
export const parkMapCoordinates: Record<LocationName, { top: string; left: string }> = {
  'Park Entrance': { top: '80%', left: '47%' },
  'Duck Pond': { top: '58%', left: '30%' },
  'Open Meadow': { top: '58%', left: '68%' },
  'Forest Trail': { top: '32%', left: '49%' },
  'Strange Old Tree': { top: '24%', left: '30%' },
  'Whisper Grove': { top: '22%', left: '68%' },
};
