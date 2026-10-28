import { useEffect } from 'react';
import { startAmbient, stopAmbient, type AmbientKind } from '../audio/sound';

// Plays the habitat's quiet ambient bed while the screen is mounted.
export function useAmbient(kind: AmbientKind): void {
  useEffect(() => {
    startAmbient(kind);
    return () => stopAmbient(kind);
  }, [kind]);
}
