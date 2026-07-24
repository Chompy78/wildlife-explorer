import { useEffect, useMemo, useRef, useState } from 'react';
import { getAnimalById, getAnimalsForLocation, getLocationByName, getRoleName, getVisibleParkLocations, photographAnimal, visitLocation } from '../state/gameState';
import type { AnimalId, LocationName } from '../types/Ids';
import type { SaveData } from '../types/SaveData';
import { CameraPanel } from './CameraPanel';
import { CompletionCelebration } from './CompletionCelebration';
import { DiscoveryPanel } from './DiscoveryPanel';
import { Journal } from './Journal';
import { LocationClues } from './LocationClues';
import { ProgressTracker } from './ProgressTracker';
import { QuestPanel } from './QuestPanel';

type ParkScreenProps = { saveData: SaveData; onSaveChange: (saveData: SaveData) => void; onOpenCamper: () => void; onGoHome: () => void };

export function ParkScreen({ saveData, onSaveChange, onOpenCamper, onGoHome }: ParkScreenProps) {
  const [message, setMessage] = useState('Welcome to Tutorial Park. Try visiting Duck Pond, Open Meadow, Forest Trail, or the Strange Old Tree.');
  const [journalOpen, setJournalOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
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
    onSaveChange(photographAnimal(saveData, animal.id));
    setMessage(`Great photo! ${animal.name} added to your Wildlife Journal.`);
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
        <img src="/assets/tutorial-park/park-direction.png" alt="Illustrated wildlife explorer and dog photographing a duck family at a woodland pond in Tutorial Park"/>
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
          <div className="location-grid">{visibleLocations.map((location) => (
            <button key={location.id} className={location.name === saveData.currentLocation ? 'location-card active' : `location-card ${location.status}`} onClick={() => goToLocation(location.name)}>
              <span className="location-icon">{location.status === 'hidden' ? '\uD83D\uDD12' : location.icon}</span><strong>{location.name}</strong><span>{location.description}</span><em>{location.status === 'hidden' ? 'Hidden for now' : 'Available now'}</em>
            </button>
          ))}</div>
        </div>
        <aside className="panel side-panel">
          <h2>{currentLocation.name}</h2><p>{currentLocation.description}</p>
          <LocationClues saveData={saveData} />
          <CameraPanel animalsHere={animalsHere} saveData={saveData} onPhotographAnimal={handlePhotographAnimal} />
          <QuestPanel saveData={saveData} onSaveChange={onSaveChange} onMessage={setMessage} />
          <DiscoveryPanel saveData={saveData} onSaveChange={onSaveChange} onMessage={setMessage} />
          <div className="message-box" role="status" aria-live="polite">{message}</div>
          <ProgressTracker saveData={saveData} />
        </aside>
      </section>
      {journalOpen ? <Journal saveData={saveData} onClose={closeJournal} /> : null}
      {celebrationOpen ? <CompletionCelebration onClose={() => setCelebrationOpen(false)} /> : null}
    </main>
  );
}
