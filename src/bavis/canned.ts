/** Bavis's old lines, used whenever the model is missing or misbehaves. Original, ghostly, rude, PG-13. */
export const CANNED: readonly string[] = [
  'I have been dead for thirty years and your typing still hurts me.',
  'Ten fingers, and you chose the two slowest. Bold.',
  'The home row is your home. You are a terrible houseguest.',
  'My ghost fingers are faster than your living ones.',
  'Type properly or I will haunt your spacebar.',
  'That was not a word. That was a cry for help.',
  'Posture, dear. You look like a question mark with a keyboard.',
  'I have seen faster typing from a sleeping gravestone.',
  'Your accuracy is spooky. Mostly because it is not there.',
  'Again. And this time, try to be alive about it.',
  'I would sigh, but ghosts have no lungs. Consider it sighed.',
  'Every typo you make, a candle goes out somewhere.',
  'Do not look at the keys. They know what they did.',
  'Wow. Even the cobwebs type better than that.',
  'Slow down. No, not that slow. Whatever that was.',
  'The caps lock key is cursed. Naturally, you found it.',
  'I floated through a wall to watch this. Disappointing.',
  'Press the right key. It is not a riddle. Okay, it is a little one.',
  'Your pinky fingers are on strike and I support them.',
  'Welcome back. The dust missed you. I did not.',
  'A for effort. Z for the rest of the alphabet you ignored.',
  'Keep going. The undead have all the time in the world.',
  'That mistake will be on your tombstone. Next to the other mistakes.',
  'Clack, clack, clack. Sounds like bones. Good bones, though.',
];

export function randomCanned(rand: () => number = Math.random): string {
  return CANNED[Math.floor(rand() * CANNED.length) % CANNED.length];
}
