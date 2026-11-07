# Requirements: asset-pipeline (lane A)

## Introduction
Turns John's source art into game-ready files and enforces the art style. Owns `tools/`, `assets/` and the generated `public/assets/`. See steering `art-style.md`.

## Requirements

### 1. Sprite export
**User story:** As John, I want to save a `.ase` file in LibreSprite and have the game pick it up.
1. WHEN `npm run assets` runs THE pipeline SHALL export every `assets/src/**/*.ase` to `public/assets/<name>.png` (sprite sheet) and `public/assets/<name>.json` (frame rects, durations, tags).
2. IF LibreSprite's command line cannot export sheets THEN THE pipeline SHALL export per-frame PNGs and pack them itself, giving the same JSON shape.
3. THE JSON format SHALL be documented in `design.md` and consumed by lane B without changes.

### 2. SVG export
1. WHEN `npm run assets` runs THE pipeline SHALL copy `assets/src/**/*.svg` to `public/assets/`, removing editor metadata.

### 3. Style checks
**User story:** As John, I want off-style art caught before it ships.
1. IF any exported PNG pixel is not fully transparent and not in `assets/palette/bavis-21.gpl` THEN THE pipeline SHALL fail and list the file, the pixel coordinates and the colour.
2. IF any pixel has partial alpha (not 0 and not 255) THEN THE pipeline SHALL fail.
3. THE checks SHALL have property-based tests (random images inside and outside the palette).

### 4. Quantise tool (for the AI pixel-art test)
1. WHEN `npm run quantize -- <in.png> <out.png> [--width N]` runs THE tool SHALL resize with nearest-neighbour, map to bavis-21 with ordered (Bayer 4×4) dithering, and write a PNG that passes the style checks.

### 5. Hook
1. A Kiro hook SHALL run `npm run assets` when a file under `assets/src/` is saved, and report failures in the chat.
