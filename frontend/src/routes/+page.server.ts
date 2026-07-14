import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';
import { getFallback } from '$lib/server/fallback';
import { getPreviewStatus } from '$lib/server/preview';
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

export const load: PageServerLoad = async ({ url, fetch }) => {
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
			// card-grid: deep-populate the nested cards' media (image, background_image)
			// because Strapi v5's populate=* only resolves one level deep.
			'populate[content][on][blocks.card-grid][populate][cards][populate][image]': 'true',
			'populate[content][on][blocks.card-grid][populate][cards][populate][background_image]': 'true',
			'populate[content][on][blocks.card-grid][populate][cards][populate][points]': 'true',
			'populate[content][on][blocks.latest-articles][populate]': '*',
			'populate[content][on][blocks.upcoming-events][populate]': '*',
			'populate[content][on][blocks.contact-form][populate]': '*',
			'populate[content][on][blocks.spacer][populate]': '*',
			'populate[content][on][blocks.social-feed][populate]': '*',
			'populate[content][on][blocks.word-carousel][populate]': '*',
			'populate[content][on][blocks.featured-campaigns][populate]': '*',
			'populate[content][on][blocks.timeline][populate]': '*',
			'populate[content][on][blocks.mission-band][populate]': '*',
			'populate[content][on][blocks.chapters-grid][populate]': '*',
			'populate[content][on][blocks.team-grid][populate]': '*',
			'populate[content][on][blocks.page-header][populate]': '*',
			'populate[content][on][blocks.romania-map][populate]': '*',
			'populate[content][on][blocks.calendar][populate]': '*',
			// calendar-custom: deep-populate the entries (repeatable component scalars).
			'populate[content][on][blocks.calendar-custom][populate][entries]': 'true',
			// file-list: deep-populate the nested files (component) with their media.
			'populate[content][on][blocks.file-list][populate][files][populate][file]': 'true',
			'populate[seo][populate]': '*',
			...previewParams,
		}, undefined, fetch);

		const homepage = res.data ?? null;

		if (homepage?.content) {
			homepage.content = await enrichDynamicZone(homepage.content, fetch);
		}

		return { homepage };
	} catch (err) {
		// Strapi jos → servește homepage-ul de rezervă dacă e completat
		// (`$lib/server/fallback`), altfel arată pagina de eroare.
		const fb = getFallback<HomepageData>('/homepage');
		if (fb?.data) {
			console.warn('[fallback] /homepage — servesc conținut de rezervă (Strapi indisponibil).');
			const homepage = fb.data;
			if (homepage?.content) {
				homepage.content = await enrichDynamicZone(homepage.content, fetch);
			}
			return { homepage };
		}

		const status = (err as { status?: number })?.status;
		const message = (err as { message?: string })?.message ?? 'unknown';
		console.error(`[/] Strapi fetch failed (${status ?? '?'}): ${message}`);
		throw error(status && status >= 500 ? 503 : 500, 'Nu putem încărca pagina principală momentan.');
	}
};
