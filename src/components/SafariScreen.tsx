import { safariLocations } from '../data/safariLocations';
import { moveInSafari, photographSafariAnimal } from '../state/safariState';
import type { SafariLocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { BiomeScreen, type BiomeConfig } from './BiomeScreen';

type Props = { saveData: SaveData; onSaveChange: (s: SaveData) => void; onReturnToCamper: () => void; onGoHome: () => void };

const SAFARI_CONFIG: BiomeConfig = {
  eyebrow: 'Safari',
  title: 'Safari Arrival',
  arrivalMessage: 'You have arrived quietly at the edge of the savanna.',
  aboutTitle: 'The wide savanna',
  aboutText: 'Visit the Waterhole, Open Plains, and Acacia Grove, and photograph the six animals that live here. Keep a respectful distance and stay quiet - every animal stays wild and free.',
  toolsLabel: 'Safari tools',
  className: 'safari-screen',
  gridClassName: 'lake-location-grid',
  ambient: 'safari',
};

export function SafariScreen({ saveData, onSaveChange, onReturnToCamper, onGoHome }: Props) {
  return (
    <BiomeScreen
      config={SAFARI_CONFIG}
      locations={safariLocations}
      currentLocationName={saveData.safariLocation}
      saveData={saveData}
      onSaveChange={onSaveChange}
      onMove={(name) => onSaveChange(moveInSafari(saveData, name as SafariLocationName))}
      photograph={photographSafariAnimal}
      onReturnToCamper={onReturnToCamper}
      onGoHome={onGoHome}
    />
  );
}
