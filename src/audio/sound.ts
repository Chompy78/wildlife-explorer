// Calm, synthesized sound effects (Web Audio API) - no asset files to bundle or license. Sounds only ever
// play in direct response to a player action (a tap), which also satisfies browser autoplay rules.
// The mute choice lives in its own localStorage key rather than SaveData, so it needs no save migration
// and survives "New Game" / "Reset Save".
const MUTE_KEY = 'wildlife-explorer-sound-muted';

let context: AudioContext | null = null;

export function isSoundMuted(): boolean {
  try { return window.localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
}

export function setSoundMuted(muted: boolean): void {
  try { window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* storage unavailable: choice just won't persist */ }
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
