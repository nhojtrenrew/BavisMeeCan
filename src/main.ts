import { fitScale, H, W } from './render/scale';
import { startHelloScene } from './render/hello';
import { mountTypingLine } from './typing/view';
import { DEFAULT_SENTENCE } from './typing/line';
import { mountSummon } from './bavis/summon';

const stage = document.querySelector<HTMLDivElement>('#stage')!;
const canvas = document.querySelector<HTMLCanvasElement>('#screen')!;
const start = document.querySelector<HTMLDivElement>('#start')!;
canvas.getContext('2d')!.imageSmoothingEnabled = false;

function applyScale(): void {
  const vv = window.visualViewport;
  const s = fitScale(vv?.width ?? innerWidth, vv?.height ?? innerHeight);
  stage.style.width = `${W * s}px`;
  stage.style.height = `${H * s}px`;
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

startHelloScene(canvas);

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

void firstGesture.then(() => {
  mountTypingLine(document.querySelector<HTMLDivElement>('#typing')!, DEFAULT_SENTENCE);
  mountSummon(document.querySelector<HTMLDivElement>('#summon')!);
});
