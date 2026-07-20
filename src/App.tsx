import { useEffect, useState } from 'react';
import { CamperScreen } from './components/CamperScreen';
import { ForestScreen } from './components/ForestScreen';
import { ParkScreen } from './components/ParkScreen';
import { RoleSelect } from './components/RoleSelect';
import { StartScreen } from './components/StartScreen';
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
    setScreen(saveData.wildCamperUnlocked && saveData.lastPlayArea === 'forest' ? 'forest' : saveData.wildCamperUnlocked && saveData.lastPlayArea === 'camper' ? 'camper' : 'park');
  }
  function selectRole(roleId: string) { updateSave({ ...saveData, selectedRole: roleId }); setScreen('park'); }
  function openCamper() { updateSave(enterWildCamper(saveData)); setScreen('camper'); }
  function openForest() { updateSave(enterForest(saveData)); setScreen('forest'); }
  function returnToCamper() { updateSave(returnToCamperFromForest(saveData)); setScreen('camper'); }
  function openPark() { updateSave(returnToTutorialPark(saveData)); setScreen('park'); }
  function resetSave() { clearSave(); setSaveData(createDefaultSave()); setScreen('start'); }
  if (screen === 'role-select') return <RoleSelect onSelectRole={selectRole} />;
  if (screen === 'park') return <ParkScreen saveData={saveData} onSaveChange={updateSave} onOpenCamper={openCamper} onGoHome={() => setScreen('start')} />;
  if (screen === 'forest') return <ForestScreen saveData={saveData} onSaveChange={updateSave} onReturnToCamper={returnToCamper} onGoHome={() => setScreen('start')} />;
  if (screen === 'camper') return <CamperScreen saveData={saveData} onSaveChange={updateSave} onReturnToPark={openPark} onTravelToForest={openForest} onGoHome={() => setScreen('start')} />;
  return <StartScreen saveData={saveData} onNewGame={startNewGame} onContinue={continueGame} onReset={resetSave} />;
}
