import './typing.css';
import { createInput } from './input';
import { applyInput, initLine, statuses, type LineState } from './line';
import { report, tally } from './score';

export function mountTypingLine(host: HTMLElement, sentence: string): { destroy(): void } {
  const root = document.createElement('div');
  root.className = 'typing-line';
  const text = document.createElement('div');
  text.className = 'typing-text';
  const stats = document.createElement('div');
  stats.className = 'typing-stats';
  stats.setAttribute('aria-live', 'polite');
  const hint = document.createElement('div');
  hint.className = 'typing-hint';
  root.append(text, stats, hint);
  host.appendChild(root);

  let state: LineState = initLine(sentence);
  let start = 0;
  const spans = [...sentence].map((c) => {
    const s = document.createElement('span');
    s.textContent = c;
    text.appendChild(s);
    return s;
  });

  const render = () => {
    const st = statuses(state);
    spans.forEach((s, i) => {
      s.className = st[i] + (i === state.cursor && !state.finished ? ' cursor' : '');
    });
    const r = report(tally(state.log));
    stats.textContent = `${Math.round(r.netWpm)} WPM | ${Math.round(r.accuracy)}% accuracy`;
    hint.textContent = state.finished
      ? 'Done! Press Enter or tap to retry'
      : state.cursor === 0 ? 'Tap to begin' : '';
  };

  const now = () => {
    if (!start) start = performance.now();
    return performance.now() - start;
  };
  const retry = () => { state = initLine(sentence); start = 0; render(); };

  const input = createInput(root, root, {
    onChar: (char) => { state = applyInput(state, { kind: 'char', char, t: now() }); render(); },
    onBackspace: () => { state = applyInput(state, { kind: 'backspace', t: now() }); render(); },
    onEnter: () => { if (state.finished) retry(); },
    onEscape: () => {},
  });
  // Tap on a finished line retries (and keeps the keyboard open).
  const onTap = () => { if (state.finished) retry(); input.relayout(); };
  root.addEventListener('pointerdown', onTap);
  render();

  return {
    destroy() {
      root.removeEventListener('pointerdown', onTap);
      input.destroy();
      root.remove();
    },
  };
}
