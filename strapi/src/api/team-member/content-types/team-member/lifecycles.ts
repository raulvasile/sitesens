import { purgeEverything } from '../../../../lib/cloudflare-cache';

/**
 * Membrii apar în:
 *  - blocuri TeamGrid (pe oricâte pagini din DZ)
 *  - byline-ul fiecărui articol pe care l-au scris
 * Imposibil de enumerat exact URL-urile → purge total e cea mai sigură cale.
 */
export default {
  async afterUpdate() { await purgeEverything(); },
  async afterCreate() { await purgeEverything(); },
  async afterDelete() { await purgeEverything(); },
};
