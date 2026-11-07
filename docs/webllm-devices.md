# WebLLM device findings

Spike for `webllm-bavis`. Press "Summon Bavis", then read the browser console: `[bavis] <model> load <ms> ms, <n> tokens/s`.

Ladder (prebuilt ids confirmed in `@mlc-ai/web-llm` 0.2.87; f32 ids used when the GPU lacks `shader-f16`):

| Model | f16 id | f32 id | Shown size (MB) |
|---|---|---|---|
| SmolLM2 135M | `SmolLM2-135M-Instruct-q0f16-MLC` | `SmolLM2-135M-Instruct-q0f32-MLC` | 360 |
| SmolLM2 360M | `SmolLM2-360M-Instruct-q4f16_1-MLC` | `SmolLM2-360M-Instruct-q4f32_1-MLC` | 380 |
| Qwen3 0.6B | `Qwen3-0.6B-q4f16_1-MLC` | `Qwen3-0.6B-q4f32_1-MLC` | 1400 |

Sizes are the prebuilt `vram_required_MB`, not file sizes. The `minBufferSize` thresholds in `src/bavis/ladder.ts` are estimates; tune them from the rows below.

| device | browser | model | load time | tokens/s | worked |
|---|---|---|---|---|---|
| (desktop, to fill) | Chrome | | | | |
| (phone, to fill) | Chrome Android | | | | |
| (iPhone, to fill) | Safari 26 | | | | |
| (to fill) | Firefox Android | | | | expect: no WebGPU, canned lines |
