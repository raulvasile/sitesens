import type { Core } from '@strapi/strapi';
import { seedSingle } from '../helpers';

/**
 * Pagina principală — single type `homepage`.
 * TODO(content): completează. `content` e un dynamic zone (blocuri: hero,
 * word-carousel, featured-campaigns, latest-articles, etc.). Vezi catalogul de
 * blocuri în MANUAL_CONTENT/03-dynamic-zone.
 */
const HOMEPAGE: Record<string, unknown> = {
  // content: [ { __component: 'blocks.hero', title: '...' } ],
  // seo: { meta_title: '...', meta_description: '...' },
};

export async function seedHomepage(strapi: Core.Strapi) {
  await seedSingle(strapi, 'api::homepage.homepage', HOMEPAGE, 'Homepage');
}
