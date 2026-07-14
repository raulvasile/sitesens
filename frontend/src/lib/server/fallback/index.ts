import type { StrapiResponse } from '$lib/strapi';

// Conținut de rezervă (fallback) servit când Strapi e inaccesibil.
// SERVER-ONLY (dir `$lib/server`) — nu ajunge în bundle-ul de client.
// Fiecare JSON e o oglindă a răspunsului REAL al endpoint-ului (forma `{ data, meta }`
// DUPĂ populate). Scris de mână — vezi README.md din acest folder.
import navigation from './data/navigation.json';
import footer from './data/footer.json';
import siteTheme from './data/site-theme.json';
import homepage from './data/homepage.json';
import contactPage from './data/contact-page.json';
import donatePage from './data/donate-page.json';
import inscriptionPage from './data/inscription-page.json';
import newsletterPage from './data/newsletter-page.json';
import communityPage from './data/community-page.json';
import privacyPolicyPage from './data/privacy-policy-page.json';
import eventsPage from './data/events-page.json';

/**
 * Endpoint Strapi (fără `/api`, fără query) → snapshot de fallback.
 * Scope: shell (navigation/footer/site-theme) + paginile fixe (single-types).
 * Colecțiile (articole, evenimente) NU au fallback → degradează grațios (listă goală).
 */
const FALLBACKS: Record<string, unknown> = {
  '/navigation': navigation,
  '/footer': footer,
  '/site-theme': siteTheme,
  '/homepage': homepage,
  '/contact-page': contactPage,
  '/donate-page': donatePage,
  '/inscription-page': inscriptionPage,
  '/newsletter-page': newsletterPage,
  '/community-page': communityPage,
  '/privacy-policy-page': privacyPolicyPage,
  '/events-page': eventsPage,
};

/**
 * Întoarce fallback-ul pentru un endpoint DOAR dacă a fost completat (`data` non-null).
 * Skeleton-urile goale (`data: null`) → întoarce `null`, deci comportamentul rămâne
 * identic cu azi (degradare grațioasă) până când completezi JSON-ul.
 *
 * @param endpoint calea ca la `fetchStrapi` (ex. `/navigation`); query-ul se ignoră.
 */
export function getFallback<T = unknown>(endpoint: string): StrapiResponse<T> | null {
  const path = endpoint.split('?')[0].replace(/\/$/, '');
  const fb = FALLBACKS[path] as StrapiResponse<T> | undefined;
  if (fb && fb.data != null) return fb;
  return null;
}
