import { randomCanned } from './canned';
import { modelId, pickModels, type GpuLimits, type LadderEntry } from './ladder';
import type { FromWorker, ToWorker } from './protocol';
import { validateLine } from './validate';

export const NO_GPU_MESSAGE = "Bavis can't possess this browser (no WebGPU). He'll use his old lines.";

/** Read adapter limits, or null when WebGPU is missing. */
async function probeGpu(): Promise<GpuLimits | null> {
  const gpu = (navigator as unknown as { gpu?: { requestAdapter(): Promise<any> } }).gpu;
  if (!gpu) return null;
  try {
    const a = await gpu.requestAdapter();
    if (!a) return null;
    return { maxBufferSize: Number(a.limits.maxBufferSize), shaderF16: a.features.has('shader-f16') };
  } catch {
    return null;
  }
}

/** Adds the "Summon Bavis" button, progress and output to `host`. The model only downloads after confirmation. */
export function mountSummon(host: HTMLElement): { destroy(): void } {
  const root = document.createElement('div');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Summon Bavis';
  const status = document.createElement('p');
  status.setAttribute('aria-live', 'polite');
  const out = document.createElement('p');
  out.setAttribute('aria-live', 'polite');
  root.append(button, status, out);
  host.append(root);

  let worker: Worker | null = null;
  let noGpuShown = false;
  let busy = false;

  const canned = () => { out.textContent = randomCanned(); };

  function stop(): void {
    worker?.terminate();
    worker = null;
    busy = false;
    button.disabled = false;
  }

  async function onPress(): Promise<void> {
    if (busy) return;
    busy = true;
    const limits = await probeGpu();
    const models = limits ? pickModels(limits) : [];
    if (!limits || models.length === 0) {
      busy = false;
      if (!noGpuShown) { status.textContent = NO_GPU_MESSAGE; noGpuShown = true; }
      canned();
      return;
    }
    if (!confirm(`Summon Bavis with ${models[0].label}? It needs about ${models[0].mb} MB of graphics memory and a large download. You can keep playing while it loads.`)) {
      busy = false;
      return;
    }
    button.disabled = true;
    run(limits, models);
  }

  function run(limits: GpuLimits, models: LadderEntry[]): void {
    const w = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    worker = w;
    let idx = 0;
    let loadMs = 0;
    let retried = false;
    const send = (m: ToWorker) => w.postMessage(m);
    const tryLoad = () => {
      status.textContent = `Loading ${models[idx].label}...`;
      send({ type: 'load', id: modelId(models[idx], limits) });
    };
    const giveUp = () => { status.textContent = 'Bavis would not come. He uses his old lines.'; canned(); stop(); };

    w.onerror = giveUp;
    w.onmessage = (ev: MessageEvent<FromWorker>) => {
      const m = ev.data;
      if (m.type === 'progress') {
        status.textContent = `${models[idx].label}: ${Math.round(m.fraction * 100)}% ${m.text}`;
      } else if (m.type === 'ready') {
        loadMs = m.loadMs;
        status.textContent = `${models[idx].label} ready.`;
        send({ type: 'generate', attempt: 0 });
      } else if (m.type === 'failed') {
        console.warn('[bavis] load failed', models[idx].label, m.message);
        idx += 1;
        if (idx < models.length) tryLoad(); else giveUp();
      } else if (m.type === 'line') {
        console.info(`[bavis] ${models[idx].label} load ${loadMs} ms, ${m.tokensPerSecond.toFixed(1)} tokens/s`);
        const clean = validateLine(m.text);
        if (clean) { out.textContent = clean; stop(); }
        else if (!retried) { retried = true; send({ type: 'generate', attempt: 1 }); }
        else { canned(); stop(); }
      } else {
        console.warn('[bavis] generate failed', m.message);
        canned();
        stop();
      }
    };
    tryLoad();
  }

  button.addEventListener('click', () => void onPress());
  return { destroy() { stop(); root.remove(); } };
}
