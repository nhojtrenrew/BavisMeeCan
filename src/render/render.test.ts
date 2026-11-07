import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { frameAt } from './animator';
import { toLogical } from './button';
import { pickSize } from './sizes';
import type { SheetJson, SheetTag } from './sheet-types';

const sheetAndTag = fc
  .array(fc.integer({ min: 1, max: 500 }), { minLength: 1, maxLength: 12 })
  .chain((mss) =>
    fc.tuple(fc.nat(mss.length - 1), fc.nat(mss.length - 1), fc.boolean()).map(([a, b, loop]) => {
      const sheet: SheetJson = {
        image: 'x.png',
        size: { w: 10, h: 10 },
        frames: mss.map((ms) => ({ x: 0, y: 0, w: 1, h: 1, ms })),
        tags: [],
      };
      const tag: SheetTag = { name: 't', from: Math.min(a, b), to: Math.max(a, b), loop };
      return { sheet, tag };
    }),
  );

describe('frameAt', () => {
  it('stays within the tag and is a pure step function', () => {
    fc.assert(fc.property(sheetAndTag, fc.double({ min: 0, max: 1e9, noNaN: true }), ({ sheet, tag }, t) => {
      const i = frameAt(sheet, tag, t);
      expect(i).toBeGreaterThanOrEqual(tag.from);
      expect(i).toBeLessThanOrEqual(tag.to);
      expect(frameAt(sheet, tag, t)).toBe(i);
    }));
  });
  it('starts at from; non-looping ends on the last frame', () => {
    fc.assert(fc.property(sheetAndTag, ({ sheet, tag }) => {
      expect(frameAt(sheet, tag, 0)).toBe(tag.from);
      expect(frameAt(sheet, { ...tag, loop: false }, 1e12)).toBe(tag.to);
    }));
  });
});

describe('pickSize', () => {
  const steps = fc
    .array(fc.integer({ min: 0, max: 1000 }), { minLength: 1, maxLength: 20 })
    .map((ds) => [...ds].sort((a, b) => a - b).map((maxDistance, frame) => ({ maxDistance, frame })));
  it('returns a member and never grows with distance', () => {
    fc.assert(fc.property(steps, fc.integer({ min: 0, max: 2000 }), fc.integer({ min: 0, max: 2000 }), (sizes, d1, d2) => {
      const [near, far] = d1 <= d2 ? [d1, d2] : [d2, d1];
      expect(sizes).toContain(pickSize(near!, sizes));
      expect(pickSize(far!, sizes).frame).toBeGreaterThanOrEqual(pickSize(near!, sizes).frame);
    }));
  });
});

describe('toLogical', () => {
  it('maps points inside the rect into 0..640, 0..480', () => {
    fc.assert(fc.property(
      fc.record({ left: fc.integer({ min: -500, max: 500 }), top: fc.integer({ min: -500, max: 500 }), width: fc.integer({ min: 1, max: 3000 }), height: fc.integer({ min: 1, max: 3000 }) }),
      fc.double({ min: 0, max: 1, noNaN: true }), fc.double({ min: 0, max: 1, noNaN: true }),
      (rect, u, v) => {
        const p = toLogical(rect, rect.left + u * rect.width, rect.top + v * rect.height);
        expect(p.x).toBeGreaterThanOrEqual(-1e-9);
        expect(p.x).toBeLessThanOrEqual(640 + 1e-9);
        expect(p.y).toBeGreaterThanOrEqual(-1e-9);
        expect(p.y).toBeLessThanOrEqual(480 + 1e-9);
      },
    ));
  });
});
