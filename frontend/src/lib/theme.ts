import type { SiteThemeData } from '../routes/+layout';

/**
 * Maps theme attribute keys to the CSS custom property names used in app.css.
 * Each entry: [strapiKey, cssVarName]. Order is preserved for deterministic CSS output.
 */
const COLOR_MAP: Array<[group: 'brand' | 'surfaces' | 'accents', key: string, cssVar: string]> = [
	['brand', 'green_deep', '--color-green-deep'],
	['brand', 'green_dark', '--color-green-dark'],
	['brand', 'green_mid', '--color-green-mid'],
	['brand', 'green_soft', '--color-green-soft'],
	['brand', 'green_bright', '--color-green-bright'],
	['brand', 'lime', '--color-lime'],
	['brand', 'pastel_green', '--color-pastel-green'],
	['surfaces', 'paper', '--color-paper'],
	['surfaces', 'cream', '--color-cream'],
	['surfaces', 'ink', '--color-ink'],
	['surfaces', 'ink_soft', '--color-ink-soft'],
	['accents', 'rose', '--color-rose'],
	['accents', 'error', '--color-error'],
];

const FONT_MAP: Array<[key: 'font_display' | 'font_body' | 'font_mono', cssVar: string]> = [
	['font_display', '--font-display'],
	['font_body', '--font-body'],
	['font_mono', '--font-mono'],
];

/** Strict hex color guard so we never inject arbitrary CSS payloads. */
const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

/**
 * Font-family values can contain quotes & commas; we validate that they
 * contain only safe font-family characters and disallow ; { } < > to prevent
 * CSS injection.
 */
const FONT_RE = /^[\w\s,'"\-.()]+$/;

/**
 * Build a CSS string overriding :root custom properties with values from the
 * Strapi `site-theme` singleton. Returns empty string if theme is missing or
 * has no overrides — defaults from app.css then apply.
 */
export function themeToCssVars(theme: SiteThemeData | null): string {
	if (!theme) return '';

	const lines: string[] = [];

	for (const [group, key, cssVar] of COLOR_MAP) {
		const groupObj = theme[group] as Record<string, string | null | undefined> | null | undefined;
		const value = groupObj?.[key];
		if (value && HEX_RE.test(value)) {
			// !important on custom properties guarantees override regardless of
			// the order in which Vite injects app.css vs our <style> in <head>.
			lines.push(`${cssVar}: ${value} !important;`);
		}
	}

	for (const [key, cssVar] of FONT_MAP) {
		const value = theme.typography?.[key];
		if (value && FONT_RE.test(value)) {
			lines.push(`${cssVar}: ${value} !important;`);
		}
	}

	if (lines.length === 0) return '';
	return `:root{${lines.join('')}}`;
}
