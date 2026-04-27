import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/**
 * Pagină liberă: invalidează URL-ul ei (/<slug>). Suportă slug-uri
 * schimbate la afterUpdate.
 */
export default {
  async afterUpdate({ result, params }) {
    const slugs = new Set<string>();
    if (result?.slug) slugs.add(result.slug);
    if (params?.data?.slug && params.data.slug !== result?.slug) {
      slugs.add(params.data.slug);
    }
    const urls = [...slugs].flatMap((s) => cacheUrls.page(s));
    await purgeUrls(urls);
  },
  async afterCreate({ result }) {
    await purgeUrls(cacheUrls.page(result?.slug));
  },
  async afterDelete({ result }) {
    await purgeUrls(cacheUrls.page(result?.slug));
  },
};
