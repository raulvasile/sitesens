import { fetchStrapi, type StrapiResponse } from '$lib/strapi';
import { getFallback } from './fallback';

/**
 * `fetchStrapi` cu FALLBACK la conținut committat când Strapi e inaccesibil.
 *
 * - Succes → răspunsul Strapi.
 * - Eroare (Strapi jos / 5xx / rețea) → dacă există un snapshot de fallback pentru
 *   endpoint (vezi `$lib/server/fallback`), îl întoarce; altfel `null` (degradare grațioasă).
 *
 * SERVER-ONLY (importă `$lib/server/fallback`). Folosește-l în `+page.server.ts` /
 * `+layout.server.ts` pentru shell + paginile fixe. Pentru colecții (articole,
 * evenimente) nu are rost — nu au fallback; folosește `fetchStrapi` direct.
 */
export async function fetchContent<T = unknown>(
  endpoint: string,
  params?: Record<string, string>,
  fetchFn: typeof fetch = fetch
): Promise<StrapiResponse<T> | null> {
  try {
    return await fetchStrapi<T>(endpoint, params, undefined, fetchFn);
  } catch (err) {
    const fb = getFallback<T>(endpoint);
    if (fb) {
      console.warn(`[fallback] ${endpoint} — servesc conținut de rezervă (Strapi indisponibil).`);
      return fb;
    }
    if (import.meta.env.DEV) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[content] ${endpoint} — fetch eșuat, fără fallback: ${msg}`);
    }
    return null;
  }
}
