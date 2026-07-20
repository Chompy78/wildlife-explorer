import type { ExplorerRole } from '../types/Role';

export const roles: ExplorerRole[] = [
  { id: 'zoologist', name: 'Zoologist', description: 'Learns extra animal facts for the Wildlife Journal.' },
  { id: 'wildlife-photographer', name: 'Wildlife Photographer', description: 'Focuses on taking clear and interesting animal photos.' },
  { id: 'conservation-ranger', name: 'Conservation Ranger', description: 'Helps animals and notices habitat clues.' },
  { id: 'explorer', name: 'Explorer', description: 'Finds paths, places, and hidden nature details.' },
  { id: 'animal-researcher', name: 'Animal Researcher', description: 'Studies animal behaviour and rare discoveries.' },
  { id: 'custom-character', name: 'Custom Character', description: 'A flexible explorer role for later customisation.' },
];
