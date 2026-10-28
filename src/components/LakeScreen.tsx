import { useAmbient } from '../hooks/useAmbient';
import { useState } from 'react';
import { animals } from '../data/animals';
import { getBonusFactForVariantKey, getFactForVariantKey } from '../data/animalFacts';
import { countCollectedVariants, getPhotoVariantCount, getPhotoVariantUrlFromKey } from '../data/animalPhotoVariants';
import { lakeLocations } from '../data/lakeLocations';
import { getsBonusFirstPhotoFact, unlocksBonusFacts } from '../data/roleBonuses';
import { moveInLake, photographLakeAnimal } from '../state/lakeState';
import type { Animal } from '../types/Animal';
import type { AnimalId } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { CameraPanel } from './CameraPanel';
import { HabitatQuiz } from './HabitatQuiz';
import { Journal } from './Journal';
import { SoundToggle } from './SoundToggle';
import { PanelModal } from './PanelModal';
import { PhotoReveal } from './PhotoReveal';

type Props = { saveData: SaveData; onSaveChange: (s: SaveData) => void; onReturnToCamper: () => void; onGoHome: () => void };
type PanelKey = 'camera' | 'about';

// Mirrors ForestScreen: same camera -> photo reveal -> optional habitat quiz flow, over the Lake's three
// sections instead of the Forest's two. Calm observation only - nothing is collected from the wild.
export function LakeScreen({ saveData, onSaveChange, onReturnToCamper, onGoHome }: Props) {
  useAmbient('lake');
  const [journalOpen, setJournalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [message, setMessage] = useState('You have arrived quietly at the lake shore.');
  const [quizAnimal, setQuizAnimal] = useState<Animal | null>(null);
  const [photoReveal, setPhotoReveal] = useState<{ animal: Animal; variantKey: string; greatShot: boolean; bonusFact: string | null } | null>(null);
  const location = lakeLocations.find((l) => l.name === saveData.lakeLocation) ?? lakeLocations[0];
  const here: AnimalId[] = location.animalIds;
  const animalsHere: Animal[] = here.map((id) => animals.find((a) => a.id === id)!);

  function handlePhotographAnimal(id: AnimalId, greatShot: boolean) {
    const animal = animals.find((a) => a.id === id);
    if (!animal) return;
    const isNewReport = Boolean(animal.nonNative) && !saveData.reportedInvasiveSpecies.includes(id);
    const previousVariants = saveData.collectedPhotoVariants;
    const updated = photographLakeAnimal(saveData, id);
    onSaveChange(updated);
    setMessage(greatShot ? `Great shot! ${animal.name} was added to your Wildlife Journal.` : `Great photo! ${animal.name} was added to your Wildlife Journal.`);
    const newVariant = updated.collectedPhotoVariants.find((key) => !previousVariants.includes(key));
    if (newVariant) {
      let bonusFact: string | null = null;
      if (unlocksBonusFacts(saveData.selectedRole, animal)) {
        bonusFact = getBonusFactForVariantKey(animal.id, newVariant);
      } else if (getsBonusFirstPhotoFact(saveData.selectedRole) && countCollectedVariants(animal.id, previousVariants) === 0) {
        bonusFact = animal.funFact;
      }
      setPhotoReveal({ animal, variantKey: newVariant, greatShot, bonusFact });
    }
    if (isNewReport) setQuizAnimal(animal);
  }

  return (
    <main className="screen play-screen lake-screen">
      <header className="top-bar">
        <div><p className="eyebrow">Lake</p><h1>Lake Arrival</h1></div>
        <div className="button-row">
          <SoundToggle />
          <button onClick={onReturnToCamper}>Return to Wild Camper</button>
          <button className="secondary" onClick={onGoHome}>Home</button>
        </div>
      </header>
      <section className="play-area">
        <div className="map-column">
          <div className="location-strip"><strong>{location.name}</strong>{location.description} Observe from a respectful distance and take photos without disturbing wildlife.</div>
          <div className="forest-stage">
            <div className="lake-location-grid">
              {lakeLocations.map((l) => (
                <button key={l.name} className={saveData.lakeLocation === l.name ? 'location-card active' : 'location-card'} onClick={() => onSaveChange(moveInLake(saveData, l.name))}>
                  <span className="location-icon">{l.icon}</span><strong>{l.name}</strong><span>{l.description}</span>
                </button>
              ))}
            </div>
            <nav className="action-bar" aria-label="Lake tools">
              <button className="action-button" onClick={() => setActivePanel('camera')} aria-label="Camera"><span aria-hidden="true">📷</span>{here.length > 0 ? <span className="badge">{here.length}</span> : null}</button>
              <button className="action-button" onClick={() => setJournalOpen(true)} aria-label="Journal"><span aria-hidden="true">📖</span></button>
              <button className="action-button secondary" onClick={() => setActivePanel('about')} aria-label="About"><span aria-hidden="true">ℹ️</span></button>
            </nav>
          </div>
          <div className="message-box" role="status" aria-live="polite">{message}</div>
        </div>
      </section>
      {activePanel === 'camera' ? (
        <PanelModal title="Camera" onClose={() => setActivePanel(null)}>
          <CameraPanel animalsHere={animalsHere} saveData={saveData} onPhotographAnimal={handlePhotographAnimal} />
        </PanelModal>
      ) : null}
      {activePanel === 'about' ? (
        <PanelModal title="A calm lake" eyebrow="Lake" onClose={() => setActivePanel(null)}>
          <p>Visit the Shoreline, Open Water, and Reeds &amp; Shallows, and photograph the six animals that live here. Watch quietly - every animal stays wild and free.</p>
        </PanelModal>
      ) : null}
      {journalOpen ? <Journal saveData={saveData} onClose={() => setJournalOpen(false)} /> : null}
      {photoReveal ? (
        <PhotoReveal
          animal={photoReveal.animal}
          photoUrl={getPhotoVariantUrlFromKey(photoReveal.variantKey)}
          collectedCount={countCollectedVariants(photoReveal.animal.id, saveData.collectedPhotoVariants)}
          totalCount={getPhotoVariantCount(photoReveal.animal.id)}
          fact={getFactForVariantKey(photoReveal.animal.id, photoReveal.variantKey)}
          bonusFact={photoReveal.bonusFact}
          showPhotoQuality
          greatShot={photoReveal.greatShot}
          onClose={() => setPhotoReveal(null)}
        />
      ) : null}
      {quizAnimal ? <HabitatQuiz animal={quizAnimal} onClose={() => setQuizAnimal(null)} /> : null}
    </main>
  );
}
