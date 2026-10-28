import { useState } from 'react';
import { animals } from '../data/animals';
import { getBonusFactForVariantKey, getFactForVariantKey } from '../data/animalFacts';
import { countCollectedVariants, getPhotoVariantCount, getPhotoVariantUrlFromKey } from '../data/animalPhotoVariants';
import { getsBonusFirstPhotoFact, unlocksBonusFacts } from '../data/roleBonuses';
import { useAmbient } from '../hooks/useAmbient';
import type { AmbientKind } from '../audio/sound';
import type { Animal } from '../types/Animal';
import type { AnimalId } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { CameraPanel } from './CameraPanel';
import { HabitatQuiz } from './HabitatQuiz';
import { Journal } from './Journal';
import { PanelModal } from './PanelModal';
import { PhotoReveal } from './PhotoReveal';
import { SoundToggle } from './SoundToggle';

export type BiomeLocationView = { name: string; icon: string; description: string; animalIds: AnimalId[] };

export type BiomeConfig = {
  eyebrow: string;
  title: string;
  arrivalMessage: string;
  aboutTitle: string;
  aboutText: string;
  toolsLabel: string;
  className: string;
  gridClassName: string;
  ambient: AmbientKind;
};

type Props = {
  config: BiomeConfig;
  locations: BiomeLocationView[];
  currentLocationName: string;
  saveData: SaveData;
  onSaveChange: (s: SaveData) => void;
  onMove: (name: string) => void;
  photograph: (save: SaveData, id: AnimalId) => SaveData;
  onReturnToCamper: () => void;
  onGoHome: () => void;
};

// The shared play screen for data-driven biomes (Lake, Mountains): same camera -> photo reveal ->
// optional habitat quiz flow as the Park and Forest, over a config-supplied set of sections. Calm
// observation only - nothing is collected from the wild.
export function BiomeScreen({ config, locations, currentLocationName, saveData, onSaveChange, onMove, photograph, onReturnToCamper, onGoHome }: Props) {
  useAmbient(config.ambient);
  const [journalOpen, setJournalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'camera' | 'about' | null>(null);
  const [message, setMessage] = useState(config.arrivalMessage);
  const [quizAnimal, setQuizAnimal] = useState<Animal | null>(null);
  const [photoReveal, setPhotoReveal] = useState<{ animal: Animal; variantKey: string; greatShot: boolean; bonusFact: string | null } | null>(null);
  const location = locations.find((l) => l.name === currentLocationName) ?? locations[0];
  const animalsHere: Animal[] = location.animalIds.map((id) => animals.find((a) => a.id === id)!);

  function handlePhotographAnimal(id: AnimalId, greatShot: boolean) {
    const animal = animals.find((a) => a.id === id);
    if (!animal) return;
    const isNewReport = Boolean(animal.nonNative) && !saveData.reportedInvasiveSpecies.includes(id);
    const previousVariants = saveData.collectedPhotoVariants;
    const updated = photograph(saveData, id);
    onSaveChange(updated);
    const lead = greatShot ? 'Great shot!' : 'Great photo!';
    // An animal with no photo art yet gets no photo reveal, so its fun fact is shown here instead.
    const noPhotoArt = getPhotoVariantCount(id) === 0;
    setMessage(`${lead} ${animal.name} was added to your Wildlife Journal.${noPhotoArt ? ` Did you know? ${animal.funFact}` : ''}`);
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
    <main className={`screen play-screen ${config.className}`}>
      <header className="top-bar">
        <div><p className="eyebrow">{config.eyebrow}</p><h1>{config.title}</h1></div>
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
            <div className={config.gridClassName}>
              {locations.map((l) => (
                <button key={l.name} className={location.name === l.name ? 'location-card active' : 'location-card'} onClick={() => onMove(l.name)}>
                  <span className="location-icon">{l.icon}</span><strong>{l.name}</strong><span>{l.description}</span>
                </button>
              ))}
            </div>
            <nav className="action-bar" aria-label={config.toolsLabel}>
              <button className="action-button" onClick={() => setActivePanel('camera')} aria-label="Camera"><span aria-hidden="true">📷</span><span className="badge">{animalsHere.length}</span></button>
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
        <PanelModal title={config.aboutTitle} eyebrow={config.eyebrow} onClose={() => setActivePanel(null)}>
          <p>{config.aboutText}</p>
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
