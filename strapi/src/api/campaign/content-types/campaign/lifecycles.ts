import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/**
 * Campanie: invalidează pagina campaniei + lista /campanii + homepage
 * (featured-campaigns). Suportă slug-uri schimbate la afterUpdate.
 */
export default {
  async afterUpdate({ result, params }) {
    const slugs = new Set<string>();
    if (result?.slug) slugs.add(result.slug);
    if (params?.data?.slug && params.data.slug !== result?.slug) {
      slugs.add(params.data.slug);
    }
    const urls = slugs.size > 0
      ? [...slugs].flatMap((s) => cacheUrls.campaign(s))
      : cacheUrls.campaign();
    await purgeUrls(urls);
  },
  async afterCreate({ result }) {
    await purgeUrls(cacheUrls.campaign(result?.slug));
  },
  async afterDelete({ result }) {
    await purgeUrls(cacheUrls.campaign(result?.slug));
  },
};
