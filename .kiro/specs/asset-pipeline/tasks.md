# Tasks: asset-pipeline (lane A)

bavis-builder on `feature/asset-pipeline`. Touch only `tools/`, `assets/src/`, `public/assets/`. Shared-file changes in `design.md` are already on `main`.

- [x] 1. Palette check
  - `tools/palette.ts`: `loadGpl`, `checkPixels`; tests with random palette / off-palette images
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 2. Sheet JSON
  - `tools/sheet.ts`: `toSheetJson`, `packFrames`; property tests on rects and tags
  - Run LibreSprite once on a tiny test `.ase` to confirm its JSON field names; note them in a code comment
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. SVG clean
  - `tools/svg.ts`: `cleanSvg` and its tests
  - _Requirements: 2.1_

- [x] 4. `npm run assets`
  - `tools/assets.ts`: walk `assets/src/`, export, clean, check, write `public/assets/`, exit 1 on failure
  - Test fixture: a tiny palette-only `.ase` in `assets/src/test/` made by you in LibreSprite (no reference art)
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 5. Quantize tool
  - `tools/quantize.ts` + property test that output always passes `checkPixels`
  - _Requirements: 4.1_

- [x] 6. Hook and log
  - Save the fixture `.ase`; confirm the asset-export hook runs; rows in `docs/kiro-log.md` (property-based tests, hook)
  - Push the branch; ask bavis-verifier to check it
  - _Requirements: 5.1_
