import type { PageServerLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';
import { getPreviewStatus } from '$lib/server/preview';
import { error } from '@sveltejs/kit';

export interface EventDetail {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	description: any[];
	start_date: string;
	end_date: string | null;
	location_name: string | null;
	venue: string | null;
	city: string | null;
	cover_image: { url: string; alternativeText: string | null; width: number; height: number; caption?: string | null } | null;
	max_participants: number | null;
	spots_taken: number | null;
	is_featured: boolean | null;
	registration_open: boolean;
	registration_url: string | null;
	event_type: 'dezbatere' | 'actiune' | 'mars' | 'online';
	social_posts_description: string | null;
	social_posts: Array<{ platform: string; url: string }>;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
	} | null;
}

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	const [res, relatedRes] = await Promise.all([
		fetchStrapi<EventDetail[]>('/events', {
			'filters[slug][$eq]': params.slug,
			'populate[cover_image][fields][0]': 'url',
			'populate[cover_image][fields][1]': 'alternativeText',
			'populate[cover_image][fields][2]': 'width',
			'populate[cover_image][fields][3]': 'height',
			'populate[cover_image][fields][4]': 'caption',
			'populate[social_posts]': 'true',
			'populate[seo]': 'true',
			...previewParams,
		}, undefined, fetch),
		fetchStrapi<EventDetail[]>('/events', {
			'filters[slug][$ne]': params.slug,
			'filters[start_date][$gte]': new Date().toISOString(),
			'sort[0]': 'start_date:asc',
			'pagination[pageSize]': '4',
			'populate[cover_image][fields][0]': 'url',
		}, undefined, fetch).catch(() => ({ data: [] as EventDetail[] })),
	]);

	const event = res.data?.[0];
	if (!event) {
		throw error(404, 'Evenimentul nu a fost găsit');
	}

	const isPast = new Date(event.start_date) < new Date();
	const relatedEvents = ((relatedRes as { data?: EventDetail[] }).data ?? []).slice(0, 3);

	return { event, isPast, relatedEvents };
};
