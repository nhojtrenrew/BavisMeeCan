// Sprite-sheet JSON: the contract with lane B (see .kiro/specs/asset-pipeline/design.md).
// Kept in sync by hand with src/render/sheet-types.ts; the verifier checks they match.

export type SheetFrame = { x: number; y: number; w: number; h: number; ms: number };
export type SheetTag = { name: string; from: number; to: number; loop: boolean };
export type SheetJson = {
  image: string;
  size: { w: number; h: number };
  frames: SheetFrame[];
  tags: SheetTag[];
};

// LibreSprite 1.3 `--data x.json --format json-array --list-tags` (confirmed on a real run):
//   frames[]: { filename, frame:{x,y,w,h}, rotated, trimmed, spriteSourceSize, sourceSize, duration }
//   meta: { app, version, image, format, size:{w,h}, scale, frameTags:[{name,from,to,direction}] }
// `duration` is in milliseconds; the `image` field is an absolute path, so we ignore it.
export type LibreSpriteJson = {
  frames: { frame: { x: number; y: number; w: number; h: number }; duration: number }[];
  meta: {
    size: { w: number; h: number };
    frameTags?: { name: string; from: number; to: number }[];
  };
};

/** Map LibreSprite's JSON to our sheet JSON. `image` is the PNG file name beside the JSON. */
export function toSheetJson(ls: LibreSpriteJson, image: string): SheetJson {
  const frames = ls.frames.map(({ frame, duration }) => ({
    x: frame.x,
    y: frame.y,
    w: frame.w,
    h: frame.h,
    ms: Math.max(1, Math.round(duration)),
  }));
  const src = ls.meta.frameTags ?? [];
  const tags: SheetTag[] = src.length
    ? src.map((t) => {
        const once = t.name.endsWith('-once');
        return { name: once ? t.name.slice(0, -5) : t.name, from: t.from, to: t.to, loop: !once };
      })
    : [{ name: 'all', from: 0, to: Math.max(0, frames.length - 1), loop: true }];
  return { image, size: { ...ls.meta.size }, frames, tags };
}

export type RawFrame = { w: number; h: number; data: Uint8Array; ms: number };

/** Fallback: lay per-frame RGBA images in one row; returns the sheet pixels and its JSON. */
export function packFrames(
  frames: RawFrame[],
  image: string,
  tags: SheetTag[] = [],
): { w: number; h: number; data: Uint8Array; json: SheetJson } {
  const w = frames.reduce((s, f) => s + f.w, 0);
  const h = frames.reduce((m, f) => Math.max(m, f.h), 0);
  const data = new Uint8Array(w * h * 4);
  const rects: SheetFrame[] = [];
  let x = 0;
  for (const f of frames) {
    for (let row = 0; row < f.h; row++) {
      data.set(f.data.subarray(row * f.w * 4, (row + 1) * f.w * 4), (row * w + x) * 4);
    }
    rects.push({ x, y: 0, w: f.w, h: f.h, ms: Math.max(1, Math.round(f.ms)) });
    x += f.w;
  }
  const outTags = tags.length
    ? tags
    : [{ name: 'all', from: 0, to: Math.max(0, frames.length - 1), loop: true }];
  return { w, h, data, json: { image, size: { w, h }, frames: rects, tags: outTags } };
}
