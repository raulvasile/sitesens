import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';

export interface PetitionListItem {
	id: number;
	title: string;
	slug: string;
	summary?: string;
	cover_image?: { url: string; alternativeText?: string } | null;
	signature_target?: number | null;
	petition_status?: 'open' | 'closed';
	deadline?: string | null;
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	const status = url.searchParams.get('status') ?? 'open';

	const params: Record<string, string> = {
		'sort[0]': 'createdAt:desc',
		'pagination[pageSize]': '50',
		'populate[cover_image]': 'true',
	};
	if (status === 'open' || status === 'closed') {
		params['filters[petition_status][$eq]'] = status;
	}

	try {
		const res = await fetchStrapi<PetitionListItem[]>('/petitions', params, undefined, fetch);
		return { petitions: res.data ?? [], currentStatus: status };
	} catch (err) {
		const s = (err as { status?: number })?.status;
		throw error(s && s >= 500 ? 503 : 500, 'Nu putem încărca petițiile momentan.');
	}
};
