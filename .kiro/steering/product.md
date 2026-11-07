---
inclusion: always
---
# Product: Bavis MeeCan

A weird, PG-13 browser-game homage to 1992 Windows 3.1 typing edutainment, built for **Kiroween 2026** (Devpost, category **Resurrection**). Solo project by John. Deadline: **Dec 4 2026, 2:00 pm PT**, no extensions.

## What it is
- A **new kind of typing game**, executed in the art style and techniques of early-90s Windows edutainment (640×480, 16-colour VGA, dithering, frame-swap sprites).
- **Bavis MeeCan** is an original character: a ghostly, slightly unhinged typing teacher. He is not a copy of any real product's mascot or of a real person.
- Bavis talks through a tiny **in-browser LLM** (WebLLM). The game must still be fully playable without it.
- Runs free on **GitHub Pages**. Desktop first, **mobile supported** (soft keyboard).

## Hard rules
- **Original work only.** Never copy art, sound, text, lesson content or minigame designs from Mavis Beacon or any other existing game. The 1992 reference is for studying sizes, palette and technique only, and it never enters this repo.
- **All code is new**, written from Oct 30 2026 on. Disclose anything pre-existing in `docs/kiro-log.md`.
- **Kiro must visibly do the work.** Specs per feature, steering, hooks, custom agents, property-based tests, and log each use in `docs/kiro-log.md`. Insufficient use of Kiro disqualifies the entry.
- PG-13: spooky and rude is fine; no slurs, sexual content or gore.

## Current milestone: hello world (pipeline proof)
Done when a public Pages URL, on desktop Chrome **and** a real phone:
1. Shows a 640×480 logical canvas, integer-scaled, pixelated and letterboxed.
2. Animates one LibreSprite sprite by John, exported by the asset pipeline, in the bavis-21 palette.
3. Shows one Affinity SVG UI element (a button in normal, pressed and disabled states).
4. Has a typing line that accepts physical and soft keyboards, with live WPM and accuracy (property-based tests).
5. Has a "Summon Bavis" button that loads the smallest working WebLLM model in a Worker and prints one generated line, with canned lines as the fallback.
6. Has `.kiro/` committed and `docs/kiro-log.md` up to date.

The actual game design comes **after** this milestone. Sound is deferred.
