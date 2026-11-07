import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { packFrames, toSheetJson, type LibreSpriteJson, type SheetJson } from './sheet.ts';

// Random horizontal strip in LibreSprite's shape, with random (valid) tags.
const lsJson = fc
  .tuple(fc.integer({ min: 1, max: 16 }), fc.integer({ min: 1, max: 40 }), fc.integer({ min: 1, max: 40 }))
  .chain(([n, fw, fh]) =>
    fc
      .tuple(
        fc.array(fc.integer({ min: 1, max: 2000 }), { minLength: n, maxLength: n }),
        fc.array(
          fc.record({
            name: fc.constantFrom('idle', 'run', 'die-once', 'x-once'),
            a: fc.nat(n - 1),
            b: fc.nat(n - 1),
          }),
          { maxLength: 4 },
        ),
      )
      .map(([durs, tags]): LibreSpriteJson => ({
        frames: durs.map((duration, i) => ({ frame: { x: i * fw, y: 0, w: fw, h: fh }, duration })),
        meta: {
          size: { w: n * fw, h: fh },
          frameTags: tags.map((t) => ({ name: t.name, from: Math.min(t.a, t.b), to: Math.max(t.a, t.b) })),
        },
      })),
  );

function expectValid(j: SheetJson) {
  expect(j.frames.length).toBeGreaterThan(0);
  for (const f of j.frames) {
    expect(f.x).toBeGreaterThanOrEqual(0);
    expect(f.y).toBeGreaterThanOrEqual(0);
    expect(f.x + f.w).toBeLessThanOrEqual(j.size.w);
    expect(f.y + f.h).toBeLessThanOrEqual(j.size.h);
    expect(Number.isInteger(f.x + f.y + f.w + f.h)).toBe(true);
    expect(f.ms).toBeGreaterThanOrEqual(1);
  }
  expect(j.tags.length).toBeGreaterThan(0);
  for (const t of j.tags) {
    expect(t.from).toBeGreaterThanOrEqual(0);
    expect(t.to).toBeGreaterThanOrEqual(t.from);
    expect(t.to).toBeLessThan(j.frames.length);
  }
}

describe('toSheetJson', () => {
  it('keeps rects inside the sheet and tags inside the frame range', () => {
    fc.assert(fc.property(lsJson, (ls) => expectValid(toSheetJson(ls, 'a.png'))));
  });

  it('strips -once and turns loop off; untagged sources get one looping "all" tag', () => {
    fc.assert(
      fc.property(lsJson, (ls) => {
        const j = toSheetJson(ls, 'a.png');
        const src = ls.meta.frameTags ?? [];
        if (src.length === 0) {
          expect(j.tags).toEqual([{ name: 'all', from: 0, to: j.frames.length - 1, loop: true }]);
        }
        src.forEach((s, i) => {
          expect(j.tags[i].loop).toBe(!s.name.endsWith('-once'));
          expect(j.tags[i].name.endsWith('-once')).toBe(false);
        });
      }),
    );
  });
});

describe('packFrames', () => {
  const raw = fc
    .array(
      fc
        .tuple(fc.integer({ min: 1, max: 10 }), fc.integer({ min: 1, max: 10 }), fc.integer({ min: 1, max: 500 }))
        .map(([w, h, ms]) => ({ w, h, ms, data: new Uint8Array(w * h * 4).fill(7) })),
      { minLength: 1, maxLength: 8 },
    );

  it('produces valid rects and copies every frame pixel', () => {
    fc.assert(
      fc.property(raw, (frames) => {
        const p = packFrames(frames, 'a.png');
        expectValid(p.json);
        expect(p.json.frames).toHaveLength(frames.length);
        p.json.frames.forEach((r, i) => {
          for (let y = 0; y < r.h; y++)
            for (let x = 0; x < r.w; x++) expect(p.data[((r.y + y) * p.w + r.x + x) * 4]).toBe(7);
          expect([r.w, r.h]).toEqual([frames[i].w, frames[i].h]);
        });
      }),
    );
  });
});
