import { useCallback, useRef } from 'react';
import { getPhotoVariantCount, getPhotoVariantUrl } from '../data/animalPhotoVariants';
import { useModalFocus } from '../hooks/useModalFocus';
import type { Animal } from '../types/Animal';

type PhotoAlbumProps = { animal: Animal; collected: string[]; onClose: () => void };

export function PhotoAlbum({ animal, collected, onClose }: PhotoAlbumProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]);
  useModalFocus(dialogRef, close, closeRef);
  const total = getPhotoVariantCount(animal.id);
  const collectedCount = Array.from({ length: total }, (_, i) => i + 1).filter((variant) => collected.includes(`${animal.id}-${variant}`)).length;

  return (
    <div className="album-overlay" role="presentation">
      <section ref={dialogRef} className="album-card" role="dialog" aria-modal="true" aria-labelledby="album-title" aria-describedby="album-description" tabIndex={-1}>
        <div className="journal-header">
          <div><p className="eyebrow">Photo Album</p><h2 id="album-title">{animal.name}</h2><p id="album-description" className="muted">{collectedCount} of {total} photos collected</p></div>
          <button ref={closeRef} className="secondary" onClick={onClose}>Close</button>
        </div>
        <div className="album-grid">
          {Array.from({ length: total }, (_, i) => i + 1).map((variant) => {
            const key = `${animal.id}-${variant}`;
            const isCollected = collected.includes(key);
            return (
              <div key={variant} className={isCollected ? 'album-slot' : 'album-slot locked'}>
                {isCollected ? (
                  <img src={getPhotoVariantUrl(animal.id, variant)} alt={`Photo ${variant} of ${animal.name}`} />
                ) : (
                  <span aria-hidden="true">🔒</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
