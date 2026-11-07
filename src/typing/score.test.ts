import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mergeTally, report, tally, type Keystroke } from './score';

const ch = fc.constantFrom('a', 'b', 'c', ' ', 'z');
const ks = fc.record({ t: fc.integer({ min: 0, max: 600000 }), expected: ch, typed: fc.oneof(ch, fc.constant('')) });
const log = fc.array(ks, { maxLength: 60 });

describe('score', () => {
  it('accuracy is within 0..100', () =>
    fc.assert(fc.property(log, (l) => {
      const a = report(tally(l)).accuracy;
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(100);
    })));
  it('perfect input gives 100', () =>
    fc.assert(fc.property(fc.array(fc.record({ t: fc.nat(600000), c: ch }), { maxLength: 40 }), (xs) => {
      const l: Keystroke[] = xs.map((x) => ({ t: x.t, expected: x.c, typed: x.c }));
      expect(report(tally(l)).accuracy).toBe(100);
    })));
  it('WPM is finite and never negative', () =>
    fc.assert(fc.property(log, (l) => {
      const r = report(tally(l));
      for (const w of [r.grossWpm, r.netWpm]) {
        expect(Number.isFinite(w)).toBe(true);
        expect(w).toBeGreaterThanOrEqual(0);
      }
    })));
  it('is deterministic', () =>
    fc.assert(fc.property(log, (l) => { expect(report(tally(l))).toEqual(report(tally(l))); })));
  it('split and merge equals whole', () =>
    fc.assert(fc.property(log, fc.nat(), (l, i) => {
      const k = l.length ? i % (l.length + 1) : 0;
      expect(mergeTally(tally(l.slice(0, k)), tally(l.slice(k)))).toEqual(tally(l));
    })));
  it('counts errors per expected key', () => {
    const t = tally([{ t: 0, expected: 'a', typed: 'b' }, { t: 5, expected: 'a', typed: '' }, { t: 9, expected: 'c', typed: 'c' }]);
    expect(t).toMatchObject({ chars: 2, correct: 1, errors: 1, errorsByKey: { a: 1 } });
  });
});
