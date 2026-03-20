import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';
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
	location_coords: { lat: number; lng: number } | null;
	cover_image: { url: string; alternativeText: string | null; width: number; height: number } | null;
	max_participants: number | null;
	registration_open: boolean;
	event_type: 'dezbatere' | 'actiune' | 'mars' | 'online';
	social_posts: Array<{ platform: string; url: string }>;
	ical_url: string | null;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
	} | null;
}

export const load: PageLoad = async ({ params, url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	const res = await fetchStrapi<EventDetail[]>('/events', {
		'filters[slug][$eq]': params.slug,
		'populate[cover_image][fields][0]': 'url',
		'populate[cover_image][fields][1]': 'alternativeText',
		'populate[cover_image][fields][2]': 'width',
		'populate[cover_image][fields][3]': 'height',
		'populate[social_posts]': 'true',
		'populate[seo]': 'true',
		...previewParams,
	}, undefined, fetch);

	const event = res.data?.[0];
	if (!event) {
		throw error(404, 'Evenimentul nu a fost găsit');
	}

	const isPast = new Date(event.start_date) < new Date();

	return { event, isPast };
};
