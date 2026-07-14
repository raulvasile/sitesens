import type { Core } from '@strapi/strapi';
import { seedSingle } from '../helpers';

/**
 * Tema site-ului (culori, tipografie) — single type `site-theme`.
 * TODO(content): completează. Componente: brand, surfaces, accents, typography.
 * Culorile trebuie să fie hex valid (`#rrggbb`) — frontend-ul validează strict.
 */
const THEME: Record<string, unknown> = {
  // brand: { primary: '#...', ... },
  // typography: { ... },
};

export async function seedTheme(strapi: Core.Strapi) {
  await seedSingle(strapi, 'api::site-theme.site-theme', THEME, 'Temă site');
}
