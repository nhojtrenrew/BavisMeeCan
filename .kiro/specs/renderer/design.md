# Design: renderer (lane B)

Implements `requirements.md`. Owns `src/render/` (including `scale.ts` from lane 0).

## Files

| File | Job |
|---|---|
| `src/render/sheet-types.ts` | `SheetJson` type, copied from asset-pipeline `design.md` "Sheet JSON" |
| `src/render/sheet.ts` | `loadSheet(jsonUrl): Promise<Sheet>`; `drawFrame(ctx, sheet, i, x, y)` |
| `src/render/animator.ts` | Pure: `frameAt(sheet, tag, elapsedMs): number`; `Animator` class wrapping a clock |
| `src/render/sizes.ts` | Pure: `pickSize(distance, sizes): number` |
| `src/render/button.ts` | `SvgButton` on the canvas: three state images, hit-test, `onPress` |
| `src/render/hello.ts` | `startHelloScene(canvas): { stop() }`: the hello-world scene loop |
| `src/render/*.test.ts` | Vitest + fast-check (pure parts only) |

## Sheets
- `loadSheet` fetches the JSON, then the PNG named in `image`, resolved with `new URL(image, jsonUrl)` (works under `/BavisMeeCan/`).
- Load failure (JSON or PNG) → a `Sheet` whose frames draw as magenta `#FF00FF` rects of the frame size (size 32×32 if the JSON itself failed). Log the path once per URL (req 1.2).
- `drawFrame` rounds `x, y` to whole pixels; `imageSmoothingEnabled = false` is set once on the context.

## Frame-swap
- `frameAt`: walk the tag's frames summing `ms`; looping tags use `elapsed % total`; non-looping tags clamp to the last frame. Returns an index within `from..to`. No interpolation anywhere (req 2.2).
- `Animator` keeps its own elapsed time, advanced by `min(dt, 250)` per rAF tick, so a hidden tab coming back moves at most 250 ms, not a burst (req 2.3). Also resets `lastTime` on `visibilitychange`.

## Fixed sizes
`pickSize(distance, sizes)`: `sizes` is a list of `{ maxDistance, frame }` sorted ascending; returns the first whose `maxDistance >= distance`, else the last. Never scales a bitmap (req 3.1).

## Button
- Three images from `public/assets/<name>-normal.svg`, `-pressed.svg`, `-disabled.svg` (lane A output), drawn with `drawImage` at native size, whole-pixel position.
- Pointer coordinates → logical 640×480 using `canvas.getBoundingClientRect()`. Pointerdown inside → `pressed`; pointerup inside → `onPress()`; `disabled` ignores input.
- Missing SVG → magenta 54×34 placeholder.

## Hello scene (req 4)
`startHelloScene(canvas)` fills the backdrop with `#000080` (bavis-21 navy), draws the sprite sheet `assets/hello.json` animating its first tag at (40, 40), and a button `assets/button-*.svg` at (40, 400). Until John's art exists, both show magenta placeholders, which is the expected result for this lane. The lead calls it from `main.ts` at integration.

## Tests (fast-check)
- `frameAt`: any sheet, tag and elapsed ≥ 0 → index within the tag; non-looping at huge elapsed → last frame; elapsed 0 → `from`.
- `frameAt` is a step function: same elapsed twice → same index.
- `pickSize`: result always one of `sizes`; larger distance never gives a larger size.
- Button hit-test mapping: any canvas rect and point inside it → logical point within 0..640, 0..480.

## Out of scope
Scenes beyond hello world, layers, camera, text rendering.
