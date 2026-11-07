# Tasks: webllm-bavis (lane D, spike)

bavis-builder on `feature/webllm-bavis`. Touch only `src/bavis/` and `docs/webllm-devices.md`. `@mlc-ai/web-llm` is already in `package.json` on `main`.

- [ ] 1. Validator and canned lines
  - `validate.ts`, `canned.ts`; property tests (nothing gets past unchecked; all canned lines pass)
  - _Requirements: 3.2, 3.3_

- [ ] 2. Ladder
  - `ladder.ts`: confirm ids in `prebuiltAppConfig`; `pickModels`; tests
  - _Requirements: 2.1, 2.2_

- [ ] 3. Worker
  - `worker.ts`: load with progress, fallback on failure, generate one line
  - _Requirements: 1.2, 2.3, 3.1_

- [ ] 4. Summon UI
  - `summon.ts` `mountSummon(host)`: confirm with size, progress, no-WebGPU message, output, regenerate-once
  - Check the build: web-llm only in the worker chunk; main chunk stays small
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.2_

- [ ] 5. Findings and hand off
  - `docs/webllm-devices.md` with the table and one desktop row
  - Rows in `docs/kiro-log.md` (property-based tests); push the branch; ask bavis-verifier to check it
  - _Requirements: 4.1_
