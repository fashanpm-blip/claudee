// Exportiert die fertige Website als einfachen Ordner aus HTML + CSS + Bildern:  ../site/
// Alle Links sind relativ, daher läuft die Seite überall: auf jedem Hosting, in einem Unterordner
// und sogar per Doppelklick auf index.html direkt vom Computer.
// Aufruf: npm run export   (baut vorher automatisch mit astro build)
import { readdir, readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises';
import path from 'node:path';

const dist = 'dist';
const out = path.resolve('..', 'site');

async function walk(dir) {
  const res = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) res.push(...(await walk(p)));
    else res.push(p);
  }
  return res;
}

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'css'), { recursive: true });
await mkdir(path.join(out, 'fonts'), { recursive: true });

// 1) CSS + Schriften: _astro/ → css/style.css und fonts/
const cssMap = {};
for (const f of await readdir(path.join(dist, '_astro'))) {
  const src = path.join(dist, '_astro', f);
  if (f.endsWith('.woff2') || f.endsWith('.woff')) {
    await cp(src, path.join(out, 'fonts', f));
  } else if (f.endsWith('.css')) {
    cssMap[`/_astro/${f}`] = 'css/style.css';
    const css = (await readFile(src, 'utf8')).replace(/url\(\/_astro\//g, 'url(../fonts/');
    await writeFile(path.join(out, 'css', 'style.css'), css);
  }
}
if (Object.keys(cssMap).length !== 1) throw new Error('Erwartet genau eine CSS-Datei in dist/_astro');

// 2) Bilder, Favicon, robots.txt, sitemap.xml unverändert übernehmen
for (const f of ['images', 'favicon.svg', 'robots.txt', 'sitemap.xml']) {
  await cp(path.join(dist, f), path.join(out, f), { recursive: true });
}

// 3) HTML: absolute Pfade (/…) in relative Pfade umschreiben
const toRel = (url, prefix) => {
  if (cssMap[url.split('#')[0]]) return prefix + cssMap[url.split('#')[0]];
  const [p, hash] = url.split('#');
  let target = p.replace(/^\//, '');
  if (target === '' || target.endsWith('/')) target += 'index.html';
  return prefix + target + (hash !== undefined ? '#' + hash : '');
};

for (const file of await walk(dist)) {
  if (!file.endsWith('.html')) continue;
  const rel = path.relative(dist, file);
  const depth = rel.split(path.sep).length - 1;
  const prefix = depth ? '../'.repeat(depth) : '';
  let html = await readFile(file, 'utf8');
  // href="/…", src="/…"  (nicht //cdn und keine absoluten https-Links)
  html = html.replace(/\b(href|src)="(\/(?!\/)[^"]*)"/g, (_, attr, url) => `${attr}="${toRel(url, prefix)}"`);
  // srcset="/a 400w, /b 800w"
  html = html.replace(/\bsrcset="([^"]*)"/g, (_, v) =>
    `srcset="${v.replace(/(^|,\s*)\/(?!\/)/g, `$1${prefix}`)}"`,
  );
  const dest = path.join(out, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, html);
}

const files = await walk(out);
let size = 0;
for (const f of files) size += (await stat(f)).size;
console.log(`✓ ${files.length} Dateien, ${(size / 1024).toFixed(0)} KB → ${out}`);
