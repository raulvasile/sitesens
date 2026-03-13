import type { PageLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';

export interface HomepageData {
	hero_title: string;
	hero_subtitle: string | null;
	hero_cta_text: string | null;
	hero_cta_link: string | null;
	hero_image: { url: string; alternativeText: string | null } | null;
	values: Array<{
		title: string;
		short_text: string;
		description: string;
		link_text: string | null;
		link_url: string | null;
		points: Array<{ text: string }>;
	}>;
	program_points: Array<{
		area: string;
		text: string;
	}>;
	newsletter_title: string | null;
	newsletter_description: string | null;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageLoad = async () => {
	const [homepage, articlesRes, eventsRes] = await Promise.all([
		fetchStrapi<HomepageData>('/homepage', { 'populate': '*' }).catch(() => null),
		fetchStrapi('/articles', {
			'populate[cover_image]': 'true',
			'populate[category]': 'true',
			'populate[author]': 'true',
			'sort[0]': 'createdAt:desc',
			'pagination[pageSize]': '3',
		}).catch(() => ({ data: [], meta: {} })),
		fetchStrapi('/events', {
			'populate': '*',
			'filters[start_date][$gte]': new Date().toISOString(),
			'sort[0]': 'start_date:asc',
			'pagination[pageSize]': '3',
		}).catch(() => ({ data: [], meta: {} })),
	]);

	return {
		homepage: homepage?.data ?? null,
		latestArticles: (articlesRes as any)?.data ?? [],
		upcomingEvents: (eventsRes as any)?.data ?? [],
	};
};
