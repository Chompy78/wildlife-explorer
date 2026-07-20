# Wildlife Explorer

Wildlife Explorer is a calm, child-friendly wildlife adventure game where players explore habitats, photograph animals, help wildlife, discover hidden places and build a wildlife journal. The experience focuses on nature, education and cooperative discovery rather than competition or combat.

## Vision

Travel through diverse natural habitats, observe wildlife behaving naturally, photograph common and rare animals, learn real-world facts, help animals through gentle quests and uncover peaceful hidden locations.

## Core Design Principles

- Exploration is the primary activity.
- Players collect photos, never animals.
- Wildlife behaves naturally.
- Animals do not talk or wear clothes.
- There are no villains, weapons or combat.
- Players help wildlife through gentle quests.
- The game is educational, relaxing and rewarding.
- Rare animal discoveries are important milestone moments.
- Cooperative progress is encouraged without competition.
- Language, controls and interfaces remain child-friendly and accessible.

## Target Audience

**Primary audience:** Ages 8 to 14

**Secondary audience:**

- Families
- Nature lovers
- Animal enthusiasts
- Young explorers
- Educational gaming audiences

## Current Status

The current repository is the **Milestone 5** baseline.

Implemented features include:

- Start screen and character role selection
- Complete Tutorial Park progression
- Wildlife photography system
- Wildlife Journal
- Tutorial Progress Tracker
- Lost Puppy helping and reunion quest
- Rare Owl photography
- Whisper Grove discovery
- Wild Camper unlock and planning hub
- Camper introduction, stations, route previews, Photo Wall and Expedition Readiness
- Narrow playable Forest arrival shell
- Forest Arrival and Fern Trail
- Forest Wren, Forest Wallaby and Shiny Forest Beetle
- Forest photography and Journal integration
- Return travel to the Wild Camper
- Local-storage save, migration and restoration
- Continue restoration across Park, Camper and Forest play areas
- Accessible modal focus handling
- Responsive and reduced-motion styling
- Automated TypeScript, state, component, build and encoding checks

Mountains, Lake, Safari, Rainforest and Alien Planet remain preview-only.

## Playable Locations

### Tutorial Park

- Park Entrance
- Duck Pond
- Open Meadow
- Forest Trail
- Strange Old Tree
- Whisper Grove

### Forest

- Forest Arrival
- Fern Trail

## Included Wildlife

### Tutorial Park

- Duck
- Frog
- Butterfly
- Rabbit
- Lizard
- Park Bird
- Rare Owl
- Lost Puppy, helped and reunited rather than collected

### Forest

- Forest Wren
- Forest Wallaby
- Shiny Forest Beetle

## Technology Stack

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- Local Storage save system

Possible future platform work may include Progressive Web App support, cloud-backed saves and cooperative discovery features. These are not part of the current milestone.

## Project Structure

```text
wildlife-explorer/
├── public/                 Static assets
├── scripts/                Development validation scripts
├── src/
│   ├── components/         React screens and interface components
│   ├── data/               Animals, destinations, locations, quests and roles
│   ├── hooks/              Shared React hooks
│   ├── state/              Game state, progression, saves and migrations
│   ├── test/               Shared test setup
│   └── types/              TypeScript domain types
├── AI.md                   AI development rules and current scope
├── START_HERE.md           Session start and wrap-up workflow
├── CURRENT_CODE_REVIEW.md  Current review priorities
├── MILESTONE_5_NOTES.md    Milestone 5 implementation notes
├── package.json
└── README.md
```

## Run Locally

Requirements:

- Node.js
- npm

```powershell
npm install
npm run check
npm run dev
```

The development server will display the local address in the terminal.

## Validation Commands

```powershell
npm run typecheck
npm run test
npm run build
npm run check:encoding
npm run check
```

`npm run check` performs the complete validation sequence and should pass before commits or handoffs.

## Current Development Boundary

Milestone 5 intentionally keeps the first Forest expedition narrow. Do not add the following without an explicitly approved later milestone:

- A full Forest biome
- Complex Forest quests
- Rare Forest animals
- Animal companions
- Inventory or crafting
- Shops or an economy
- Additional playable destinations

## Development Workflow

1. Read `AI.md` and `START_HERE.md` before making changes.
2. Treat repository files as the source of truth.
3. Run `npm install` and `npm run check` before editing.
4. Keep changes within the requested milestone scope.
5. Run `npm run check` after meaningful changes and before committing.
6. Do not commit `node_modules`, `dist`, secrets or local environment files.

## Roadmap

Potential future development includes:

- Milestone 5 hardening and browser-level testing
- Expanded Forest content through separately approved milestones
- Safari, Rainforest, Mountain and Lake habitats
- Advanced photography
- Expanded wildlife journal features
- Cooperative discovery systems
- Day and night wildlife behaviour
- Progressive Web App support

Roadmap items are ideas rather than current implementation commitments.

## Success Goal

The project succeeds when a child can independently:

- Explore safely and confidently
- Observe and photograph wildlife
- Learn interesting animal facts
- Help animals through gentle interactions
- Complete Tutorial Park
- Unlock and use the Wild Camper
- Begin the first Forest expedition
- Feel excited to continue exploring future habitats

## Credits

Created with and for young wildlife enthusiasts. Inspired by nature exploration, wildlife photography, educational discovery, cooperative adventure and real-world conservation themes.

## Licence

Private development repository. All project materials, designs, artwork and source code remain the property of the project owners unless otherwise specified.
