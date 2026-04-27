import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/**
 * Secțiune (tab): invalidează pagina părinte. Sectiunile nu au URL propriu —
 * apar ca tab-uri pe `/<page.slug>`.
 */
async function purgeParentPage(documentId?: string): Promise<void> {
  if (!documentId) return;
  try {
    const section = await strapi.documents('api::section.section').findOne({
      documentId,
      populate: { page: { fields: ['slug'] } },
    });
    const slug = (section as { page?: { slug?: string } } | null)?.page?.slug;
    if (slug) await purgeUrls(cacheUrls.page(slug));
  } catch (err) {
    strapi.log.warn(`[CF-cache] section parent lookup failed: ${err}`);
  }
}

export default {
  async afterUpdate({ result }) {
    await purgeParentPage(result?.documentId);
  },
  async afterCreate({ result }) {
    await purgeParentPage(result?.documentId);
  },
  async afterDelete({ result }) {
    await purgeParentPage(result?.documentId);
  },
};
