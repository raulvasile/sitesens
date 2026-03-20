import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML string — strips dangerous tags/attributes (scripts, event handlers, etc).
 * Uses DOMPurify with a restrictive allowlist suitable for CMS rich-text content.
 */
export function sanitizeHtml(dirty: string): string {
	if (!dirty) return '';

	return DOMPurify.sanitize(dirty, {
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
		// Force all links to have rel="noopener noreferrer"
		FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
		FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
	});
}

/**
 * Sanitize SVG string — allows only safe SVG elements.
 * Used for inline SVG icons from CMS or local icon library.
 */
export function sanitizeSvg(dirty: string): string {
	if (!dirty) return '';

	return DOMPurify.sanitize(dirty, {
		USE_PROFILES: { svg: true, svgFilters: true },
		ALLOW_DATA_ATTR: false,
		FORBID_ATTR: ['onerror', 'onload', 'onclick', 'style'],
	});
}

/**
 * Validate and sanitize a URL — blocks javascript:, data:, and vbscript: protocols.
 * Returns empty string for dangerous URLs.
 */
export function sanitizeUrl(url: string): string {
	if (!url) return '';

	const trimmed = url.trim();

	// Block dangerous protocols
	const dangerous = /^(javascript|data|vbscript|blob):/i;
	if (dangerous.test(trimmed)) return '';

	// Allow relative URLs, http, https, mailto, tel
	const safe = /^(https?:\/\/|mailto:|tel:|\/|#)/i;
	if (safe.test(trimmed) || !trimmed.includes(':')) return trimmed;

	return '';
}
