import { mountainLocations } from '../data/mountainLocations';
import { moveInMountains, photographMountainAnimal } from '../state/mountainsState';
import type { MountainLocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { BiomeScreen, type BiomeConfig } from './BiomeScreen';

type Props = { saveData: SaveData; onSaveChange: (s: SaveData) => void; onReturnToCamper: () => void; onGoHome: () => void };

const MOUNTAINS_CONFIG: BiomeConfig = {
  eyebrow: 'Mountains',
  title: 'Mountain Arrival',
  arrivalMessage: 'You have arrived quietly on the mountain trail.',
  aboutTitle: 'High country',
  aboutText: 'Walk the Rocky Trail, Alpine Meadow, and Lookout Ridge, and photograph the six animals that live here. Move slowly and watch from a distance - every animal stays wild and free.',
  toolsLabel: 'Mountain tools',
  className: 'mountains-screen',
  gridClassName: 'lake-location-grid',
  ambient: 'mountains',
};

export function MountainsScreen({ saveData, onSaveChange, onReturnToCamper, onGoHome }: Props) {
  return (
    <BiomeScreen
      config={MOUNTAINS_CONFIG}
      locations={mountainLocations}
      currentLocationName={saveData.mountainLocation}
      saveData={saveData}
      onSaveChange={onSaveChange}
      onMove={(name) => onSaveChange(moveInMountains(saveData, name as MountainLocationName))}
      photograph={photographMountainAnimal}
      onReturnToCamper={onReturnToCamper}
      onGoHome={onGoHome}
    />
  );
}
