import { purgeUrls, cacheUrls } from '../../../../lib/cloudflare-cache';

const UID = 'api::chapter-page.chapter-page';

/**
 * Extrage id-ul filialei din `params.data.chapter`, care în Strapi v5 poate fi:
 *   - un număr (id) — prin REST API,
 *   - { connect: [{ id }] } / { set: [{ id }] } — din admin panel,
 *   - { connect: [id] } / [id] — variante.
 * Returnează id-ul sau null dacă nu e prezent (ex. update care nu atinge relația).
 */
function extractChapterId(rel: unknown): number | null {
  if (rel == null) return null;
  if (typeof rel === 'number') return rel;
  if (typeof rel === 'string') return Number(rel) || null;
  if (Array.isArray(rel)) {
    const first = rel[0];
    if (typeof first === 'number') return first;
    if (first && typeof first === 'object' && 'id' in first) return Number((first as any).id) || null;
    return null;
  }
  if (typeof rel === 'object') {
    const obj = rel as Record<string, any>;
    const arr = obj.connect ?? obj.set;
    if (Array.isArray(arr) && arr.length > 0) {
      const first = arr[0];
      return typeof first === 'number' ? first : Number(first?.id) || null;
    }
    if ('id' in obj) return Number(obj.id) || null;
  }
  return null;
}

/**
 * Impune unicitatea slug-ului PER filială (chapter + slug).
 * `uid` din Strapi e unic global → nu se poate folosi aici; validăm manual.
 * Pattern: controller membership-request (validare custom + respingere).
 */
async function assertUniqueSlug(event: any) {
  const { data } = event.params;
  const where = event.params.where as { id?: number } | undefined;
  const currentId = where?.id;

  // Determină slug-ul și filiala efective (pe update pot lipsi din `data`).
  let slug: string | undefined = data?.slug;
  let chapterId: number | null = extractChapterId(data?.chapter);

  // Pe update, dacă slug sau chapter nu sunt în payload, citește înregistrarea existentă.
  if ((!slug || chapterId == null) && currentId) {
    const existing = await strapi.db.query(UID).findOne({
      where: { id: currentId },
      populate: { chapter: true },
    });
    if (!slug) slug = existing?.slug;
    if (chapterId == null) chapterId = existing?.chapter?.id ?? null;
  }

  if (!slug || chapterId == null) return; // nimic de validat

  const duplicate = await strapi.db.query(UID).findOne({
    where: {
      slug,
      chapter: chapterId,
      ...(currentId ? { id: { $ne: currentId } } : {}),
    },
  });

  if (duplicate) {
    throw new Error(
      `Slug-ul „${slug}" există deja la această filială. Alege un slug unic în cadrul filialei.`
    );
  }
}

/** Rezolvă slug-ul filialei pentru URL-ul de purge (nu e în `result` by default). */
async function chapterSlugFor(result: any): Promise<string | undefined> {
  if (result?.chapter?.slug) return result.chapter.slug;
  if (!result?.id) return undefined;
  const row = await strapi.db.query(UID).findOne({
    where: { id: result.id },
    populate: { chapter: true },
  });
  return row?.chapter?.slug;
}

export default {
  async beforeCreate(event: any) {
    await assertUniqueSlug(event);
  },
  async beforeUpdate(event: any) {
    await assertUniqueSlug(event);
  },
  async afterCreate({ result }: any) {
    const chapterSlug = await chapterSlugFor(result);
    await purgeUrls(cacheUrls.chapterPage(chapterSlug, result?.slug));
  },
  async afterUpdate({ result }: any) {
    const chapterSlug = await chapterSlugFor(result);
    await purgeUrls(cacheUrls.chapterPage(chapterSlug, result?.slug));
  },
  async afterDelete({ result }: any) {
    const chapterSlug = await chapterSlugFor(result);
    await purgeUrls(cacheUrls.chapterPage(chapterSlug, result?.slug));
  },
};
