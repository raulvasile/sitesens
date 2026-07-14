import type { LayoutServerLoad } from './$types';
import { fetchContent } from '$lib/server/content';
import type { NavigationData, FooterData, SiteThemeData } from './+layout';
import { themeToCssVars } from '$lib/theme';

/**
 * Server-side load for navigation + footer.
 *
 * - Runs once on initial SSR; the response is serialized into the HTML.
 * - On subsequent client-side navigations, SvelteKit automatically reuses
 *   the parent layout data unless `depends(...)` declares an invalidation key,
 *   so these fetches don't repeat on every page change.
 * - A short `Cache-Control` hint lets the browser / CDN cache the HTML chunk
 *   that contains this data.
 */
export const load: LayoutServerLoad = async ({ fetch, setHeaders }) => {
	// `fetchContent` = fetchStrapi + fallback la conținut committat când Strapi e jos
	// (shell-ul — nav/footer/temă — apare pe fiecare pagină, deci fallback-ul lui e critic).
	const [navResult, footerResult, themeResult] = await Promise.all([
		fetchContent<NavigationData>(
			'/navigation',
			{
				'populate[main_menu][populate]': 'children',
				'populate[secondary_menu][populate]': 'children',
				'populate[logo]': 'true',
				'populate[mobile_extra_links]': 'true',
			},
			fetch
		),

		fetchContent<FooterData>(
			'/footer',
			{
				'populate[logo]': 'true',
				'populate[footer_links]': 'true',
				'populate[social_links]': 'true',
			},
			fetch
		),

		fetchContent<SiteThemeData>(
			'/site-theme',
			{
				'populate[brand]': 'true',
				'populate[surfaces]': 'true',
				'populate[accents]': 'true',
				'populate[typography]': 'true',
			},
			fetch
		),
	]);

	const themeCss = themeToCssVars(themeResult?.data ?? null);
	if (import.meta.env.DEV) {
		if (!themeResult?.data) {
			console.warn('[theme] No site-theme data returned. Check Strapi: singleton saved? public find permission set?');
		} else if (!themeCss) {
			console.warn('[theme] site-theme loaded but no overrides emitted (all fields empty or invalid hex).');
		}
	}

	const nav = navResult?.data ?? null;
	if (nav?.main_menu) nav.main_menu.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	if (nav?.secondary_menu) nav.secondary_menu.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

	// Short cache so admin tweaks (theme colors, nav, footer) propagate fast.
	// Stale-while-revalidate keeps the browser/CDN snappy without serving very
	// stale config. SvelteKit's setHeaders throws if a header is already set
	// (e.g. when this layout re-runs to render an error page) — swallow that.
	try {
		setHeaders({
			'cache-control': 'public, max-age=10, stale-while-revalidate=60',
		});
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (!msg.includes('already set')) throw err;
	}

	return {
		_serverNav: nav,
		_serverFooter: footerResult?.data ?? null,
		_themeCss: themeCss,
	};
};
