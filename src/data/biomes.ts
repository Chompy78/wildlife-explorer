import type { AmbientKind } from '../audio/sound';
import type { BiomeId, BiomeLocationKey } from '../types/Biome';
import type { AnimalId } from '../types/Ids';

export type BiomeLocation = { name: string; icon: string; description: string; animalIds: AnimalId[] };

export type BiomeDef = {
  id: BiomeId; // also the DestinationId it is reached by
  name: string;
  saveKey: BiomeLocationKey;
  locations: BiomeLocation[]; // the first one is where a new game starts
  ambient: AmbientKind;
  screenClassName: string;
  eyebrow: string;
  screenTitle: string;
  arrivalMessage: string;
  aboutTitle: string;
  aboutText: string;
  journalIcon: string;
  journalTitle: string;
};

// Each biome has three sections with two animals each. Animals with no entry in PHOTO_VARIANT_COUNTS
// (src/data/animalPhotoVariants.ts) show their emoji and award no collectible photos.
export const biomes: BiomeDef[] = [
  {
    id: 'lake',
    name: 'Lake',
    saveKey: 'lakeLocation',
    ambient: 'lake',
    screenClassName: 'lake-screen',
    eyebrow: 'Lake',
    screenTitle: 'Lake Arrival',
    arrivalMessage: 'You have arrived quietly at the lake shore.',
    aboutTitle: 'A calm lake',
    aboutText: 'Visit the Shoreline, Open Water, and Reeds & Shallows, and photograph the six animals that live here. Watch quietly - every animal stays wild and free.',
    journalIcon: '🌊',
    journalTitle: 'Lake Animals',
    locations: [
      { name: 'Shoreline', icon: '🏞️', description: 'A quiet bank where herons stand watch and beavers rest.', animalIds: ['great-blue-heron', 'beaver'] },
      { name: 'Open Water', icon: '🌊', description: 'Calm, open water where loons float and trout glint below.', animalIds: ['loon', 'rainbow-trout'] },
      { name: 'Reeds & Shallows', icon: '🌾', description: 'Sheltered reeds and warm shallows, busy with small life.', animalIds: ['dragonfly', 'painted-turtle'] },
    ],
  },
  {
    id: 'mountains',
    name: 'Mountains',
    saveKey: 'mountainLocation',
    ambient: 'mountains',
    screenClassName: 'mountains-screen',
    eyebrow: 'Mountains',
    screenTitle: 'Mountain Arrival',
    arrivalMessage: 'You have arrived quietly on the mountain trail.',
    aboutTitle: 'High country',
    aboutText: 'Walk the Rocky Trail, Alpine Meadow, and Lookout Ridge, and photograph the six animals that live here. Move slowly and watch from a distance - every animal stays wild and free.',
    journalIcon: '⛰️',
    journalTitle: 'Mountain Animals',
    locations: [
      { name: 'Rocky Trail', icon: '🥾', description: 'A stony path where sure-footed climbers and sunbathing marmots live.', animalIds: ['mountain-goat', 'marmot'] },
      { name: 'Alpine Meadow', icon: '🌼', description: 'A cool, flowery meadow among the rocks, full of small busy animals.', animalIds: ['pika', 'mountain-hare'] },
      { name: 'Lookout Ridge', icon: '🏔️', description: 'A high, windy ridge with wide views and birds riding the air.', animalIds: ['golden-eagle', 'mountain-bluebird'] },
    ],
  },
  {
    id: 'safari',
    name: 'Safari',
    saveKey: 'safariLocation',
    ambient: 'safari',
    screenClassName: 'safari-screen',
    eyebrow: 'Safari',
    screenTitle: 'Safari Arrival',
    arrivalMessage: 'You have arrived quietly at the edge of the savanna.',
    aboutTitle: 'The wide savanna',
    aboutText: 'Visit the Waterhole, Open Plains, and Acacia Grove, and photograph the six animals that live here. Keep a respectful distance and stay quiet - every animal stays wild and free.',
    journalIcon: '🦒',
    journalTitle: 'Safari Animals',
    locations: [
      { name: 'Waterhole', icon: '💧', description: 'A shared waterhole where big, gentle animals come to drink and cool off.', animalIds: ['african-elephant', 'hippo'] },
      { name: 'Open Plains', icon: '🌾', description: 'Wide golden grassland stretching to the horizon, with herds grazing in the distance.', animalIds: ['zebra', 'giraffe'] },
      { name: 'Acacia Grove', icon: '🌳', description: 'Flat-topped acacia trees casting shade over small, busy animals and bright birds.', animalIds: ['meerkat', 'lilac-breasted-roller'] },
    ],
  },
  {
    id: 'rainforest',
    name: 'Rainforest',
    saveKey: 'rainforestLocation',
    ambient: 'rainforest',
    screenClassName: 'rainforest-screen',
    eyebrow: 'Rainforest',
    screenTitle: 'Rainforest Arrival',
    arrivalMessage: 'You have arrived quietly under the rainforest canopy.',
    aboutTitle: 'Under the canopy',
    aboutText: 'Explore the Forest Floor, Canopy Walk, and River Bank, and photograph the six animals that live here. Step softly and listen - every animal stays wild and free.',
    journalIcon: '🌴',
    journalTitle: 'Rainforest Animals',
    locations: [
      { name: 'Forest Floor', icon: '🍃', description: 'A damp, shady floor of fallen leaves, where tapirs forage and tiny frogs glow with colour.', animalIds: ['tapir', 'poison-dart-frog'] },
      { name: 'Canopy Walk', icon: '🌴', description: 'A high walkway among the treetops, where sloths hang and macaws call.', animalIds: ['sloth', 'scarlet-macaw'] },
      { name: 'River Bank', icon: '🏞️', description: 'A warm, muddy river bank where capybaras graze and iguanas bask above the water.', animalIds: ['capybara', 'green-iguana'] },
    ],
  },
  {
    id: 'desert',
    name: 'Desert',
    saveKey: 'desertLocation',
    ambient: 'desert',
    screenClassName: 'desert-screen',
    eyebrow: 'Desert',
    screenTitle: 'Desert Arrival',
    arrivalMessage: 'You have arrived quietly at the edge of the dunes.',
    aboutTitle: 'Warm dunes, cool nights',
    aboutText: 'Visit the Sand Dunes, Rocky Outcrop, and Oasis Edge, and photograph the six animals that live here. Keep still and give every animal space - each one stays wild and free.',
    journalIcon: '🏜️',
    journalTitle: 'Desert Animals',
    locations: [
      { name: 'Sand Dunes', icon: '🏜️', description: 'Rolling sand where small animals wait for the cool of the evening.', animalIds: ['fennec-fox', 'sidewinder'] },
      { name: 'Rocky Outcrop', icon: '⛰️', description: 'Warm, sunny rocks where reptiles bask and slow walkers shelter.', animalIds: ['desert-tortoise', 'chuckwalla'] },
      { name: 'Oasis Edge', icon: '🌴', description: 'Palms and a little water where desert animals come to rest and drink.', animalIds: ['roadrunner', 'dromedary-camel'] },
    ],
  },
  {
    id: 'arctic',
    name: 'Arctic',
    saveKey: 'arcticLocation',
    ambient: 'arctic',
    screenClassName: 'arctic-screen',
    eyebrow: 'Arctic',
    screenTitle: 'Arctic Arrival',
    arrivalMessage: 'You have arrived quietly on the snowy tundra.',
    aboutTitle: 'Snow, ice, and open sky',
    aboutText: 'Cross the Snowfield, Ice Edge, and Frozen Shore, and photograph the six animals that live here. Watch from a respectful distance - every animal stays wild and free.',
    journalIcon: '❄️',
    journalTitle: 'Arctic Animals',
    locations: [
      { name: 'Snowfield', icon: '🌨️', description: 'A wide white plain where white-coated animals hunt quietly.', animalIds: ['arctic-fox', 'snowy-owl'] },
      { name: 'Ice Edge', icon: '🧊', description: 'Where the ice meets cold open water, home to big, calm sea animals.', animalIds: ['polar-bear', 'walrus'] },
      { name: 'Frozen Shore', icon: '🏔️', description: 'A cold, stony shore with animals built for wind and ice.', animalIds: ['muskox', 'harp-seal'] },
    ],
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    saveKey: 'coralReefLocation',
    ambient: 'coral-reef',
    screenClassName: 'coral-reef-screen',
    eyebrow: 'Coral Reef',
    screenTitle: 'Coral Reef Arrival',
    arrivalMessage: 'You have arrived quietly at the edge of the reef.',
    aboutTitle: 'Bright coral and calm water',
    aboutText: 'Drift over the Shallow Reef, Coral Garden, and Deep Blue, and photograph the six animals that live here. Look but never touch - every animal stays wild and free.',
    journalIcon: '🐠',
    journalTitle: 'Coral Reef Animals',
    locations: [
      { name: 'Shallow Reef', icon: '🌊', description: 'Sunny, clear water full of colourful fish darting between the coral.', animalIds: ['clownfish', 'blue-tang'] },
      { name: 'Coral Garden', icon: '🌊', description: 'A calm garden of coral where slow swimmers drift and graze.', animalIds: ['green-sea-turtle', 'seahorse'] },
      { name: 'Deep Blue', icon: '🌀', description: 'The edge of the reef where the water turns deep blue and big animals glide by.', animalIds: ['manta-ray', 'whale-shark'] },
    ],
  },
  {
    id: 'wetlands',
    name: 'Wetlands',
    saveKey: 'wetlandsLocation',
    ambient: 'wetlands',
    screenClassName: 'wetlands-screen',
    eyebrow: 'Wetlands',
    screenTitle: 'Wetlands Arrival',
    arrivalMessage: 'You have arrived quietly at the edge of the marsh.',
    aboutTitle: 'Reeds, mangroves, and still water',
    aboutText: 'Wade through the Mangroves, Still Marsh, and Mudflats, and photograph the six animals that live here. Stay quiet and watch from a distance - every animal stays wild and free.',
    journalIcon: '🦩',
    journalTitle: 'Wetlands Animals',
    locations: [
      { name: 'Mangroves', icon: '🌿', description: 'Tangled roots in shallow water, where small animals shelter.', animalIds: ['mudskipper', 'roseate-spoonbill'] },
      { name: 'Still Marsh', icon: '🌿', description: 'Calm, glassy water among the reeds where patient birds stand watch.', animalIds: ['river-otter', 'great-egret'] },
      { name: 'Mudflats', icon: '🏖️', description: 'Wide, soft mud at low tide, busy with small life and big flocks.', animalIds: ['fiddler-crab', 'american-flamingo'] },
    ],
  },
  {
    id: 'coastal',
    name: 'Coastal',
    saveKey: 'coastalLocation',
    ambient: 'coastal',
    screenClassName: 'coastal-screen',
    eyebrow: 'Coastal',
    screenTitle: 'Coastal Arrival',
    arrivalMessage: 'You have arrived quietly at the edge of the shore.',
    aboutTitle: 'Tide pools and rocky shoreline',
    aboutText: 'Explore the Tide Pools, Sea Cliffs, and Sandy Beach, and photograph the six animals that live here. Tread gently and leave the shore as you found it - every animal stays wild and free.',
    journalIcon: '🦀',
    journalTitle: 'Coastal Animals',
    locations: [
      { name: 'Tide Pools', icon: '🐚', description: 'Little pools of seawater left on the rocks, full of tiny life.', animalIds: ['sea-star', 'hermit-crab'] },
      { name: 'Sea Cliffs', icon: '⛰️', description: 'Tall cliffs above the waves, where seabirds nest and fly.', animalIds: ['atlantic-puffin', 'northern-gannet'] },
      { name: 'Sandy Beach', icon: '🏖️', description: 'A long beach where seals rest and small birds run along the waves.', animalIds: ['harbor-seal', 'sanderling'] },
    ],
  },
  {
    id: 'grassland',
    name: 'Grassland',
    saveKey: 'grasslandLocation',
    ambient: 'grassland',
    screenClassName: 'grassland-screen',
    eyebrow: 'Grassland',
    screenTitle: 'Grassland Arrival',
    arrivalMessage: 'You have arrived quietly at the edge of the prairie.',
    aboutTitle: 'Open plains and rolling grass',
    aboutText: 'Walk through the Tall Grass, Prairie Burrows, and Open Sky, and photograph the six animals that live here. Move slowly and keep your distance - every animal stays wild and free.',
    journalIcon: '🌾',
    journalTitle: 'Grassland Animals',
    locations: [
      { name: 'Tall Grass', icon: '🌾', description: 'Rolling grass that stretches to the horizon, grazed by large herds.', animalIds: ['american-bison', 'pronghorn'] },
      { name: 'Prairie Burrows', icon: '🕳️', description: 'A hillside of burrows, where small animals pop up to look around.', animalIds: ['prairie-dog', 'burrowing-owl'] },
      { name: 'Open Sky', icon: '☁️', description: 'The wide blue sky above the prairie, where birds sing and soar.', animalIds: ['western-meadowlark', 'red-tailed-hawk'] },
    ],
  },
  {
    id: 'taiga',
    name: 'Taiga',
    saveKey: 'taigaLocation',
    ambient: 'taiga',
    screenClassName: 'taiga-screen',
    eyebrow: 'Taiga',
    screenTitle: 'Taiga Arrival',
    arrivalMessage: 'You have arrived quietly among the snowy pines.',
    aboutTitle: 'Cold pines and quiet wilderness',
    aboutText: 'Walk through the Pine Forest, Frozen Stream, and Snowy Clearing, and photograph the six animals that live here. Be still and quiet - every animal stays wild and free.',
    journalIcon: '🌲',
    journalTitle: 'Taiga Animals',
    locations: [
      { name: 'Pine Forest', icon: '🌲', description: 'Tall, dark pines where big animals browse and owls listen.', animalIds: ['moose', 'great-grey-owl'] },
      { name: 'Frozen Stream', icon: '🧊', description: 'A quiet stream with ice at its edges, where animals pass through.', animalIds: ['lynx', 'snowshoe-hare'] },
      { name: 'Snowy Clearing', icon: '❄️', description: 'An open patch of snow among the trees, where small animals feed.', animalIds: ['porcupine', 'red-crossbill'] },
    ],
  },
  {
    id: 'volcanic-highlands',
    name: 'Volcanic Highlands',
    saveKey: 'volcanicHighlandsLocation',
    ambient: 'volcanic-highlands',
    screenClassName: 'volcanic-highlands-screen',
    eyebrow: 'Volcanic Highlands',
    screenTitle: 'Volcanic Highlands Arrival',
    arrivalMessage: 'You have arrived quietly beside the steaming hills.',
    aboutTitle: 'Hot springs and steaming ground',
    aboutText: 'Explore the Hot Springs, Steam Vents, and Lava Fields, and photograph the six animals that live here. Stay on the path and keep your distance - every animal stays wild and free.',
    journalIcon: '🌋',
    journalTitle: 'Volcanic Highlands Animals',
    locations: [
      { name: 'Hot Springs', icon: '♨️', description: 'Warm pools in the cold hills, where animals come to stay cosy.', animalIds: ['japanese-macaque', 'mandarin-duck'] },
      { name: 'Steam Vents', icon: '💨', description: 'Cracks in the rock that puff warm steam over mossy ground.', animalIds: ['lava-lizard', 'nene'] },
      { name: 'Lava Fields', icon: '⛰️', description: 'Dark, cooled lava rock with animals that thrive in harsh places.', animalIds: ['marine-iguana', 'galapagos-tortoise'] },
    ],
  },
  {
    id: 'alien-planet',
    name: 'Alien Planet',
    saveKey: 'alienPlanetLocation',
    ambient: 'alien-planet',
    screenClassName: 'alien-planet-screen',
    eyebrow: 'Alien Planet',
    screenTitle: 'Alien Planet Arrival',
    arrivalMessage: 'You have landed quietly on a glowing, faraway world.',
    aboutTitle: 'A far-future mystery',
    aboutText: 'Explore the Crystal Meadow, Floating Islands, and Glowing Caves, and photograph the six imaginary animals that live here. They are made up, but the rules are the same - watch quietly, and every animal stays wild and free.',
    journalIcon: '🪐',
    journalTitle: 'Alien Animals',
    locations: [
      { name: 'Crystal Meadow', icon: '💎', description: 'A glittering meadow of glassy crystals that hum softly in the starlight.', animalIds: ['crystal-hopper', 'lumen-moth'] },
      { name: 'Floating Islands', icon: '☁️', description: 'Islands of rock and moss that drift gently high above the clouds.', animalIds: ['sky-whale', 'cloud-jelly'] },
      { name: 'Glowing Caves', icon: '🕳️', description: 'Deep caves lit by soft, glowing mushrooms and streams of blue light.', animalIds: ['cave-glimmer', 'echo-bat'] },
    ],
  },
];

export function getBiome(id: string | null | undefined): BiomeDef | undefined {
  return biomes.find((biome) => biome.id === id);
}

export function isBiomeId(value: unknown): value is BiomeId {
  return biomes.some((biome) => biome.id === value);
}

export function getBiomeAnimalIds(biome: BiomeDef): AnimalId[] {
  return biome.locations.flatMap((location) => location.animalIds);
}

// Every animal that belongs to a data-driven biome, for keeping them out of the Park / Forest lists.
export const allBiomeAnimalIds: AnimalId[] = biomes.flatMap(getBiomeAnimalIds);
