import { useEffect, useState } from 'react';
import { playNewPhoto, playShutter } from '../audio/sound';
import { buildFindRound, buildHabitatRound, buildMemoryDeck, buildWhoAmIRound, type ChoiceRound } from '../data/miniGames';
import { SoundToggle } from './SoundToggle';

type GameId = 'memory' | 'who' | 'find' | 'habitat';

const GAMES: { id: GameId; icon: string; title: string; blurb: string }[] = [
  { id: 'memory', icon: '🃏', title: 'Memory Match', blurb: 'Flip the cards and find every matching pair of animals.' },
  { id: 'who', icon: '🔍', title: 'Who Am I?', blurb: 'Read the clue and guess which animal it is.' },
  { id: 'find', icon: '👀', title: 'Spot the Animal', blurb: 'One animal is different. Can you spot it in the group?' },
  { id: 'habitat', icon: '🗺️', title: 'Where Do I Live?', blurb: 'Pick the place each animal calls home.' },
];

type Props = { onGoHome: () => void };

// Calm little games. There is no timer, no losing and nothing to collect - a wrong guess just says "try
// again". They never read or change the save.
export function MiniGames({ onGoHome }: Props) {
  const [game, setGame] = useState<GameId | null>(null);
  return (
    <main className="screen minigames-screen">
      <header className="top-bar">
        <div><p className="eyebrow">Just for fun</p><h1>Mini Games</h1></div>
        <div className="button-row">
          <SoundToggle />
          {game ? <button className="secondary" onClick={() => setGame(null)}>All games</button> : null}
          <button className="secondary" onClick={onGoHome}>Home</button>
        </div>
      </header>
      {game === null ? (
        <section className="minigame-menu">
          {GAMES.map((g) => (
            <button key={g.id} className="minigame-card" onClick={() => setGame(g.id)}>
              <span aria-hidden="true" className="minigame-icon">{g.icon}</span>
              <strong>{g.title}</strong>
              <small>{g.blurb}</small>
            </button>
          ))}
        </section>
      ) : (
        <section className="minigame-board">
          {game === 'memory' ? <MemoryMatch /> : null}
          {game === 'who' ? <ChoiceGame title="Who Am I?" build={buildWhoAmIRound} /> : null}
          {game === 'habitat' ? <ChoiceGame title="Where Do I Live?" build={buildHabitatRound} showEmoji /> : null}
          {game === 'find' ? <SpotTheAnimal /> : null}
        </section>
      )}
    </main>
  );
}

const PAIRS = 6;

function MemoryMatch() {
  const [deck, setDeck] = useState(() => buildMemoryDeck(PAIRS));
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (open.length !== 2) return undefined;
    const [a, b] = open.map((key) => deck.find((card) => card.key === key)!);
    if (a.animalId === b.animalId) {
      playNewPhoto();
      setMatched((m) => [...m, a.animalId]);
      setOpen([]);
      return undefined;
    }
    const timer = setTimeout(() => setOpen([]), 800);
    return () => clearTimeout(timer);
  }, [open, deck]);

  function flip(key: string) {
    if (open.length >= 2 || open.includes(key)) return;
    playShutter();
    if (open.length === 1) setMoves((m) => m + 1);
    setOpen((o) => [...o, key]);
  }
  function again() { setDeck(buildMemoryDeck(PAIRS)); setOpen([]); setMatched([]); setMoves(0); }
  const won = matched.length === PAIRS;

  return (
    <div>
      <h2>Memory Match</h2>
      <p className="muted">Pairs found: {matched.length} / {PAIRS} · Tries: {moves}</p>
      <div className="memory-grid">
        {deck.map((card) => {
          const faceUp = open.includes(card.key) || matched.includes(card.animalId);
          return (
            <button key={card.key} className={`memory-card${faceUp ? ' face-up' : ''}`} onClick={() => flip(card.key)} disabled={matched.includes(card.animalId)} aria-label={faceUp ? card.name : 'Hidden card'}>
              <span aria-hidden="true">{faceUp ? card.emoji : '❓'}</span>
            </button>
          );
        })}
      </div>
      {won ? <p role="status" className="minigame-win">🎉 You found every pair in {moves} tries!</p> : null}
      <button className="secondary" onClick={again}>{won ? 'Play again' : 'New cards'}</button>
    </div>
  );
}

function ChoiceGame({ title, build, showEmoji = false }: { title: string; build: () => ChoiceRound; showEmoji?: boolean }) {
  const [round, setRound] = useState(build);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, played: 0 });
  const solved = picked === round.answer;

  function pick(choice: string) {
    if (solved) return;
    setPicked(choice);
    if (choice === round.answer) { playNewPhoto(); setScore((s) => ({ right: s.right + 1, played: s.played + 1 })); }
  }
  function next() { setRound(build()); setPicked(null); }

  return (
    <div>
      <h2>{title}</h2>
      <p className="muted">Correct: {score.right}</p>
      <p className="minigame-prompt">{showEmoji ? <span aria-hidden="true" className="minigame-icon">{round.animal.emoji} </span> : null}{round.prompt}</p>
      <div className="choice-grid">
        {round.choices.map((choice) => (
          <button key={choice} className={picked === choice ? (choice === round.answer ? 'choice right' : 'choice tryagain') : 'choice'} onClick={() => pick(choice)}>{choice}</button>
        ))}
      </div>
      <p role="status" className="minigame-feedback">
        {solved ? `✅ Yes! It's the ${round.answer}. ${round.animal.emoji}` : picked ? 'Not quite - try another one!' : ''}
      </p>
      {solved ? <button onClick={next}>Next</button> : null}
    </div>
  );
}

const TILES = 12;

function SpotTheAnimal() {
  const [round, setRound] = useState(() => buildFindRound(TILES));
  const [found, setFound] = useState(false);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState('');
  function tap(index: number) {
    if (found) return;
    if (round.tiles[index].id === round.target.id) { playNewPhoto(); setFound(true); setScore((s) => s + 1); setHint(''); }
    else setHint('Not that one - look closer!');
  }
  function next() { setRound(buildFindRound(TILES)); setFound(false); setHint(''); }
  return (
    <div>
      <h2>Spot the Animal</h2>
      <p className="muted">Found: {score}</p>
      <p className="minigame-prompt">One of these is a different animal. Which is it?</p>
      <div className="find-grid">
        {round.tiles.map((animal, index) => (
          <button key={index} className="find-tile" onClick={() => tap(index)} aria-label={`Animal ${index + 1}`}><span aria-hidden="true">{animal.emoji}</span></button>
        ))}
      </div>
      <p role="status" className="minigame-feedback">{found ? `✅ Found it - the ${round.target.name}!` : hint}</p>
      {found ? <button onClick={next}>Next</button> : null}
    </div>
  );
}
