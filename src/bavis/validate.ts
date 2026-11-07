/** Longest line Bavis may say. */
export const MAX_LINE = 120;

/** Minimal PG-13 block list: crude words only. Deliberately strict (substring, not just whole words). */
export const BLOCKED = ['fuck', 'shit', 'bitch', 'cunt', 'dick', 'piss', 'slut', 'whore', 'nazi', 'rape', 'porn', 'cock'];

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', $: 's' };

/** Lowercase, map leetspeak, turn everything that is not a letter into a space. */
function normalise(s: string): string {
  return s
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[013457@$]/g, (c) => LEET[c])
    .replace(/[^a-z]+/g, ' ');
}

/** True when a blocked word appears, also split up by punctuation or spaces ("f.u.c.k"). */
export function isBlocked(s: string): boolean {
  const n = normalise(s);
  const squashed = n.replace(/ /g, '');
  return BLOCKED.some((w) => squashed.includes(w));
}

/** Clean a model line, or return null when it must not be shown. */
export function validateLine(text: string): string | null {
  if (typeof text !== 'string' || text.length > 4000) return null;
  let t = text.trim();
  if (/[\r\n]/.test(t)) return null;
  t = t
    .replace(/\s+/g, ' ')
    .replace(/^["'`“‘]+|["'`”’]+$/g, '')
    .trim();
  if (!t || t.length > MAX_LINE) return null;
  if (/[\u0000-\u001F\u007F]/.test(t)) return null;
  if (isBlocked(t)) return null;
  return t;
}
