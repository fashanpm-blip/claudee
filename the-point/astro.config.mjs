import { defineConfig } from 'astro/config';

// Eigene Domain hier eintragen – wird für Canonical-Links, hreflang, sitemap.xml und robots.txt genutzt.
export default defineConfig({
  site: 'https://thepoint-uerdingen.de',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'never', format: 'directory' },
});
