# Tasks: skeleton (lane 0, lead)

Done by bavis-lead alone, on `main`. Lanes A–D wait until task 6 passes.

- [x] 1. Project files
  - `package.json` with the four scripts and exact-pinned dev deps from `design.md`; `npm install`; commit `package-lock.json`
  - `tsconfig.json` (strict, `noEmit`, `moduleResolution: bundler`, DOM libs)
  - `vite.config.ts` with `base: '/BavisMeeCan/'`
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Scale function and its tests
  - `src/render/scale.ts`: `fitScale(vw, vh)`
  - `src/render/scale.test.ts`: the four fast-check properties in `design.md`
  - `npm test` passes
  - _Requirements: 2.1, 2.2_

- [x] 3. Page shell
  - `index.html`: black body, centred 640×480 canvas, start prompt div
  - `src/main.ts`: apply scale, rAF-batched rescale on resize / `visualViewport` / rotate, `firstGesture` promise that hides the prompt
  - `npm run dev` shows it; `npm run build` passes
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 4. Pages workflow
  - `.github/workflows/pages.yml`: checkout → Node 24 → `npm ci` → `npm test` → `npm run build` → upload → deploy
  - _Requirements: 3.1, 3.2_

- [x] 5. Log and push
  - Rows in `docs/kiro-log.md` for this spec (design, tasks, property-based test)
  - Commit and push to `main` (commit and push as separate commands)
  - _Requirements: 4.1_

- [ ] 6. Live check (John)
  - Actions run is green
  - The Pages URL loads on desktop Chrome and a real phone; prompt shows; rotating rescales; pixels stay sharp
  - Then the lead starts lanes A–D
  - _Requirements: 2, 3_
