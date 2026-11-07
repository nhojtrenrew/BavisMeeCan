# Handoff: starting Bavis MeeCan in Kiro Crew

How to open this repo in Kiro Crew and start the hello-world build. Context: `.kiro/steering/` (product, tech, structure, art style, mobile input) and `.kiro/specs/*/requirements.md` (five lanes). Both were drafted before the build. `design.md` and `tasks.md` are left for Kiro to generate.

## 1. One-time setup (John)

- [ ] Kiro CLI + Kiro Crew desktop installed and signed in; Kiro credits requested (by Dec 1, noon PT).
- [ ] Node.js 22 LTS, git, `gh` (`gh auth login` as nhojtrenrew).
- [ ] GitHub repo → Settings → Pages → Source: **GitHub Actions**.
- [ ] LibreSprite installed. Check: `libresprite --help` lists `--sheet` and `--data`. Note the result in `docs/kiro-log.md`.

## 2. Crew workspace folder

| Field | Value |
|---|---|
| Parent | `Kiroween 2026` (no project directory; holds this and any later Crew-app repo) |
| Name | `Bavis MeeCan` |
| Project directory | `C:\HomeLab\BavisMeeCan` (loads `.kiro/steering/` for every chat) |
| Additional steering | none |
| Default agent | `kirocrew` at first, then `bavis-lead` once created (step 4) |
| Tags | defaults (Planned / ToDo / Implementation / Review / Done) |

## 3. Knowledge and lessons

**Knowledge** (sidebar → add local folder). These stay on the machine and are **never committed**:
- `C:\Users\jcwer\Documents\_tWt\7 - AI\PROJECTS\Old PC\_restored\Mavis v2 reference` (README, contact sheets, help-manual PDF; copyrighted, for study only)
- `C:\Users\jcwer\Documents\_tWt\7 - AI\PROJECTS\_HomeLab\Projects\Hackathons` (rules diff, winners report, setup spec)

**Lessons** (run once):
```
kirocrew learn add "Never copy or commit files from the Mavis v2 reference folder; study it for sizes, palette and technique only"
kirocrew learn add "Every sprite pixel must be in assets/palette/bavis-21.gpl or fully transparent"
kirocrew learn add "After using any Kiro feature (spec, hook, steering, custom agent, power, property-based test, MCP, Crew workflow), append a line to docs/kiro-log.md"
kirocrew learn add "Builders only touch their own lane's folder; src/main.ts, index.html, package.json, vite.config.ts and .kiro/steering belong to the lead"
```

## 4. Agents

Create these as Kiro custom agents (ask Kiro to create them; that's evidence for the write-up). Pick models explicitly, never Auto.

| Agent | Model | Prompt summary |
|---|---|---|
| `bavis-lead` | Claude Opus 5.5 | Owns the specs and steering. Generates `design.md` + `tasks.md` per spec, runs lane 0, assigns lanes A–D to builders, merges `feature/*` branches after the verifier passes them, keeps `docs/kiro-log.md` current |
| `bavis-builder` | Claude Sonnet 5.5 | Implements one spec's `tasks.md` on `feature/<spec>`, only in that lane's folder, with tests. Asks the lead for changes to shared files |
| `bavis-verifier` | Claude Sonnet 5.5 | Read-mostly. Runs `npm test` and `npm run build`, checks the spec's acceptance criteria and the steering rules (palette, no reference assets, mobile input), and reports pass/fail with reasons. Doesn't write features |

Keep the Crew agent backend on **Kiro CLI** (the default).

## 5. Run order

1. **Lead, alone:** `skeleton` spec. Generate design and tasks, build, push to `main`, and confirm the Pages URL loads on desktop and phone.
2. **Four builders in parallel**, one per spec: `asset-pipeline`, `renderer`, `typing-core`, `webllm-bavis`. Use a Crew workflow (fan-out, then judge with the verifier) if it's available; otherwise four sessions.
3. **Lead:** integrate in `src/main.ts`, verifier pass, deploy, test on a real phone.
4. John draws the first LibreSprite sprite and an Affinity button. The asset hook should pick them up on save.

## 6. First message to the lead

> You are bavis-lead for Bavis MeeCan (Kiroween 2026). Read every file in .kiro/steering and the five .kiro/specs/*/requirements.md. Start with the `skeleton` spec: generate design.md and tasks.md, show them to me for approval, then implement. Log each Kiro feature you use in docs/kiro-log.md. Don't start lanes A–D until skeleton is on main and the Pages URL works.
