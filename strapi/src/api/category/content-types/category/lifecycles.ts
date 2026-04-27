import { purgeEverything } from '../../../../lib/cloudflare-cache';

/**
 * Categoria apare pe fiecare card de articol din lista /stiri și pe fiecare
 * pagină de articol care o folosește. Update-uri rare → purge total e cea mai
 * sigură cale.
 */
export default {
  async afterUpdate() { await purgeEverything(); },
  async afterCreate() { await purgeEverything(); },
  async afterDelete() { await purgeEverything(); },
};
