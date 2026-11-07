/** Messages between summon.ts (main thread) and worker.ts. Types only. */
export type ToWorker =
  | { type: 'load'; id: string }
  | { type: 'generate'; attempt: number };

export type FromWorker =
  | { type: 'progress'; fraction: number; text: string }
  | { type: 'ready'; loadMs: number }
  | { type: 'failed'; message: string }
  | { type: 'line'; text: string; tokensPerSecond: number }
  | { type: 'genFailed'; message: string };
