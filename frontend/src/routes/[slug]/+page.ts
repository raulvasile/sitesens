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

	// Per-block populate. In Strapi v5, generic `populate=*` on a DynamicZone
	// returns blocks but does NOT deep-populate nested components — each block
	// type needs its own populate spec.
	//
	// IMPORTANT: blocks that need deep populate (card-grid, file-list,
	// calendar-custom) MUST NOT also receive the generic `*`. Setting both
	// `populate[on][blocks.X][populate]=*` AND
	// `populate[on][blocks.X][populate][nested]=true` makes Strapi see two
	// values for `populate` (string + object) and reject the query with
	// "Invalid populate parameter".
	const blockPopulate: Record<string, string> = {};
	const SHALLOW_BLOCKS = [
		'hero', 'hero-refined', 'hero-editorial', 'text-block', 'cta-banner',
		'image-gallery', 'accordion', 'quote', 'video-embed', 'stats-counter',
		'program-points', 'newsletter-cta', 'latest-articles',
		'upcoming-events', 'contact-form', 'spacer', 'social-feed',
		'word-carousel', 'timeline', 'mission-band', 'chapters-grid',
		'team-grid', 'page-header', 'romania-map', 'calendar',
	];
	for (const t of SHALLOW_BLOCKS) {
		blockPopulate[`populate[content][on][blocks.${t}][populate]`] = '*';
		blockPopulate[`populate[sections][populate][content][on][blocks.${t}][populate]`] = '*';
	}
	// Deep-populated blocks: only the nested keys, NO generic `*`.
	// card-grid: nested cards' media + points relation.
	blockPopulate['populate[content][on][blocks.card-grid][populate][cards][populate][image]'] = 'true';
	blockPopulate['populate[content][on][blocks.card-grid][populate][cards][populate][background_image]'] = 'true';
	blockPopulate['populate[content][on][blocks.card-grid][populate][cards][populate][points]'] = 'true';
	blockPopulate['populate[sections][populate][content][on][blocks.card-grid][populate][cards][populate][image]'] = 'true';
	blockPopulate['populate[sections][populate][content][on][blocks.card-grid][populate][cards][populate][background_image]'] = 'true';
	blockPopulate['populate[sections][populate][content][on][blocks.card-grid][populate][cards][populate][points]'] = 'true';
	// file-list: nested files component + media.
	blockPopulate['populate[content][on][blocks.file-list][populate][files][populate][file]'] = 'true';
	blockPopulate['populate[sections][populate][content][on][blocks.file-list][populate][files][populate][file]'] = 'true';
	// calendar-custom: repeatable entries (scalars only).
	blockPopulate['populate[content][on][blocks.calendar-custom][populate][entries]'] = 'true';
	blockPopulate['populate[sections][populate][content][on][blocks.calendar-custom][populate][entries]'] = 'true';

	let res;
	try {
		res = await fetchStrapi<StrapiPage[]>('/pages', {
			'filters[slug][$eq]': params.slug,
			...blockPopulate,
			'populate[seo][populate]': '*',
			'populate[sections][sort][0]': 'display_order:asc',
			...previewParams,
		}, undefined, fetch);
	} catch (err) {
		const status = (err as { status?: number })?.status;
		const message = (err as { message?: string })?.message ?? 'unknown';
		// Surface Strapi failures as 503 (service down) — distinct from 404 (page
		// missing) — so /+error.svelte can render the right message and ops can
		// see this in logs.
		console.error(`[/${params.slug}] Strapi fetch failed (${status ?? '?'}): ${message}`);
		throw error(
			status && status >= 500 ? 503 : 500,
			'Pagina nu poate fi încărcată momentan. Verifică dacă Strapi rulează și schemele sunt sincronizate.',
		);
	}

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
