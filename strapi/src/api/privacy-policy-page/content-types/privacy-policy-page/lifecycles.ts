import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/** /politica-confidentialitate single-type. */
export default {
  async afterUpdate() { await purgeUrls(cacheUrls.fixed('/politica-confidentialitate')); },
};
