import type { LayoutServerLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';
import type { NavigationData, FooterData } from './+layout';

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
	const [navResult, footerResult] = await Promise.all([
		fetchStrapi<NavigationData>(
			'/navigation',
			{
				'populate[main_menu][populate]': 'children',
				'populate[secondary_menu][populate]': 'children',
				'populate[logo]': 'true',
				'populate[mobile_extra_links]': 'true',
			},
			undefined,
			fetch
		).catch(() => null),

		fetchStrapi<FooterData>(
			'/footer',
			{
				'populate[logo]': 'true',
				'populate[footer_links]': 'true',
				'populate[social_links]': 'true',
			},
			undefined,
			fetch
		).catch(() => null),
	]);

	const nav = navResult?.data ?? null;
	if (nav?.main_menu) nav.main_menu.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	if (nav?.secondary_menu) nav.secondary_menu.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

	// Cache public navigation + footer for 60s (fresh) + 300s (stale-while-revalidate).
	setHeaders({
		'cache-control': 'public, max-age=60, stale-while-revalidate=300',
	});

	return {
		_serverNav: nav,
		_serverFooter: footerResult?.data ?? null,
	};
};
