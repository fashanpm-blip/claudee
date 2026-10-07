import { site } from '../site';
import hours from '../data/hours.json';
import menu from '../data/menu.json';
import type { Lang } from '../i18n';

const dayMap: Record<string, string> = {
  mo: 'Monday', tu: 'Tuesday', we: 'Wednesday', th: 'Thursday', fr: 'Friday', sa: 'Saturday', su: 'Sunday',
};

// Schema.org "Restaurant" – Google zeigt damit Adresse, Öffnungszeiten, Telefon und Speisekarte direkt in der Suche.
export function restaurantJsonLd(lang: Lang, siteUrl: URL) {
  const home = new URL(lang === 'de' ? '/' : '/en/', siteUrl).href;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': new URL('/#restaurant', siteUrl).href,
    name: site.name,
    url: home,
    image: [new URL('/images/innenraum-tische-800.webp', siteUrl).href, new URL('/images/festtafel-800.webp', siteUrl).href],
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      postalCode: site.zip,
      addressLocality: site.city,
      addressRegion: 'Nordrhein-Westfalen',
      addressCountry: site.country,
    },
    hasMap: site.mapsUrl,
    servesCuisine: lang === 'de' ? ['Deutsch', 'Gutbürgerlich', 'Regional'] : ['German', 'Traditional', 'Regional'],
    acceptsReservations: 'True',
    paymentAccepted: 'Cash, EC, Visa, Mastercard, Maestro, American Express, Apple Pay, Contactless',
    currenciesAccepted: 'EUR',
    // Nur Tage mit bekannter Schließzeit (Sonntag fehlt, bis die Uhrzeit feststeht).
    openingHoursSpecification: hours.days
      .filter((d: any) => !d.closed && d.close)
      .map((d: any) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${dayMap[d.day]}`, opens: d.open, closes: d.close })),
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Außenbereich', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Haustiere erlaubt', value: true },
    ],
    hasMenu: {
      '@type': 'Menu',
      url: home + '#speisekarte',
      inLanguage: lang,
      hasMenuSection: menu.categories.map((c) => ({
        '@type': 'MenuSection',
        name: c.name[lang],
        hasMenuItem: c.items
          .filter((i: any) => !i.placeholder)
          .map((i: any) => ({
            '@type': 'MenuItem',
            name: i.name[lang],
            ...(i.description ? { description: i.description[lang] } : {}),
            ...(i.price != null ? { offers: { '@type': 'Offer', price: i.price.toFixed(2), priceCurrency: 'EUR' } } : {}),
          })),
      })).filter((sec) => sec.hasMenuItem.length),
    },
    sameAs: [site.instagram, site.facebook, site.cateringUrl].filter(Boolean),
  };
}
