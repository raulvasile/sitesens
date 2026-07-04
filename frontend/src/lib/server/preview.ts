import { env } from '$env/dynamic/private';

/**
 * Modul SERVER-ONLY pentru modul preview (draft).
 *
 * A stat inițial în `$lib/strapi.ts` cu `VITE_PREVIEW_SECRET` — dar variabilele
 * VITE_ se inlinează în bundle-ul de CLIENT la build, deci secretul era citibil
 * de oricine din sursa JS. Aici folosim `$env/dynamic/private` (doar runtime
 * server; importul din cod de client aruncă eroare la build — protecție în plus).
 *
 * Acceptă PREVIEW_SECRET (recomandat) sau VITE_PREVIEW_SECRET (compat cu .env existent).
 */
const PREVIEW_SECRET = env.PREVIEW_SECRET ?? env.VITE_PREVIEW_SECRET ?? '';

if (!PREVIEW_SECRET) {
	console.warn('[SENS] PREVIEW_SECRET is not set — preview mode is disabled.');
}

/**
 * Verifică dacă URL-ul curent este în modul preview.
 * Returnează parametrii Strapi necesari pentru draft content.
 *
 * Include și `secret` în parametri: middleware-ul `draft-guard` din Strapi
 * refuză `status=draft` fără el (altfel drafturile ar fi publice).
 */
export function getPreviewStatus(url: URL): { isPreview: boolean; params: Record<string, string> } {
	if (!PREVIEW_SECRET) return { isPreview: false, params: {} };

	const secret = url.searchParams.get('secret');
	const status = url.searchParams.get('status');

	if (secret === PREVIEW_SECRET && status === 'draft') {
		return {
			isPreview: true,
			params: { status: 'draft', secret: PREVIEW_SECRET }
		};
	}

	return { isPreview: false, params: {} };
}
