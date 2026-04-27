import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/** /doneaza single-type. */
export default {
  async afterUpdate() { await purgeUrls(cacheUrls.fixed('/doneaza')); },
};
