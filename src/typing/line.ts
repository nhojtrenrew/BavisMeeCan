import type { Keystroke } from './score';

export const DEFAULT_SENTENCE = 'The old lantern flickers, and something in the cellar begins to hum.';

export type LineState = {
  target: string;
  typed: string[]; // one entry per position before the cursor
  cursor: number;
  finished: boolean;
  log: Keystroke[];
};
export type LineEvent = { kind: 'char'; char: string; t: number } | { kind: 'backspace'; t: number };
export type CharStatus = 'pending' | 'ok' | 'bad';

export const initLine = (target: string): LineState => ({
  target, typed: [], cursor: 0, finished: target.length === 0, log: [],
});

export function applyInput(s: LineState, e: LineEvent): LineState {
  if (s.finished) return s;
  if (e.kind === 'backspace') {
    if (s.cursor === 0) return s;
    return {
      ...s,
      typed: s.typed.slice(0, -1),
      cursor: s.cursor - 1,
      log: [...s.log, { t: e.t, expected: s.target[s.cursor - 1], typed: '' }],
    };
  }
  const cursor = s.cursor + 1;
  return {
    ...s,
    typed: [...s.typed, e.char],
    cursor,
    finished: cursor >= s.target.length,
    log: [...s.log, { t: e.t, expected: s.target[s.cursor], typed: e.char }],
  };
}

export function statuses(s: LineState): CharStatus[] {
  return [...s.target].map((c, i) => (i >= s.cursor ? 'pending' : s.typed[i] === c ? 'ok' : 'bad'));
}
