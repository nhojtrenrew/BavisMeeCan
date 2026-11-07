import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { cleanSvg } from './svg.ts';

const word = fc.stringMatching(/^[a-z0-9]{1,8}$/);

// A clean SVG: root with a few plain shapes.
const cleanSvgText = fc
  .array(fc.tuple(word, fc.integer({ min: 0, max: 99 })), { maxLength: 5 })
  .map(
    (rs) =>
      `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="34">` +
      rs.map(([id, n]) => `<rect id="${id}" x="${n}" y="${n}" width="4" height="4" fill="#c0c0c0"/>`).join('') +
      `</svg>`,
  );

describe('cleanSvg', () => {
  it('leaves an already clean SVG unchanged', () => {
    fc.assert(fc.property(cleanSvgText, (s) => cleanSvg(s) === s));
  });

  it('removes editor metadata, namespaces and comments but keeps the shapes', () => {
    fc.assert(
      fc.property(cleanSvgText, word, word, (clean, a, b) => {
        const dirty = clean
          .replace(
            '<svg ',
            `<svg xmlns:serif="http://www.serif.com/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" serif:id="${a}" inkscape:version="1.0" `,
          )
          .replace('>', `><!-- ${b} --><metadata><x>${a}</x></metadata><sodipodi:namedview id="n"/><sodipodi:namedview id="m"><x/></sodipodi:namedview>`)
          .replace('</svg>', `<g inkscape:label="${b}"/></svg>`);
        const out = cleanSvg(dirty);
        expect(out).not.toMatch(/serif:|inkscape:|sodipodi:|<metadata|<!--/);
        expect(out).toContain('xmlns="http://www.w3.org/2000/svg"');
        expect(out.match(/<rect/g)?.length ?? 0).toBe(clean.match(/<rect/g)?.length ?? 0);
      }),
    );
  });
});
