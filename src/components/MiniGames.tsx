import { useEffect, useState } from 'react';
import { playNewPhoto, playShutter } from '../audio/sound';
import { buildCountRound, buildFindRound, buildHabitatRound, buildMemoryDeck, buildPatternPad, buildTimeRound, buildWhoAmIRound, extendPattern, type ChoiceRound } from '../data/miniGames';
import { SoundToggle } from './SoundToggle';

type GameId = 'memory' | 'who' | 'find' | 'habitat' | 'pattern' | 'count' | 'time';

const GAMES: { id: GameId; icon: string; title: string; blurb: string }[] = [
  { id: 'memory', icon: '🃏', title: 'Memory Match', blurb: 'Flip the cards and find every matching pair of animals.' },
  { id: 'who', icon: '🔍', title: 'Who Am I?', blurb: 'Read the clue and guess which animal it is.' },
  { id: 'find', icon: '👀', title: 'Spot the Animal', blurb: 'One animal is different. Can you spot it in the group?' },
  { id: 'habitat', icon: '🗺️', title: 'Where Do I Live?', blurb: 'Pick the place each animal calls home.' },
  { id: 'pattern', icon: '🎶', title: 'Pattern Parade', blurb: 'Watch the animals light up, then repeat the pattern.' },
  { id: 'count', icon: '🔢', title: 'Count Them Up', blurb: 'How many of one animal are hiding in the crowd?' },
  { id: 'time', icon: '🌗', title: 'Day or Night?', blurb: 'Pick when each animal is most active.' },
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
          {game === 'pattern' ? <PatternParade /> : null}
          {game === 'count' ? <CountThemUp /> : null}
          {game === 'time' ? <ChoiceGame title="Day or Night?" build={buildTimeRound} showEmoji /> : null}
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

const STEP_MS = 700;
const MAX_PATTERN = 8;

// No losing here: a wrong tap just replays the same pattern.
function PatternParade() {
  const [pad] = useState(() => buildPatternPad());
  const [sequence, setSequence] = useState(() => extendPattern([], 4));
  const [phase, setPhase] = useState<'watch' | 'play'>('watch');
  const [lit, setLit] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Watch the animals...');
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    if (phase !== 'watch') return undefined;
    const timers: ReturnType<typeof setTimeout>[] = [];
    sequence.forEach((padIndex, i) => {
      timers.push(setTimeout(() => setLit(padIndex), 500 + i * STEP_MS));
      timers.push(setTimeout(() => setLit(null), 500 + i * STEP_MS + STEP_MS * 0.6));
    });
    timers.push(setTimeout(() => { setPhase('play'); setProgress(0); setMessage('Your turn - repeat the pattern!'); }, 500 + sequence.length * STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [phase, sequence, replay]);

  function tap(index: number) {
    if (phase !== 'play') return;
    playShutter();
    if (sequence[progress] !== index) {
      setMessage("Let's watch it once more.");
      setProgress(0);
      setPhase('watch');
      setReplay((r) => r + 1);
      return;
    }
    if (progress + 1 === sequence.length) {
      playNewPhoto();
      if (sequence.length >= MAX_PATTERN) { setMessage('🎉 You remembered the whole parade!'); setPhase('watch'); setSequence(extendPattern([], 4)); return; }
      setMessage(`✅ Got it! Now ${sequence.length + 1} in a row.`);
      setSequence(extendPattern(sequence, 4));
      setPhase('watch');
      return;
    }
    setProgress(progress + 1);
  }

  return (
    <div>
      <h2>Pattern Parade</h2>
      <p className="muted">Pattern length: {sequence.length}</p>
      <div className="pattern-pad">
        {pad.map((animal, index) => (
          <button key={animal.id} className={`pattern-button${lit === index ? ' lit' : ''}`} onClick={() => tap(index)} disabled={phase !== 'play'} aria-label={animal.name}>
            <span aria-hidden="true">{animal.emoji}</span>
          </button>
        ))}
      </div>
      <p role="status" className="minigame-feedback">{message}</p>
    </div>
  );
}

function CountThemUp() {
  const [round, setRound] = useState(buildCountRound);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const solved = picked === round.answer;
  function pick(n: number) {
    if (solved) return;
    setPicked(n);
    if (n === round.answer) { playNewPhoto(); setScore((s) => s + 1); }
  }
  return (
    <div>
      <h2>Count Them Up</h2>
      <p className="muted">Correct: {score}</p>
      <p className="minigame-prompt">How many <strong>{round.target.name}</strong> <span aria-hidden="true">{round.target.emoji}</span> can you see?</p>
      <div className="find-grid" aria-hidden="true">
        {round.tiles.map((animal, index) => <span key={index} className="find-tile">{animal.emoji}</span>)}
      </div>
      <div className="choice-grid">
        {round.choices.map((n) => (
          <button key={n} className={picked === n ? (n === round.answer ? 'choice right' : 'choice tryagain') : 'choice'} onClick={() => pick(n)}>{n}</button>
        ))}
      </div>
      <p role="status" className="minigame-feedback">{solved ? `✅ Yes, ${round.answer}!` : picked !== null ? 'Not quite - count again!' : ''}</p>
      {solved ? <button onClick={() => { setRound(buildCountRound()); setPicked(null); }}>Next</button> : null}
    </div>
  );
}
