import { lostPuppyQuest } from '../data/quests';
import {
  completeLostPuppyQuest,
  findChewToy,
  findLostPuppy,
  findPawprints,
  getLostPuppyQuestHint,
  startLostPuppyQuest,
} from '../state/gameState';
import type { SaveData } from '../types/SaveData';

type QuestPanelProps = {
  saveData: SaveData;
  onSaveChange: (saveData: SaveData) => void;
  onMessage: (message: string) => void;
  onPhotoReveal: (variantKey: string) => void;
};

export function QuestPanel({ saveData, onSaveChange, onMessage, onPhotoReveal }: QuestPanelProps) {
  const quest = saveData.questProgress.lostPuppy;
  const location = saveData.currentLocation;

  function applyQuestUpdate(nextSaveData: SaveData, message: string) {
    onSaveChange(nextSaveData);
    onMessage(message);
  }

  function reunitePuppy() {
    const previousVariants = saveData.collectedPhotoVariants;
    const updated = completeLostPuppyQuest(saveData);
    applyQuestUpdate(updated, 'The puppy is reunited with the owner. Lost Puppy quest complete!');
    const newVariant = updated.collectedPhotoVariants.find((key) => !previousVariants.includes(key));
    if (newVariant) onPhotoReveal(newVariant);
  }

  return (
    <section className="quest-card">
      <p className="eyebrow">Quest</p>
      <h3>{lostPuppyQuest.name}</h3>
      <p>{lostPuppyQuest.description}</p>
      <p className="quest-hint"><strong>Hint:</strong> {getLostPuppyQuestHint(saveData)}</p>

      <div className="quest-steps">
        <QuestStep done={quest.started} label="Talk to owner" />
        <QuestStep done={quest.foundPawprints} label="Find pawprints" />
        <QuestStep done={quest.foundToy} label="Find chew toy" />
        <QuestStep done={quest.foundPuppy} label="Find puppy" />
        <QuestStep done={quest.completed} label="Reunite puppy" />
      </div>

      <div className="quest-actions">
        {!quest.started && location === 'Park Entrance' && (
          <button onClick={() => applyQuestUpdate(startLostPuppyQuest(saveData), 'The owner says the puppy wandered off calmly. Look for pawprints in Open Meadow.')}>Talk to Owner</button>
        )}

        {quest.started && !quest.foundPawprints && location === 'Open Meadow' && (
          <button onClick={() => applyQuestUpdate(findPawprints(saveData), 'You found gentle pawprints in the grass. They lead toward Forest Trail.')}>Look at Pawprints</button>
        )}

        {quest.foundPawprints && !quest.foundToy && location === 'Forest Trail' && (
          <button onClick={() => applyQuestUpdate(findChewToy(saveData), 'You found a small chew toy near the trail. The puppy must be close.')}>Pick Up Chew Toy</button>
        )}

        {quest.foundToy && !quest.foundPuppy && location === 'Forest Trail' && (
          <button onClick={() => applyQuestUpdate(findLostPuppy(saveData), 'You found the puppy sitting calmly near the trail. Return to Park Entrance.')}>Find Puppy</button>
        )}

        {quest.foundPuppy && !quest.completed && location === 'Park Entrance' && (
          <button onClick={reunitePuppy}>Reunite Puppy</button>
        )}

        {quest.completed && <p className="complete-message">{'\u2705'} Completed - puppy helped and reunited.</p>}
      </div>
    </section>
  );
}

type QuestStepProps = {
  done: boolean;
  label: string;
};

function QuestStep({ done, label }: QuestStepProps) {
  return (
    <div className={done ? 'quest-step done' : 'quest-step'}>
      <span>{done ? '\u2705' : '\u2B1C'}</span>
      {label}
    </div>
  );
}
