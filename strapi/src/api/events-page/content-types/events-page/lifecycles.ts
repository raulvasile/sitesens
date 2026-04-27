import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/** /evenimente listing single-type. */
export default {
  async afterUpdate() { await purgeUrls(cacheUrls.fixed('/evenimente')); },
};
