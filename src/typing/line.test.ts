import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyInput, initLine, statuses, type LineEvent } from './line';

const ev = fc.oneof(
  fc.record({ kind: fc.constant('char' as const), char: fc.constantFrom('a', 'b', 'x', ' '), t: fc.nat(1e5) }),
  fc.record({ kind: fc.constant('backspace' as const), t: fc.nat(1e5) }),
);

describe('line', () => {
  it('cursor stays within 0..length', () =>
    fc.assert(fc.property(fc.string({ maxLength: 20 }), fc.array(ev, { maxLength: 80 }), (target, evs) => {
      let s = initLine(target);
      for (const e of evs as LineEvent[]) {
        s = applyInput(s, e);
        expect(s.cursor).toBeGreaterThanOrEqual(0);
        expect(s.cursor).toBeLessThanOrEqual(target.length);
      }
    })));
  it('typing the whole target finishes with all ok', () =>
    fc.assert(fc.property(fc.string({ minLength: 1, maxLength: 30 }), (target) => {
      let s = initLine(target);
      [...target].forEach((c, i) => { s = applyInput(s, { kind: 'char', char: c, t: i * 100 }); });
      expect(s.finished).toBe(true);
      expect(statuses(s).every((x) => x === 'ok')).toBe(true);
    })));
  it('backspace undoes a wrong character', () => {
    let s = initLine('ab');
    s = applyInput(s, { kind: 'char', char: 'x', t: 0 });
    expect(statuses(s)).toEqual(['bad', 'pending']);
    s = applyInput(s, { kind: 'backspace', t: 1 });
    expect(s.cursor).toBe(0);
  });
});
