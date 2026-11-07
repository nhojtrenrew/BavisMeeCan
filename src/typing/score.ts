export type Keystroke = { t: number; expected: string; typed: string }; // typed '' = Backspace
export type Tally = {
  chars: number;
  correct: number;
  errors: number;
  errorsByKey: Record<string, number>;
  firstT: number;
  lastT: number;
};
export type Report = { grossWpm: number; netWpm: number; accuracy: number; errorsByKey: Record<string, number> };

/** Identity for mergeTally: firstT/lastT are +/-Infinity until a character is typed. */
export const emptyTally = (): Tally => ({
  chars: 0, correct: 0, errors: 0, errorsByKey: {}, firstT: Infinity, lastT: -Infinity,
});

export function tally(log: readonly Keystroke[]): Tally {
  const r = emptyTally();
  for (const k of log) {
    if (k.typed === '') continue; // Backspace adds nothing
    r.chars++;
    if (k.typed === k.expected) r.correct++;
    else {
      r.errors++;
      r.errorsByKey[k.expected] = (r.errorsByKey[k.expected] ?? 0) + 1;
    }
    r.firstT = Math.min(r.firstT, k.t);
    r.lastT = Math.max(r.lastT, k.t);
  }
  return r;
}

export function mergeTally(a: Tally, b: Tally): Tally {
  const errorsByKey: Record<string, number> = { ...a.errorsByKey };
  for (const [key, n] of Object.entries(b.errorsByKey)) errorsByKey[key] = (errorsByKey[key] ?? 0) + n;
  return {
    chars: a.chars + b.chars,
    correct: a.correct + b.correct,
    errors: a.errors + b.errors,
    errorsByKey,
    firstT: Math.min(a.firstT, b.firstT),
    lastT: Math.max(a.lastT, b.lastT),
  };
}

export function report(t: Tally): Report {
  const span = t.chars ? Math.max(0, t.lastT - t.firstT) : 0;
  const minutes = Math.max(span, 1000) / 60000;
  const grossWpm = t.chars / 5 / minutes;
  const netWpm = Math.max(0, grossWpm - t.errors / minutes);
  const accuracy = t.chars ? (100 * t.correct) / t.chars : 100;
  return { grossWpm, netWpm, accuracy, errorsByKey: t.errorsByKey };
}
