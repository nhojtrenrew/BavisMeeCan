export interface SizeStep { maxDistance: number; frame: number }

/** `sizes` sorted ascending by maxDistance. First step that reaches `distance`, else the last. */
export function pickSize<T extends SizeStep>(distance: number, sizes: readonly T[]): T {
  return sizes.find((s) => s.maxDistance >= distance) ?? sizes[sizes.length - 1]!;
}
