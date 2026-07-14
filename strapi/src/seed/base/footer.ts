import type { Core } from '@strapi/strapi';
import { seedSingle } from '../helpers';

/**
 * Subsolul — single type `footer`.
 * TODO(content): completează. Shape (vezi schema footer):
 *   footer_links: [{ label, url }], social_links: [{ platform, url }], logo: <media>
 */
const FOOTER: Record<string, unknown> = {
  // footer_links: [{ label: 'Contact', url: '/contact' }],
};

export async function seedFooter(strapi: Core.Strapi) {
  await seedSingle(strapi, 'api::footer.footer', FOOTER, 'Footer');
}
