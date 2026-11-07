# Design: asset-pipeline (lane A)

Implements `requirements.md`. Owns `tools/`, `assets/src/` layout and the generated `public/assets/`.

## Files

| File | Job |
|---|---|
| `tools/assets.ts` | `npm run assets`: export every `.ase`, clean every `.svg`, run the style check, exit 1 on any failure |
| `tools/quantize.ts` | `npm run quantize -- <in.png> <out.png> [--width N]` |
| `tools/palette.ts` | Pure: `loadGpl(text)`, `checkPixels(rgba, w, h, palette)`, `nearest(...)`, `bayer4` |
| `tools/sheet.ts` | Pure: `toSheetJson(libresprite json, tags)` and `packFrames(frames)` (fallback) |
| `tools/svg.ts` | Pure: `cleanSvg(text)` |
| `tools/*.test.ts` | Vitest + fast-check |

Scripts run with Node 24's built-in TypeScript type stripping (`node tools/assets.ts`), so no build step and no `tsx`. Imports use `.ts` extensions. Only erasable syntax (no `enum`, no parameter properties).

## Shared changes (lead makes these on `main` before the lane starts)
- `package.json`: `"assets": "node tools/assets.ts"`, `"quantize": "node tools/quantize.ts"`; dev deps `pngjs 7.0.0`, `@types/pngjs 6.0.5`, `@types/node 24.19.2`.
- `vite.config.ts`: test `include` adds `tools/**/*.test.ts`.
- `tsconfig.json`: include `tools`, add `allowImportingTsExtensions`, types add `node`.

## Sheet JSON (the contract with lane B)

`public/assets/<name>.json`, beside `<name>.png`:

```json
{
  "image": "<name>.png",
  "size": { "w": 368, "h": 49 },
  "frames": [ { "x": 0, "y": 0, "w": 92, "h": 49, "ms": 100 } ],
  "tags": [ { "name": "tick", "from": 0, "to": 6, "loop": true } ]
}
```

- `frames` in timeline order; `x, y, w, h` whole pixels inside the sheet; `ms` ≥ 1.
- `tags`: `from`/`to` inclusive frame indexes. No tags in the source → one tag `"all"` covering every frame, `loop: true`.
- Tag loop: a LibreSprite tag named `*-once` (e.g. `die-once`) gets `loop: false`, name without the suffix. Everything else loops. Ping-pong is out of scope.
- `image` is a file name, not a path: lane B resolves it next to the JSON.

The TypeScript type lives in `src/render/sheet-types.ts` (lane B's folder, written by lane B from this section). Lane A keeps its own copy in `tools/sheet.ts`; the verifier checks they match.

## Export path

1. `libresprite -b <file>.ase --sheet <tmp>.png --data <tmp>.json --format json-array --list-tags`
2. `toSheetJson` maps LibreSprite's `frames[].frame` / `duration` / `meta.frameTags` to the shape above.
3. If step 1 fails or gives no sheet (req 1.2): `libresprite -b <file>.ase --save-as <tmp>/{frame}.png`, then `packFrames` lays the frames in one row, same JSON shape.
4. Style check the PNG, then write both files to `public/assets/`.

LibreSprite path: `LIBRESPRITE` env var, else `libresprite` on PATH. Not found → clear error naming both.

## SVG
`cleanSvg` removes `<metadata>`, `<sodipodi:*>`, editor namespaces (`serif`, `inkscape`, `sodipodi`) and their attributes, and XML comments. String/regex based, no SVGO. Button states are three files: `<name>-normal.svg`, `<name>-pressed.svg`, `<name>-disabled.svg`.

## Style check
`checkPixels` returns a list of `{ x, y, rgba }` failures: alpha 0 passes; alpha 255 with RGB in the palette passes; anything else fails (req 3.1, 3.2). `assets.ts` prints up to 20 per file plus a count, then exits 1.

## Quantize
Nearest-neighbour resize to `--width` (height keeps aspect, rounded), then for each pixel: alpha < 128 → transparent; else add the Bayer 4×4 threshold offset (±32 per channel) and pick the nearest palette colour by squared RGB distance. Output passes `checkPixels` by construction (tested).

## Tests (fast-check)
- Random images built only from palette colours + alpha 0 → no failures.
- Inject one off-palette or partial-alpha pixel at a random spot → exactly that spot reported.
- `quantize` of any random RGBA image → passes `checkPixels`.
- `toSheetJson`: random frame lists → every rect inside `size`, tags inside frame range.
- `cleanSvg`: output has no `serif:`/`inkscape:`/`<metadata`; a clean SVG is unchanged.

## Hook (req 5)
Already in `.kiro/hooks/asset-export.kiro.hook`. The lane just checks it fires once `npm run assets` works.

## Out of scope
Audio, fonts, ping-pong tags, texture atlases across files.
