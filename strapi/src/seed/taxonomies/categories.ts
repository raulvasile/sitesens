import type { Core } from '@strapi/strapi';
import { slugifyRo, seedCollection } from '../helpers';

/**
 * Categorii de articole (chip color pe carduri + filtru în /stiri).
 * TODO(content): completează lista reală. Shape per item:
 *   { name: string, color?: '#rrggbb', description?: string }
 * Slug-ul se generează automat din `name`.
 */
const CATEGORIES: Array<{ name: string; color?: string; description?: string }> = [
  // { name: 'Mediu', color: '#2e7d32', description: 'Politici de mediu și climă.' },
];

export async function seedCategories(strapi: Core.Strapi) {
  const items = CATEGORIES.map((c) => ({ ...c, slug: slugifyRo(c.name) }));
  await seedCollection(strapi, 'api::category.category', items, 'slug', 'Categorii');
}
