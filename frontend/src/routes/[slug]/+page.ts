import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';
import { error } from '@sveltejs/kit';

export interface StrapiPage {
	title: string;
	slug: string;
	content: Array<{ __component: string; [key: string]: unknown }>;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageLoad = async ({ params, url }) => {
	const { params: previewParams } = getPreviewStatus(url);

	const res = await fetchStrapi<StrapiPage[]>('/pages', {
		'filters[slug][$eq]': params.slug,
		'populate[content][populate]': '*',
		'populate[seo][populate]': '*',
		...previewParams,
	});

	const page = res.data?.[0];
	if (!page) {
		throw error(404, 'Pagina nu a fost găsită');
	}

	return { page };
};
