import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';
import { enrichDynamicZone } from '$lib/enrichDynamicZone';

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

export const load: PageLoad = async ({ url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	try {
		const res = await fetchStrapi<HomepageData>('/homepage', {
			'populate[content][populate]': '*',
			'populate[seo][populate]': '*',
			...previewParams,
		}, undefined, fetch);

		const homepage = res.data ?? null;

		if (homepage?.content) {
			homepage.content = await enrichDynamicZone(homepage.content, fetch);
		}

		return { homepage };
	} catch {
		return { homepage: null };
	}
};
