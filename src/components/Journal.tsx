import { useCallback, useRef, useState } from 'react';
import { achievements } from '../data/achievements';
import { animals } from '../data/animals';
import { getTotalFactCount, getLearnedFacts } from '../data/animalFacts';
import { countCollectedVariants, getFirstCollectedVariant, getPhotoVariantCount, getPhotoVariantUrl } from '../data/animalPhotoVariants';
import { useModalFocus } from '../hooks/useModalFocus';
import { getsBonusPhotoSlot, unlocksBonusFacts } from '../data/roleBonuses';
import { hasHelpedLostPuppy, hasPhotographedAnimal } from '../state/gameState';
import { forestAnimalIds } from '../state/forestState';
import type { Animal } from '../types/Animal';
import type { SaveData } from '../types/SaveData';
import { PhotoAlbum } from './PhotoAlbum';

type JournalView = 'biomes' | 'park' | 'forest' | 'rewards';

function isDiscovered(animal: Animal, saveData: SaveData): boolean {
  const photographed = hasPhotographedAnimal(saveData, animal.id);
  const helped = animal.id === 'lost-puppy' && hasHelpedLostPuppy(saveData);
  const owlSpotted = animal.id === 'rare-owl' && saveData.rareOwlSpotted;
  return photographed || helped || owlSpotted;
}

const parkAnimals = animals.filter((animal) => !forestAnimalIds.includes(animal.id));
const forestBiomeAnimals = animals.filter((animal) => forestAnimalIds.includes(animal.id));

