import type { SaveData } from '../types/SaveData';

export function LocationClues({ saveData }: { saveData: SaveData }) {
  const clue = getClue(saveData);
  if (!clue) return null;
  return (
    <section className="clue-card" aria-label="Nearby clue">
      <p className="eyebrow">Nearby clue</p>
      <p>{clue}</p>
    </section>
  );
}

function getClue(saveData: SaveData): string | null {
  const quest = saveData.questProgress.lostPuppy;
  if (saveData.currentLocation === 'Open Meadow' && quest.started && !quest.foundPawprints) {
    return 'You notice small marks pressed into the soft grass.';
  }
  if (saveData.currentLocation === 'Forest Trail' && quest.foundPawprints && !quest.foundToy) {
    return 'A bright object is partly hidden beside a fallen leaf.';
  }
  if (saveData.currentLocation === 'Forest Trail' && quest.foundToy && !quest.foundPuppy) {
    return 'A gentle rustling sound comes from farther along the trail.';
  }
  if (saveData.currentLocation === 'Strange Old Tree' && !saveData.rareOwlSpotted) {
    return 'A quiet shape is tucked between the upper branches.';
  }
  if (saveData.currentLocation === 'Strange Old Tree' && quest.completed && !saveData.whisperGroveDiscovered) {
    return 'The returned puppy revealed where a narrow path begins behind the tree.';
  }
  return null;
}
