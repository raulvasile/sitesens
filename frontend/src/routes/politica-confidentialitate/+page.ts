import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';

export interface PrivacyPolicyPageData {
	title?: string;
	subtitle?: string;
	content?: unknown;
	cmf_text?: string;
	last_updated?: string;
	seo?: {
		meta_title?: string | null;
		meta_description?: string | null;
	} | null;
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetchStrapi<PrivacyPolicyPageData>('/privacy-policy-page', {
			'populate[seo]': 'true',
		}, undefined, fetch);
		return { page: res.data ?? null };
	} catch (err) {
		const status = (err as { status?: number })?.status;
		throw error(status && status >= 500 ? 503 : 500, 'Nu putem încărca politica de confidențialitate momentan.');
	}
};
