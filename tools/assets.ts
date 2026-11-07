// npm run assets: export every assets/src/**/*.ase and clean every *.svg into public/assets/,
// style-check the PNGs against bavis-21, exit 1 on any failure.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join } from 'node:path';
import { PNG } from 'pngjs';
import { checkPixels, loadGpl } from './palette.ts';
import { packFrames, toSheetJson, type LibreSpriteJson } from './sheet.ts';
import { cleanSvg } from './svg.ts';

const SRC = 'assets/src';
const OUT = 'public/assets';
const palette = loadGpl(readFileSync('assets/palette/bavis-21.gpl', 'utf8'));
const errors: string[] = [];
const seen = new Map<string, string>();

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

function libresprite(args: string[]) {
  const exe = process.env.LIBRESPRITE || 'libresprite';
  const r = spawnSync(exe, ['-b', ...args], { encoding: 'utf8' });
  if (r.error) {
    throw new Error(
      `cannot run LibreSprite ("${exe}"): ${r.error.message}. Set the LIBRESPRITE env var to libresprite.exe or put it on PATH.`,
    );
  }
  return r;
}

// Returns the PNG bytes and sheet JSON for one .ase.
function exportAse(file: string, name: string) {
  const tmp = mkdtempSync(join(tmpdir(), 'bavis-'));
  try {
    const sheet = join(tmp, 'sheet.png');
    const data = join(tmp, 'sheet.json');
    const r = libresprite([file, '--sheet', sheet, '--data', data, '--format', 'json-array', '--list-tags']);
    try {
      if (process.env.ASSETS_FORCE_PACK) throw new Error('forced'); // test the fallback path
      const json = toSheetJson(JSON.parse(readFileSync(data, 'utf8')) as LibreSpriteJson, `${name}.png`);
      return { png: readFileSync(sheet), json };
    } catch {
      if (r.status === 0) console.warn(`${file}: sheet export gave no usable output, packing frames ourselves`);
    }
    // Fallback (req 1.2): per-frame PNGs, packed in one row. Durations and tags are lost.
    // LibreSprite 1.3 writes f1.png, f2.png, ... (1-based) for `--save-as f.png`.
    libresprite([file, '--save-as', join(tmp, 'f.png')]);
    const files = readdirSync(tmp)
      .filter((f) => /^f\d+\.png$/.test(f))
      .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
    if (!files.length) throw new Error('LibreSprite exported no frames');
    const frames = files.map((f) => {
      const p = PNG.sync.read(readFileSync(join(tmp, f)));
      return { w: p.width, h: p.height, data: new Uint8Array(p.data), ms: 100 };
    });
    const packed = packFrames(frames, `${name}.png`);
    const png = new PNG({ width: packed.w, height: packed.h });
    png.data = Buffer.from(packed.data);
    return { png: PNG.sync.write(png), json: packed.json };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function claim(file: string, name: string): boolean {
  const prev = seen.get(name);
  if (prev) {
    errors.push(`${file}: output name "${name}" already used by ${prev}`);
    return false;
  }
  seen.set(name, file);
  return true;
}

mkdirSync(OUT, { recursive: true });
const exported: string[] = [];
for (const file of walk(SRC).sort()) {
  const ext = extname(file).toLowerCase();
  const name = basename(file, extname(file));
  if (ext !== '.ase' && ext !== '.svg') continue;
  if (!claim(file, name)) continue;
  try {
    if (ext === '.svg') {
      writeFileSync(join(OUT, `${name}.svg`), cleanSvg(readFileSync(file, 'utf8')));
      exported.push(`${name}.svg`);
      continue;
    }
    const { png, json } = exportAse(file, name);
    const img = PNG.sync.read(png);
    const fails = checkPixels(img.data, img.width, img.height, palette);
    if (fails.length) {
      const lines = fails
        .slice(0, 20)
        .map((f) => `  (${f.x},${f.y}) rgba(${f.rgba.join(',')})`);
      errors.push(`${file}: ${fails.length} pixel(s) off bavis-21 or partially transparent\n${lines.join('\n')}`);
      continue;
    }
    writeFileSync(join(OUT, `${name}.png`), png);
    writeFileSync(join(OUT, `${name}.json`), JSON.stringify(json, null, 2) + '\n');
    exported.push(`${name}.png`, `${name}.json`);
  } catch (e) {
    errors.push(`${file}: ${(e as Error).message}`);
  }
}

if (errors.length) {
  console.error(`assets: FAILED\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`assets: exported ${exported.join(', ') || 'nothing'}`);
