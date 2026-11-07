import { prebuiltAppConfig } from '@mlc-ai/web-llm';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { CANNED, randomCanned } from './canned';
import { LADDER, modelId, pickModels } from './ladder';
import { BLOCKED, isBlocked, MAX_LINE, validateLine } from './validate';

const LEET: Record<string, string> = { o: '0', i: '1', e: '3', a: '4', s: '5', t: '7' };
const leet = (w: string) => [...w].map((c) => LEET[c] ?? c).join('');
const mixCase = (w: string, bits: boolean[]) => [...w].map((c, i) => (bits[i % bits.length] ? c.toUpperCase() : c)).join('');

describe('validateLine', () => {
  it('returns null or a clean, short, unblocked line for any string', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string({ maxLength: 400 }), fc.string({ unit: 'binary', maxLength: 400 }), fc.string({ minLength: 3000, maxLength: 6000 })), (s) => {
        const r = validateLine(s);
        if (r !== null) {
          expect(r.length).toBeLessThanOrEqual(MAX_LINE);
          expect(r).not.toMatch(/[\r\n]/);
          expect(isBlocked(r)).toBe(false);
        }
      }),
    );
  });

  it('rejects block-list words embedded in text, in any case and leetspeak', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...BLOCKED),
        fc.boolean(),
        fc.array(fc.boolean(), { minLength: 1, maxLength: 8 }),
        fc.string({ maxLength: 30 }),
        fc.string({ maxLength: 30 }),
        (word, useLeet, bits, pre, post) => {
          const w = mixCase(useLeet ? leet(word) : word, bits);
          expect(validateLine(`${pre} ${w} ${post}`)).toBeNull();
          expect(validateLine(w)).toBeNull();
        },
      ),
    );
  });

  it('rejects stems split by punctuation, spaces or leetspeak', () => {
    for (const w of BLOCKED) {
      expect(validateLine([...w].join('.'))).toBeNull();
      expect(validateLine([...w].join(' '))).toBeNull();
      expect(validateLine(leet(w).toUpperCase())).toBeNull();
    }
  });

  it('lets innocent words that contain block-list letters through', () => {
    for (const w of ['grape', 'Scunthorpe', 'Cocktail', 'Dickens', 'Peacock', 'Drape', 'a bit chilly', 'this hit']) {
      expect(validateLine(`I like ${w} a lot.`)).not.toBeNull();
    }
  });

  it('rejects empty, multi-line and over-long text', () => {
    expect(validateLine('   ')).toBeNull();
    expect(validateLine('one\ntwo')).toBeNull();
    expect(validateLine('a'.repeat(MAX_LINE + 1))).toBeNull();
    expect(validateLine('a'.repeat(1_000_000))).toBeNull();
  });

  it('trims, collapses whitespace and strips quotes', () => {
    expect(validateLine('  "Hello   ghost"  ')).toBe('Hello ghost');
  });
});

describe('canned lines', () => {
  it('has 20 or more lines and every one passes validateLine unchanged', () => {
    expect(CANNED.length).toBeGreaterThanOrEqual(20);
    for (const l of CANNED) expect(validateLine(l)).toBe(l);
  });
  it('randomCanned always returns a canned line', () => {
    fc.assert(fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (r) => CANNED.includes(randomCanned(() => r))));
  });
});

describe('pickModels', () => {
  const limits = fc.record({ maxBufferSize: fc.integer({ min: 0, max: 2 ** 33 }), shaderF16: fc.boolean() });
  it('returns a subset of LADDER, largest first', () => {
    fc.assert(
      fc.property(limits, (l) => {
        const r = pickModels(l);
        for (const m of r) expect(LADDER).toContain(m);
        const idx = r.map((m) => LADDER.indexOf(m));
        expect([...idx].sort((a, b) => b - a)).toEqual(idx);
      }),
    );
  });
  it('higher limits never give fewer models', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 2 ** 33 }), fc.integer({ min: 0, max: 2 ** 33 }), fc.boolean(), (a, b, f) => {
        const [lo, hi] = a <= b ? [a, b] : [b, a];
        expect(pickModels({ maxBufferSize: hi, shaderF16: f }).length).toBeGreaterThanOrEqual(pickModels({ maxBufferSize: lo, shaderF16: f }).length);
      }),
    );
  });
  it('no WebGPU-sized buffer gives no models', () => {
    expect(pickModels({ maxBufferSize: 0, shaderF16: true })).toEqual([]);
  });
});

describe('ladder ids', () => {
  const known = new Set(prebuiltAppConfig.model_list.map((m) => m.model_id));
  it('exist in prebuiltAppConfig (f16 and f32 variants)', () => {
    for (const m of LADDER) {
      expect(known.has(m.id)).toBe(true);
      expect(known.has(m.idF32)).toBe(true);
    }
  });
  it('modelId follows shader-f16', () => {
    for (const m of LADDER) {
      expect(modelId(m, { maxBufferSize: 0, shaderF16: true })).toBe(m.id);
      expect(modelId(m, { maxBufferSize: 0, shaderF16: false })).toBe(m.idF32);
    }
  });
});