type JournalProps = { saveData: SaveData; onClose: () => void };
export function Journal({ saveData, onClose }: JournalProps) {
  const dialogRef = useRef<HTMLElement>(null); const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]); useModalFocus(dialogRef, close, closeRef);
  const [view, setView] = useState<JournalView>('biomes');
  const [albumAnimal, setAlbumAnimal] = useState<Animal | null>(null);

  const parkDiscovered = parkAnimals.filter((animal) => isDiscovered(animal, saveData)).length;
  const forestDiscovered = forestBiomeAnimals.filter((animal) => isDiscovered(animal, saveData)).length;

  return <div className="journal-overlay" role="presentation"><section ref={dialogRef} className="journal-panel" role="dialog" aria-modal="true" aria-labelledby="journal-title" aria-describedby="journal-description" tabIndex={-1}>
    <div className="journal-header"><div><p className="eyebrow">Wildlife Journal</p><h2 id="journal-title">Collection Book</h2><p id="journal-description" className="muted">Photos, discoveries, and animals helped during the adventure.</p></div><button ref={closeRef} className="secondary" onClick={onClose}>Close</button></div>
    {view === 'biomes' ? (
      <div className="biome-select-grid">
        <button className="biome-select-card" onClick={() => setView('park')}><span aria-hidden="true">🌳</span><strong>Tutorial Park</strong><small>{parkDiscovered} of {parkAnimals.length} discovered</small></button>
        <button className="biome-select-card" onClick={() => setView('forest')}><span aria-hidden="true">🌲</span><strong>Forest</strong><small>{forestDiscovered} of {forestBiomeAnimals.length} discovered</small></button>
        <button className="biome-select-card" onClick={() => setView('rewards')}><span aria-hidden="true">🏅</span><strong>Places &amp; Rewards</strong><small>Whisper Grove, Wild Camper, achievements</small></button>
      </div>
    ) : (
      <>
        <button className="secondary journal-back" onClick={() => setView('biomes')}>{'←'} Back to biomes</button>
        {view === 'park' ? <section className="journal-section"><h3>Tutorial Park Animals</h3><div className="journal-list">{parkAnimals.map((animal) => <JournalEntry key={animal.id} animal={animal} saveData={saveData} onOpenAlbum={setAlbumAnimal}/>)}</div></section> : null}
        {view === 'forest' ? <section className="journal-section"><h3>Forest Animals</h3><div className="journal-list">{forestBiomeAnimals.map((animal) => <JournalEntry key={animal.id} animal={animal} saveData={saveData} onOpenAlbum={setAlbumAnimal}/>)}</div></section> : null}
        {view === 'rewards' ? (
          <>
            <section className="journal-section"><h3>Places and Rewards</h3><SpecialEntry icon={saveData.whisperGroveDiscovered ? '🌺' : '🔒'} title="Whisper Grove" discovered={saveData.whisperGroveDiscovered} text={saveData.whisperGroveDiscovered ? 'Discovered - a peaceful hidden natural area.' : 'Hidden. Help animals and explore the Strange Old Tree area.'}/><SpecialEntry icon={saveData.wildCamperUnlocked ? '🚐' : '🔒'} title="Wild Camper" discovered={saveData.wildCamperUnlocked} text={saveData.wildCamperUnlocked ? 'Unlocked - Tutorial Park complete!' : 'Locked. Complete Lost Puppy, photograph Rare Owl, and discover Whisper Grove.'}/></section>
            <section className="journal-section"><h3>Achievements</h3>{Object.values(achievements).map((achievement) => { const unlocked = saveData.achievements.includes(achievement.id); return <SpecialEntry key={achievement.id} icon={unlocked ? achievement.icon : '🔒'} title={achievement.name} discovered={unlocked} text={unlocked ? achievement.description : 'Not earned yet.'}/>; })}</section>
          </>
        ) : null}
      </>
    )}
  </section>
  {albumAnimal ? <PhotoAlbum animal={albumAnimal} collected={saveData.collectedPhotoVariants} showBonusSlot={getsBonusPhotoSlot(saveData.selectedRole)} onClose={() => setAlbumAnimal(null)}/> : null}
  </div>;
}
function SpecialEntry({ icon, title, discovered, text }: { icon:string; title:string; discovered:boolean; text:string }) { return <article className={discovered ? 'journal-entry' : 'journal-entry undiscovered'}><div className="animal-emoji" aria-hidden="true">{icon}</div><div><h3>{title}</h3><p>{text}</p></div></article>; }
function PhotoProgress({ animal, saveData }: { animal:Animal; saveData:SaveData }) {
  const total=getPhotoVariantCount(animal.id); const collected=countCollectedVariants(animal.id,saveData.collectedPhotoVariants);
  if (total===0) return null;
  return <p className="photo-progress"><span>{collected} of {total} photos collected</span><span className="photo-progress-dots" aria-hidden="true">{Array.from({length:total},(_,i)=>(<span key={i} className={i<collected?'collected':''}/>))}</span></p>;
}
function FactsProgress({ animal, saveData }: { animal:Animal; saveData:SaveData }) {
  const bonusEligible = unlocksBonusFacts(saveData.selectedRole, animal);
  const total=getTotalFactCount(animal.id, bonusEligible);
  if (total===0) return null;
  const learned=getLearnedFacts(animal.id,saveData.collectedPhotoVariants,bonusEligible);
  return <div className="facts-progress"><p className="facts-progress-count">💡 {learned.length} of {total} facts learned</p>{learned.length>0 ? <ul className="facts-list">{learned.map((fact,i)=><li key={i}>{fact}</li>)}</ul> : null}</div>;
}
function JournalEntry({ animal, saveData, onOpenAlbum }: { animal:Animal; saveData:SaveData; onOpenAlbum:(animal:Animal)=>void }) {
  const photographed=hasPhotographedAnimal(saveData,animal.id); const helped=animal.id==='lost-puppy'&&hasHelpedLostPuppy(saveData); const owlSpotted=animal.id==='rare-owl'&&saveData.rareOwlSpotted; const discovered=photographed||helped||owlSpotted; const locked=!animal.availableInMilestone&&!helped&&!owlSpotted;
  const firstCollected=photographed?getFirstCollectedVariant(animal.id,saveData.collectedPhotoVariants):null;
  const hasAlbum=discovered&&getPhotoVariantCount(animal.id)>0;
  const icon=discovered&&firstCollected ? <img className="animal-thumb" src={getPhotoVariantUrl(animal.id,firstCollected)} alt=""/> : <div className="animal-emoji" aria-hidden="true">{discovered ? animal.emoji : locked ? '🔒' : '⬜'}</div>;
  return <article className={discovered ? 'journal-entry' : 'journal-entry undiscovered'}>{icon}<div><h3>{discovered ? animal.name : locked ? `${animal.name} - later` : animal.name}</h3>{helped ? <><p><strong>Status:</strong> Helped and reunited with owner.</p><p>{animal.funFact}</p><FactsProgress animal={animal} saveData={saveData}/></> : null}{!helped&&photographed ? <><p><strong>Habitat:</strong> {animal.habitat}</p><p>{animal.funFact}</p><PhotoProgress animal={animal} saveData={saveData}/><FactsProgress animal={animal} saveData={saveData}/>{animal.nonNative ? <p className="invasive-note"><strong>Logged for the park rangers:</strong> {animal.nonNative.impactNote}</p> : null}</> : null}{!helped&&!photographed&&owlSpotted ? <p className="muted">Spotted at the Strange Old Tree. Use the camera to photograph the owl.</p> : null}{!discovered ? <p className="muted">{locked ? 'This entry belongs to a later milestone or quest.' : `Not photographed yet. Explore ${animal.habitat}.`}</p> : null}{hasAlbum ? <button className="secondary album-open-button" onClick={() => onOpenAlbum(animal)}>{'📷'} View Photos</button> : null}</div></article>;
}
