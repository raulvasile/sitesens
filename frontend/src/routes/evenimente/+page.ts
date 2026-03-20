import type { PageLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';
import { error } from '@sveltejs/kit';

export interface StrapiEvent {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	start_date: string;
	end_date: string | null;
	location_name: string | null;
	event_type: 'dezbatere' | 'actiune' | 'mars' | 'online';
	cover_image: { url: string; alternativeText: string | null } | null;
	registration_open: boolean;
	max_participants: number | null;
}

export const load: PageLoad = async ({ url, fetch }) => {
	const tab = url.searchParams.get('tab') ?? 'viitoare';
	const type = url.searchParams.get('type') ?? '';
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const now = new Date().toISOString();

	const params: Record<string, string> = {
		'populate[cover_image][fields][0]': 'url',
		'populate[cover_image][fields][1]': 'alternativeText',
		'sort[0]': tab === 'viitoare' ? 'start_date:asc' : 'start_date:desc',
		'pagination[page]': String(page),
		'pagination[pageSize]': '9'
	};

	// Filter by future or past
	if (tab === 'viitoare') {
		params['filters[start_date][$gte]'] = now;
	} else {
		params['filters[start_date][$lt]'] = now;
	}

	// Filter by event type
	if (type) {
		params['filters[event_type][$eq]'] = type;
	}

	try {
		const res = await fetchStrapi<StrapiEvent[]>('/events', params, undefined, fetch);
		return {
			events: res.data,
			pagination: res.meta.pagination ?? { page: 1, pageSize: 9, pageCount: 1, total: 0 },
			activeTab: tab,
			activeType: type
		};
	} catch {
		throw error(503, 'Serviciul nu este disponibil momentan. Încearcă din nou în câteva momente.');
	}
};
