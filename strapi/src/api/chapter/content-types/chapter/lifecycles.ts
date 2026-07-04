import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/**
 * Filială: invalidează landing-ul ei + indexul /filiale.
 * Pe afterUpdate, purge și slug-ul vechi dacă s-a schimbat.
 */
export default {
  async afterUpdate({ result, params }) {
    const slugs = new Set<string>();
    if (result?.slug) slugs.add(result.slug);
    if (params?.data?.slug && params.data.slug !== result?.slug) {
      slugs.add(params.data.slug);
    }
    const urls = slugs.size > 0
      ? [...slugs].flatMap((s) => cacheUrls.chapter(s))
      : cacheUrls.chapter();
    await purgeUrls(urls);
  },
  async afterCreate({ result }) {
    await purgeUrls(cacheUrls.chapter(result?.slug));
  },
  async afterDelete({ result }) {
    await purgeUrls(cacheUrls.chapter(result?.slug));
  },
};
