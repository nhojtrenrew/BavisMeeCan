# Kiro log

Evidence for the Kiroween write-up: one line per use of a Kiro feature. Format: `date | surface (IDE / CLI / Web / Crew) | feature | what it did`.

## Disclosure: work before the Kiro build

- 2026-11-07 | none (Claude Code, outside Kiro) | planning | Drafted `.kiro/steering/*.md`, `.kiro/specs/*/requirements.md`, `docs/handoff.md`, this file and `assets/palette/bavis-21.gpl` (colour list measured from a local, uncommitted 1992 reference). No application code. All code is written in Kiro from here on.

## Log

| Date | Surface | Feature | What it did |
|---|---|---|---|
| 2026-11-07 | Crew dashboard | Crew Knowledge | Added two local Knowledge sources: Mavis v2 reference and Hackathons folder (reference material, never committed) |
| 2026-11-07 | Crew CLI | Crew lessons | Added four project lessons with `kirocrew learn add` (palette rule, reference rule, log rule, lane ownership rule) |
| 2026-11-07 | Crew CLI + .kiro/agents/ | Custom agents | Created bavis-lead (claude-opus-4-5), bavis-builder (claude-sonnet-4-5), bavis-verifier (claude-sonnet-4-5) with workspace-level agent specs in .kiro/agents/ |
