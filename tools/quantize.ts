// npm run quantize -- <in.png> <out.png> [--width N]
// Nearest-neighbour resize, then map to bavis-21 with Bayer 4x4 ordered dithering.
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { loadGpl } from './palette.ts';
import { quantizeImage } from './palette.ts';

const args = process.argv.slice(2);
const wi = args.indexOf('--width');
const width = wi >= 0 ? Number(args.splice(wi, 2)[1]) : undefined;
const [inPath, outPath] = args;
if (!inPath || !outPath || (width !== undefined && !(width >= 1))) {
  console.error('usage: npm run quantize -- <in.png> <out.png> [--width N]');
  process.exit(2);
}
const palette = loadGpl(readFileSync('assets/palette/bavis-21.gpl', 'utf8'));
const src = PNG.sync.read(readFileSync(inPath));
const out = quantizeImage(src.data, src.width, src.height, palette, width);
const png = new PNG({ width: out.w, height: out.h });
png.data = Buffer.from(out.data);
writeFileSync(outPath, PNG.sync.write(png));
console.log(`quantize: wrote ${outPath} (${out.w}x${out.h})`);
