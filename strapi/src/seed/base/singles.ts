import type { Core } from '@strapi/strapi';
import { seedSingle } from '../helpers';

/**
 * Restul paginilor single-type (conținut fix, editabil din CMS).
 * TODO(content): completează fiecare obiect. Fiecare are propriul shape — vezi
 * schema content-type-ului corespunzător. Toate sunt gate-uite: dacă obiectul e
 * gol, `seedSingle` nu creează nimic (frontend-ul cade pe fallback).
 */
const SINGLES: Array<{ uid: string; label: string; data: Record<string, unknown> }> = [
  { uid: 'api::contact-page.contact-page', label: 'Pagina Contact', data: {} },
  { uid: 'api::donate-page.donate-page', label: 'Pagina Donații', data: {} },
  { uid: 'api::inscription-page.inscription-page', label: 'Pagina Înscriere', data: {} },
  { uid: 'api::newsletter-page.newsletter-page', label: 'Pagina Newsletter', data: {} },
  { uid: 'api::community-page.community-page', label: 'Pagina Comunitate', data: {} },
  { uid: 'api::privacy-policy-page.privacy-policy-page', label: 'Politica de confidențialitate', data: {} },
  { uid: 'api::events-page.events-page', label: 'Pagina Evenimente', data: {} },
];

export async function seedSingles(strapi: Core.Strapi) {
  for (const s of SINGLES) {
    if (Object.keys(s.data).length === 0) continue; // scaffold gol → sări
    await seedSingle(strapi, s.uid, s.data, s.label);
  }
}
