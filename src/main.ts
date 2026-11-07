import { fitScale, H, W } from './render/scale';

const canvas = document.querySelector<HTMLCanvasElement>('#screen')!;
const start = document.querySelector<HTMLDivElement>('#start')!;
canvas.getContext('2d')!.imageSmoothingEnabled = false;

function applyScale(): void {
  const vv = window.visualViewport;
  const s = fitScale(vv?.width ?? innerWidth, vv?.height ?? innerHeight);
  canvas.style.width = `${W * s}px`;
  canvas.style.height = `${H * s}px`;
}

let queued = false;
function queueScale(): void {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; applyScale(); });
}

addEventListener('resize', queueScale);
addEventListener('orientationchange', queueScale);
window.visualViewport?.addEventListener('resize', queueScale);
applyScale();

/** Resolves on the first tap or key press. Later lanes reuse it to open the soft keyboard and unlock audio. */
export const firstGesture = new Promise<Event>((resolve) => {
  const go = (e: Event) => {
    removeEventListener('pointerdown', go);
    removeEventListener('keydown', go);
    start.hidden = true;
    resolve(e);
  };
  addEventListener('pointerdown', go);
  addEventListener('keydown', go);
});
