import type { Core } from '@strapi/strapi';
import { seedTeam } from './team';
import { seedChapters } from './chapters';

/**
 * Structura organizației: echipă + filiale. Rulează după taxonomii (filialele pot
 * lega județe) și înainte de base (paginile pot referi echipa/filialele).
 */
export async function seedOrg(strapi: Core.Strapi) {
  await seedTeam(strapi);
  await seedChapters(strapi);
}
