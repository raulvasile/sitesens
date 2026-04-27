import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/** /newsletter single-type. */
export default {
  async afterUpdate() { await purgeUrls(cacheUrls.fixed('/newsletter')); },
};
