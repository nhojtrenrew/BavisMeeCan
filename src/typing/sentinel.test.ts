import fc from 'fast-check';
import { expect, it } from 'vitest';
import { SENTINEL, stripSentinel } from './sentinel';

it('stripSentinel removes every sentinel and nothing else', () =>
  fc.assert(fc.property(fc.array(fc.oneof(fc.string({ maxLength: 5 }), fc.constant(SENTINEL))), (parts) => {
    const out = stripSentinel(parts.join(''));
    expect(out.includes(SENTINEL)).toBe(false);
    expect(out).toBe(parts.join('').replaceAll(SENTINEL, ''));
    expect(stripSentinel(out)).toBe(out);
  })));
