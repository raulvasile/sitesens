import type { Core } from '@strapi/strapi';

/**
 * Slugify cu suport pentru diacritice românești. `uid`-ul Strapi NU se
 * auto-completează la create programatic (doar în admin UI), deci generăm slug-ul
 * manual la seed. Ex: „Bistrița-Năsăud" → „bistrita-nasaud".
 */
export function slugifyRo(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // elimină semnele diacritice combinate
    .replace(/[șş]/gi, 's')
    .replace(/[țţ]/gi, 't')
    .replace(/ă/gi, 'a')
    .replace(/â/gi, 'a')
    .replace(/î/gi, 'i')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Upsert idempotent pentru un SINGLE TYPE. Creează entry-ul dacă nu există,
 * altfel îl lasă neatins (nu suprascrie edituri făcute din CMS). Publică direct.
 * Folosește-l în modulele din `base/` pentru homepage, navigation, footer, etc.
 */
export async function seedSingle(
  strapi: Core.Strapi,
  uid: string,
  data: Record<string, unknown>,
  label = uid
): Promise<void> {
  const existing = await strapi.documents(uid as any).findFirst();
  // Considerăm „populat" dacă are deja orice câmp de conținut (nu doar shell gol).
  if (existing && Object.keys(existing).some((k) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale'].includes(k) && (existing as any)[k] != null)) {
    return;
  }
  try {
    await strapi.documents(uid as any).create({ data: data as any, status: 'published' });
    strapi.log.info(`🌱 [seed] ${label} — creat.`);
  } catch (err) {
    strapi.log.warn(`[seed] ${label} eșuat: ${err}`);
  }
}

/**
 * Upsert idempotent pentru itemi de COLLECTION TYPE, pe baza unui câmp-cheie
 * (ex. `name` sau `slug`). Creează doar cei lipsă; nu duplică. Publică direct.
 * Folosește-l pentru taxonomii (categorii, tag-uri, județe) și org (echipă, filiale).
 */
export async function seedCollection(
  strapi: Core.Strapi,
  uid: string,
  items: Array<Record<string, unknown>>,
  keyField = 'slug',
  label = uid
): Promise<void> {
  if (!items.length) return;
  let added = 0;
  for (const item of items) {
    const keyVal = item[keyField];
    if (keyVal == null) continue;
    const existing = await strapi.documents(uid as any).findMany({
      filters: { [keyField]: keyVal } as any,
      limit: 1,
    });
    if (existing.length === 0) {
      try {
        await strapi.documents(uid as any).create({ data: item as any, status: 'published' });
        added++;
      } catch (err) {
        strapi.log.warn(`[seed] ${label} „${String(keyVal)}" eșuat: ${err}`);
      }
    }
  }
  if (added > 0) strapi.log.info(`🌱 [seed] ${label} — ${added} adăugate.`);
}
