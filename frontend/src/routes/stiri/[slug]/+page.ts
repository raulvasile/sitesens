import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, url }) => {
	const { params: previewParams } = getPreviewStatus(url);

	const [articleRes, relatedRes] = await Promise.all([
		fetchStrapi('/articles', {
			'filters[slug][$eq]': params.slug,
			'populate[cover_image]': 'true',
			'populate[category]': 'true',
			'populate[author][populate][photo]': 'true',
			'populate[tags]': 'true',
			'populate[seo][populate][og_image]': 'true',
			...previewParams,
		}),
		// Articole din aceeași categorie (se va filtra pe client)
		fetchStrapi('/articles', {
			'populate[cover_image]': 'true',
			'populate[category]': 'true',
			'sort[0]': 'createdAt:desc',
			'pagination[pageSize]': '4',
			'filters[slug][$ne]': params.slug,
		}).catch(() => ({ data: [] })),
	]);

	const articles = (articleRes as any).data;
	if (!Array.isArray(articles) || articles.length === 0) {
		throw error(404, 'Articolul nu a fost găsit');
	}

	return {
		article: articles[0],
		relatedArticles: ((relatedRes as any).data ?? []).slice(0, 3),
	};
};
