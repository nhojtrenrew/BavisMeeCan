---
inclusion: always
---
# Tech

| Concern | Choice | Notes |
|---|---|---|
| Language / build | TypeScript (strict) + Vite | Node 24 LTS. No framework (React etc.) unless a spec justifies it |
| Text and UI | Plain DOM + CSS | Typing line, menus, dialogs. Native focus and accessibility |
| Sprites / scenes | One `<canvas>` 2D context, 640×480 logical | `imageSmoothingEnabled = false`, CSS `image-rendering: pixelated`, whole-number scale only |
| Game engine | **None** for now | Add PixiJS or Phaser only through a spec that shows the need |
| In-game AI | `@mlc-ai/web-llm` in a **Web Worker** | Opt-in download; fallback to canned lines without WebGPU |
| Tests | Vitest + **fast-check** | Property-based tests for every pure logic module (scoring, input mapping, pipeline checks) |
| Hosting | GitHub Pages via GitHub Actions | Static only. **No backend**, no accounts, no analytics |
| Persistence | `localStorage`, wrapped in try/catch | Progress and settings only |
| Assets | LibreSprite (`.ase`) + Affinity (`.svg`) | Exported by `tools/` scripts into `public/assets/`; never hand-edit exports |

## Rules
- Pin exact dependency versions. Keep dependencies few; prefer platform APIs.
- Every module with branching logic ships at least one test.
- The site must work from a sub-path (`/BavisMeeCan/`): set Vite `base`, and never use absolute `/` asset URLs.
- Budget: first load (without the LLM) under 2 MB.
- Models: lead agent Claude Opus 5.5 (`claude-opus-5.5`), builder and verifier Claude Sonnet 5.5 (`claude-sonnet-5.5`). Don't use Auto.
- Log every Kiro feature use with the `kiro-log` skill (`.kiro/skills/kiro-log/SKILL.md`).
