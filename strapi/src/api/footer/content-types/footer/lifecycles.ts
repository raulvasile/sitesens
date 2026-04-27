import { purgeEverything } from '../../../../lib/cloudflare-cache';

/** Footer apare pe toate paginile → purge total. */
export default {
  async afterUpdate() { await purgeEverything(); },
};
