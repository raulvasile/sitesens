import type { Core } from '@strapi/strapi';
import { seedCounties } from './counties';
import { seedInterestAreas } from './interest-areas';
import { seedCategories } from './categories';
import { seedTags } from './tags';

/**
 * Taxonomii — date de referință + clasificare. Rulează PRIMUL (org & base pot referi).
 * Județele și domeniile de interes sunt referință stabilă; categoriile și etichetele
 * sunt editoriale (scaffold gol până la lista de conținut).
 */
export async function seedTaxonomies(strapi: Core.Strapi) {
  await seedCounties(strapi);
  await seedInterestAreas(strapi);
  await seedCategories(strapi);
  await seedTags(strapi);
}
