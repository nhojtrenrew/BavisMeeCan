---
inclusion: always
---
# Mobile input and on-device AI

## Soft keyboards
- Phone keyboards send `keydown` with `key: "Unidentified"` / keyCode 229. Read typed text from `beforeinput` / `input` on a focused, visually hidden `<input>`. Use `keydown` only for physical keys (Backspace, Enter, Escape).
- The keyboard opens only after a user tap: start with "Tap to begin". The same tap will unlock audio later.
- Set `autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"` and `inputmode="text"`, `enterkeyhint="done"`.
- The keyboard covers about half the screen: track `window.visualViewport` (`resize` / `scroll`) and keep the typing line visible above it.
- Physical-keyboard layouts differ: compare characters (`event.key` / input data), never `event.code`.
- Treat composition (`compositionstart` … `compositionend`) as one input; don't score half-composed text.

## WebLLM
- Needs WebGPU: Safari 26+ (iOS/iPadOS 26), Chrome 121+ Android, desktop Chrome/Edge. Firefox Android: fallback.
- Model ladder, smallest first: SmolLM2-135M-Instruct → SmolLM2-360M-Instruct → Qwen3-0.6B. 1B+ desktop only. Confirm IDs and sizes against WebLLM's `prebuiltAppConfig` at build time.
- **Opt-in only.** Show the download size (about 400 MB) before fetching. Run in a Web Worker. Never block play on it.
- Validate every generated line: length cap, PG-13 word filter, and for practice text, only the lesson's allowed keys. On failure, regenerate once, then use a canned line.
