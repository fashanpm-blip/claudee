import type { APIRoute } from 'astro';

// Alle Seiten mit ihrer Übersetzung (hreflang), damit Google DE und EN richtig zuordnet.
const pairs: [string, string][] = [
  ['/', '/en/'],
  ['/impressum/', '/en/imprint/'],
  ['/datenschutz/', '/en/privacy/'],
];

export const GET: APIRoute = ({ site }) => {
  const u = (p: string) => new URL(p, site).href;
  const urls = pairs.flatMap(([de, en]) =>
    [de, en].map(
      (loc) => `  <url>
    <loc>${u(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="de" href="${u(de)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${u(en)}"/>
  </url>`,
    ),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
