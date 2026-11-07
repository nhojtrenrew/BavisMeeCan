/** Sheet JSON written by the asset pipeline (asset-pipeline design.md, "Sheet JSON"). */
export interface SheetFrame { x: number; y: number; w: number; h: number; ms: number }
export interface SheetTag { name: string; from: number; to: number; loop: boolean }
export interface SheetJson {
  image: string;
  size: { w: number; h: number };
  frames: SheetFrame[];
  tags: SheetTag[];
}
