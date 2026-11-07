# Requirements: renderer (lane B)

## Introduction
Draws scenes and animates sprites on the 640×480 canvas in the frame-swap style. Owns `src/render/`. Reads the sheet JSON defined in the asset-pipeline spec.

## Requirements

### 1. Sprite sheets
1. WHEN given a sheet PNG and its JSON THE renderer SHALL draw any frame at whole-pixel coordinates with smoothing disabled.
2. IF an asset fails to load THEN THE renderer SHALL draw a magenta placeholder of the frame's size and log the path once.

### 2. Frame-swap animation
**User story:** As a player, I want sprites to move like 1992 bitmaps: whole frames, no smoothing.
1. THE animator SHALL advance frames using each frame's duration from the JSON, looping or stopping per tag.
2. THE animator SHALL NOT interpolate position, scale or opacity between frames.
3. WHEN the tab is hidden and shown again THE animator SHALL resume without a burst of skipped frames.
4. Frame selection SHALL have property-based tests (any elapsed time maps to a valid frame index).

### 3. Fixed-size fake 3D
1. WHEN an object has N pre-drawn sizes THE renderer SHALL pick the size for a given distance from a lookup, never scaling the bitmap at run time.

### 4. Hello-world scene
1. THE scene SHALL show a backdrop colour from bavis-21, one animated sprite from lane A's output, and one SVG button with normal, pressed and disabled states.
