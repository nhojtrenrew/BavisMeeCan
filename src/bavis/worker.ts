/// <reference lib="webworker" />
// The ONLY file that imports @mlc-ai/web-llm, so it stays out of the main chunk.
import { CreateMLCEngine, type MLCEngine } from '@mlc-ai/web-llm';
import type { FromWorker, ToWorker } from './protocol';

const SYSTEM_PROMPT =
  'You are Bavis MeeCan, a ghost who died teaching typing and is still grumpy about it. ' +
  'You are rude, spooky and funny, never cruel. Keep it PG-13. ' +
  'Reply with exactly one short sentence, under 100 characters, no emoji, no quotes.';

const post = (m: FromWorker) => (self as unknown as Worker).postMessage(m);
let engine: MLCEngine | null = null;

async function load(id: string): Promise<void> {
  const t0 = performance.now();
  try {
    await engine?.unload();
    engine = await CreateMLCEngine(id, {
      initProgressCallback: (p) => post({ type: 'progress', fraction: p.progress, text: p.text }),
    });
    post({ type: 'ready', loadMs: Math.round(performance.now() - t0) });
  } catch (e) {
    engine = null;
    post({ type: 'failed', message: e instanceof Error ? e.message : String(e) });
  }
}

async function generate(attempt: number): Promise<void> {
  if (!engine) return post({ type: 'genFailed', message: 'no model loaded' });
  try {
    const t0 = performance.now();
    const r = await engine.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: attempt === 0 ? 'Say something to the student.' : 'Another one, shorter.' },
      ],
      max_tokens: 48,
      temperature: 0.9,
      extra_body: { enable_thinking: false },
    });
    const secs = (performance.now() - t0) / 1000;
    const tokens = r.usage?.completion_tokens ?? 0;
    post({ type: 'line', text: r.choices[0]?.message.content ?? '', tokensPerSecond: secs > 0 ? tokens / secs : 0 });
  } catch (e) {
    post({ type: 'genFailed', message: e instanceof Error ? e.message : String(e) });
  }
}

self.onmessage = (ev: MessageEvent<ToWorker>) => {
  if (ev.data.type === 'load') void load(ev.data.id);
  else void generate(ev.data.attempt);
};
