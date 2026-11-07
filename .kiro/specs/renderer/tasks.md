# Tasks: renderer (lane B)

bavis-builder on `feature/renderer`. Touch only `src/render/`.

- [x] 1. Sheet type and loader
  - `sheet-types.ts` (match asset-pipeline `design.md` exactly), `sheet.ts` with magenta fallback
  - _Requirements: 1.1, 1.2_

- [x] 2. Animator
  - `frameAt` + `Animator` with the 250 ms catch-up cap; property tests
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Fixed sizes
  - `pickSize` + property tests
  - _Requirements: 3.1_

- [x] 4. SVG button
  - `button.ts`: three states, hit-test, placeholder; property test on the coordinate mapping
  - _Requirements: 4.1_

- [x] 5. Hello scene
  - `hello.ts` `startHelloScene(canvas)`; shows placeholders until art exists
  - _Requirements: 4.1_

- [x] 6. Log and hand off
  - Rows in `docs/kiro-log.md` (property-based tests); push the branch; ask bavis-verifier to check it
