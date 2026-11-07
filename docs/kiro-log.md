# Kiro log

Evidence for the Kiroween write-up: one line per use of a Kiro feature. Format: `date | surface (IDE / CLI / Web / Crew) | feature | what it did`.

## Disclosure: work before the Kiro build

- 2026-11-07 | Claude desktop (outside Kiro) | preliminary planning | Drafted `.kiro/steering/*.md`, `.kiro/specs/*/requirements.md`, `docs/handoff.md`, this file, `assets/palette/bavis-21.gpl` (colour list measured from a local, uncommitted 1992 reference) and the first text of the three `.kiro/agents/*.md` prompts. No application code.
- From 2026-11-07 the build runs inside **Kiro Crew** (agents on Claude Opus 5.5 / Sonnet 5.5 through Crew's Claude agent backend) and the **Kiro IDE**. All application code is written there.

## Log

| Date | Surface | Feature | What it did |
|---|---|---|---|
| 2026-11-07 | Crew dashboard | Crew Knowledge | Added two local Knowledge sources: Mavis v2 reference and Hackathons folder (reference material, never committed) |
| 2026-11-07 | Crew CLI | Crew lessons | Added four project lessons with `kirocrew learn add` (palette rule, reference rule, log rule, lane ownership rule) |
| 2026-11-07 | Crew CLI | Custom agents | Registered the `.kiro/agents/` prompts as Crew members bavis-lead (claude-opus-5.5), bavis-builder and bavis-verifier (claude-sonnet-5.5), each with its own workspace and memory store |
| 2026-11-07 | Crew CLI | Model pinning | Set Crew's fallback model to claude-sonnet-5.5 so no session ever drops to Auto |
| 2026-11-07 | Crew CLI | Crew apps | Enabled Spec Builder (design + tasks per spec), Workflows (parallel lanes + verifier) and Code Review Sage (PR review) |
| 2026-11-07 | Kiro hook | Hook | Added `.kiro/hooks/asset-export.kiro.hook`: saving a `.ase` or `.svg` in `assets/src/` asks the agent to run `npm run assets` and report palette failures |
| 2026-11-07 | Crew skill | Skill | Added `.kiro/skills/kiro-log/SKILL.md` so every agent logs Kiro feature use in one format |
| 2026-11-07 | Crew dashboard | Setup check | bavis-lead (claude-opus-5.5) installed LibreSprite 1.3 (portable, on user PATH); `libresprite --help` lists `--batch`, `--sheet` and `--data`, so lane A can export headless |
| 2026-11-07 | Crew dashboard | Spec | bavis-lead (claude-opus-5.5) generated `.kiro/specs/skeleton/design.md` and `tasks.md` from its requirements, for John's approval |
| 2026-11-07 | Crew dashboard | Spec (tasks) | bavis-lead (claude-opus-5.5) ran skeleton tasks 1–5 after John approved: Vite + TS project, page shell, Pages workflow |
| 2026-11-07 | Crew dashboard | Property-based test | bavis-lead (claude-opus-5.5) added fast-check properties for `fitScale` (always fits, largest whole scale, fractional only when smaller) |
| 2026-11-07 | Crew dashboard | Spec (tasks) | Skeleton task 6 passed: John confirmed the Pages URL on desktop Chrome and a real phone; lanes A–D unblocked |
| 2026-11-07 | Crew dashboard | Spec | bavis-lead (claude-opus-5.5) generated design.md and tasks.md for asset-pipeline, renderer, typing-core and webllm-bavis, fixing the shared sheet JSON and module entry points so the four lanes can run in parallel; awaiting John's approval |
| 2026-11-07 | Crew dashboard | Spec | John approved the four lane designs; bavis-lead (claude-opus-5.5) made the shared changes on main (scripts, pinned deps, test and tsconfig paths) before fan-out |
