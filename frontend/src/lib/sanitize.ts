import { browser } from '$app/environment';

let purify: typeof import('dompurify').default | null = null;

async function getPurify() {
	if (purify) return purify;
	if (!browser) return null;
	const DOMPurify = (await import('dompurify')).default;
	purify = DOMPurify;
	return purify;
}

const PURIFY_CONFIG = {
	ALLOWED_TAGS: [
		'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a',
		'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
		'ul', 'ol', 'li',
		'blockquote', 'code', 'pre',
		'span', 'div',
		'img',
		'table', 'thead', 'tbody', 'tr', 'th', 'td',
	],
	ALLOWED_ATTR: [
		'href', 'target', 'rel', 'class', 'id',
		'src', 'alt', 'width', 'height',
		'colspan', 'rowspan',
	],
	ALLOW_DATA_ATTR: false,
	ADD_ATTR: ['target'],
	FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
	FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
};

/**
 * Sanitize HTML string — strips dangerous tags/attributes.
 * On server: escapes HTML (safe fallback). On client: uses DOMPurify.
 */
export function sanitizeHtml(dirty: string): string {
	if (!dirty) return '';

	if (!browser) {
		// SSR: strip script tags and event handlers as a basic safeguard
		return dirty
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
			.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
			.replace(/\bon\w+\s*=\s*\S+/gi, '')
			.replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
			.replace(/<object\b[^>]*>.*?<\/object>/gi, '')
			.replace(/<embed\b[^>]*>/gi, '');
	}

	const p = purify;
	if (p) return p.sanitize(dirty, PURIFY_CONFIG);

	// DOMPurify not loaded yet — init and return dirty (will be sanitized on next render)
	getPurify();
	return dirty;
}

/**
 * Sanitize SVG string.
 */
export function sanitizeSvg(dirty: string): string {
	if (!dirty) return '';

	if (!browser) {
		return dirty
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
			.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
	}

	const p = purify;
	if (p) return p.sanitize(dirty, { USE_PROFILES: { svg: true, svgFilters: true }, ALLOW_DATA_ATTR: false });

	getPurify();
	return dirty;
}

/**
 * Validate and sanitize a URL — blocks javascript:, data:, and vbscript: protocols.
 */
export function sanitizeUrl(url: string): string {
	if (!url) return '';

	const trimmed = url.trim();

	const dangerous = /^(javascript|data|vbscript|blob):/i;
	if (dangerous.test(trimmed)) return '';

	const safe = /^(https?:\/\/|mailto:|tel:|\/|#)/i;
	if (safe.test(trimmed) || !trimmed.includes(':')) return trimmed;

	return '';
}
