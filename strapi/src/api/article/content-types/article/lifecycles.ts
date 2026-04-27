import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/**
 * Articol: invalidează pagina articolului + lista /stiri + homepage
 * (care afișează LatestArticles). Pe afterUpdate, purge și slug-ul vechi
 * dacă s-a schimbat.
 */
export default {
  async afterUpdate({ result, params }) {
    const slugs = new Set<string>();
    if (result?.slug) slugs.add(result.slug);
    if (params?.data?.slug && params.data.slug !== result?.slug) {
      slugs.add(params.data.slug);
    }
    const urls = slugs.size > 0
      ? [...slugs].flatMap((s) => cacheUrls.article(s))
      : cacheUrls.article();
    await purgeUrls(urls);
  },
  async afterCreate({ result }) {
    await purgeUrls(cacheUrls.article(result?.slug));
  },
  async afterDelete({ result }) {
    await purgeUrls(cacheUrls.article(result?.slug));
  },
};
