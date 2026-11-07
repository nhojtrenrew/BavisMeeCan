# Design: skeleton (lane 0, lead)

Implements `requirements.md`. The smallest base every lane can build on. No game code.

## Files

| File | Owner after lane 0 | Job |
|---|---|---|
| `package.json` | lead | Scripts and exact-pinned dev dependencies |
| `tsconfig.json` | lead | Strict TypeScript, `noEmit` (Vite builds, `tsc` only type-checks) |
| `vite.config.ts` | lead | `base: '/BavisMeeCan/'`, Vitest config inline |
| `index.html` | lead | Black page, one `<canvas width=640 height=480>`, the start prompt |
| `src/main.ts` | lead | Boot: apply scale, watch resizes, wait for first gesture |
| `src/render/scale.ts` | renderer (lane B) | Pure `fitScale(vw, vh)`; lead writes it now, lane B owns it after |
| `src/render/scale.test.ts` | renderer (lane B) | Property-based tests for `fitScale` |
| `.github/workflows/pages.yml` | lead | Test, build, deploy `dist/` to Pages |

No `tools/` folder yet: `npm run assets` is an inline placeholder until lane A replaces it.

## Dependencies (dev only, exact pins)

| Package | Version | Why |
|---|---|---|
| `vite` | 8.3.6 | Dev server and build |
| `typescript` | 7.0.2 | Strict type-check (`tsc --noEmit`) |
| `vitest` | 5.1.0 | Test runner |
| `fast-check` | 4.10.2 | Property-based tests |

Versions are the current npm releases on 2026-11-07. Runtime dependencies: none. `package-lock.json` is committed.

## Scripts

| Script | Command |
|---|---|
| `dev` | `vite` |
| `build` | `tsc --noEmit && vite build` |
| `test` | `vitest run` |
| `assets` | `node -e "console.log('assets: placeholder until lane A')"` |

## Scaling (requirement 2)

`fitScale(vw, vh)` returns the CSS scale for the 640×480 canvas:

- `n = floor(min(vw / 640, vh / 480))`
- `n >= 1` → return `n` (whole number, req 2.1)
- `n < 1` → return `min(vw / 640, vh / 480)` (the one fractional case, req 2.2)

`main.ts` sets the canvas CSS size to `640·s × 480·s`. The canvas buffer stays 640×480. CSS: `image-rendering: pixelated`, body black, flex-centred, so the spare space is the letterbox.

Viewport size comes from `window.visualViewport` when present, else `innerWidth/innerHeight`. Resize, `visualViewport` resize and `orientationchange` all schedule one `requestAnimationFrame` that re-applies the scale (req 2.3). Several events in one frame cost one rescale.

## Start prompt (requirement 2.4)

A DOM `<div>` over the canvas: "Tap or press any key to begin". The first `pointerdown` or `keydown` removes it and resolves `firstGesture` (a promise exported from `main.ts`). Later lanes use that same gesture to open the soft keyboard and unlock audio.

## Deploy (requirement 3)

`.github/workflows/pages.yml`, on push to `main` and on manual run:

1. `actions/checkout`, `actions/setup-node` (Node 24, npm cache)
2. `npm ci`
3. `npm test` → a failure stops the job, so nothing deploys (req 3.2)
4. `npm run build`
5. `actions/upload-pages-artifact` (`dist/`) → `actions/deploy-pages`

Permissions: `pages: write`, `id-token: write`, `contents: read`. One concurrency group so two pushes never deploy at once.

## Tests

`scale.test.ts` (fast-check), for any `vw, vh` in 1…8000:

- the scaled canvas always fits: `640·s <= vw` and `480·s <= vh`
- when the viewport fits 640×480, `s` is a whole number ≥ 1
- `s` is the largest such whole number: `s + 1` would not fit
- when the viewport is smaller, `s < 1` and one side fills exactly

The DOM wiring in `main.ts` has no branches worth a unit test; it is checked by hand on desktop and phone.

## Done check

- `npm test` and `npm run build` pass locally.
- The Actions run is green and [the Pages URL](https://nhojtrenrew.github.io/BavisMeeCan/) shows a black page with the prompt on desktop Chrome and a real phone; rotating the phone rescales.
- `docs/kiro-log.md` has rows for this spec.
