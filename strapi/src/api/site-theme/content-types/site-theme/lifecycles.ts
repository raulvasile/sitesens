import { purgeEverything } from '../../../../lib/cloudflare-cache';

/**
 * Tema (culori + fonturi) sunt injectate ca CSS variables în <head>-ul tuturor
 * paginilor → orice schimbare invalidează tot cache-ul HTML.
 */
export default {
  async afterUpdate() { await purgeEverything(); },
};
