export interface LadderEntry {
  /** WebLLM prebuilt model id (needs the shader-f16 GPU feature). */
  id: string;
  /** Fallback id for GPUs without shader-f16. */
  idF32: string;
  label: string;
  /** Rough size shown before download, MB (prebuilt record's vram_required_MB, rounded). */
  mb: number;
  /** Smallest adapter maxBufferSize (bytes) we try this model at. Estimate until measured on devices. */
  minBufferSize: number;
}

export interface GpuLimits {
  maxBufferSize: number;
  shaderF16: boolean;
}

const MB = 1024 * 1024;

/** Smallest first. */
export const LADDER: readonly LadderEntry[] = [
  { id: 'SmolLM2-135M-Instruct-q0f16-MLC', idF32: 'SmolLM2-135M-Instruct-q0f32-MLC', label: 'SmolLM2 135M', mb: 360, minBufferSize: 256 * MB },
  { id: 'SmolLM2-360M-Instruct-q4f16_1-MLC', idF32: 'SmolLM2-360M-Instruct-q4f32_1-MLC', label: 'SmolLM2 360M', mb: 380, minBufferSize: 512 * MB },
  { id: 'Qwen3-0.6B-q4f16_1-MLC', idF32: 'Qwen3-0.6B-q4f32_1-MLC', label: 'Qwen3 0.6B', mb: 1400, minBufferSize: 1024 * MB },
];

/** Models the adapter allows, largest first (try the biggest, fall back down). */
export function pickModels(limits: GpuLimits): LadderEntry[] {
  return LADDER.filter((m) => limits.maxBufferSize >= m.minBufferSize).reverse();
}

/** The model id to load for this adapter. */
export function modelId(m: LadderEntry, limits: GpuLimits): string {
  return limits.shaderF16 ? m.id : m.idF32;
}
