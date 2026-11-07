export type InputHandlers = {
  onChar(char: string): void;
  onBackspace(): void;
  onEnter(): void;
  onEscape(): void;
};

/**
 * Hidden <input> that feeds typed text to the handlers (steering: mobile-input.md).
 * Text comes from beforeinput/input; keydown is used only for Backspace (fallback), Enter, Escape.
 * `keepVisible` is shifted up while the soft keyboard covers it (visualViewport).
 */
export function createInput(tapTarget: HTMLElement, keepVisible: HTMLElement, h: InputHandlers) {
  const input = document.createElement('input');
  input.type = 'text';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('inputmode', 'text');
  input.setAttribute('enterkeyhint', 'done');
  input.setAttribute('aria-label', 'Typing input');
  Object.assign(input.style, { position: 'fixed', opacity: '0', width: '1px', height: '1px', left: '0', top: '0' });
  tapTarget.appendChild(input);

  let composing = false;
  let skipInput = false; // swallow the input event some browsers fire right after compositionend
  let sawBeforeInputDelete = false;

  const feed = (text: string) => { for (const c of text) h.onChar(c); };
  const focus = () => input.focus({ preventScroll: true });

  const on = <T extends EventTarget>(el: T, type: string, fn: (e: any) => void) => {
    el.addEventListener(type, fn);
    return () => el.removeEventListener(type, fn);
  };

  const offs = [
    on(tapTarget, 'pointerdown', focus),
    on(input, 'beforeinput', (e: InputEvent) => {
      if (composing || e.isComposing) return;
      if (e.inputType === 'deleteContentBackward') {
        sawBeforeInputDelete = true;
        e.preventDefault();
        h.onBackspace();
      } else if (e.inputType === 'insertText' && e.cancelable) {
        e.preventDefault();
        feed(e.data ?? '');
      }
    }),
    on(input, 'input', (e: InputEvent) => {
      // Fallback for browsers that don't cancel beforeinput.
      if (composing || e.isComposing || skipInput) { if (!composing) input.value = ''; return; }
      const v = input.value;
      input.value = '';
      feed(v);
    }),
    on(input, 'compositionstart', () => { composing = true; }),
    on(input, 'compositionend', (e: CompositionEvent) => {
      composing = false;
      skipInput = true;
      setTimeout(() => { skipInput = false; }, 0);
      input.value = '';
      feed(e.data ?? '');
    }),
    on(input, 'keydown', (e: KeyboardEvent) => {
      if (composing || e.isComposing) return;
      if (e.key === 'Enter') { e.preventDefault(); h.onEnter(); }
      else if (e.key === 'Escape') { input.blur(); h.onEscape(); }
      else if (e.key === 'Backspace') {
        // beforeinput normally handles it; only act if it did not fire.
        sawBeforeInputDelete = false;
        setTimeout(() => { if (!sawBeforeInputDelete) h.onBackspace(); }, 0);
      }
    }),
  ];

  const vv = window.visualViewport;
  const layout = () => {
    if (!vv) return;
    keepVisible.style.transform = '';
    const over = keepVisible.getBoundingClientRect().bottom - (vv.height + vv.offsetTop);
    if (over > 0) keepVisible.style.transform = `translateY(${-Math.ceil(over)}px)`;
  };
  if (vv) {
    offs.push(on(vv, 'resize', layout), on(vv, 'scroll', layout));
  }

  return {
    focus,
    relayout: layout,
    destroy() {
      offs.forEach((f) => f());
      keepVisible.style.transform = '';
      input.remove();
    },
  };
}
