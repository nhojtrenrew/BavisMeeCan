import { H, W } from './scale';
import { loadImage, logOnce } from './sheet';

export type ButtonState = 'normal' | 'pressed' | 'disabled';
export interface Rect { left: number; top: number; width: number; height: number }

/** Client pixels to logical 640x480 coordinates. */
export function toLogical(rect: Rect, clientX: number, clientY: number): { x: number; y: number } {
  return { x: ((clientX - rect.left) / rect.width) * W, y: ((clientY - rect.top) / rect.height) * H };
}

export class SvgButton {
  state: ButtonState = 'normal';
  onPress: () => void = () => {};
  private imgs: Partial<Record<ButtonState, HTMLImageElement>> = {};

  constructor(private canvas: HTMLCanvasElement, base: string, private x: number, private y: number) {
    for (const s of ['normal', 'pressed', 'disabled'] as const) {
      const url = new URL(`${base}-${s}.svg`, document.baseURI).href;
      loadImage(url).then((i) => { this.imgs[s] = i; }, () => logOnce(url));
    }
    canvas.addEventListener('pointerdown', this.down);
    canvas.addEventListener('pointerup', this.up);
    canvas.addEventListener('pointercancel', this.cancel);
  }

  private down = (e: PointerEvent): void => {
    if (this.state === 'disabled' || !this.hit(e)) return;
    this.state = 'pressed';
    this.canvas.setPointerCapture(e.pointerId);
  };
  private up = (e: PointerEvent): void => {
    if (this.state !== 'pressed') return;
    this.state = 'normal';
    if (this.hit(e)) this.onPress();
  };
  private cancel = (): void => { if (this.state === 'pressed') this.state = 'normal'; };

  dispose(): void {
    this.canvas.removeEventListener('pointerdown', this.down);
    this.canvas.removeEventListener('pointerup', this.up);
    this.canvas.removeEventListener('pointercancel', this.cancel);
  }

  private size(): { w: number; h: number } {
    const i = this.imgs.normal;
    return i ? { w: i.naturalWidth, h: i.naturalHeight } : { w: 54, h: 34 };
  }

  private hit(e: PointerEvent): boolean {
    const p = toLogical(this.canvas.getBoundingClientRect(), e.clientX, e.clientY);
    const { w, h } = this.size();
    return p.x >= this.x && p.x < this.x + w && p.y >= this.y && p.y < this.y + h;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const img = this.imgs[this.state];
    const dx = Math.round(this.x);
    const dy = Math.round(this.y);
    if (img) ctx.drawImage(img, dx, dy);
    else {
      ctx.fillStyle = '#FF00FF';
      ctx.fillRect(dx, dy, 54, 34);
    }
  }
}
