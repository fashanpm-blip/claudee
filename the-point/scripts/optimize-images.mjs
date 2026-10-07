// Wandelt alle Fotos aus public/images/original/ in WebP (400 px und 800 px breit) um.
// Aufruf: npm run images
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const src = 'public/images/original';
const out = 'public/images';
const widths = [400, 800];

await mkdir(out, { recursive: true });
for (const file of await readdir(src)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
  const name = path.parse(file).name;
  const img = sharp(path.join(src, file));
  const { width } = await img.metadata();
  for (const w of widths) {
    await img
      .clone()
      .resize({ width: Math.min(w, width), withoutEnlargement: true })
      .webp({ quality: 74 })
      .toFile(path.join(out, `${name}-${w}.webp`));
  }
  console.log('✓', file);
}
