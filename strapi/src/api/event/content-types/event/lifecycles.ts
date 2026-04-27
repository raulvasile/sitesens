import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/**
 * Eveniment: invalidează pagina + lista /evenimente + homepage
 * (UpcomingEvents block). Suportă slug-uri schimbate la afterUpdate.
 */
export default {
  async afterUpdate({ result, params }) {
    const slugs = new Set<string>();
    if (result?.slug) slugs.add(result.slug);
    if (params?.data?.slug && params.data.slug !== result?.slug) {
      slugs.add(params.data.slug);
    }
    const urls = slugs.size > 0
      ? [...slugs].flatMap((s) => cacheUrls.event(s))
      : cacheUrls.event();
    await purgeUrls(urls);
  },
  async afterCreate({ result }) {
    await purgeUrls(cacheUrls.event(result?.slug));
  },
  async afterDelete({ result }) {
    await purgeUrls(cacheUrls.event(result?.slug));
  },
};
