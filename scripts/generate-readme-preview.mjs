import { mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const WIDTH = 960;
const HEIGHT = 540;
const FPS = 12;
const SECONDS = 10;
const OUTPUT = fileURLToPath(new URL('../docs/assets/nestjs-code-audit-preview.gif', import.meta.url));

const colors = {
  page: '#090D13', terminal: '#111821', border: '#283342', text: '#E6EDF3',
  muted: '#8190A5', coral: '#E0234E', green: '#3DDC97', amber: '#F4B860', blue: '#64B5F6',
};

const glyphs = {
  ' ': ['00000','00000','00000','00000','00000','00000','00000'],
  A:['01110','10001','10001','11111','10001','10001','10001'], B:['11110','10001','10001','11110','10001','10001','11110'],
  C:['01111','10000','10000','10000','10000','10000','01111'], D:['11110','10001','10001','10001','10001','10001','11110'],
  E:['11111','10000','10000','11110','10000','10000','11111'], F:['11111','10000','10000','11110','10000','10000','10000'],
  G:['01111','10000','10000','10111','10001','10001','01111'], H:['10001','10001','10001','11111','10001','10001','10001'],
  I:['11111','00100','00100','00100','00100','00100','11111'], J:['00111','00010','00010','00010','10010','10010','01100'],
  K:['10001','10010','10100','11000','10100','10010','10001'], L:['10000','10000','10000','10000','10000','10000','11111'],
  M:['10001','11011','10101','10101','10001','10001','10001'], N:['10001','11001','10101','10011','10001','10001','10001'],
  O:['01110','10001','10001','10001','10001','10001','01110'], P:['11110','10001','10001','11110','10000','10000','10000'],
  Q:['01110','10001','10001','10001','10101','10010','01101'], R:['11110','10001','10001','11110','10100','10010','10001'],
  S:['01111','10000','10000','01110','00001','00001','11110'], T:['11111','00100','00100','00100','00100','00100','00100'],
  U:['10001','10001','10001','10001','10001','10001','01110'], V:['10001','10001','10001','10001','10001','01010','00100'],
  W:['10001','10001','10001','10101','10101','10101','01010'], X:['10001','10001','01010','00100','01010','10001','10001'],
  Y:['10001','10001','01010','00100','00100','00100','00100'], Z:['11111','00001','00010','00100','01000','10000','11111'],
  0:['01110','10001','10011','10101','11001','10001','01110'], 1:['00100','01100','00100','00100','00100','00100','01110'],
  2:['01110','10001','00001','00010','00100','01000','11111'], 3:['11110','00001','00001','01110','00001','00001','11110'],
  4:['00010','00110','01010','10010','11111','00010','00010'], 5:['11111','10000','10000','11110','00001','00001','11110'],
  6:['01110','10000','10000','11110','10001','10001','01110'], 7:['11111','00001','00010','00100','01000','01000','01000'],
  8:['01110','10001','10001','01110','10001','10001','01110'], 9:['01110','10001','10001','01111','00001','00001','01110'],
  '$':['00100','01111','10100','01110','00101','11110','00100'], '-':['00000','00000','00000','11111','00000','00000','00000'],
  '.':['00000','00000','00000','00000','00000','00110','00110'], ':':['00000','00110','00110','00000','00110','00110','00000'],
  '/':['00001','00010','00010','00100','01000','01000','10000'], '[':['01110','01000','01000','01000','01000','01000','01110'],
  ']':['01110','00010','00010','00010','00010','00010','01110'], '(':['00010','00100','01000','01000','01000','00100','00010'],
  ')':['01000','00100','00010','00010','00010','00100','01000'], '+':['00000','00100','00100','11111','00100','00100','00000'],
  '>':['10000','01000','00100','00010','00100','01000','10000'], '#':['01010','11111','01010','01010','11111','01010','00000'],
  '_':['00000','00000','00000','00000','00000','00000','11111'], ',':['00000','00000','00000','00000','00110','00100','01000'],
};

function rgb(hex) {
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

function makeFrame() {
  const data = Buffer.alloc(WIDTH * HEIGHT * 3);
  const [r, g, b] = rgb(colors.page);
  for (let i = 0; i < data.length; i += 3) { data[i] = r; data[i + 1] = g; data[i + 2] = b; }
  return data;
}

function rect(frame, x, y, width, height, color) {
  const [r, g, b] = rgb(color);
  for (let py = Math.max(0, y); py < Math.min(HEIGHT, y + height); py += 1) {
    for (let px = Math.max(0, x); px < Math.min(WIDTH, x + width); px += 1) {
      const index = (py * WIDTH + px) * 3;
      frame[index] = r; frame[index + 1] = g; frame[index + 2] = b;
    }
  }
}

function text(frame, value, x, y, color = colors.text, scale = 3) {
  let cursor = x;
  for (const rawCharacter of value.toUpperCase()) {
    const character = glyphs[rawCharacter] ? rawCharacter : ' ';
    const glyph = glyphs[character];
    glyph.forEach((row, gy) => [...row].forEach((pixel, gx) => {
      if (pixel === '1') rect(frame, cursor + gx * scale, y + gy * scale, scale, scale, color);
    }));
    cursor += 6 * scale;
  }
}

function line(frame, label, y, color = colors.text) {
  text(frame, label, 92, y, color, 3);
}

function renderFrame(index) {
  const time = index / FPS;
  const frame = makeFrame();
  rect(frame, 40, 35, 880, 470, colors.border);
  rect(frame, 42, 37, 876, 466, colors.terminal);
  rect(frame, 42, 37, 876, 54, '#17212D');
  rect(frame, 68, 58, 13, 13, colors.coral);
  rect(frame, 90, 58, 13, 13, colors.amber);
  rect(frame, 112, 58, 13, 13, colors.green);
  text(frame, 'NESTJS CODE AUDIT', 342, 54, colors.text, 3);

  line(frame, '$NESTJS-CODE-AUDIT FULL SRC/PAYMENTS', 120, colors.blue);
  if (time > 1.0) line(frame, 'READ-ONLY PRE-FLIGHT', 165, colors.muted);
  if (time > 1.4) line(frame, '+ PROJECT: PAYMENTS API (NESTJS 11)', 200, colors.green);
  if (time > 2.0) line(frame, '+ TYPESCRIPT: PASS', 235, colors.green);
  if (time > 2.6) line(frame, '! ESLINT: 2 PROBLEMS', 270, colors.amber);
  if (time > 3.3) {
    line(frame, 'ARCH-001 [HIGH] CROSS-MODULE WRITE', 315, colors.coral);
    line(frame, 'PAYMENTS WRITES ORDERS-OWNED DATA', 345, colors.text);
  }
  if (time > 5.0) {
    line(frame, 'SEC-001 [MEDIUM] TENANT CHECK MISSING', 385, colors.amber);
  }
  if (time > 6.4) {
    rect(frame, 72, 425, 816, 1, colors.border);
    line(frame, '2 CONFIRMED  1 VERIFY  0 FILES CHANGED', 449, colors.green);
  }
  if (time > 8.1) {
    rect(frame, 40, 505, 880, 3, colors.coral);
    text(frame, 'EVIDENCE-BACKED REPORT. NO CODE CHANGES.', 164, 516, colors.muted, 2);
  }
  return frame;
}

mkdirSync(path.dirname(OUTPUT), { recursive: true });

const ffmpeg = spawn('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 'rawvideo', '-pixel_format', 'rgb24', '-video_size', `${WIDTH}x${HEIGHT}`, '-framerate', String(FPS), '-i', '-',
  '-filter_complex', '[0:v]split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle',
  '-loop', '0', OUTPUT,
], { stdio: ['pipe', 'inherit', 'inherit'] });

ffmpeg.on('error', (error) => {
  console.error(`Unable to start ffmpeg: ${error.message}`);
  process.exitCode = 1;
});

for (let frame = 0; frame < FPS * SECONDS; frame += 1) {
  if (!ffmpeg.stdin.write(renderFrame(frame))) await new Promise((resolve) => ffmpeg.stdin.once('drain', resolve));
}
ffmpeg.stdin.end();

const exitCode = await new Promise((resolve) => ffmpeg.on('close', resolve));
if (exitCode !== 0) throw new Error(`ffmpeg exited with code ${exitCode}`);
console.log(`Generated ${OUTPUT}`);
