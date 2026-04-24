import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';

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

export const load: PageLoad = async ({ url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	try {
		const res = await fetchStrapi<ContactPageData>('/contact-page', {
			'populate[seo]': 'true',
			'populate[form]': 'true',
			'populate[validation]': 'true',
			...previewParams,
		}, undefined, fetch);
		return { contactPage: res.data };
	} catch {
		return {
			contactPage: {
				id: 0,
				title: 'Contact',
				subtitle: null,
				email: 'contact@partidulsens.ro',
				address: null,
				schedule: null,
				newsletter_title: null,
				newsletter_description: null,
				seo: null
			} as ContactPageData
		};
	}
};
