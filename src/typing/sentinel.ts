/** Zero-width char kept in the hidden input so Backspace has something to delete (Gboard sends keyCode 229). */
export const SENTINEL = '​';
export const stripSentinel = (s: string): string => s.split(SENTINEL).join('');
