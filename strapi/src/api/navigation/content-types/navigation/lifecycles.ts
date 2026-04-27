import { purgeEverything } from '../../../../lib/cloudflare-cache';

/** Header apare pe toate paginile → purge total. */
export default {
  async afterUpdate() { await purgeEverything(); },
};
