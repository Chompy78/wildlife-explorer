import { useCallback, useRef } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';

export function CompletionCelebration({ onClose }: { onClose: () => void }) {
  const dialogRef=useRef<HTMLElement>(null); const closeRef=useRef<HTMLButtonElement>(null); const close=useCallback(onClose,[onClose]); useModalFocus(dialogRef,close,closeRef);
  return <div className="celebration-overlay" role="presentation"><section ref={dialogRef} className="celebration-card" role="dialog" aria-modal="true" aria-labelledby="celebration-title" aria-describedby="celebration-description" tabIndex={-1}><div className="celebration-icon" aria-hidden="true">{'\uD83D\uDE90'}</div><p className="eyebrow">Tutorial Park complete</p><h2 id="celebration-title">You unlocked the Wild Camper!</h2><p id="celebration-description">You helped the puppy, photographed the Rare Owl, and discovered Whisper Grove.</p><button ref={closeRef} onClick={onClose}>Continue Exploring</button></section></div>;
}
