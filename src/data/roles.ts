import type { ExplorerRole } from '../types/Role';

export const roles: ExplorerRole[] = [
  { id: 'zoologist', name: 'Zoologist', description: 'Learns a bonus fact right on the first photo of every new species.' },
  { id: 'wildlife-photographer', name: 'Wildlife Photographer', description: 'Unlocks a bonus 6th photo to collect for every animal.' },
  { id: 'conservation-ranger', name: 'Conservation Ranger', description: 'Discovers twice as many facts about common wildlife.' },
  { id: 'explorer', name: 'Explorer', description: 'Gets an early glimpse of still-locked hidden places on the map.' },
  { id: 'animal-researcher', name: 'Animal Researcher', description: 'Finds rare animals easier to photograph, and learns twice as many facts about them.' },
  { id: 'custom-character', name: 'Custom Character', description: 'A flexible explorer role for later customisation.' },
];
