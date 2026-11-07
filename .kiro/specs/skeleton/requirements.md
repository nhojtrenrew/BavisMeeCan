# Requirements: skeleton (lane 0, lead, runs first)

## Introduction
The empty app every other lane builds on: Vite + TypeScript project, a 640×480 canvas page, a test runner, and an automatic deploy to GitHub Pages. Nothing in lanes A–D starts until this is merged to `main`. `design.md` and `tasks.md` are generated in Kiro from this file.

## Requirements

### 1. Project
**User story:** As the developer, I want a minimal TypeScript project, so that every lane starts from the same base.
1. THE project SHALL use Vite and TypeScript in strict mode with exact-pinned dependency versions.
2. THE project SHALL provide `npm run dev`, `npm run build`, `npm test` (Vitest + fast-check) and `npm run assets` (a placeholder until lane A).
3. THE build SHALL use the base path `/BavisMeeCan/`.

### 2. Page shell
**User story:** As a player, I want the game to fill my screen correctly on any device.
1. WHEN the page loads THE system SHALL show a 640×480 logical canvas scaled by the largest whole number that fits the viewport, centred and letterboxed in black.
2. IF the viewport is smaller than 640×480 THEN THE system SHALL scale the canvas down to fit (the one allowed fractional scale) and keep pixels sharp with `image-rendering: pixelated`.
3. WHEN the viewport resizes or rotates THE system SHALL rescale within one animation frame.
4. THE page SHALL show "Tap or press any key to begin" until the first user gesture.

### 3. Deploy
**User story:** As John, I want every push to `main` live on Pages.
1. WHEN a commit lands on `main` THE GitHub Actions workflow SHALL run the tests, build, and deploy `dist/` to GitHub Pages.
2. IF the tests fail THEN THE workflow SHALL NOT deploy.

### 4. Kiro evidence
1. THE lead SHALL add an entry to `docs/kiro-log.md` for each Kiro feature used in this lane.
