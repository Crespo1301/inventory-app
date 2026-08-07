/* Generates the Kitchen Inventory app icon set per docs/icon-brief.md.
   Flat 2-color clipboard-with-check mark. No gradient, no blur. */
const path = require('path');
const Jimp = require(path.join(__dirname, '..', 'node_modules', 'jimp-compact'));

const ASSETS = path.join(__dirname, '..', 'assets', 'images');
const GREEN = { r: 0x15, g: 0xa1, b: 0x50 };
const WHITE = { r: 0xff, g: 0xff, b: 0xff };

// --- Mark geometry, authored in a 1024x1024 logical canvas -----------------
const board = { x0: 250, y0: 290, x1: 774, y1: 874, r: 66 };
const gap = { x0: 388, y0: 244, x1: 636, y1: 378, r: 64 }; // green notch under the clip
const clip = { x0: 430, y0: 210, x1: 594, y1: 346, r: 44 };
const checkPts = [
  [396, 614],
  [474, 694],
  [656, 468],
];
const checkR = 35; // half-thickness of the check stroke

function insideRR(px, py, g) {
  if (px < g.x0 || px > g.x1 || py < g.y0 || py > g.y1) return false;
  const cx = px < g.x0 + g.r ? g.x0 + g.r : px > g.x1 - g.r ? g.x1 - g.r : px;
  const cy = py < g.y0 + g.r ? g.y0 + g.r : py > g.y1 - g.r ? g.y1 - g.r : py;
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= g.r * g.r;
}
function distSeg(px, py, a, b) {
  const vx = b[0] - a[0];
  const vy = b[1] - a[1];
  const wx = px - a[0];
  const wy = py - a[1];
  let t = (wx * vx + wy * vy) / (vx * vx + vy * vy);
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (a[0] + t * vx), py - (a[1] + t * vy));
}
function insideCheck(px, py) {
  return (
    Math.min(distSeg(px, py, checkPts[0], checkPts[1]), distSeg(px, py, checkPts[1], checkPts[2])) <=
    checkR
  );
}

/**
 * Paints one variant.
 *  bg:    'green' | 'transparent'
 *  scale: mark scale around the canvas centre (1 = full bleed)
 *  mode:  'color' (white board, green check) | 'mono' (white board, check cut out)
 */
function paint(out, opts) {
  const SS = 3; // supersample factor
  const S = out * SS;
  const img = new Jimp(S, S, 0x00000000);
  const data = img.bitmap.data;
  const transparent = opts.bg === 'transparent';

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      // sample point in logical space, undoing the centre scale
      let lx = ((x + 0.5) / SS - 512) / opts.scale + 512;
      let ly = ((y + 0.5) / SS - 512) / opts.scale + 512;

      let color = transparent ? null : GREEN;
      let onMark = false;
      if (insideRR(lx, ly, board)) {
        color = WHITE;
        onMark = true;
      }
      if (insideRR(lx, ly, gap)) {
        color = transparent ? null : GREEN;
        onMark = false;
      }
      if (insideRR(lx, ly, clip)) {
        color = WHITE;
        onMark = true;
      }
      if (onMark && color === WHITE && insideCheck(lx, ly)) {
        color = opts.mode === 'mono' ? null : GREEN;
      }

      const i = (y * S + x) * 4;
      if (color === null) {
        data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 0;
      } else {
        data[i] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
        data[i + 3] = 255;
      }
    }
  }
  img.resize(out, out);
  return img;
}

async function main() {
  const write = (img, name) =>
    img.writeAsync(path.join(ASSETS, name)).then(() => console.log('wrote', name));

  // iOS / App Store master — full-bleed green, opaque.
  const icon = paint(1024, { bg: 'green', scale: 1, mode: 'color' });
  await write(icon, 'icon.png');

  // Splash mark — reuse the full icon; expo-splash-screen centres it.
  await write(paint(1024, { bg: 'green', scale: 1, mode: 'color' }), 'splash-icon.png');

  // Web favicon — small, derived from the full icon.
  await write(paint(64, { bg: 'green', scale: 1, mode: 'color' }), 'favicon.png');

  // Android adaptive set — foreground padded into the safe zone.
  await write(paint(1024, { bg: 'transparent', scale: 0.62, mode: 'color' }), 'android-icon-foreground.png');
  await write(new Jimp(1024, 1024, 0x15a150ff), 'android-icon-background.png');
  await write(paint(1024, { bg: 'transparent', scale: 0.62, mode: 'mono' }), 'android-icon-monochrome.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
