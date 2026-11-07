import { Animator } from './animator';
import { SvgButton } from './button';
import { drawFrame, loadSheet } from './sheet';
import { H, W } from './scale';

export function startHelloScene(canvas: HTMLCanvasElement): { stop(): void } {
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  const button = new SvgButton(canvas, 'assets/button', 40, 400);
  let stopped = false;
  let raf = 0;

  void loadSheet('assets/hello.json').then((sheet) => {
    if (stopped) return;
    const tag = sheet.json.tags[0] ?? { name: 'all', from: 0, to: 0, loop: true };
    const anim = new Animator(sheet.json, tag);
    const loop = (now: number): void => {
      if (stopped) return;
      ctx.fillStyle = '#000080';
      ctx.fillRect(0, 0, W, H);
      drawFrame(ctx, sheet, anim.tick(now), 40, 40);
      button.draw(ctx);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  });

  return { stop() { stopped = true; cancelAnimationFrame(raf); } };
}
