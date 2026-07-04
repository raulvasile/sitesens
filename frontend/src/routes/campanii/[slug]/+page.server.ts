import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';
import { getPreviewStatus } from '$lib/server/preview';
import { enrichDynamicZone } from '$lib/enrichDynamicZone';
import { chapterContentPopulate } from '$lib/chapterPopulate';

export interface CampaignData {
	id: number;
	title: string;
	slug: string;
	summary?: string;
	content: Array<{ __component: string; [key: string]: unknown }>;
	cover_image?: { url: string; alternativeText?: string } | null;
	start_date?: string | null;
	end_date?: string | null;
	cta_label?: string | null;
	cta_url?: string | null;
	goal?: number | null;
	progress?: number | null;
	articles?: Array<{
		title: string; slug: string; excerpt?: string; createdAt: string;
		cover_image?: { url: string; alternativeText?: string }; category?: { name: string; color?: string };
	}>;
	events?: Array<{
		title: string; slug: string; start_date: string; location_name?: string; city?: string;
		cover_image?: { url: string; alternativeText?: string };
	}>;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	let res;
	try {
		res = await fetchStrapi<CampaignData[]>('/campaigns', {
			'filters[slug][$eq]': params.slug,
			...chapterContentPopulate(),
			'populate[cover_image]': 'true',
			'populate[seo][populate]': '*',
			'populate[articles][populate][cover_image]': 'true',
			'populate[articles][populate][category]': 'true',
			'populate[events][populate][cover_image]': 'true',
			...previewParams,
		}, undefined, fetch);
	} catch (err) {
		const status = (err as { status?: number })?.status;
		const message = (err as { message?: string })?.message ?? 'unknown';
		console.error(`[/campanii/${params.slug}] Strapi fetch failed (${status ?? '?'}): ${message}`);
		throw error(status && status >= 500 ? 503 : 500, 'Campania nu poate fi încărcată momentan.');
	}

	const campaign = res.data?.[0];
	if (!campaign) {
		throw error(404, 'Campania nu a fost găsită');
	}

	if (campaign.content) {
		campaign.content = await enrichDynamicZone(campaign.content, fetch);
	}

	return { campaign };
};
