import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/** /contact single-type. */
export default {
  async afterUpdate() { await purgeUrls(cacheUrls.fixed('/contact')); },
};
