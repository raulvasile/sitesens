import type { Core } from '@strapi/strapi';
import { slugifyRo, seedCollection } from '../helpers';

/**
 * Cele 42 de județe (41 + București). Date de REFERINȚĂ, nu conținut editorial —
 * lista e stabilă și necesară pentru filtrele `?judet=` + formularul de înscriere.
 */
const COUNTIES = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea',
];

export async function seedCounties(strapi: Core.Strapi) {
  const items = COUNTIES.map((name, i) => ({ name, slug: slugifyRo(name), order: i }));
  await seedCollection(strapi, 'api::county.county', items, 'slug', 'Județe');
}
