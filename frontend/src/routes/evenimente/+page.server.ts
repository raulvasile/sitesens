import type { PageServerLoad } from './$types';
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
	venue: string | null;
	city: string | null;
	event_type: 'dezbatere' | 'actiune' | 'mars' | 'online';
	cover_image: { url: string; alternativeText: string | null } | null;
	registration_open: boolean;
	registration_url: string | null;
	max_participants: number | null;
	spots_taken: number | null;
	is_featured: boolean | null;
}

export interface EventsPageData {
	eyebrow?: string;
	title?: string;
	title_italic?: string;
	lead?: string;
	featured_label?: string;
	featured_cta_primary?: string;
	featured_cta_secondary?: string;
	location_label?: string;
	interval_label?: string;
	spots_template?: string;
	list_reserve_cta?: string;
	filter_all_label?: string;
	host_section_kicker?: string;
	host_section_title?: string;
	host_section_body?: string;
	host_section_cta?: string;
	host_section_url?: string;
	host_section_visible?: boolean;
	empty_state?: string;
	seo?: {
		meta_title?: string | null;
		meta_description?: string | null;
	} | null;
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	const tab = url.searchParams.get('tab') ?? 'viitoare';
	const type = url.searchParams.get('type') ?? '';
	const county = url.searchParams.get('judet') ?? '';
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const now = new Date().toISOString();

	const commonPopulate = {
		'populate[cover_image][fields][0]': 'url',
		'populate[cover_image][fields][1]': 'alternativeText',
	};

	const params: Record<string, string> = {
		...commonPopulate,
		'sort[0]': tab === 'viitoare' ? 'start_date:asc' : 'start_date:desc',
		'pagination[page]': String(page),
		'pagination[pageSize]': '20',
	};
	if (tab === 'viitoare') {
		params['filters[start_date][$gte]'] = now;
	} else {
		params['filters[start_date][$lt]'] = now;
	}
	if (type) {
		params['filters[event_type][$eq]'] = type;
	}
	if (county) {
		params['filters[county][slug][$eq]'] = county;
	}

	// Featured event — MEREU primul eveniment viitor (indiferent de filtre),
	// preferă is_featured dacă există.
	const featuredParams: Record<string, string> = {
		...commonPopulate,
		'filters[start_date][$gte]': now,
		'sort[0]': 'is_featured:desc',
		'sort[1]': 'start_date:asc',
		'pagination[pageSize]': '1',
	};

	try {
		const [eventsRes, featuredRes, pageDataRes] = await Promise.all([
			fetchStrapi<StrapiEvent[]>('/events', params, undefined, fetch),
			fetchStrapi<StrapiEvent[]>('/events', featuredParams, undefined, fetch).catch(() => ({ data: [] })),
			fetchStrapi<EventsPageData>('/events-page', { 'populate[seo]': 'true' }, undefined, fetch).catch(() => ({ data: null })),
		]);

		const featured: StrapiEvent | null = (featuredRes as { data: StrapiEvent[] }).data?.[0] ?? null;
		const events = eventsRes.data ?? [];

		return {
			events,
			featured,
			page: (pageDataRes as { data: EventsPageData | null }).data,
			pagination: eventsRes.meta.pagination ?? { page: 1, pageSize: 20, pageCount: 1, total: 0 },
			activeTab: tab,
			activeType: type,
			activeCounty: county,
		};
	} catch {
		throw error(503, 'Serviciul nu este disponibil momentan. Încearcă din nou în câteva momente.');
	}
};
