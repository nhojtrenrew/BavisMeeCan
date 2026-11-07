import type { SheetJson, SheetTag } from './sheet-types';

/** Frame index (within tag.from..tag.to) shown at `elapsedMs`. Step function, no interpolation. */
export function frameAt(sheet: SheetJson, tag: SheetTag, elapsedMs: number): number {
  const ms: number[] = [];
  let total = 0;
  for (let i = tag.from; i <= tag.to; i++) {
    const d = Math.max(1, sheet.frames[i]?.ms ?? 1);
    ms.push(d);
    total += d;
  }
  if (ms.length === 0) return tag.from;
  let t = Math.max(0, elapsedMs);
  if (tag.loop) t %= total;
  else if (t >= total) return tag.to;
  for (let k = 0; k < ms.length; k++) {
    if (t < ms[k]!) return tag.from + k;
    t -= ms[k]!;
  }
  return tag.to;
}

export const MAX_STEP_MS = 250;

export class Animator {
  private elapsed = 0;
  private last: number | null = null;
  constructor(private sheet: SheetJson, private tag: SheetTag) {
    document.addEventListener('visibilitychange', () => { this.last = null; });
  }
  /** Call once per rAF with the rAF timestamp; returns the frame to draw. */
  tick(now: number): number {
    if (this.last !== null) this.elapsed += Math.min(Math.max(0, now - this.last), MAX_STEP_MS);
    this.last = now;
    return frameAt(this.sheet, this.tag, this.elapsed);
  }
}
