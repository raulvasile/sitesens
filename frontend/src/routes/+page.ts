import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
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
		// Deep-populate the dynamic zone: nested components (rotating_words, featured_link, items, etc.)
		// need explicit 'populate' per component type. Keep this list in sync with
		// the components allowed by `homepage.schema.json#/attributes/content/components`.
		const res = await fetchStrapi<HomepageData>('/homepage', {
			'populate[content][on][blocks.hero][populate]': '*',
			'populate[content][on][blocks.hero-refined][populate]': '*',
			'populate[content][on][blocks.hero-editorial][populate]': '*',
			'populate[content][on][blocks.text-block][populate]': '*',
			'populate[content][on][blocks.cta-banner][populate]': '*',
			'populate[content][on][blocks.image-gallery][populate]': '*',
			'populate[content][on][blocks.accordion][populate]': '*',
			'populate[content][on][blocks.quote][populate]': '*',
			'populate[content][on][blocks.video-embed][populate]': '*',
			'populate[content][on][blocks.stats-counter][populate]': '*',
			'populate[content][on][blocks.program-points][populate]': '*',
			'populate[content][on][blocks.newsletter-cta][populate]': '*',
			'populate[content][on][blocks.card-grid][populate]': '*',
			'populate[content][on][blocks.latest-articles][populate]': '*',
			'populate[content][on][blocks.upcoming-events][populate]': '*',
			'populate[content][on][blocks.contact-form][populate]': '*',
			'populate[content][on][blocks.spacer][populate]': '*',
			'populate[content][on][blocks.social-feed][populate]': '*',
			'populate[content][on][blocks.word-carousel][populate]': '*',
			'populate[content][on][blocks.timeline][populate]': '*',
			'populate[content][on][blocks.mission-band][populate]': '*',
			'populate[content][on][blocks.chapters-grid][populate]': '*',
			'populate[content][on][blocks.team-grid][populate]': '*',
			'populate[content][on][blocks.page-header][populate]': '*',
			'populate[content][on][blocks.romania-map][populate]': '*',
			'populate[seo][populate]': '*',
			...previewParams,
		}, undefined, fetch);

		const homepage = res.data ?? null;

		if (homepage?.content) {
			homepage.content = await enrichDynamicZone(homepage.content, fetch);
		}

		return { homepage };
	} catch (err) {
		// Surface the failure so the global +error.svelte page renders, instead
		// of a blank homepage that silently hides Strapi being down.
		const status = (err as { status?: number })?.status;
		throw error(status && status >= 500 ? 503 : 500, 'Nu putem încărca pagina principală momentan.');
	}
};
