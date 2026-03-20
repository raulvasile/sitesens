import type { Handle } from '@sveltejs/kit';

/**
 * Security headers hook — adds CSP, X-Frame-Options, etc. to all responses.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

	// Content Security Policy
	const csp = [
		`default-src 'self'`,
		`script-src 'self'`,
		`style-src 'self' 'unsafe-inline'`,
		`img-src 'self' ${strapiUrl} data: https:`,
		`font-src 'self' data:`,
		`connect-src 'self' ${strapiUrl}`,
		`frame-src 'none'`,
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

	return response;
};
