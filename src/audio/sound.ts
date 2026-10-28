// Calm, synthesized sound effects (Web Audio API) - no asset files to bundle or license. Sounds only ever
// play in direct response to a player action (a tap), which also satisfies browser autoplay rules.
// The mute choice lives in its own localStorage key rather than SaveData, so it needs no save migration
// and survives "New Game" / "Reset Save".
const MUTE_KEY = 'wildlife-explorer-sound-muted';

let context: AudioContext | null = null;

export function isSoundMuted(): boolean {
  try { return window.localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
}

const muteListeners = new Set<() => void>();

// Lets every mute button (top bar, Camera panel) stay in step with each other.
export function subscribeSoundMuted(listener: () => void): () => void {
  muteListeners.add(listener);
  return () => { muteListeners.delete(listener); };
}

export function setSoundMuted(muted: boolean): void {
  try { window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* storage unavailable: choice just won't persist */ }
  syncAmbient();
  muteListeners.forEach((listener) => listener());
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') return null;
  if (!context) context = new window.AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
}

type Tone = { freq: number; start: number; duration: number; type?: OscillatorType; peak?: number };

function playTones(tones: Tone[]): void {
  if (isSoundMuted()) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (const { freq, start, duration, type = 'sine', peak = 0.12 } of tones) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    // Soft attack and release so nothing clicks or startles.
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(peak, now + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + duration + 0.02);
  }
}

export function playShutter(): void {
  playTones([{ freq: 1800, start: 0, duration: 0.05, type: 'square', peak: 0.04 }, { freq: 900, start: 0.06, duration: 0.07, type: 'square', peak: 0.04 }]);
}

export function playGreatShot(): void {
  playTones([{ freq: 660, start: 0.1, duration: 0.25 }, { freq: 880, start: 0.2, duration: 0.25 }, { freq: 1320, start: 0.3, duration: 0.45 }]);
}

export function playNewPhoto(): void {
  playTones([{ freq: 523, start: 0, duration: 0.3 }, { freq: 659, start: 0.12, duration: 0.3 }, { freq: 784, start: 0.24, duration: 0.5 }]);
}

// --- Ambient habitat sound -------------------------------------------------------------------------
// A very quiet, slowly swelling filtered-noise bed per habitat (breeze, rustle, lapping water, high wind).
// It starts only after the player has tapped something (entering a screen is always a tap), and follows
// the same mute switch as the effects above.
export type AmbientKind = 'park' | 'forest' | 'lake' | 'mountains';

type AmbientRecipe = { filter: BiquadFilterType; freq: number; q: number; level: number; swellHz: number };
const AMBIENT_RECIPES: Record<AmbientKind, AmbientRecipe> = {
  park: { filter: 'lowpass', freq: 700, q: 0.4, level: 0.035, swellHz: 0.12 },
  forest: { filter: 'bandpass', freq: 1400, q: 0.6, level: 0.03, swellHz: 0.18 },
  lake: { filter: 'lowpass', freq: 900, q: 0.8, level: 0.04, swellHz: 0.4 },
  mountains: { filter: 'lowpass', freq: 380, q: 0.5, level: 0.05, swellHz: 0.08 },
};

let wantedAmbient: AmbientKind | null = null;
let playingAmbient: { kind: AmbientKind; stop: () => void } | null = null;

function buildAmbient(ctx: AudioContext, kind: AmbientKind): { kind: AmbientKind; stop: () => void } {
  const recipe = AMBIENT_RECIPES[kind];
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = recipe.filter;
  filter.frequency.value = recipe.freq;
  filter.Q.value = recipe.q;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(recipe.level, ctx.currentTime + 1.5); // fade in
  const swell = ctx.createOscillator();
  const swellDepth = ctx.createGain();
  swell.frequency.value = recipe.swellHz;
  swellDepth.gain.value = recipe.level * 0.5;
  swell.connect(swellDepth).connect(gain.gain);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
  swell.start();
  return {
    kind,
    stop: () => {
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), t);
      gain.gain.linearRampToValueAtTime(0.0001, t + 0.4); // fade out
      source.stop(t + 0.5);
      swell.stop(t + 0.5);
    },
  };
}

function syncAmbient(): void {
  if (playingAmbient && (isSoundMuted() || playingAmbient.kind !== wantedAmbient)) {
    playingAmbient.stop();
    playingAmbient = null;
  }
  if (!playingAmbient && wantedAmbient && !isSoundMuted()) {
    const ctx = getContext();
    if (ctx) playingAmbient = buildAmbient(ctx, wantedAmbient);
  }
}

export function startAmbient(kind: AmbientKind): void {
  wantedAmbient = kind;
  syncAmbient();
}

export function stopAmbient(kind?: AmbientKind): void {
  if (kind && wantedAmbient !== kind) return; // a newer screen already took over
  wantedAmbient = null;
  syncAmbient();
}
