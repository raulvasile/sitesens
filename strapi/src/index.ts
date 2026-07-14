import type { Core } from '@strapi/strapi';
import { setupPublicPermissions, hardenAuth } from './seed/permissions';
import { configureAdminLabels } from './seed/admin-labels';
import { runSeed } from './seed';

/**
 * Bootstrap Strapi — orchestrare. Logica reală trăiește în `src/seed/`:
 *   - `seed/permissions.ts` — permisiuni publice + PII lockdown + hardening auth (securitate)
 *   - `seed/admin-labels.ts` — etichete RO pentru panoul admin (UX editori)
 *   - `seed/index.ts` → taxonomies / org / base — CONȚINUT real (hibrid: bază în seed,
 *     editorial în CMS). Vezi `seed/index.ts` pentru strategie și ordine.
 *
 * Tot ce se rulează aici e IDEMPOTENT — sigur la fiecare restart / clean deploy.
 */
export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ── Securitate (mereu) ──
    await setupPublicPermissions(strapi);
    await hardenAuth(strapi);

    // ── Conținut de bază (idempotent; scaffold-urile goale nu fac nimic) ──
    await runSeed(strapi);

    // ── UX admin: etichete RO pe câmpuri ──
    await configureAdminLabels(strapi);
  },
};
