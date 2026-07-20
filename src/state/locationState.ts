import { parkLocations } from '../data/locations';
import type { LocationName } from '../types/Ids';
import type { ParkLocation } from '../types/Location';
import type { SaveData } from '../types/SaveData';
import { checkTutorialCompletion } from './progressionState';
import { addUnique } from './stateUtils';

export function getLocationByName(locationName: LocationName): ParkLocation | undefined {
  return parkLocations.find((location) => location.name === locationName);
}

export function getVisibleParkLocations(saveData: SaveData): ParkLocation[] {
  return parkLocations.map((location) =>
    location.name === 'Whisper Grove' && saveData.whisperGroveDiscovered
      ? { ...location, status: 'available' as const }
      : location
  );
}

export function visitLocation(saveData: SaveData, locationName: LocationName): SaveData {
  const location = getLocationByName(locationName);
  if (!location) return saveData;
  if (location.name === 'Whisper Grove' && !saveData.whisperGroveDiscovered) return saveData;
  if (location.status === 'hidden' && location.name !== 'Whisper Grove') return saveData;

  return {
    ...saveData,
    currentLocation: locationName,
    discoveredLocations: addUnique(saveData.discoveredLocations, locationName),
  };
}

export function spotRareOwl(saveData: SaveData): SaveData {
  if (saveData.currentLocation !== 'Strange Old Tree') return saveData;
  return {
    ...saveData,
    rareOwlSpotted: true,
    discoveredAnimals: addUnique(saveData.discoveredAnimals, 'rare-owl'),
  };
}

export function discoverWhisperGrove(saveData: SaveData): SaveData {
  if (saveData.currentLocation !== 'Strange Old Tree') return saveData;
  if (!saveData.questProgress.lostPuppy.completed) return saveData;

  return checkTutorialCompletion({
    ...saveData,
    whisperGroveDiscovered: true,
    currentLocation: 'Whisper Grove',
    discoveredLocations: addUnique(saveData.discoveredLocations, 'Whisper Grove'),
  });
}
