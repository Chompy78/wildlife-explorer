import { useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../assetUrl';
import { countCollectedVariants, getPhotoVariantCount, getPhotoVariantUrlFromKey } from '../data/animalPhotoVariants';
import { getFactForVariantKey } from '../data/animalFacts';
import { parkMapCoordinates } from '../data/parkMapCoordinates';
import { unlockAchievement } from '../state/achievementState';
import { getAnimalById, getAnimalsForLocation, getLocationByName, getVisibleParkLocations, photographAnimal, visitLocation } from '../state/gameState';
import type { Animal } from '../types/Animal';
import type { AnimalId, LocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { BiomeQuiz } from './BiomeQuiz';
import { CameraPanel } from './CameraPanel';
import { CompletionCelebration } from './CompletionCelebration';
import { DiscoveryPanel } from './DiscoveryPanel';
import { HabitatQuiz } from './HabitatQuiz';
import { Journal } from './Journal';
import { getLocationClue, LocationClues } from './LocationClues';
import { PanelModal } from './PanelModal';
import { PhotoReveal } from './PhotoReveal';
import { ProgressTracker } from './ProgressTracker';
import { QuestPanel } from './QuestPanel';

type ParkScreenProps = { saveData: SaveData; onSaveChange: (saveData: SaveData) => void; onOpenCamper: () => void; onGoHome: () => void };
type PanelKey = 'camera' | 'quest' | 'clue' | 'discover' | 'progress' | 'about';

export function ParkScreen({ saveData, onSaveChange, onOpenCamper, onGoHome }: ParkScreenProps) {
  const [message, setMessage] = useState('Welcome to Tutorial Park. Try visiting Duck Pond, Open Meadow, Forest Trail, or the Strange Old Tree.');
  const [journalOpen, setJournalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [biomeQuizOpen, setBiomeQuizOpen] = useState(false);
  const [quizAnimal, setQuizAnimal] = useState<Animal | null>(null);
  const [photoReveal, setPhotoReveal] = useState<{ animal: Animal; variantKey: string; greatShot: boolean } | null>(null);
  const previousUnlocked = useRef(saveData.wildCamperUnlocked);
  const visibleLocations = useMemo(() => getVisibleParkLocations(saveData), [saveData]);
  const currentLocation = getLocationByName(saveData.currentLocation) ?? visibleLocations[0];
  const animalsHere = useMemo(() => getAnimalsForLocation(currentLocation.name, saveData), [currentLocation.name, saveData]);
  const showDiscover = saveData.currentLocation === 'Strange Old Tree' || saveData.wildCamperUnlocked;
  const clue = getLocationClue(saveData);

  useEffect(() => {
    if (!previousUnlocked.current && saveData.wildCamperUnlocked) setCelebrationOpen(true);
    previousUnlocked.current = saveData.wildCamperUnlocked;
  }, [saveData.wildCamperUnlocked]);

  function goToLocation(locationName: LocationName) {
    const location = getLocationByName(locationName);
    if (!location) return;
    if (location.status === 'hidden' && !(location.name === 'Whisper Grove' && saveData.whisperGroveDiscovered)) {
      setMessage('Whisper Grove is hidden. Explore the old tree after helping the puppy.');
      return;
    }
    onSaveChange(visitLocation(saveData, location.name));
    setMessage(`You arrived at ${location.name}. ${location.gameplayNote}`);
  }

  function handlePhotographAnimal(animalId: AnimalId, greatShot: boolean) {
    const animal = getAnimalById(animalId);
    if (!animal) return;
    const isNewReport = Boolean(animal.nonNative) && !saveData.reportedInvasiveSpecies.includes(animalId);
    const previousVariants = saveData.collectedPhotoVariants;
    const updated = photographAnimal(saveData, animal.id);
    onSaveChange(updated);
    setMessage(greatShot ? `Great shot! ${animal.name} added to your Wildlife Journal.` : `Great photo! ${animal.name} added to your Wildlife Journal.`);
    const newVariant = updated.collectedPhotoVariants.find((key) => !previousVariants.includes(key));
    if (newVariant) setPhotoReveal({ animal, variantKey: newVariant, greatShot });
    if (isNewReport) setQuizAnimal(animal);
  }

  return (
    <main className="screen play-screen park-screen">
      <header className="top-bar">
        <div><p className="eyebrow">Tutorial Park</p><h1>Wildlife Explorer</h1></div>
        <div className="button-row">
          {saveData.wildCamperUnlocked ? <button className="camper-button" onClick={onOpenCamper}>{'🚐'} Enter Wild Camper</button> : null}
          <button className="secondary" onClick={onGoHome}>Home</button>
        </div>
      </header>
      <section className="play-area">
        <div className="map-column">
          <div className="location-strip"><strong>{currentLocation.name}</strong>{currentLocation.description}</div>
          <div className="park-map">
            <img src={assetUrl('assets/tutorial-park/park-map.png')} alt="Illustrated map of Tutorial Park" />
            {visibleLocations.map((location) => {
              const coords = parkMapCoordinates[location.name];
              const isActive = location.name === saveData.currentLocation;
              return (
                <div key={location.id} className="map-pin-wrap" style={{ top: coords.top, left: coords.left }}>
                  <button
                    className={`map-pin ${isActive ? 'active' : location.status}`}
                    onClick={() => goToLocation(location.name)}
                    aria-label={`${location.name}${location.status === 'hidden' ? ', hidden' : isActive ? ', current location' : ''}`}
                  >
                    <span className="pin-icon" aria-hidden="true">{location.status === 'hidden' ? '🔒' : location.icon}</span>
                    <span className="pin-label">{location.name}</span>
                  </button>
                </div>
              );
            })}
            <nav className="action-bar" aria-label="Park tools">
              <button className="action-button" onClick={() => setActivePanel('camera')} aria-label="Camera">
                <span aria-hidden="true">📷</span>{animalsHere.length > 0 ? <span className="badge">{animalsHere.length}</span> : null}
              </button>
              <button className="action-button" onClick={() => setActivePanel('quest')} aria-label="Quest"><span aria-hidden="true">🐾</span></button>
              {clue ? <button className="action-button" onClick={() => setActivePanel('clue')} aria-label="Nearby clue"><span aria-hidden="true">🔍</span></button> : null}
              {showDiscover ? <button className="action-button" onClick={() => setActivePanel('discover')} aria-label="Discover"><span aria-hidden="true">🔭</span></button> : null}
              <button className="action-button" onClick={() => setActivePanel('progress')} aria-label="Progress"><span aria-hidden="true">✅</span></button>
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
      {activePanel === 'quest' ? (
        <PanelModal title="Lost Puppy Quest" onClose={() => setActivePanel(null)}>
          <QuestPanel saveData={saveData} onSaveChange={onSaveChange} onMessage={setMessage} onPhotoReveal={(variantKey) => { const lostPuppy = getAnimalById('lost-puppy'); if (lostPuppy) setPhotoReveal({ animal: lostPuppy, variantKey, greatShot: false }); }} />
        </PanelModal>
      ) : null}
      {activePanel === 'clue' ? (
        <PanelModal title="Nearby Clue" onClose={() => setActivePanel(null)}>
          <LocationClues saveData={saveData} />
        </PanelModal>
      ) : null}
      {activePanel === 'discover' ? (
        <PanelModal title="Special Discoveries" onClose={() => setActivePanel(null)}>
          <DiscoveryPanel saveData={saveData} onSaveChange={onSaveChange} onMessage={setMessage} />
        </PanelModal>
      ) : null}
      {activePanel === 'progress' ? (
        <PanelModal title="Tutorial Progress" onClose={() => setActivePanel(null)}>
          <ProgressTracker saveData={saveData} />
        </PanelModal>
      ) : null}
      {activePanel === 'about' ? (
        <PanelModal title="Explore the park" eyebrow="Wildlife photography" onClose={() => setActivePanel(null)}>
          <img className="about-hero-image" src={assetUrl('assets/tutorial-park/park-direction.png')} alt="Illustrated wildlife explorer and dog photographing a duck family at a woodland pond in Tutorial Park" />
          <p>Visit each location and photograph wildlife calmly. Finish Tutorial Park by helping the puppy, photographing Rare Owl, and discovering Whisper Grove.</p>
        </PanelModal>
      ) : null}

      {journalOpen ? <Journal saveData={saveData} onClose={() => setJournalOpen(false)} /> : null}
      {celebrationOpen ? (
        <CompletionCelebration
          onClose={() => {
            setCelebrationOpen(false);
            if (!saveData.achievements.includes('tutorial-park-ranger')) setBiomeQuizOpen(true);
          }}
        />
      ) : null}
      {biomeQuizOpen ? (
        <BiomeQuiz
          saveData={saveData}
          onComplete={() => onSaveChange(unlockAchievement(saveData, 'tutorial-park-ranger'))}
          onClose={() => setBiomeQuizOpen(false)}
        />
      ) : null}
      {photoReveal ? (
        <PhotoReveal
          animal={photoReveal.animal}
          photoUrl={getPhotoVariantUrlFromKey(photoReveal.variantKey)}
          collectedCount={countCollectedVariants(photoReveal.animal.id, saveData.collectedPhotoVariants)}
          totalCount={getPhotoVariantCount(photoReveal.animal.id)}
          fact={getFactForVariantKey(photoReveal.animal.id, photoReveal.variantKey)}
          photographCount={photoReveal.animal.id === 'lost-puppy' ? undefined : saveData.photographCounts[photoReveal.animal.id]}
          greatShot={photoReveal.greatShot}
          onClose={() => setPhotoReveal(null)}
        />
      ) : null}
      {quizAnimal ? <HabitatQuiz animal={quizAnimal} onClose={() => setQuizAnimal(null)} /> : null}
    </main>
  );
}
