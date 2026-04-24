import type { PageLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';

export interface InscriptionPageData {
	title?: string;
	subtitle?: string;
	steps?: Array<{ number: number; label: string; description?: string }>;
	personal_section_heading?: string;
	address_section_heading?: string;
	labels?: Record<string, string>;
	validation?: Record<string, string>;
	consents?: Array<{ key: string; label: string; required: boolean; help_text?: string }>;
	submit_text?: string;
	submitting_text?: string;
	prev_step_text?: string;
	next_step_text?: string;
	success?: {
		title?: string;
		message?: string;
		next_steps_heading?: string;
		next_steps?: Array<{ icon?: string; text: string }>;
		primary_cta_label?: string;
		primary_cta_url?: string;
		secondary_cta_label?: string;
		secondary_cta_url?: string;
	};
	seo?: {
		meta_title?: string | null;
		meta_description?: string | null;
	} | null;
}

export interface County { id: number; name: string; slug?: string; order?: number }
export interface InterestArea { id: number; name: string; slug?: string; icon?: string; description?: string; order?: number }

export const load: PageLoad = async ({ fetch }) => {
	const [pageRes, countiesRes, interestsRes] = await Promise.all([
		fetchStrapi<InscriptionPageData>('/inscription-page', {
			'populate[labels]': 'true',
			'populate[validation]': 'true',
			'populate[steps]': 'true',
			'populate[consents]': 'true',
			'populate[success][populate]': '*',
			'populate[seo]': 'true',
		}, undefined, fetch).catch(() => ({ data: null })),
		fetchStrapi<County[]>('/counties', { 'sort[0]': 'order:asc', 'pagination[pageSize]': '100' }, undefined, fetch).catch(() => ({ data: [] })),
		fetchStrapi<InterestArea[]>('/interest-areas', { 'sort[0]': 'order:asc', 'pagination[pageSize]': '100' }, undefined, fetch).catch(() => ({ data: [] })),
	]);

	return {
		page: (pageRes as { data: InscriptionPageData | null })?.data ?? null,
		counties: (countiesRes as { data: County[] })?.data ?? [],
		interests: (interestsRes as { data: InterestArea[] })?.data ?? [],
	};
};
