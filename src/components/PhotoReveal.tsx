import { useCallback, useRef } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';
import { getPhotoQualityLabel, getPhotoQualityStyle } from '../data/photoQuality';
import type { Animal } from '../types/Animal';

type Props = {
  animal: Animal;
  photoUrl: string;
  collectedCount: number;
  totalCount: number;
  fact?: string | null;
  photographCount?: number;
  greatShot?: boolean;
  onClose: () => void;
};

export function PhotoReveal({ animal, photoUrl, collectedCount, totalCount, fact, photographCount, greatShot, onClose }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]);
  useModalFocus(dialogRef, close, closeRef);
  const complete = collectedCount >= totalCount;
  const qualityStyle = photographCount !== undefined ? getPhotoQualityStyle(photographCount) : undefined;
  const qualityLabel = photographCount !== undefined ? getPhotoQualityLabel(photographCount) : null;

  return (
    <div className="reveal-overlay" role="presentation">
      <section ref={dialogRef} className="reveal-card" role="dialog" aria-modal="true" aria-labelledby="reveal-title" aria-describedby="reveal-description" tabIndex={-1}>
        <p className="eyebrow">New photo!</p>
        <h2 id="reveal-title">{animal.name}</h2>
        <div className="reveal-photo-frame">
          <img className="reveal-photo" src={photoUrl} alt={`Photo of ${animal.name}`} style={qualityStyle} />
          {greatShot ? <span className="great-shot-badge">✨ Great shot!</span> : null}
        </div>
        {qualityLabel ? <p className="quality-label">{qualityLabel}</p> : null}
        <p id="reveal-description">
          {complete
            ? `${collectedCount} of ${totalCount} photos collected — collection complete!`
            : `${collectedCount} of ${totalCount} photos collected.`}
        </p>
        {fact ? (
          <p className="reveal-fact"><span className="eyebrow">Did you know?</span>{fact}</p>
        ) : null}
        <button ref={closeRef} onClick={onClose}>Continue Exploring</button>
      </section>
    </div>
  );
}
