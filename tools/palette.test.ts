import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { checkPixels, loadGpl, nearest } from './palette.ts';

const palette = loadGpl(readFileSync('assets/palette/bavis-21.gpl', 'utf8'));

// Random w*h image: each pixel is transparent or a palette colour.
export const goodImage = fc
  .tuple(fc.integer({ min: 1, max: 12 }), fc.integer({ min: 1, max: 12 }))
  .chain(([w, h]) =>
    fc
      .array(fc.option(fc.integer({ min: 0, max: palette.length - 1 }), { nil: null }), {
        minLength: w * h,
        maxLength: w * h,
      })
      .map((px) => {
        const data = new Uint8Array(w * h * 4);
        px.forEach((p, i) => {
          if (p === null) return; // transparent black
          data.set([...palette[p], 255], i * 4);
        });
        return { w, h, data };
      }),
  );

const byte = fc.integer({ min: 0, max: 255 });
const badPixel = fc.oneof(
  fc
    .tuple(byte, byte, byte)
    .filter(([r, g, b]) => !palette.some((p) => p[0] === r && p[1] === g && p[2] === b))
    .map(([r, g, b]) => [r, g, b, 255]),
  fc
    .tuple(fc.integer({ min: 0, max: 20 }), fc.integer({ min: 1, max: 254 }))
    .map(([i, a]) => [...palette[i], a]), // partial alpha
);

describe('palette', () => {
  it('loads 21 colours', () => {
    expect(palette).toHaveLength(21);
  });

  it('accepts images made only of palette colours and transparency', () => {
    fc.assert(
      fc.property(goodImage, ({ w, h, data }) => checkPixels(data, w, h, palette).length === 0),
    );
  });

  it('reports exactly the injected bad pixel', () => {
    fc.assert(
      fc.property(goodImage, badPixel, fc.nat(), ({ w, h, data }, px, n) => {
        const i = n % (w * h);
        data.set(px, i * 4);
        const f = checkPixels(data, w, h, palette);
        expect(f).toHaveLength(1);
        expect(f[0].x).toBe(i % w);
        expect(f[0].y).toBe(Math.floor(i / w));
        expect(f[0].rgba).toEqual(px);
      }),
    );
  });

  it('nearest returns an exact match for palette colours', () => {
    palette.forEach(([r, g, b], i) => expect(nearest(r, g, b, palette)).toBe(i));
  });
});
