import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';
import { enrichDynamicZone } from '$lib/enrichDynamicZone';
import { error } from '@sveltejs/kit';

export interface StrapiSection {
	id: number;
	title: string;
	content: Array<{ __component: string; [key: string]: unknown }>;
	display_order: number;
}

export interface StrapiPage {
	title: string;
	slug: string;
	content: Array<{ __component: string; [key: string]: unknown }>;
	sections?: StrapiSection[];
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageLoad = async ({ params, url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	const res = await fetchStrapi<StrapiPage[]>('/pages', {
		'filters[slug][$eq]': params.slug,
		'populate[content][populate]': '*',
		'populate[seo][populate]': '*',
		'populate[sections][populate][content][populate]': '*',
		'populate[sections][sort][0]': 'display_order:asc',
		...previewParams,
	}, undefined, fetch);

	const page = res.data?.[0];
	if (!page) {
		throw error(404, 'Pagina nu a fost găsită');
	}

	// Enrich dynamic zone blocks with server-side data
	if (page.content) {
		page.content = await enrichDynamicZone(page.content, fetch);
	}
	if (page.sections) {
		for (const section of page.sections) {
			if (section.content) {
				section.content = await enrichDynamicZone(section.content, fetch);
			}
		}
	}

	return {
		page,
		initialTab: url.searchParams.get('tab') ?? null,
	};
};
