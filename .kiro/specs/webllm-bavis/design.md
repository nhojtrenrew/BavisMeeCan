# Design: webllm-bavis (lane D, spike)

Implements `requirements.md`. Owns `src/bavis/` and `docs/webllm-devices.md`.

## Files

| File | Job |
|---|---|
| `src/bavis/ladder.ts` | Pure: `LADDER` (model id, label, download MB, min `maxBufferSize`), `pickModels(limits)` |
| `src/bavis/validate.ts` | Pure: `validateLine(text): string \| null` |
| `src/bavis/canned.ts` | 20+ original canned Bavis lines, each passing `validateLine` |
| `src/bavis/worker.ts` | Web Worker: loads the model with `@mlc-ai/web-llm`, generates one line |
| `src/bavis/summon.ts` | DOM: `mountSummon(host): { destroy() }` — button, confirm, progress, output |
| `src/bavis/*.test.ts` | Vitest + fast-check |

## Shared change (lead makes it on `main` before the lane starts)
`package.json` dependency `@mlc-ai/web-llm 0.2.87` (exact). It is imported **only** in `worker.ts`, so it lands in the worker chunk and the first page load stays under 2 MB.

## Ladder (req 2)
- IDs are confirmed against `prebuiltAppConfig.model_list` at build time; a test asserts every `LADDER` id exists there. Starting guesses: `SmolLM2-135M-Instruct-q0f16-MLC`, `SmolLM2-360M-Instruct-q4f16_1-MLC`, `Qwen3-0.6B-q4f16_1-MLC`. Download sizes come from the model record (`vram_required_MB` as the shown estimate if no file size is listed).
- `pickModels(limits)` returns the ladder entries the adapter allows, **largest first**, so loading tries the biggest that fits, then falls back down (req 2.2, 2.3).
- No `navigator.gpu` or no adapter → no models → canned lines, with one message "Bavis can't possess this browser (no WebGPU). He'll use his old lines." (req 2.1).

## Flow (req 1)
1. "Summon Bavis" button. Press → confirm dialog with model label and size (req 1.1). Cancel → nothing downloaded.
2. Confirm → `new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })`; worker posts `progress` (0..1 + text) shown under the button (req 1.2).
3. Load error or out of memory → worker posts `failed`; summon tries the next smaller model; none left → canned (req 2.3).
4. Ready → generate. Everything is async in the worker; the main thread never waits on it (req 1.3).

## Output (req 3)
- System prompt: Bavis MeeCan, ghost typing teacher, rude, spooky, PG-13, one sentence, under 120 characters, no emoji. Original wording only.
- `max_tokens` 48, temperature 0.9.
- `validateLine`: trim, collapse whitespace, strip quotes; reject if empty, over 120 chars, contains a newline after trimming, or matches the PG-13 block list (word-boundary, case-insensitive, also with leetspeak digits mapped `0→o 1→i 3→e 4→a 5→s 7→t`). Returns the clean line or `null`.
- Fail → regenerate once → fail → random canned line (req 3.2).

## Findings (req 4)
`docs/webllm-devices.md`: table `device | browser | model | load time | tokens/s | worked`. The summon UI logs load time and tokens/s to the console so John can fill rows from his phone and desktop.

## Tests (fast-check)
- `validateLine` on any string (including huge, unicode, control chars, block-list words embedded with random case/leet) → `null` or a string ≤ 120 chars with no block-list match (req 3.3).
- Every canned line passes `validateLine`.
- `pickModels`: result is a subset of `LADDER`, ordered largest first; higher limits never give fewer models.
- Every `LADDER` id exists in `prebuiltAppConfig`.

## Out of scope
Chat history, streaming text to the screen, voice, caching settings beyond WebLLM's default cache.
