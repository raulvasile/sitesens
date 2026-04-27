import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/** Homepage single-type → invalidează doar `/`. */
export default {
  async afterUpdate() { await purgeUrls(cacheUrls.fixed('/')); },
};
