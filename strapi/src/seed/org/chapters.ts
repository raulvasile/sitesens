import type { Core } from '@strapi/strapi';
import { slugifyRo, seedCollection } from '../helpers';

/**
 * Filiale (organizații locale) — /filiale/[slug]. TODO(content): completează.
 * Shape per item (vezi schema chapter):
 *   { name: string, county?: <documentId județ>, email?, phone?, address?, is_active?: boolean }
 * Slug-ul se generează din `name`. `content` (dynamic zone) + `coordinators` +
 * `cover_image` se completează de obicei din CMS.
 *
 * NOTĂ: dacă legi `county`, seed-ul de taxonomii (județe) trebuie să ruleze înainte
 * — ceea ce se întâmplă (runSeed: taxonomii → org → base).
 */
const CHAPTERS: Array<Record<string, unknown>> = [
  // { name: 'Cluj', is_active: true },
];

export async function seedChapters(strapi: Core.Strapi) {
  const items = CHAPTERS.map((c) => ({ ...c, slug: slugifyRo(String(c.name ?? '')) }));
  await seedCollection(strapi, 'api::chapter.chapter', items, 'slug', 'Filiale');
}
