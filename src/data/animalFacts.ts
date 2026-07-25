import type { AnimalId } from '../types/Ids';

// Exactly 5 facts per animal, matching the 5 collectible photo variants in animalPhotoVariants.ts -
// getting photo variant N reveals fact N. No separate "learned" save state is needed: a fact is learned
// iff its matching "<id>-<variant>" key is already in saveData.collectedPhotoVariants. Animals without
// photo art (see PHOTO_VARIANT_COUNTS) have no facts yet either.
const ANIMAL_FACTS: Partial<Record<AnimalId, string[]>> = {
  duck: [
    "Ducks have waterproof feathers - they spread natural oil from a gland to keep dry.",
    'Baby ducklings can swim within hours of hatching.',
    "Ducks \"dabble\" - tipping tail-up to reach pond plants without fully diving under.",
    "A duck's quack barely echoes, which is a small mystery scientists still enjoy studying.",
    'Ducks have excellent color vision, even better than humans in some ways.',
  ],
  frog: [
    'Frogs breathe partly through their skin, so they need to stay moist.',
    'Many frogs can leap over 20 times their own body length.',
    'A group of frogs is sometimes called an "army."',
    'Frogs have lived on Earth for over 200 million years.',
    'Some frogs shift color slightly depending on temperature and light.',
  ],
  butterfly: [
    'Butterflies taste with their feet.',
    "A butterfly's wings are actually clear - tiny scales create all their color.",
    "Butterflies warm up in the sun before flying if they've gotten too cool.",
    'Some butterflies, like monarchs, migrate thousands of miles.',
    'A butterfly starts life as a caterpillar and transforms inside a chrysalis.',
  ],
  rabbit: [
    "A rabbit's front teeth never stop growing, so they gnaw to keep them worn down.",
    'Rabbits can see almost all the way around themselves without turning their head.',
    'Baby rabbits are called kits.',
    'Rabbits thump their back feet to signal or warn each other.',
    'A joyful rabbit sometimes leaps and twists in the air - it is called a "binky."',
  ],
  lizard: [
    'Many lizards can drop their tail to escape danger and grow a new one later.',
    'Lizards are cold-blooded, so they bask in the sun to warm up.',
    'Some lizards can sprint on just their back legs for extra speed.',
    'Tiny scales cover a lizard\'s skin and help it stay hydrated.',
    'Geckos, a kind of lizard, can stick to almost any surface with tiny hairs on their feet.',
  ],
  'park-bird': [
    "A small bird like this one eats roughly half its body weight in food each day.",
    'Birds have hollow bones, which helps keep them light for flying.',
    'Many small birds take quick dust baths to keep their feathers clean.',
    "A bird's song can mark its territory or attract a mate.",
    'Some small birds can remember hundreds of hiding spots for their food.',
  ],
  'rare-owl': [
    'Owls can rotate their heads up to 270 degrees.',
    'Special soft feathers let owls fly almost silently.',
    "An owl's eyes do not move in their sockets - that is why it turns its whole head.",
    'Owls have incredible hearing and can find prey in complete darkness.',
    'A group of owls is sometimes called a "parliament."',
  ],
  'forest-wren': [
    'Wrens are tiny, but their songs are surprisingly loud for their size.',
    'Some wrens build several practice nests before choosing a final one.',
    'Wrens often hold their tail feathers pointed straight up.',
    'Wrens are curious and will investigate unfamiliar sounds in the forest.',
    'Despite their small size, wrens fiercely defend their nesting area.',
  ],
  'forest-wallaby': [
    'Wallabies are relatives of kangaroos, just smaller.',
    'Wallabies use their strong tail for balance while hopping.',
    "Baby wallabies, called joeys, grow in their mother's pouch.",
    'A wallaby can leap several times its own height.',
    'Wallabies are most active at dawn and dusk, resting in shade during the heat of day.',
  ],
  'forest-beetle': [
    'Beetles make up about a quarter of all known animal species on Earth.',
    "A beetle's shiny shell is a hardened pair of wings, protecting a second flying pair underneath.",
    'Some beetles can carry many times their own body weight.',
    'Beetles have existed for over 300 million years.',
    'Many beetles help recycle fallen leaves and wood in the forest.',
  ],
  'lost-puppy': [
    'A wagging tail can mean a dog is happy, excited, or just saying hello.',
    "A dog's sense of smell is tens of thousands of times stronger than a human's.",
    'Puppies sleep a lot during the day - it helps them grow.',
    'Dogs can learn many human words and read our tone of voice.',
    'A reunited dog often shows its joy with excited jumps, licks, and a happy wiggle.',
  ],
};

export function getFactForVariant(id: AnimalId, variant: number): string | null {
  const facts = ANIMAL_FACTS[id];
  if (!facts) return null;
  return facts[variant - 1] ?? null;
}

export function getFactForVariantKey(id: AnimalId, variantKey: string): string | null {
  const variant = Number(variantKey.slice(id.length + 1));
  return getFactForVariant(id, variant);
}

export function getFactCount(id: AnimalId): number {
  return ANIMAL_FACTS[id]?.length ?? 0;
}

// Facts learned so far for an animal, derived from which photo variants are collected (same
// "<id>-<variant>" keys) - ordered by variant number for a stable Journal display.
export function getLearnedFacts(id: AnimalId, collected: string[]): string[] {
  const facts = ANIMAL_FACTS[id];
  if (!facts) return [];
  const learned: string[] = [];
  for (let i = 1; i <= facts.length; i++) {
    if (collected.includes(`${id}-${i}`)) learned.push(facts[i - 1]);
  }
  return learned;
}
