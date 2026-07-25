import { useEffect, useState } from 'react';
import { getPhotoVariantCount, getPhotoVariantUrl, isCollectionComplete } from '../data/animalPhotoVariants';
import type { AnimalId } from '../types/Ids';
import { hasPhotographedAnimal } from '../state/gameState';
import type { Animal } from '../types/Animal';
import type { SaveData } from '../types/SaveData';

type CameraPanelProps = {
  animalsHere: Animal[];
  saveData: SaveData;
  onPhotographAnimal: (animalId: AnimalId, greatShot: boolean) => void;
};

const PULSE_ON_MS = 900;
const PULSE_OFF_MS = 1500;

export function CameraPanel({ animalsHere, saveData, onPhotographAnimal }: CameraPanelProps) {
  // A calm, non-punishing timing cue: the shutter glows on a loop, and shooting during the glow marks
  // that photo a "Great shot!" bonus. Shooting at any other time still always works - there is no miss.
  const [posePulse, setPosePulse] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    function loop(active: boolean) {
      setPosePulse(active);
      timeoutId = setTimeout(() => loop(!active), active ? PULSE_ON_MS : PULSE_OFF_MS);
    }
    loop(false);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="camera-card">
      {animalsHere.length === 0 ? (
        <p>No common animals are ready to photograph here yet.</p>
      ) : (
        <>
          <p className="camera-hint muted">Watch for the calm glow for a Great Shot bonus - any time still works!</p>
          <div className="photo-target-list">
            {animalsHere.map((animal) => {
              const alreadyPhotographed = hasPhotographedAnimal(saveData, animal.id);
              const hasPhotos = getPhotoVariantCount(animal.id) > 0;
              const complete = isCollectionComplete(animal.id, saveData.collectedPhotoVariants);
              return (
                <button
                  key={animal.id}
                  className={posePulse && !complete ? 'photo-target pulse' : 'photo-target'}
                  onClick={() => onPhotographAnimal(animal.id, posePulse)}
                  disabled={complete}
                >
                  {hasPhotos ? (
                    <img className="animal-thumb small" src={getPhotoVariantUrl(animal.id, 1)} alt="" />
                  ) : (
                    <span>{animal.emoji}</span>
                  )}
                  <strong>{complete ? `${animal.name} — collection complete` : alreadyPhotographed ? `Retake ${animal.name}` : `Photograph ${animal.name}`}</strong>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
