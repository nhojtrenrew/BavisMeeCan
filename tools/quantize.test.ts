import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { checkPixels, loadGpl, quantizeImage } from './palette.ts';

const palette = loadGpl(readFileSync('assets/palette/bavis-21.gpl', 'utf8'));

// Any RGBA bytes at all, including partial alpha.
const anyImage = fc
  .tuple(fc.integer({ min: 1, max: 20 }), fc.integer({ min: 1, max: 20 }))
  .chain(([w, h]) =>
    fc
      .uint8Array({ minLength: w * h * 4, maxLength: w * h * 4 })
      .map((data) => ({ w, h, data })),
  );

describe('quantizeImage', () => {
  it('always passes checkPixels, with or without resizing', () => {
    fc.assert(
      fc.property(anyImage, fc.integer({ min: 1, max: 40 }), fc.boolean(), ({ w, h, data }, width, resize) => {
        const out = quantizeImage(data, w, h, palette, resize ? width : undefined);
        expect(checkPixels(out.data, out.w, out.h, palette)).toEqual([]);
        expect(out.w).toBe(resize ? width : w);
        expect(out.h).toBeGreaterThanOrEqual(1);
      }),
    );
  });

  it('keeps transparent pixels transparent', () => {
    fc.assert(
      fc.property(anyImage, ({ w, h, data }) => {
        for (let i = 3; i < data.length; i += 4) data[i] = 0;
        const out = quantizeImage(data, w, h, palette);
        for (let i = 3; i < out.data.length; i += 4) expect(out.data[i]).toBe(0);
      }),
    );
  });
});
