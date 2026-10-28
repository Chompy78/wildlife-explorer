import { lakeLocations } from '../data/lakeLocations';
import { moveInLake, photographLakeAnimal } from '../state/lakeState';
import type { LakeLocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { BiomeScreen, type BiomeConfig } from './BiomeScreen';

type Props = { saveData: SaveData; onSaveChange: (s: SaveData) => void; onReturnToCamper: () => void; onGoHome: () => void };

const LAKE_CONFIG: BiomeConfig = {
  eyebrow: 'Lake',
  title: 'Lake Arrival',
  arrivalMessage: 'You have arrived quietly at the lake shore.',
  aboutTitle: 'A calm lake',
  aboutText: 'Visit the Shoreline, Open Water, and Reeds & Shallows, and photograph the six animals that live here. Watch quietly - every animal stays wild and free.',
  toolsLabel: 'Lake tools',
  className: 'lake-screen',
  gridClassName: 'lake-location-grid',
  ambient: 'lake',
};

export function LakeScreen({ saveData, onSaveChange, onReturnToCamper, onGoHome }: Props) {
  return (
    <BiomeScreen
      config={LAKE_CONFIG}
      locations={lakeLocations}
      currentLocationName={saveData.lakeLocation}
      saveData={saveData}
      onSaveChange={onSaveChange}
      onMove={(name) => onSaveChange(moveInLake(saveData, name as LakeLocationName))}
      photograph={photographLakeAnimal}
      onReturnToCamper={onReturnToCamper}
      onGoHome={onGoHome}
    />
  );
}
