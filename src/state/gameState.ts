import { commonMilestoneAnimals } from '../data/animals';
import { roles } from '../data/roles';
import type { SaveData } from '../types/SaveData';
import { getCommonPhotoCount } from './animalState';

export * from './animalState';
export * from './camperState';
export * from './locationState';
export * from './forestState';
export * from './progressionState';
export * from './questState';

export function getRoleName(roleId: string | null): string {
  return roles.find((role) => role.id === roleId)?.name ?? 'No role selected';
}

export function getTutorialProgressItems(saveData: SaveData) {
  const photoCount = getCommonPhotoCount(saveData);
  return [
    { label: 'Choose role', done: Boolean(saveData.selectedRole), locked: false },
    { label: 'Visit Duck Pond', done: saveData.discoveredLocations.includes('Duck Pond'), locked: false },
    { label: 'Photograph first animal', done: photoCount >= 1, locked: false },
    { label: 'Photograph 3 common animals', done: photoCount >= 3, locked: false },
    { label: 'Photograph all common animals', done: photoCount >= commonMilestoneAnimals.length, locked: false },
    { label: 'Complete Lost Puppy quest', done: saveData.questProgress.lostPuppy.completed, locked: false },
    { label: 'Spot Rare Owl', done: saveData.rareOwlSpotted, locked: false },
    { label: 'Photograph Rare Owl', done: saveData.photographedAnimals.includes('rare-owl'), locked: !saveData.rareOwlSpotted },
    { label: 'Find Whisper Grove', done: saveData.whisperGroveDiscovered, locked: !saveData.questProgress.lostPuppy.completed },
    { label: 'Unlock Wild Camper', done: saveData.wildCamperUnlocked, locked: false },
  ];
}
