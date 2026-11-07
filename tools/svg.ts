// Strip editor cruft (Affinity / Inkscape) from an SVG. String based, no SVGO.
const EDITOR_NS = ['serif', 'inkscape', 'sodipodi'];

export function cleanSvg(text: string): string {
  let s = text.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<metadata\b[\s\S]*?<\/metadata\s*>/g, '').replace(/<metadata\b[^>]*\/>/g, '');
  for (const ns of EDITOR_NS) {
    // elements: <ns:tag ...>...</ns:tag> or self-closing
    s = s.replace(new RegExp(`<${ns}:([\\w-]+)\\b[^>]*/>`, 'g'), '');
    s = s.replace(new RegExp(`<${ns}:([\\w-]+)\\b[^>]*>[\\s\\S]*?</${ns}:\\1\\s*>`, 'g'), '');
    // attributes and namespace declarations
    s = s.replace(new RegExp(`\\s+${ns}:[\\w.-]+\\s*=\\s*("[^"]*"|'[^']*')`, 'g'), '');
    s = s.replace(new RegExp(`\\s+xmlns:${ns}\\s*=\\s*("[^"]*"|'[^']*')`, 'g'), '');
  }
  return s;
}
