import { defaultLostPuppyQuestProgress } from './saveDefaults';
import { CURRENT_SAVE_SCHEMA_VERSION, type PlayArea, type SaveData } from '../types/SaveData';
import type { AnimalId, LocationName } from '../types/Ids';
import type { DestinationId } from '../types/Destination';

const validLocations: LocationName[] = ['Park Entrance', 'Duck Pond', 'Open Meadow', 'Forest Trail', 'Strange Old Tree', 'Whisper Grove'];
const validAnimals: AnimalId[] = ['duck', 'frog', 'butterfly', 'rabbit', 'lizard', 'park-bird', 'rare-owl', 'lost-puppy', 'forest-wren', 'forest-wallaby', 'forest-beetle', 'red-eared-slider', 'cane-toad'];
const validDestinations: DestinationId[] = ['forest', 'mountains', 'lake', 'safari', 'rainforest', 'alien-planet', 'desert', 'arctic', 'coral-reef', 'wetlands', 'coastal', 'grassland', 'taiga', 'volcanic-highlands'];

export function migrateSaveData(input: unknown): SaveData {
  const parsed = isRecord(input) ? input : {};
  const questProgress = isRecord(parsed.questProgress) ? parsed.questProgress : {};
  const lostPuppy = isRecord(questProgress.lostPuppy) ? questProgress.lostPuppy : {};
  const currentLocation = validLocations.includes(parsed.currentLocation as LocationName) ? parsed.currentLocation as LocationName : 'Park Entrance';
  const wildCamperUnlocked = Boolean(parsed.wildCamperUnlocked);
  const selectedDestination = wildCamperUnlocked && validDestinations.includes(parsed.selectedDestination as DestinationId)
    ? parsed.selectedDestination as DestinationId : null;
  const requestedArea = parsed.lastPlayArea as PlayArea;

  return {
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    selectedRole: typeof parsed.selectedRole === 'string' ? parsed.selectedRole : null,
    discoveredAnimals: filterKnown(parsed.discoveredAnimals, validAnimals),
    photographedAnimals: filterKnown(parsed.photographedAnimals, validAnimals),
    discoveredLocations: withParkEntrance(filterKnown(parsed.discoveredLocations, validLocations)),
    currentLocation,
    questProgress: { lostPuppy: {
      ...defaultLostPuppyQuestProgress,
      started: Boolean(lostPuppy.started), foundPawprints: Boolean(lostPuppy.foundPawprints),
      foundToy: Boolean(lostPuppy.foundToy), foundPuppy: Boolean(lostPuppy.foundPuppy), completed: Boolean(lostPuppy.completed),
    } },
    rareOwlSpotted: Boolean(parsed.rareOwlSpotted),
    whisperGroveDiscovered: Boolean(parsed.whisperGroveDiscovered),
    wildCamperUnlocked,
    camperVisited: wildCamperUnlocked && Boolean(parsed.camperVisited),
    camperIntroductionSeen: wildCamperUnlocked && Boolean(parsed.camperIntroductionSeen),
    selectedDestination,
    lastPlayArea: requestedArea === 'forest' && wildCamperUnlocked ? 'forest' : requestedArea === 'camper' && wildCamperUnlocked ? 'camper' : 'park',
    forestLocation: parsed.forestLocation === 'Fern Trail' ? 'Fern Trail' : 'Forest Arrival',
    reportedInvasiveSpecies: filterKnown(parsed.reportedInvasiveSpecies, validAnimals),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
function withParkEntrance(locations: LocationName[]): LocationName[] { return locations.length ? locations : ['Park Entrance']; }
function filterKnown<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  return Array.isArray(value) ? value.filter((item): item is T => typeof item === 'string' && allowed.includes(item as T)) : [];
}
