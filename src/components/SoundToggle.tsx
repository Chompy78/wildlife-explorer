import { useSyncExternalStore } from 'react';
import { isSoundMuted, setSoundMuted, subscribeSoundMuted } from '../audio/sound';

export function SoundToggle() {
  const muted = useSyncExternalStore(subscribeSoundMuted, isSoundMuted);
  return (
    <button type="button" className="secondary" aria-pressed={!muted} onClick={() => setSoundMuted(!muted)}>
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span> Sound {muted ? 'off' : 'on'}
    </button>
  );
}
