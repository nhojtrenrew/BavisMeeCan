// Palette loading and pixel style checks. Pure functions, no I/O.
export type Rgb = readonly [number, number, number];
export type Failure = { x: number; y: number; rgba: [number, number, number, number] };

/** Parse a GIMP .gpl palette into [r,g,b] triples. */
export function loadGpl(text: string): Rgb[] {
  const out: Rgb[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})(?:\s|$)/.exec(line);
    if (m) out.push([Number(m[1]), Number(m[2]), Number(m[3])]);
  }
  return out;
}

/** Alpha 0 passes; alpha 255 with RGB in the palette passes; anything else fails. */
export function checkPixels(
  rgba: ArrayLike<number>,
  w: number,
  h: number,
  palette: readonly Rgb[],
): Failure[] {
  const keys = new Set(palette.map(([r, g, b]) => (r << 16) | (g << 8) | b));
  const fails: Failure[] = [];
  for (let i = 0; i < w * h; i++) {
    const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2], a = rgba[i * 4 + 3];
    if (a === 0) continue;
    if (a === 255 && keys.has((r << 16) | (g << 8) | b)) continue;
    fails.push({ x: i % w, y: Math.floor(i / w), rgba: [r, g, b, a] });
  }
  return fails;
}

/** Index of the palette colour with the least squared RGB distance. */
export function nearest(r: number, g: number, b: number, palette: readonly Rgb[]): number {
  let best = 0;
  let bestD = Infinity;
  palette.forEach(([pr, pg, pb], i) => {
    const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

export const bayer4: readonly (readonly number[])[] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Nearest-neighbour resize to `width` (aspect kept), then Bayer-dither into the palette. */
export function quantizeImage(
  rgba: ArrayLike<number>,
  w: number,
  h: number,
  palette: readonly Rgb[],
  width: number = w,
): { w: number; h: number; data: Uint8Array } {
  const ow = Math.max(1, Math.round(width));
  const oh = Math.max(1, Math.round((h * ow) / w));
  const data = new Uint8Array(ow * oh * 4);
  for (let y = 0; y < oh; y++) {
    for (let x = 0; x < ow; x++) {
      const sx = Math.min(w - 1, Math.floor((x * w) / ow));
      const sy = Math.min(h - 1, Math.floor((y * h) / oh));
      const si = (sy * w + sx) * 4;
      if (rgba[si + 3] < 128) continue; // stays transparent
      const off = (bayer4[y % 4][x % 4] / 16 - 0.5) * 64;
      const c = (v: number) => Math.min(255, Math.max(0, Math.round(v + off)));
      const [r, g, b] = palette[nearest(c(rgba[si]), c(rgba[si + 1]), c(rgba[si + 2]), palette)];
      data.set([r, g, b, 255], (y * ow + x) * 4);
    }
  }
  return { w: ow, h: oh, data };
}
