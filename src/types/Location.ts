import type { LocationName } from './Ids';

export type LocationStatus = 'available' | 'preview' | 'hidden';

export type ParkLocation = {
  id: string;
  name: LocationName;
  icon: string;
  status: LocationStatus;
  description: string;
  gameplayNote: string;
};
