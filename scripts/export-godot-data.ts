// Writes godot/data/game_data.json from the TypeScript data tables, so the Godot port reads exactly the
// same animals, biomes, facts and photo counts as the web game. Run: npx -y vite-node scripts/export-godot-data.ts
import { writeFileSync } from 'node:fs';
import { achievements } from '../src/data/achievements';
import { getBonusFactForVariant, getFactCount, getFactForVariant } from '../src/data/animalFacts';
import { getPhotoVariantCount } from '../src/data/animalPhotoVariants';
import { animals, commonMilestoneAnimals } from '../src/data/animals';
import { biomes } from '../src/data/biomes';
import { destinationPreviews } from '../src/data/destinations';
import { parkLocations } from '../src/data/locations';
import { parkMapCoordinates } from '../src/data/parkMapCoordinates';
import { lostPuppyQuest } from '../src/data/quests';
import { roles } from '../src/data/roles';
import { forestAnimalIds } from '../src/state/forestState';

const photoCounts: Record<string, number> = {};
const facts: Record<string, string[]> = {};
const bonusFacts: Record<string, string[]> = {};
for (const animal of animals) {
  const count = getPhotoVariantCount(animal.id);
  if (count > 0) photoCounts[animal.id] = count;
  const list: string[] = [];
  for (let i = 1; i <= Math.max(getFactCount(animal.id), count); i += 1) {
    const fact = getFactForVariant(animal.id, i);
    if (fact) list.push(fact);
  }
  if (list.length) facts[animal.id] = list;
  const bonus: string[] = [];
  for (let i = 1; i <= count + 1; i += 1) {
    const fact = getBonusFactForVariant(animal.id, i);
    if (fact) bonus.push(fact);
  }
  if (bonus.length) bonusFacts[animal.id] = bonus;
}

const data = {
  animals,
  commonMilestoneAnimalIds: commonMilestoneAnimals.map((a) => a.id),
  forestAnimalIds,
  photoCounts,
  facts,
  bonusFacts,
  biomes,
  destinations: destinationPreviews,
  roles,
  parkLocations,
  parkMapCoordinates,
  lostPuppyQuest,
  achievements,
};
writeFileSync(new URL('../godot/data/game_data.json', import.meta.url), JSON.stringify(data, null, 1));
console.log(`animals=${animals.length} biomes=${biomes.length} photoCounts=${Object.keys(photoCounts).length}`);
