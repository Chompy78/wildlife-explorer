import { animals, commonMilestoneAnimals } from '../data/animals';
import { ALL_PHOTO_VARIANT_KEYS, getFirstCollectedVariant, getPhotoVariantUrl } from '../data/animalPhotoVariants';
import type { SaveData } from '../types/SaveData';

export function PhotoWallSummary({ saveData }: { saveData: SaveData }) {
  const photographed = animals.filter((animal) => saveData.photographedAnimals.includes(animal.id));
  const commonCount = photographed.filter((animal) => commonMilestoneAnimals.some((common) => common.id === animal.id)).length;
  return (
    <section className="photo-wall-summary" aria-label="Tutorial Park discovery summary">
      <h3>Discovery Summary</h3>
      <ul>
        <li>{commonCount} of {commonMilestoneAnimals.length} common animals photographed</li>
        <li>Rare Owl: {saveData.photographedAnimals.includes('rare-owl') ? 'photographed' : 'not photographed'}</li>
        <li>Non-native sightings reported: {saveData.reportedInvasiveSpecies.length} of {animals.filter((animal) => animal.nonNative).length}</li>
        <li>Photos collected: {saveData.collectedPhotoVariants.length} of {ALL_PHOTO_VARIANT_KEYS.length}</li>
        <li>Lost Puppy: {saveData.questProgress.lostPuppy.completed ? 'helped and reunited' : 'not completed'}</li>
        <li>Whisper Grove: {saveData.whisperGroveDiscovered ? 'discovered' : 'hidden'}</li>
      </ul>
      {photographed.length ? (
        <div className="photo-chip-list">
          {photographed.map((animal) => {
            const firstCollected = getFirstCollectedVariant(animal.id, saveData.collectedPhotoVariants);
            return (
              <span key={animal.id}>
                {firstCollected ? <img className="animal-thumb tiny" src={getPhotoVariantUrl(animal.id, firstCollected)} alt="" /> : animal.emoji} {animal.name}
              </span>
            );
          })}
        </div>
      ) : <p className="muted">Photographed animals will appear here.</p>}
    </section>
  );
}
