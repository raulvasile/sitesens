import type { Core } from '@strapi/strapi';
import { seedSingle } from '../helpers';

/**
 * Meniul principal + secundar — single type `navigation`.
 * TODO(content): completează. Shape (vezi schema navigation):
 *   main_menu: [{ label, url, order, children?: [{ label, url }] }]
 *   secondary_menu: [...], mobile_extra_links: [...], logo: <media>
 */
const NAVIGATION: Record<string, unknown> = {
  // main_menu: [{ label: 'Știri', url: '/stiri', order: 0 }],
};

export async function seedNavigation(strapi: Core.Strapi) {
  await seedSingle(strapi, 'api::navigation.navigation', NAVIGATION, 'Navigație');
}
