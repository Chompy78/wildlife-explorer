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

// Bonus facts for Conservation Ranger (common animals) and Animal Researcher (rare animals) - doubles
// the total to 10 per eligible animal. Paired with the normal facts above: collecting variant N reveals
// both fact N and bonus fact N, shown together on the same reveal (see roleBonuses.ts for eligibility).
const BONUS_FACTS: Partial<Record<AnimalId, string[]>> = {
  duck: [
    'Ducks preen their feathers to spread the special waterproof oil evenly.',
    "A duck's webbed feet act like paddles, helping it swim without much effort.",
    'Mother ducks lead their ducklings in a line to keep them safe and together.',
    'Ducks can sleep with one eye open and half their brain still alert for danger.',
    'Some ducks migrate long distances between seasons, guided by the sun and stars.',
  ],
  frog: [
    "A frog's long, sticky tongue can snap out and back in a fraction of a second.",
    'Frogs shed their skin regularly, and many eat the old skin afterward.',
    'Tadpoles breathe through gills before they grow lungs as adult frogs.',
    "Frogs don't need to drink water - they absorb it through their skin.",
    "A frog's bulging eyes help it see nearly all the way around without moving its head.",
  ],
  butterfly: [
    'Butterflies have four wings, not two - two pairs that can move independently.',
    "A butterfly's proboscis works like a curled-up drinking straw for nectar.",
    'Butterflies rely on wind currents to help them glide long distances with less effort.',
    'Some butterfly species can see ultraviolet colors invisible to human eyes.',
    "A caterpillar's body is almost completely rebuilt during its time in the chrysalis.",
  ],
  rabbit: [
    'Rabbits have a blind spot right in front of their nose, so they rely on whiskers there.',
    "A rabbit's ears can rotate almost independently to listen in different directions.",
    'Rabbits are most active at dawn and dusk, resting quietly during the hottest part of the day.',
    'Wild rabbits dig burrow systems called warrens, with tunnels and separate rooms.',
    "A rabbit's strong sense of smell helps it recognize family members and territory.",
  ],
  lizard: [
    "Some lizards change color slightly to help regulate their body temperature.",
    "A lizard's flicking tongue helps it smell and taste the air around it.",
    'Many lizards can go without food for surprisingly long stretches when needed.',
    'Lizard scales are made of keratin, the same material as human fingernails.',
    'Some lizard species can run briefly on just two legs to move faster.',
  ],
  'park-bird': [
    'Small birds often puff up their feathers to trap warm air on cold mornings.',
    'Many birds use landmarks and the position of the sun to find their way home.',
    "A bird's beak shape usually reveals what kind of food it mostly eats.",
    'Birds preen daily to keep their feathers aligned for smooth, efficient flight.',
    'Some small birds can recognize and remember individual human faces.',
  ],
  'rare-owl': [
    "An owl's feathers have soft fringed edges that muffle the sound of its wingbeats.",
    'Owls swallow small prey whole and later cough up pellets of fur and bones.',
    'Large eyes let owls gather as much light as possible for night vision.',
    'Owls can sit perfectly still for long stretches while watching for movement below.',
    'Some owls can hear a small movement under snow or leaves from a good distance.',
  ],
  'forest-wren': [
    'Wrens often cock their tails upward as a signature part of their posture.',
    "A wren's song can be surprisingly complex, with many different notes strung together.",
    'Wrens dart quickly through undergrowth, rarely staying still for long.',
    'Some wrens will scold much larger animals that wander too close to their nest.',
    'Wrens use dense shrubs and tangles as safe cover from predators.',
  ],
  'forest-wallaby': [
    'Wallabies groom themselves often to stay clean and comfortable in the heat.',
    "A wallaby's powerful hind legs let it change direction quickly while hopping.",
    'Wallabies often thump the ground with a foot to warn others of danger.',
    'Young wallabies stay close to their mother even after leaving the pouch.',
    'Wallabies get most of the moisture they need directly from the plants they eat.',
  ],
  'forest-beetle': [
    "A beetle's hard outer shell protects its body like a suit of armor.",
    'Many beetles can squeeze into tiny gaps thanks to their flattened bodies.',
    'Some beetles play dead when threatened, staying still until danger passes.',
    'Beetle larvae often look completely different from the adult beetle.',
    'Beetles use their antennae to smell, touch, and sense the world around them.',
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

export function hasBonusFacts(id: AnimalId): boolean {
  return Boolean(BONUS_FACTS[id]);
}

export function getBonusFactForVariant(id: AnimalId, variant: number): string | null {
  const facts = BONUS_FACTS[id];
  if (!facts) return null;
  return facts[variant - 1] ?? null;
}

export function getBonusFactForVariantKey(id: AnimalId, variantKey: string): string | null {
  const variant = Number(variantKey.slice(id.length + 1));
  return getBonusFactForVariant(id, variant);
}

// Facts learned so far for an animal, derived from which photo variants are collected (same
// "<id>-<variant>" keys) - ordered by variant number for a stable Journal display. When
// includeBonus is true (Conservation Ranger on a common animal, Animal Researcher on a rare one - see
// roleBonuses.ts), each collected variant also contributes its paired bonus fact, doubling the total.
export function getLearnedFacts(id: AnimalId, collected: string[], includeBonus = false): string[] {
  const facts = ANIMAL_FACTS[id];
  if (!facts) return [];
  const learned: string[] = [];
  for (let i = 1; i <= facts.length; i++) {
    if (collected.includes(`${id}-${i}`)) {
      learned.push(facts[i - 1]);
      if (includeBonus) {
        const bonus = getBonusFactForVariant(id, i);
        if (bonus) learned.push(bonus);
      }
    }
  }
  return learned;
}

// Total facts available for an animal - 5 normally, doubled to 10 when includeBonus applies and this
// animal actually has an authored bonus set.
export function getTotalFactCount(id: AnimalId, includeBonus = false): number {
  const base = getFactCount(id);
  return includeBonus && hasBonusFacts(id) ? base + (BONUS_FACTS[id]?.length ?? 0) : base;
}
