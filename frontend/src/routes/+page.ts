import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';

export interface HomepageData {
	content: Array<{ __component: string; [key: string]: unknown }>;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageLoad = async ({ url }) => {
	const { params: previewParams } = getPreviewStatus(url);

	try {
		const res = await fetchStrapi<HomepageData>('/homepage', {
			'populate[content][populate]': '*',
			'populate[seo][populate]': '*',
			...previewParams,
		});

		return { homepage: res.data ?? null };
	} catch {
		return { homepage: null };
	}
};
