import type { Core } from '@strapi/strapi';
import { slugifyRo, seedCollection } from '../helpers';

/**
 * Etichete de articole (chip cu # la finalul articolului + filtru /stiri?tag=).
 * TODO(content): completează lista reală. Shape per item: { name: string }.
 * Slug-ul se generează automat din `name`.
 */
const TAGS: Array<{ name: string }> = [
  // { name: 'clima' },
];

export async function seedTags(strapi: Core.Strapi) {
  const items = TAGS.map((t) => ({ ...t, slug: slugifyRo(t.name) }));
  await seedCollection(strapi, 'api::tag.tag', items, 'slug', 'Etichete');
}
