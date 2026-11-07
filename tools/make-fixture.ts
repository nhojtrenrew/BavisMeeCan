// Writes assets/src/test/blink.ase: a tiny palette-only test sprite (our own art).
// 8x8, 4 frames, one layer, raw RGBA cels, tags "idle" (0-2) and "pop-once" (3).
// Usage: node tools/make-fixture.ts
import { mkdirSync, writeFileSync } from 'node:fs';

const W = 8, H = 8;
const RED: [number, number, number] = [255, 0, 0];
const WHITE: [number, number, number] = [255, 255, 255];
const BLACK: [number, number, number] = [0, 0, 0];

const u8 = (n: number) => Buffer.from([n]);
const u16 = (n: number) => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; };
const i16 = (n: number) => { const b = Buffer.alloc(2); b.writeInt16LE(n); return b; };
const u32 = (n: number) => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };
const str = (s: string) => Buffer.concat([u16(s.length), Buffer.from(s)]);
const chunk = (type: number, data: Buffer) =>
  Buffer.concat([u32(data.length + 6), u16(type), data]);

function pixels(frame: number): Buffer {
  const b = Buffer.alloc(W * H * 4); // transparent
  const set = (x: number, y: number, c: [number, number, number]) => b.set([...c, 255], (y * W + x) * 4);
  for (let y = 1; y < 7; y++) for (let x = 1; x < 7; x++) set(x, y, RED);
  for (let x = 1; x < 7; x++) { set(x, 1, BLACK); set(x, 6, BLACK); }
  set(1 + frame, 3, WHITE); // white dot walks across
  if (frame === 3) for (let x = 1; x < 7; x++) set(x, 3, WHITE);
  return b;
}

const durations = [100, 120, 100, 200];
const layer = chunk(0x2004, Buffer.concat([u16(3), u16(0), u16(0), u16(W), u16(H), u16(0), u8(255), Buffer.alloc(3), str('Layer 1')]));
const tag = (from: number, to: number, name: string) =>
  Buffer.concat([u16(from), u16(to), u8(0), Buffer.alloc(8), Buffer.alloc(4), str(name)]);
const tags = chunk(0x2018, Buffer.concat([u16(2), Buffer.alloc(8), tag(0, 2, 'idle'), tag(3, 3, 'pop-once')]));

const frames = durations.map((ms, f) => {
  const cel = chunk(0x2005, Buffer.concat([u16(0), i16(0), i16(0), u8(255), u16(0), Buffer.alloc(7), u16(W), u16(H), pixels(f)]));
  const chunks = f === 0 ? [layer, tags, cel] : [cel];
  const body = Buffer.concat(chunks);
  return Buffer.concat([u32(body.length + 16), u16(0xf1fa), u16(chunks.length), u16(ms), Buffer.alloc(2), u32(chunks.length), body]);
});

const body = Buffer.concat(frames);
const header = Buffer.concat([
  u32(128 + body.length), u16(0xa5e0), u16(frames.length), u16(W), u16(H), u16(32), u32(1), u16(100),
  u32(0), u32(0), u8(0), Buffer.alloc(3), u16(0), u8(1), u8(1), i16(0), i16(0), u16(0), u16(0), Buffer.alloc(84),
]);
mkdirSync('assets/src/test', { recursive: true });
writeFileSync('assets/src/test/blink.ase', Buffer.concat([header, body]));
console.log('wrote assets/src/test/blink.ase');
