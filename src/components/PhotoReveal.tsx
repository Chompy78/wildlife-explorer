import { useCallback, useRef } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';
import type { Animal } from '../types/Animal';

type Props = { animal: Animal; photoUrl: string; collectedCount: number; totalCount: number; onClose: () => void };

export function PhotoReveal({ animal, photoUrl, collectedCount, totalCount, onClose }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]);
  useModalFocus(dialogRef, close, closeRef);
  const complete = collectedCount >= totalCount;

  return (
    <div className="reveal-overlay" role="presentation">
      <section ref={dialogRef} className="reveal-card" role="dialog" aria-modal="true" aria-labelledby="reveal-title" aria-describedby="reveal-description" tabIndex={-1}>
        <p className="eyebrow">New photo!</p>
        <h2 id="reveal-title">{animal.name}</h2>
        <img className="reveal-photo" src={photoUrl} alt={`Photo of ${animal.name}`} />
        <p id="reveal-description">
          {complete
            ? `${collectedCount} of ${totalCount} photos collected — collection complete!`
            : `${collectedCount} of ${totalCount} photos collected.`}
        </p>
        <button ref={closeRef} onClick={onClose}>Continue Exploring</button>
      </section>
    </div>
  );
}
