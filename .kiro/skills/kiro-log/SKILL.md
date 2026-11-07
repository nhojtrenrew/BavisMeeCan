---
name: kiro-log
description: Append one row to docs/kiro-log.md after using any Kiro feature in Bavis MeeCan (spec, hook, steering, custom agent, skill, power, property-based test, MCP, Crew app, Crew workflow, cron). Use whenever such a feature was just used.
triggers: kiro log, log kiro feature, kiro-log, write-up evidence
---

# kiro-log

The Kiroween judges need proof that Kiro did the work. `docs/kiro-log.md` is that proof.

1. Open `docs/kiro-log.md`. Add one row at the end of the `## Log` table:
   `| YYYY-MM-DD | <surface> | <feature> | <what it did, one sentence> |`
2. Surface is one of: `Kiro IDE`, `Kiro CLI`, `Kiro Web`, `Crew dashboard`, `Crew CLI`, `Kiro hook`, `Crew skill`, `Crew workflow`.
3. Name the agent and model when an agent did the work (e.g. `bavis-builder (claude-sonnet-5.5)`).
4. One row per feature use. Never rewrite or delete old rows; correct with a new row.
5. Commit the log with the work it describes, not on its own.
