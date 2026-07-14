import type { Core } from '@strapi/strapi';
import { seedTaxonomies } from './taxonomies';
import { seedOrg } from './org';
import { seedBase } from './base';

/**
 * Orchestrator seed — CONȚINUT REAL (idempotent). Rulat la bootstrap după
 * `setupPublicPermissions` + `hardenAuth`.
 *
 * Ordinea contează:
 *   1. taxonomii  (județe, interese, categorii, etichete) — referință + clasificare
 *   2. org        (echipă, filiale) — pot lega taxonomii
 *   3. base       (temă, navigație, footer, homepage, pagini fixe) — pot referi org/taxonomii
 *
 * Strategie (decizie proiect 2026-07-04): HIBRID — baza + structura în seed
 * (re-rulabil pe clean deploy), editorialul (articole/evenimente) din CMS.
 * Modulele editoriale NU se seedează aici; se scriu din admin.
 *
 * Fiecare modul e idempotent (creează doar ce lipsește, nu suprascrie edituri CMS).
 * Scaffold-urile goale (TODO(content)) nu creează nimic până nu completezi datele.
 */
export async function runSeed(strapi: Core.Strapi) {
  await seedTaxonomies(strapi);
  await seedOrg(strapi);
  await seedBase(strapi);
}
