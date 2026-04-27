import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

/** /comunitate single-type. */
export default {
  async afterUpdate() { await purgeUrls(cacheUrls.fixed('/comunitate')); },
};
