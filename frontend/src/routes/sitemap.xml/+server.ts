import type { RequestHandler } from './$types';
import { fetchStrapi } from '$lib/strapi';

const SITE_URL = 'https://partidulsens.ro';

interface SlugItem {
	slug: string;
	updatedAt?: string;
}

/**
 * Generare sitemap.xml cu toate rutele publice ale site-ului.
 * Fetch-uiește articole, evenimente și pagini din Strapi.
 */
export const GET: RequestHandler = async ({ fetch }) => {
	const [articles, events, pages] = await Promise.all([
		fetchSlugs('/articles', fetch),
		fetchSlugs('/events', fetch),
		fetchSlugs('/pages', fetch),
	]);

	const staticRoutes = [
		{ loc: '/', priority: '1.0', changefreq: 'daily' },
		{ loc: '/stiri', priority: '0.9', changefreq: 'daily' },
		{ loc: '/evenimente', priority: '0.8', changefreq: 'weekly' },
		{ loc: '/contact', priority: '0.6', changefreq: 'monthly' },
		{ loc: '/doneaza', priority: '0.7', changefreq: 'monthly' },
		{ loc: '/inscrie-te', priority: '0.7', changefreq: 'monthly' },
		{ loc: '/comunitate', priority: '0.5', changefreq: 'weekly' },
		{ loc: '/newsletter', priority: '0.5', changefreq: 'monthly' },
		{ loc: '/politica-confidentialitate', priority: '0.3', changefreq: 'yearly' },
	];

	const dynamicRoutes = [
		...articles.map((a) => ({
			loc: `/stiri/${a.slug}`,
			lastmod: a.updatedAt,
			priority: '0.7',
			changefreq: 'weekly',
		})),
		...events.map((e) => ({
			loc: `/evenimente/${e.slug}`,
			lastmod: e.updatedAt,
			priority: '0.6',
			changefreq: 'weekly',
		})),
		...pages.map((p) => ({
			loc: `/${p.slug}`,
			lastmod: p.updatedAt,
			priority: '0.7',
			changefreq: 'monthly',
		})),
	];

	const allRoutes: { loc: string; priority: string; changefreq: string; lastmod?: string }[] = [
		...staticRoutes,
		...dynamicRoutes,
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
	.map(
		(route) => `  <url>
    <loc>${SITE_URL}${route.loc}</loc>${route.lastmod ? `\n    <lastmod>${route.lastmod.split('T')[0]}</lastmod>` : ''}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600',
		},
	});
};

/**
 * Fetch all slugs (with pagination) from a Strapi collection.
 */
async function fetchSlugs(endpoint: string, fetchFn: typeof fetch): Promise<SlugItem[]> {
	const items: SlugItem[] = [];
	let page = 1;
	let pageCount = 1;

	try {
		while (page <= pageCount) {
			const res = await fetchStrapi<SlugItem[]>(endpoint, {
				'fields[0]': 'slug',
				'fields[1]': 'updatedAt',
				'pagination[page]': String(page),
				'pagination[pageSize]': '100',
				'sort': 'updatedAt:desc',
			}, undefined, fetchFn);

			if (res.data) {
				items.push(...res.data);
			}
			pageCount = res.meta?.pagination?.pageCount ?? 1;
			page++;
		}
	} catch {
		// Strapi unavailable — return what we have
	}

	return items;
}
