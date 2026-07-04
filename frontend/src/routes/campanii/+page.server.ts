import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';

export interface CampaignListItem {
	id: number;
	title: string;
	slug: string;
	summary?: string;
	cover_image?: { url: string; alternativeText?: string } | null;
	start_date?: string | null;
	end_date?: string | null;
	goal?: number | null;
	progress?: number | null;
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	// status: 'active' (implicit) | 'ended' | 'all'
	const status = url.searchParams.get('status') ?? 'active';
	const county = url.searchParams.get('judet') ?? '';
	const now = new Date().toISOString();

	const params: Record<string, string> = {
		'sort[0]': 'start_date:desc',
		'pagination[pageSize]': '50',
		'populate[cover_image]': 'true',
	};

	if (status === 'active') {
		params['filters[$or][0][end_date][$null]'] = 'true';
		params['filters[$or][1][end_date][$gte]'] = now;
	} else if (status === 'ended') {
		params['filters[end_date][$lt]'] = now;
	}

	if (county) {
		params['filters[counties][slug][$eq]'] = county;
	}

	try {
		const res = await fetchStrapi<CampaignListItem[]>('/campaigns', params, undefined, fetch);
		return {
			campaigns: res.data ?? [],
			currentStatus: status,
			currentCounty: county,
		};
	} catch (err) {
		const s = (err as { status?: number })?.status;
		throw error(s && s >= 500 ? 503 : 500, 'Nu putem încărca campaniile momentan.');
	}
};
