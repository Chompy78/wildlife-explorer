import { getPhotoVariantCount, getPhotoVariantUrl, isCollectionComplete } from '../data/animalPhotoVariants';
import type { AnimalId } from '../types/Ids';
import { hasPhotographedAnimal } from '../state/gameState';
import type { Animal } from '../types/Animal';
import type { SaveData } from '../types/SaveData';

type CameraPanelProps = {
  animalsHere: Animal[];
  saveData: SaveData;
  onPhotographAnimal: (animalId: AnimalId) => void;
};

export function CameraPanel({ animalsHere, saveData, onPhotographAnimal }: CameraPanelProps) {
  return (
    <div className="camera-card">
      <h2>Camera</h2>
      {animalsHere.length === 0 ? (
        <p>No common animals are ready to photograph here yet.</p>
      ) : (
        <div className="photo-target-list">
          {animalsHere.map((animal) => {
            const alreadyPhotographed = hasPhotographedAnimal(saveData, animal.id);
            const hasPhotos = getPhotoVariantCount(animal.id) > 0;
            const complete = isCollectionComplete(animal.id, saveData.collectedPhotoVariants);
            return (
              <button key={animal.id} className="photo-target" onClick={() => onPhotographAnimal(animal.id)} disabled={complete}>
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
      )}
    </div>
  );
}
