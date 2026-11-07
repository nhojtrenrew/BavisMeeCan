# Requirements: webllm-bavis (lane D, spike)

## Introduction
Gives Bavis a voice using a tiny model running in the browser. This is a spike: find out which model runs on which devices, and record it. Owns `src/bavis/`. See steering `mobile-input.md`.

## Requirements

### 1. Opt-in load
1. WHEN the player presses "Summon Bavis" THE system SHALL show the model name and download size and ask for confirmation before downloading.
2. THE model SHALL load and run inside a Web Worker, showing progress in the page.
3. WHILE the model loads THE game SHALL stay fully playable.

### 2. Device fit
1. WHEN WebGPU is unavailable THE system SHALL skip the download and use canned Bavis lines, saying so once.
2. THE system SHALL try the model ladder smallest first (SmolLM2-135M-Instruct, SmolLM2-360M-Instruct, Qwen3-0.6B) and stop at the largest model the device's adapter limits allow.
3. IF model loading fails or runs out of memory THEN THE system SHALL fall back to the next smaller model, then to canned lines.

### 3. Output
1. WHEN Bavis speaks THE system SHALL generate one line of at most 120 characters, in character (ghostly, rude, PG-13).
2. THE system SHALL filter every line through a length cap and a PG-13 word list; IF a line fails THEN regenerate once, then use a canned line.
3. THE validator SHALL have property-based tests (no output, however long or odd, gets past the filter unchecked).

### 4. Findings
1. THE spike SHALL record in `docs/webllm-devices.md`: device, browser, model, load time, tokens per second, and whether it worked.
