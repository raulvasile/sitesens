import type { Core } from '@strapi/strapi';
import { seedTheme } from './theme';
import { seedNavigation } from './navigation';
import { seedFooter } from './footer';
import { seedHomepage } from './homepage';
import { seedSingles } from './singles';

/**
 * Conținut de bază: shell (temă, navigație, footer) + pagini fixe (homepage + singles).
 * Acesta e conținutul care se OGLINDEȘTE și în fallback-ul frontend
 * (`frontend/src/lib/server/fallback/`) — vezi acel README. Rulează ULTIMUL.
 */
export async function seedBase(strapi: Core.Strapi) {
  await seedTheme(strapi);
  await seedNavigation(strapi);
  await seedFooter(strapi);
  await seedHomepage(strapi);
  await seedSingles(strapi);
}
