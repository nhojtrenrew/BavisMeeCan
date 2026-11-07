import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { fitScale, H, W } from './scale';

const side = fc.integer({ min: 1, max: 8000 });
const EPS = 1e-9;

describe('fitScale', () => {
  it('always fits the viewport', () => {
    fc.assert(fc.property(side, side, (vw, vh) => {
      const s = fitScale(vw, vh);
      expect(W * s).toBeLessThanOrEqual(vw + EPS);
      expect(H * s).toBeLessThanOrEqual(vh + EPS);
    }));
  });

  it('is the largest whole number when 640×480 fits', () => {
    fc.assert(fc.property(fc.integer({ min: W, max: 8000 }), fc.integer({ min: H, max: 8000 }), (vw, vh) => {
      const s = fitScale(vw, vh);
      expect(Number.isInteger(s)).toBe(true);
      expect(s).toBeGreaterThanOrEqual(1);
      expect(W * (s + 1) > vw || H * (s + 1) > vh).toBe(true);
    }));
  });

  it('shrinks to fill one side exactly when the viewport is smaller', () => {
    fc.assert(fc.property(side, side, (vw, vh) => {
      fc.pre(vw < W || vh < H);
      const s = fitScale(vw, vh);
      expect(s).toBeLessThan(1);
      expect(Math.abs(W * s - vw) < 1e-6 || Math.abs(H * s - vh) < 1e-6).toBe(true);
    }));
  });
});
