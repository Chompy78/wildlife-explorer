import { getDestinationById } from '../data/destinations';
import { getRoleName } from '../state/gameState';
import type { SaveData } from '../types/SaveData';

type StartScreenProps = { saveData: SaveData; onNewGame: () => void; onContinue: () => void; onReset: () => void };

export function StartScreen({ saveData, onNewGame, onContinue, onReset }: StartScreenProps) {
  const hasSave = Boolean(saveData.selectedRole || saveData.photographedAnimals.length || saveData.questProgress.lostPuppy.started || saveData.wildCamperUnlocked);
  const destination = getDestinationById(saveData.selectedDestination);
  return (
    <main className="screen hero-screen"><section className="hero-card"><p className="eyebrow">Milestone 4.1</p><h1>Wildlife Explorer</h1><p className="pitch">Finish Tutorial Park, unlock the Wild Camper, and prepare a future wildlife journey.</p>
      {hasSave ? <div className="save-summary"><strong>Saved adventure</strong><span>Role: {getRoleName(saveData.selectedRole)}</span><span>Animal photos: {saveData.photographedAnimals.length}</span><span>Lost Puppy: {saveData.questProgress.lostPuppy.completed ? 'Completed' : saveData.questProgress.lostPuppy.started ? 'In progress' : 'Not started'}</span><span>Wild Camper: {saveData.wildCamperUnlocked ? saveData.camperVisited ? 'Hub visited' : 'Unlocked' : 'Locked'}</span>{destination ? <span>Route preview: {destination.icon} {destination.name}</span> : null}</div> : null}
      <div className="button-row"><button onClick={onNewGame}>New Game</button><button onClick={onContinue} disabled={!hasSave} className="secondary">Continue</button></div><button className="link-button" onClick={onReset}>Reset Save</button>
    </section></main>
  );
}
