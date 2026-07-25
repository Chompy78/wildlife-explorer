import { useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../assetUrl';
import { countCollectedVariants, getPhotoVariantCount, getPhotoVariantUrlFromKey } from '../data/animalPhotoVariants';
import { parkMapCoordinates } from '../data/parkMapCoordinates';
import { getAnimalById, getAnimalsForLocation, getLocationByName, getRoleName, getVisibleParkLocations, photographAnimal, visitLocation } from '../state/gameState';
import type { Animal } from '../types/Animal';
import type { AnimalId, LocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { CameraPanel } from './CameraPanel';
import { CompletionCelebration } from './CompletionCelebration';
import { DiscoveryPanel } from './DiscoveryPanel';
import { HabitatQuiz } from './HabitatQuiz';
import { Journal } from './Journal';
import { LocationClues } from './LocationClues';
import { PhotoReveal } from './PhotoReveal';
import { ProgressTracker } from './ProgressTracker';
import { QuestPanel } from './QuestPanel';

type ParkScreenProps = { saveData: SaveData; onSaveChange: (saveData: SaveData) => void; onOpenCamper: () => void; onGoHome: () => void };

export function ParkScreen({ saveData, onSaveChange, onOpenCamper, onGoHome }: ParkScreenProps) {
  const [message, setMessage] = useState('Welcome to Tutorial Park. Try visiting Duck Pond, Open Meadow, Forest Trail, or the Strange Old Tree.');
  const [journalOpen, setJournalOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [quizAnimal, setQuizAnimal] = useState<Animal | null>(null);
  const [photoReveal, setPhotoReveal] = useState<{ animal: Animal; variantKey: string } | null>(null);
  const previousUnlocked = useRef(saveData.wildCamperUnlocked);
  const journalButtonRef = useRef<HTMLButtonElement>(null);
  const visibleLocations = useMemo(() => getVisibleParkLocations(saveData), [saveData]);
  const currentLocation = getLocationByName(saveData.currentLocation) ?? visibleLocations[0];
  const animalsHere = useMemo(() => getAnimalsForLocation(currentLocation.name, saveData), [currentLocation.name, saveData]);

  useEffect(() => {
    if (!previousUnlocked.current && saveData.wildCamperUnlocked) setCelebrationOpen(true);
    previousUnlocked.current = saveData.wildCamperUnlocked;
  }, [saveData.wildCamperUnlocked]);

  function closeJournal() {
    setJournalOpen(false);
    requestAnimationFrame(() => journalButtonRef.current?.focus());
  }

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

  function handlePhotographAnimal(animalId: AnimalId) {
    const animal = getAnimalById(animalId);
    if (!animal) return;
    const isNewReport = Boolean(animal.nonNative) && !saveData.reportedInvasiveSpecies.includes(animalId);
    const previousVariants = saveData.collectedPhotoVariants;
    const updated = photographAnimal(saveData, animal.id);
    onSaveChange(updated);
    setMessage(`Great photo! ${animal.name} added to your Wildlife Journal.`);
    const newVariant = updated.collectedPhotoVariants.find((key) => !previousVariants.includes(key));
    if (newVariant) setPhotoReveal({ animal, variantKey: newVariant });
    if (isNewReport) setQuizAnimal(animal);
  }

  return (
    <main className="screen park-screen">
      <header className="top-bar">
        <div><p className="eyebrow">Tutorial Park</p><h1>Wildlife Explorer</h1><p className="muted">Role: {getRoleName(saveData.selectedRole)}</p></div>
        <div className="button-row">
          <button ref={journalButtonRef} className="secondary" onClick={() => setJournalOpen(true)}>Open Journal</button>
          {saveData.wildCamperUnlocked ? <button className="camper-button" onClick={onOpenCamper}>{'\uD83D\uDE90'} Enter Wild Camper</button> : null}<button className="secondary" onClick={onGoHome}>Home</button>
        </div>
      </header>
      <section className="biome-visual panel">
        <img src={assetUrl('assets/tutorial-park/park-direction.png')} alt="Illustrated wildlife explorer and dog photographing a duck family at a woodland pond in Tutorial Park"/>
        <div className="biome-visual-copy">
          <p className="eyebrow">Wildlife photography</p>
          <h2>Explore the park</h2>
          <p>Visit each location and photograph wildlife calmly.</p>
        </div>
      </section>
      <section className="park-grid">
        <div className="panel map-panel">
          <h2>Park Map</h2>
          <p className="muted">Finish Tutorial Park by helping the puppy, photographing Rare Owl, and discovering Whisper Grove.</p>
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
                    <span className="pin-icon" aria-hidden="true">{location.status === 'hidden' ? '\uD83D\uDD12' : location.icon}</span>
                    <span className="pin-label">{location.name}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <aside className="panel side-panel">
          <h2>{currentLocation.name}</h2><p>{currentLocation.description}</p>
          <LocationClues saveData={saveData} />
          <CameraPanel animalsHere={animalsHere} saveData={saveData} onPhotographAnimal={handlePhotographAnimal} />
          <QuestPanel saveData={saveData} onSaveChange={onSaveChange} onMessage={setMessage} onPhotoReveal={(variantKey) => { const lostPuppy = getAnimalById('lost-puppy'); if (lostPuppy) setPhotoReveal({ animal: lostPuppy, variantKey }); }} />
          <DiscoveryPanel saveData={saveData} onSaveChange={onSaveChange} onMessage={setMessage} />
          <div className="message-box" role="status" aria-live="polite">{message}</div>
          <ProgressTracker saveData={saveData} />
        </aside>
      </section>
      {journalOpen ? <Journal saveData={saveData} onClose={closeJournal} /> : null}
      {celebrationOpen ? <CompletionCelebration onClose={() => setCelebrationOpen(false)} /> : null}
      {photoReveal ? (
        <PhotoReveal
          animal={photoReveal.animal}
          photoUrl={getPhotoVariantUrlFromKey(photoReveal.variantKey)}
          collectedCount={countCollectedVariants(photoReveal.animal.id, saveData.collectedPhotoVariants)}
          totalCount={getPhotoVariantCount(photoReveal.animal.id)}
          onClose={() => setPhotoReveal(null)}
        />
      ) : null}
      {quizAnimal ? <HabitatQuiz animal={quizAnimal} onClose={() => setQuizAnimal(null)} /> : null}
    </main>
  );
}
