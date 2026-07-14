import type { Core } from '@strapi/strapi';
import { slugifyRo, seedCollection } from '../helpers';

/**
 * Domeniile de interes din formularul de înscriere.
 *
 * ⚠️ COUPLING: valorile `name` trebuie să rămână sincron cu `VALID_INTERESTS` din
 * `src/api/membership-request/controllers/membership-request.ts` (controllerul
 * validează interesele trimise împotriva acelei liste). Modifici aici → modifici și acolo.
 */
const INTEREST_AREAS = [
  { name: 'Mediu', icon: '🌱', description: 'Protecția naturii, biodiversitate, arii protejate.' },
  { name: 'Educație', icon: '📚', description: 'Reforma educațională, acces și calitate.' },
  { name: 'Sănătate', icon: '❤️', description: 'Sistem de sănătate centrat pe prevenție.' },
  { name: 'Sustenabilitate', icon: '♻️', description: 'Tranziție verde, economie circulară.' },
  { name: 'Tineret', icon: '🌟', description: 'Politici pentru generația tânără.' },
  { name: 'Digitalizare', icon: '💻', description: 'Guvernare digitală, servicii moderne.' },
  { name: 'Agricultură', icon: '🌾', description: 'Agricultură ecologică, securitate alimentară.' },
  { name: 'Transport', icon: '🚊', description: 'Transport public verde, mobilitate activă.' },
  { name: 'Energie', icon: '⚡', description: 'Energie regenerabilă, independență energetică.' },
];

export async function seedInterestAreas(strapi: Core.Strapi) {
  const items = INTEREST_AREAS.map((a, i) => ({ ...a, slug: slugifyRo(a.name), order: i }));
  await seedCollection(strapi, 'api::interest-area.interest-area', items, 'slug', 'Domenii de interes');
}
