import type { PageServerLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';
import { getPreviewStatus } from '$lib/server/preview';
import { enrichDynamicZone } from '$lib/enrichDynamicZone';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	let articleRes;
	let relatedRes;
	try {
		[articleRes, relatedRes] = await Promise.all([
			fetchStrapi('/articles', {
				'filters[slug][$eq]': params.slug,
				'populate[cover_image]': 'true',
				'populate[category]': 'true',
				'populate[author][populate][photo]': 'true',
				'populate[tags]': 'true',
				'populate[featured_stat]': 'true',
				'populate[attachments]': 'true',
				// Dynamic zone — populate per component type so nested media/items load.
				'populate[content][on][blocks.text-block][populate]': '*',
				'populate[content][on][blocks.image-gallery][populate]': '*',
				'populate[content][on][blocks.quote][populate]': '*',
				'populate[content][on][blocks.video-embed][populate]': '*',
				'populate[content][on][blocks.stats-counter][populate]': '*',
				'populate[content][on][blocks.cta-banner][populate]': '*',
				'populate[content][on][blocks.spacer][populate]': '*',
				'populate[content][on][blocks.article-stat][populate]': '*',
				'populate[seo][populate][og_image]': 'true',
				...previewParams,
			}, undefined, fetch),
			fetchStrapi('/articles', {
				'populate[cover_image]': 'true',
				'populate[category]': 'true',
				'sort[0]': 'createdAt:desc',
				'pagination[pageSize]': '4',
				'filters[slug][$ne]': params.slug,
			}, undefined, fetch).catch(() => ({ data: [] })),
		]);
	} catch (err) {
		const status = (err as { status?: number })?.status;
		const message = (err as { message?: string })?.message ?? 'unknown';
		console.error(`[/stiri/${params.slug}] Strapi fetch failed (${status ?? '?'}): ${message}`);
		throw error(
			status && status >= 500 ? 503 : 500,
			'Articolul nu poate fi încărcat momentan.',
		);
	}

	const articles = (articleRes as any).data;
	if (!Array.isArray(articles) || articles.length === 0) {
		throw error(404, 'Articolul nu a fost găsit');
	}

	const article = articles[0] as any;
	if (Array.isArray(article.content)) {
		article.content = await enrichDynamicZone(article.content, fetch);
	}

	return {
		article,
		relatedArticles: ((relatedRes as any).data ?? []).slice(0, 3),
	};
};
