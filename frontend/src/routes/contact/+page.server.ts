import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchContent } from '$lib/server/content';
import { getPreviewStatus } from '$lib/server/preview';

export interface ContactFormConfig {
	name_label?: string;
	name_placeholder?: string;
	email_label?: string;
	email_placeholder?: string;
	subject_label?: string;
	subject_placeholder?: string;
	message_label?: string;
	message_placeholder?: string;
	submit_text?: string;
	submitting_text?: string;
	success_title?: string;
	success_message?: string;
}

export interface ContactPageData {
	id: number;
	title: string;
	subtitle: string | null;
	header_eyebrow?: string;
	form_kicker?: string;
	email: string;
	address: string | null;
	schedule: string | null;
	newsletter_title: string | null;
	newsletter_description: string | null;
	form_title?: string;
	info_heading?: string;
	social_heading?: string;
	form?: ContactFormConfig;
	validation?: Record<string, string>;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	// Strapi jos → servește snapshot-ul din `$lib/server/fallback/data/contact-page.json`.
	const res = await fetchContent<ContactPageData>('/contact-page', {
		'populate[seo]': 'true',
		'populate[form]': 'true',
		'populate[validation]': 'true',
		...previewParams,
	}, fetch);

	if (!res?.data) {
		throw error(503, 'Nu putem încărca pagina de Contact momentan.');
	}

	return { contactPage: res.data };
};
