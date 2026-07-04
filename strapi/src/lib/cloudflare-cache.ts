/**
 * Cloudflare cache purge — invalidare granulară când conținutul Strapi se
 * modifică. Folosit din lifecycles pentru fiecare content type relevant.
 *
 * Funcționează ca no-op în development (CF_ZONE_ID / CF_API_TOKEN nesetate),
 * deci poți rula Strapi local fără să atingi cache-ul real.
 *
 * Variabile de mediu necesare în prod:
 *   CF_ZONE_ID        — din Cloudflare dashboard, sub zona cusens.eu
 *   CF_API_TOKEN      — token cu permisiunea Zone:Cache Purge:Purge
 *   PUBLIC_SITE_URL   — URL-ul frontend (ex: https://cusens.eu)
 *
 * Pentru rate-limit-ul Cloudflare Free: max 30 URL-uri per call,
 * dar calls nelimitate. Service-ul împarte automat în batch-uri.
 */

const CF_API = 'https://api.cloudflare.com/client/v4';
const URLS_PER_BATCH = 30;

function chunks<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function getEnv() {
  return {
    zone: process.env.CF_ZONE_ID,
    token: process.env.CF_API_TOKEN,
    site: process.env.PUBLIC_SITE_URL ?? 'https://cusens.eu',
  };
}

async function callPurge(body: object): Promise<void> {
  const { zone, token } = getEnv();
  if (!zone || !token) {
    strapi.log.debug('[CF-cache] Skip — CF_ZONE_ID/CF_API_TOKEN nesetate');
    return;
  }
  try {
    const res = await fetch(`${CF_API}/zones/${zone}/purge_cache`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Lifecycle-urile AȘTEAPTĂ purge-ul: fără timeout, un Cloudflare căzut
      // ar bloca fiecare salvare din admin pe termen nelimitat.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      const text = await res.text();
      strapi.log.warn(`[CF-cache] Purge eșuat ${res.status}: ${text}`);
      return;
    }
    const summary =
      'purge_everything' in body
        ? 'EVERYTHING'
        : `${(body as { files: string[] }).files.length} URLs`;
    strapi.log.info(`[CF-cache] Purge OK: ${summary}`);
  } catch (err) {
    strapi.log.warn(`[CF-cache] Purge eroare: ${err}`);
  }
}

/** Purge URL-uri specifice. Acceptă oricâte; service-ul le împarte în batch-uri de 30. */
export async function purgeUrls(urls: string[]): Promise<void> {
  const unique = [...new Set(urls.filter(Boolean))];
  if (unique.length === 0) return;
  for (const batch of chunks(unique, URLS_PER_BATCH)) {
    await callPurge({ files: batch });
  }
}

/**
 * Purge totală — invalidează tot cache-ul zonei.
 * Folosit pentru schimbări care afectează multe pagini (header, footer, theme,
 * team member care apare în multiple TeamGrid blocks etc.).
 */
export async function purgeEverything(): Promise<void> {
  await callPurge({ purge_everything: true });
}

// ─── URL mappers per content type ──────────────────────────────────

/**
 * Generează lista de URL-uri afectate de o modificare la un content type.
 * Toate funcțiile acceptă slug opțional (pentru cazul când e gol pe afterDelete).
 */
export const cacheUrls = {
  /** Articol: pagina articolului + lista /stiri + homepage (LatestArticles). */
  article(slug?: string): string[] {
    const { site } = getEnv();
    return [
      `${site}/`,
      `${site}/stiri`,
      ...(slug ? [`${site}/stiri/${slug}`] : []),
    ];
  },

  /** Eveniment: pagina evenimentului + lista /evenimente + homepage (UpcomingEvents). */
  event(slug?: string): string[] {
    const { site } = getEnv();
    return [
      `${site}/`,
      `${site}/evenimente`,
      ...(slug ? [`${site}/evenimente/${slug}`] : []),
    ];
  },

  /** Pagină liberă: doar URL-ul ei (ex: /despre-noi, /program). */
  page(slug?: string): string[] {
    const { site } = getEnv();
    return slug ? [`${site}/${slug}`] : [];
  },

  /** Petiție: pagina ei + indexul /petitii. */
  petition(slug?: string): string[] {
    const { site } = getEnv();
    return [
      `${site}/petitii`,
      ...(slug ? [`${site}/petitii/${slug}`] : []),
    ];
  },

  /** Campanie: pagina ei + indexul /campanii + homepage (featured-campaigns). */
  campaign(slug?: string): string[] {
    const { site } = getEnv();
    return [
      `${site}/`,
      `${site}/campanii`,
      ...(slug ? [`${site}/campanii/${slug}`] : []),
    ];
  },

  /** Filială: landing-ul ei + indexul /filiale (care listează filialele). */
  chapter(slug?: string): string[] {
    const { site } = getEnv();
    return [
      `${site}/filiale`,
      ...(slug ? [`${site}/filiale/${slug}`] : []),
    ];
  },

  /** Pagină de filială: URL-ul sub-paginii. Necesită slug-ul filialei + al paginii. */
  chapterPage(chapterSlug?: string, pageSlug?: string): string[] {
    const { site } = getEnv();
    return chapterSlug && pageSlug ? [`${site}/filiale/${chapterSlug}/${pageSlug}`] : [];
  },

  /** Single-type → URL fix. */
  fixed(path: string): string[] {
    const { site } = getEnv();
    return [`${site}${path}`];
  },
};
