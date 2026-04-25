import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';

export interface CommunityPlatform {
	name: string;
	handle?: string;
	url: string;
	description?: string;
	color?: string;
	embed_url?: string;
	icon_svg?: string;
	follow_cta?: string;
	order?: number;
}

export interface CommunityFeature {
	emoji?: string;
	title: string;
	description: string;
}

export interface CommunityPageData {
	title?: string;
	subtitle?: string;
	platforms?: CommunityPlatform[];
	posts_heading?: string;
	features_heading?: string;
	features?: CommunityFeature[];
	embed_fallback_text?: string;
	seo?: {
		meta_title?: string | null;
		meta_description?: string | null;
	} | null;
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetchStrapi<CommunityPageData>('/community-page', {
			'populate[platforms]': 'true',
			'populate[features]': 'true',
			'populate[seo]': 'true',
		}, undefined, fetch);
		return { page: res.data ?? null };
	} catch (err) {
		const status = (err as { status?: number })?.status;
		throw error(status && status >= 500 ? 503 : 500, 'Nu putem încărca pagina Comunitate momentan.');
	}
};
