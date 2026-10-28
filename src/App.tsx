import { useEffect, useState } from 'react';
import { CamperScreen } from './components/CamperScreen';
import { ForestScreen } from './components/ForestScreen';
import { BiomeScreen } from './components/BiomeScreen';
import { MiniGames } from './components/MiniGames';
import { ParkScreen } from './components/ParkScreen';
import { RoleSelect } from './components/RoleSelect';
import { StartScreen } from './components/StartScreen';
import { enterBiome, returnToCamperFromBiome } from './state/biomeState';
import { getBiome, isBiomeId } from './data/biomes';
import type { BiomeId } from './types/Biome';
import { enterForest, returnToCamperFromForest } from './state/forestState';
import { enterWildCamper, returnToTutorialPark } from './state/camperState';
import { clearSave, createDefaultSave, loadSave, saveGame } from './state/saveGame';
import type { GameScreen, SaveData } from './types/SaveData';

export default function App() {
  const [saveData, setSaveData] = useState<SaveData>(() => loadSave());
  const [screen, setScreen] = useState<GameScreen>('start');
  useEffect(() => { saveGame(saveData); }, [saveData]);
  function updateSave(next: SaveData) { setSaveData(next); saveGame(next); }
  function startNewGame() { updateSave(createDefaultSave()); setScreen('role-select'); }
  function continueGame() {
    if (!saveData.selectedRole) return setScreen('role-select');
    setScreen(saveData.wildCamperUnlocked && (saveData.lastPlayArea === 'forest' || saveData.lastPlayArea === 'camper' || isBiomeId(saveData.lastPlayArea)) ? saveData.lastPlayArea : 'park');
  }
  function selectRole(roleId: string) { updateSave({ ...saveData, selectedRole: roleId }); setScreen('park'); }
  function openCamper() { updateSave(enterWildCamper(saveData)); setScreen('camper'); }
  function openForest() { updateSave(enterForest(saveData)); setScreen('forest'); }
  function returnToCamper() { updateSave(returnToCamperFromForest(saveData)); setScreen('camper'); }
  function openBiome(id: BiomeId) { updateSave(enterBiome(saveData, id)); setScreen(id); }
  function returnToCamperFromBiomeScreen() { updateSave(returnToCamperFromBiome(saveData)); setScreen('camper'); }
  function openPark() { updateSave(returnToTutorialPark(saveData)); setScreen('park'); }
  function resetSave() { clearSave(); setSaveData(createDefaultSave()); setScreen('start'); }
  if (screen === 'minigames') return <MiniGames onGoHome={() => setScreen('start')} />;
  if (screen === 'role-select') return <RoleSelect onSelectRole={selectRole} />;
  if (screen === 'park') return <ParkScreen saveData={saveData} onSaveChange={updateSave} onOpenCamper={openCamper} onGoHome={() => setScreen('start')} />;
  if (screen === 'forest') return <ForestScreen saveData={saveData} onSaveChange={updateSave} onReturnToCamper={returnToCamper} onGoHome={() => setScreen('start')} />;
  const biome = getBiome(screen);
  if (biome) return <BiomeScreen biome={biome} saveData={saveData} onSaveChange={updateSave} onReturnToCamper={returnToCamperFromBiomeScreen} onGoHome={() => setScreen('start')} />;
  if (screen === 'camper') return <CamperScreen saveData={saveData} onSaveChange={updateSave} onReturnToPark={openPark} onTravelToForest={openForest} onTravelToBiome={openBiome} onGoHome={() => setScreen('start')} />;
  return <StartScreen saveData={saveData} onNewGame={startNewGame} onContinue={continueGame} onReset={resetSave} onMiniGames={() => setScreen('minigames')} />;
}
