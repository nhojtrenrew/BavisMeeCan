# Tasks: typing-core (lane C)

bavis-builder on `feature/typing-core`. Touch only `src/typing/`.

- [x] 1. Scoring
  - `score.ts`: `tally`, `mergeTally`, `report`; the five property tests from requirement 2.2
  - _Requirements: 2.1, 2.2_

- [x] 2. Line state
  - `line.ts`: `applyInput`; property tests on cursor and finish
  - _Requirements: 3.1, 3.2_

- [x] 3. Input
  - `input.ts`: hidden input, `beforeinput`/`input`, composition guard, Enter/Escape, `visualViewport`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 4. View
  - `view.ts` + `typing.css`: `mountTypingLine(host, sentence)` with live stats and retry
  - _Requirements: 3.1, 3.2_

- [ ] 5. Log and hand off
  - Rows in `docs/kiro-log.md` (property-based tests); push the branch; ask bavis-verifier to check it
