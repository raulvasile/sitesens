import type { PageLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ url, fetch }) => {
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const category = url.searchParams.get('categorie') ?? '';
	const search = url.searchParams.get('q') ?? '';

	const params: Record<string, string> = {
		'populate[cover_image]': 'true',
		'populate[category]': 'true',
		'populate[author]': 'true',
		'populate[tags]': 'true',
		'sort[0]': 'createdAt:desc',
		'pagination[page]': String(page),
		'pagination[pageSize]': '9',
	};

	if (category) {
		params['filters[category][slug][$eq]'] = category;
	}

	if (search) {
		params['filters[title][$containsi]'] = search;
	}

	try {
		const [articlesRes, categoriesRes] = await Promise.all([
			fetchStrapi('/articles', params, undefined, fetch),
			fetchStrapi('/categories', { 'sort[0]': 'name:asc' }, undefined, fetch).catch(() => ({ data: [], meta: {} })),
		]);

		return {
			articles: (articlesRes as any)?.data ?? [],
			pagination: (articlesRes as any)?.meta?.pagination ?? { page: 1, pageCount: 1, total: 0 },
			categories: (categoriesRes as any)?.data ?? [],
			currentCategory: category,
			currentSearch: search,
			currentPage: page,
			loadError: false,
		};
	} catch {
		throw error(503, 'Serviciul nu este disponibil momentan. Încearcă din nou în câteva momente.');
	}
};
