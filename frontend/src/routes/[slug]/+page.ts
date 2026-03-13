import type { PageLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';
import { error } from '@sveltejs/kit';

export interface StrapiPage {
	id: number;
	attributes: {
		title: string;
		slug: string;
		content?: Array<{ __component: string; [key: string]: unknown }>;
		seo?: {
			meta_title?: string;
			meta_description?: string;
			og_image?: { url: string } | null;
			canonical_url?: string;
			no_index?: boolean;
		};
	};
}

export const load: PageLoad = async ({ params }) => {
	try {
		const { data } = await fetchStrapi<StrapiPage[]>('/pages', {
			'filters[slug][$eq]': params.slug,
			populate: 'deep'
		});

		if (!Array.isArray(data) || data.length === 0) {
			throw error(404, 'Pagina nu a fost găsită');
		}

		return { page: data[0] as StrapiPage };
	} catch (e: unknown) {
		if ((e as { status?: number }).status === 404) throw e;
		return { page: null as StrapiPage | null };
	}
};
