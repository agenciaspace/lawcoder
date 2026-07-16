// Gera site/assets/headline-{pt,en}.svg — um <path> por letra.
// Rodar a mao: npm run gen:headline   (o output e commitado)
// NAO faz parte do npm run build.
import opentype from 'opentype.js';
import { writeFileSync, readFileSync } from 'node:fs';

const FONT = 'tools/BarlowCondensed-Black.ttf';
const SIZE = 96;          // clamp(52px, 7vw, 96px) -> maximo
const TRACK = -2;         // letter-spacing: -2px
const LINE = SIZE * 0.86; // line-height: .86
const BLACK = '#0d0d0d';
const RED = '#e63012';

// text-transform: uppercase. Linha 3 e o <em> (vermelho, display:block).
const HEADLINES = {
  pt: [
    { text: 'FERRAMENTAS', fill: BLACK },
    { text: 'JURÍDICAS', fill: BLACK },
    { text: 'FEITAS POR VOCÊ', fill: RED },
  ],
  en: [
    { text: 'LEGAL TOOLS', fill: BLACK },
    { text: 'BUILT', fill: BLACK },
    { text: 'BY YOU', fill: RED },
  ],
};

// opentype.js v2 deprecated loadSync() (it's now a no-op); use parse() sync API.
// Pass the Buffer (a Uint8Array) directly, not .buffer -- Buffer.buffer can be
// a slice of Node's shared pool with a nonzero byteOffset, which would corrupt reads.
const font = opentype.parse(readFileSync(FONT));

function buildSvg(lines) {
  const paths = [];
  let maxX = 0;

  lines.forEach((line, li) => {
    let x = 0;
    const y = SIZE + li * LINE; // baseline aproximada por linha
    for (const ch of line.text) {
      const adv = font.getAdvanceWidth(ch, SIZE) + TRACK;
      if (ch !== ' ') {
        const d = font.getPath(ch, x, y, SIZE).toPathData(2);
        if (d && d !== 'Z' && d.length > 2) {
          paths.push(`  <path fill="${line.fill}" d="${d}"/>`);
        }
      }
      x += adv;
    }
    maxX = Math.max(maxX, x);
  });

  const w = Math.ceil(maxX);
  const h = Math.ceil(SIZE + (lines.length - 1) * LINE + SIZE * 0.28);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n${paths.join('\n')}\n</svg>\n`;
}

for (const [lang, lines] of Object.entries(HEADLINES)) {
  const svg = buildSvg(lines);
  const out = `site/assets/headline-${lang}.svg`;
  writeFileSync(out, svg);
  const n = (svg.match(/<path/g) || []).length;
  console.log(`${out}: ${n} paths, ${svg.length} bytes`);
}
