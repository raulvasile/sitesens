import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/**
 * Petiție: invalidează pagina petiției + lista /petitii.
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
      ? [...slugs].flatMap((s) => cacheUrls.petition(s))
      : cacheUrls.petition();
    await purgeUrls(urls);
  },
  async afterCreate({ result }) {
    await purgeUrls(cacheUrls.petition(result?.slug));
  },
  async afterDelete({ result }) {
    await purgeUrls(cacheUrls.petition(result?.slug));
  },
};
