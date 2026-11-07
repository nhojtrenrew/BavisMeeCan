export const W = 640;
export const H = 480;

/** CSS scale for the 640×480 canvas: largest whole number that fits, or a fraction if the viewport is smaller. */
export function fitScale(vw: number, vh: number): number {
  const fit = Math.min(vw / W, vh / H);
  return fit >= 1 ? Math.floor(fit) : fit;
}
