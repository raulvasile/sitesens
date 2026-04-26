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

	// Same per-block populate as homepage: in Strapi v5 a generic `populate=*`
	// on a DynamicZone returns blocks but does NOT deep-populate their nested
	// components (e.g. card-grid items, accordion items, hero rotating_words).
	// Keep this list in sync with `page.schema.json#/attributes/content/components`.
	const blockPopulate: Record<string, string> = {};
	const blockTypes = [
		'hero', 'hero-refined', 'hero-editorial', 'text-block', 'cta-banner',
		'image-gallery', 'accordion', 'quote', 'video-embed', 'stats-counter',
		'program-points', 'newsletter-cta', 'card-grid', 'latest-articles',
		'upcoming-events', 'contact-form', 'spacer', 'social-feed',
		'word-carousel', 'timeline', 'mission-band', 'chapters-grid',
		'team-grid', 'page-header', 'romania-map',
	];
	for (const t of blockTypes) {
		blockPopulate[`populate[content][on][blocks.${t}][populate]`] = '*';
		blockPopulate[`populate[sections][populate][content][on][blocks.${t}][populate]`] = '*';
	}
	// card-grid: deep-populate the nested cards' media (image, background_image)
	// because Strapi v5's populate=* only resolves one level deep.
	blockPopulate['populate[content][on][blocks.card-grid][populate][cards][populate][image]'] = 'true';
	blockPopulate['populate[content][on][blocks.card-grid][populate][cards][populate][background_image]'] = 'true';
	blockPopulate['populate[content][on][blocks.card-grid][populate][cards][populate][points]'] = 'true';
	blockPopulate['populate[sections][populate][content][on][blocks.card-grid][populate][cards][populate][image]'] = 'true';
	blockPopulate['populate[sections][populate][content][on][blocks.card-grid][populate][cards][populate][background_image]'] = 'true';
	blockPopulate['populate[sections][populate][content][on][blocks.card-grid][populate][cards][populate][points]'] = 'true';

	const res = await fetchStrapi<StrapiPage[]>('/pages', {
		'filters[slug][$eq]': params.slug,
		...blockPopulate,
		'populate[seo][populate]': '*',
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
