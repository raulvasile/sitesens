import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';

export interface ContactPageData {
	id: number;
	title: string;
	subtitle: string | null;
	email: string;
	address: string | null;
	schedule: string | null;
	newsletter_title: string | null;
	newsletter_description: string | null;
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
			'populate': 'seo',
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
