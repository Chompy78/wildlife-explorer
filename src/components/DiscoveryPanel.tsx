import {
  discoverWhisperGrove,
  spotRareOwl,
} from '../state/gameState';
import type { SaveData } from '../types/SaveData';

type DiscoveryPanelProps = {
  saveData: SaveData;
  onSaveChange: (saveData: SaveData) => void;
  onMessage: (message: string) => void;
};

export function DiscoveryPanel({ saveData, onSaveChange, onMessage }: DiscoveryPanelProps) {
  const atOldTree = saveData.currentLocation === 'Strange Old Tree';
  const canDiscoverGrove = atOldTree && saveData.questProgress.lostPuppy.completed && !saveData.whisperGroveDiscovered;

  if (!atOldTree && !saveData.wildCamperUnlocked) return null;

  function handleSpotOwl() {
    onSaveChange(spotRareOwl(saveData));
    onMessage('You quietly spotted the Rare Owl perched in the Strange Old Tree. Try taking a photo.');
  }

  function handleDiscoverWhisperGrove() {
    onSaveChange(discoverWhisperGrove(saveData));
    onMessage('You found Whisper Grove - a peaceful hidden nature place behind the old tree.');
  }

  return (
    <section className="discovery-card">
      <p className="eyebrow">Special Discoveries</p>
      <h2>Tutorial Park Secrets</h2>

      {atOldTree && !saveData.rareOwlSpotted ? (
        <button onClick={handleSpotOwl}>Look Carefully for the Rare Owl</button>
      ) : null}

      {atOldTree && saveData.rareOwlSpotted ? (
        <p className="complete-message">{'\uD83E\uDD89'} Rare Owl spotted. Use the camera to photograph it.</p>
      ) : null}

      {atOldTree && !saveData.questProgress.lostPuppy.completed ? (
        <p className="muted">Whisper Grove clue: helping the puppy first may reveal a quieter path.</p>
      ) : null}

      {canDiscoverGrove ? (
        <button onClick={handleDiscoverWhisperGrove}>Follow the Quiet Path to Whisper Grove</button>
      ) : null}

      {saveData.whisperGroveDiscovered ? (
        <p className="complete-message">{'\uD83C\uDF3A'} Whisper Grove discovered.</p>
      ) : null}

      {saveData.wildCamperUnlocked ? (
        <p className="reward-message">{'\uD83D\uDE90'} You unlocked the Wild Camper!</p>
      ) : null}
    </section>
  );
}
