import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/** /inscrie-te single-type. */
export default {
  async afterUpdate() { await purgeUrls(cacheUrls.fixed('/inscrie-te')); },
};
