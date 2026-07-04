import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';

export interface NewsletterPageData {
	title?: string;
	description?: string;
	form?: {
		name_label?: string;
		name_placeholder?: string;
		email_label?: string;
		email_placeholder?: string;
		submit_text?: string;
		submitting_text?: string;
		consent_text?: string;
		success_title?: string;
		success_message?: string;
	};
	benefits_heading?: string;
	benefits?: Array<{ emoji?: string; title: string; description: string }>;
	seo?: {
		meta_title?: string | null;
		meta_description?: string | null;
	} | null;
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetchStrapi<NewsletterPageData>('/newsletter-page', {
			'populate[form]': 'true',
			'populate[benefits]': 'true',
			'populate[seo]': 'true',
		}, undefined, fetch);
		return { page: res.data ?? null };
	} catch (err) {
		const status = (err as { status?: number })?.status;
		throw error(status && status >= 500 ? 503 : 500, 'Nu putem încărca pagina Newsletter momentan.');
	}
};
