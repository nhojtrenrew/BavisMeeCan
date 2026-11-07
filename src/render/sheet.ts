import type { SheetJson } from './sheet-types';

export interface Sheet {
  json: SheetJson;
  /** null when the PNG (or JSON) failed to load: frames draw as magenta rects. */
  image: HTMLImageElement | null;
}

const MAGENTA = '#FF00FF';
const logged = new Set<string>();

export function logOnce(url: string): void {
  if (logged.has(url)) return;
  logged.add(url);
  console.warn(`[render] failed to load asset: ${url}`);
}

export function fallbackJson(w = 32, h = 32): SheetJson {
  return {
    image: '',
    size: { w, h },
    frames: [{ x: 0, y: 0, w, h, ms: 100 }],
    tags: [{ name: 'all', from: 0, to: 0, loop: true }],
  };
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(url));
    img.src = url;
  });
}

export async function loadSheet(jsonUrl: string): Promise<Sheet> {
  let json: SheetJson;
  try {
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(String(res.status));
    json = (await res.json()) as SheetJson;
  } catch {
    logOnce(jsonUrl);
    return { json: fallbackJson(), image: null };
  }
  const imgUrl = new URL(json.image, new URL(jsonUrl, document.baseURI)).href;
  try {
    return { json, image: await loadImage(imgUrl) };
  } catch {
    logOnce(imgUrl);
    return { json, image: null };
  }
}

export function drawFrame(ctx: CanvasRenderingContext2D, sheet: Sheet, i: number, x: number, y: number): void {
  const f = sheet.json.frames[i];
  if (!f) return;
  ctx.imageSmoothingEnabled = false;
  const dx = Math.round(x);
  const dy = Math.round(y);
  if (sheet.image) {
    ctx.drawImage(sheet.image, f.x, f.y, f.w, f.h, dx, dy, f.w, f.h);
  } else {
    ctx.fillStyle = MAGENTA;
    ctx.fillRect(dx, dy, f.w, f.h);
  }
}
