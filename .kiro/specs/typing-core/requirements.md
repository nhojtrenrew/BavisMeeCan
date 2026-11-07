# Requirements: typing-core (lane C)

## Introduction
Accepts typing on physical and phone keyboards and scores it. Owns `src/typing/`. See steering `mobile-input.md`. Pure logic is kept apart from DOM code so it can be property-tested.

## Requirements

### 1. Input
**User story:** As a player on a laptop or phone, I want my keystrokes counted correctly.
1. WHEN the player taps or clicks the typing area THE system SHALL focus a visually hidden input so the phone keyboard opens.
2. THE system SHALL read characters from `beforeinput`/`input` events, and SHALL use `keydown` only for Backspace, Enter and Escape.
3. WHILE an IME composition is active THE system SHALL NOT score the partial text.
4. WHEN the soft keyboard opens or closes THE system SHALL keep the typing line visible above it, using `visualViewport`.
5. THE input SHALL disable autocorrect, autocapitalise, autocomplete and spellcheck.

### 2. Scoring
1. THE scorer SHALL report gross WPM (characters ÷ 5 per minute), net WPM, accuracy % and errors per key.
2. Property-based tests SHALL cover: accuracy stays between 0 and 100; perfect input gives 100%; WPM is never negative; scoring the same keystroke log twice gives identical results; splitting a session into chunks and merging gives the same totals as scoring it whole.

### 3. Hello-world typing line
1. THE system SHALL show one target sentence, highlight each character as correct, wrong or pending, and show live WPM and accuracy.
2. WHEN the sentence is complete THE system SHALL show the final score and offer to retry.
