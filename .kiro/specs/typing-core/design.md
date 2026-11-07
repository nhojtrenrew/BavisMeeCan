# Design: typing-core (lane C)

Implements `requirements.md`. Owns `src/typing/`. Follows steering `mobile-input.md`. Pure scoring is split from DOM code.

## Files

| File | Job |
|---|---|
| `src/typing/score.ts` | Pure: `tally`, `mergeTally`, `report` |
| `src/typing/line.ts` | Pure: `applyInput(state, event)` → new state (target, typed chars, cursor) |
| `src/typing/input.ts` | DOM: hidden `<input>`, event wiring, composition guard, `visualViewport` |
| `src/typing/view.ts` | DOM: `mountTypingLine(host, sentence): { destroy() }` |
| `src/typing/typing.css` | Styles for the line, imported by `view.ts` |
| `src/typing/*.test.ts` | Vitest + fast-check |

## Keystroke log
```ts
type Keystroke = { t: number; expected: string; typed: string }   // t = ms since start; typed '' = Backspace
type Tally = { chars: number; correct: number; errors: number; errorsByKey: Record<string, number>; firstT: number; lastT: number }
type Report = { grossWpm: number; netWpm: number; accuracy: number; errorsByKey: Record<string, number> }
```
- `tally(log)` counts typed characters (Backspace adds nothing), correct ones, errors per expected key.
- `mergeTally(a, b)` adds counts, takes `min(firstT)`, `max(lastT)`. `tally(a ++ b) == mergeTally(tally(a), tally(b))` (req 2.2 split property).
- `report(tally)`: minutes = `(lastT - firstT) / 60000`, floored at 1 s to avoid a divide-by-zero spike; gross = `chars / 5 / minutes`; net = `max(0, gross - errors / minutes)`; accuracy = `chars ? 100 · correct / chars : 100`.

## Input (req 1)
- One hidden `<input>` (`position: fixed; opacity: 0; width: 1px; height: 1px`, not `display: none`) with `autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text" enterkeyhint="done"`.
- Tap/click on the line → `input.focus()` (req 1.1).
- `beforeinput`: `insertText` → each character of `data` becomes a keystroke; `deleteContentBackward` → Backspace; `preventDefault()` so the input stays empty. Fallback: `input` event reads and clears `value` (browsers that don't cancel `beforeinput`).
- `keydown` handles only Enter (retry when finished) and Escape (blur) (req 1.2). Backspace comes through `beforeinput` on every browser we target; `keydown` Backspace is used only if `beforeinput` didn't fire for it.
- `compositionstart` sets a flag; nothing is scored until `compositionend`, whose `data` is then applied as one input (req 1.3).
- Characters are compared by value, never `event.code`.
- `visualViewport` `resize`/`scroll` → move the line's container so its bottom sits above `visualViewport.height + offsetTop` (req 1.4).

## View (req 3)
- One `<span>` per target character with class `pending | ok | bad`; cursor on the next one.
- Live WPM and accuracy under the line, updated per keystroke (no timer).
- Sentence finished → final report + "Press Enter or tap to retry".
- Font: monospace for now; pixel font comes later with the art lane.
- Mounted into a host element the lead places over the canvas at integration.

## Tests (fast-check)
On random keystroke logs:
- accuracy in 0..100; all-correct logs → 100
- gross and net WPM ≥ 0, finite
- `report(tally(log))` deterministic
- split at any index: `tally(log) == mergeTally(tally(head), tally(tail))`
- `applyInput`: cursor stays in 0..length; typing the whole target with no errors → finished, all `ok`

## Out of scope
Lessons, word lists, key heatmap UI, sound.
