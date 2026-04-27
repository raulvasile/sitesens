import { purgeEverything } from '../../../../lib/cloudflare-cache';

/**
 * Etichetele apar pe articolele care le folosesc + ca filtre pe /stiri.
 * Update-uri rare → purge total e cea mai sigură cale.
 */
export default {
  async afterUpdate() { await purgeEverything(); },
  async afterCreate() { await purgeEverything(); },
  async afterDelete() { await purgeEverything(); },
};
