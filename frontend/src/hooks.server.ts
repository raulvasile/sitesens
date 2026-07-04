import type { Handle } from '@sveltejs/kit';

/**
 * Security headers hook — adds CSP, X-Frame-Options, etc. to all responses.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

	// TikTok embed.js loads scripts/styles/images/iframes from a constellation
	// of CDNs (ttwstatic, tiktokcdn, byteoversea, ibyteimg). We allow all of
	// them so the embed actually renders; without these the script is blocked.
	const tiktokDomains = [
		'https://www.tiktok.com',
		'https://*.tiktok.com',
		'https://*.ttwstatic.com',
		'https://*.tiktokcdn.com',
		'https://*.tiktokcdn-us.com',
		'https://*.byteoversea.com',
		'https://*.ibyteimg.com',
	].join(' ');

	// Content Security Policy
	const csp = [
		`default-src 'self'`,
		`script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.instagram.com ${tiktokDomains} https://www.googletagmanager.com https://www.google-analytics.com`,
		`script-src-elem 'self' 'unsafe-inline' https://connect.facebook.net https://www.instagram.com ${tiktokDomains} https://www.googletagmanager.com https://www.google-analytics.com`,
		`style-src 'self' 'unsafe-inline' ${tiktokDomains} https://www.googletagmanager.com`,
		`style-src-elem 'self' 'unsafe-inline' ${tiktokDomains} https://www.googletagmanager.com`,
		`img-src 'self' ${strapiUrl} data: blob: https: ${tiktokDomains}`,
		`media-src 'self' blob: ${tiktokDomains}`,
		`font-src 'self' data: ${tiktokDomains}`,
		`connect-src 'self' ${strapiUrl} ${tiktokDomains} https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com`,
		`frame-src https://www.facebook.com https://www.instagram.com ${tiktokDomains}`,
		`worker-src 'self' blob:`,
		`object-src 'none'`,
		`base-uri 'self'`,
		`form-action 'self'`,
		`frame-ancestors 'none'`,
	].join('; ');

	response.headers.set('Content-Security-Policy', csp);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('X-XSS-Protection', '0'); // Disabled per modern best practice (CSP is preferred)

	// HSTS — forțează HTTPS 2 ani + preload. Cloudflare poate adăuga și el, dar
	// îl setăm explicit ca să nu depindem de config-ul edge. (audit 2026-07-02 L7)
	response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
	// Izolare cross-origin — reduce suprafața de atac (leak-uri de referință cross-window).
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	// `same-site` (nu `same-origin`): media Strapi + embed-urile terțe trebuie să încarce.
	response.headers.set('Cross-Origin-Resource-Policy', 'same-site');

	// NOTĂ CSP (audit 2026-07-02 M4): CSP-ul de mai sus păstrează `unsafe-inline` +
	// `unsafe-eval`, cerute azi de embed-urile TikTok/GTM. Migrarea la nonce-based
	// (fără `unsafe-eval`) necesită testare live cu embed-urile active + click-to-load
	// — de făcut la Epic 5/6 (analytics), împreună cu cookie-consent.

	// Cache-Control pentru HTML — dacă endpoint-ul nu a setat deja prin setHeaders()
	// 30s fresh, 60s stale-while-revalidate — reduce fetch-urile repetate din SSR
	const contentType = response.headers.get('content-type') ?? '';
	if (contentType.includes('text/html') && !response.headers.has('cache-control')) {
		response.headers.set('cache-control', 'public, max-age=30, stale-while-revalidate=60');
	}

	return response;
};
