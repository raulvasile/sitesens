import type { PageLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';

export const load: PageLoad = async ({ url }) => {
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

	const [articlesRes, categoriesRes] = await Promise.all([
		fetchStrapi('/articles', params).catch(() => ({ data: [], meta: {} })),
		fetchStrapi('/categories', { 'sort[0]': 'name:asc' }).catch(() => ({ data: [] })),
	]);

	return {
		articles: (articlesRes as any)?.data ?? [],
		pagination: (articlesRes as any)?.meta?.pagination ?? { page: 1, pageCount: 1, total: 0 },
		categories: (categoriesRes as any)?.data ?? [],
		currentCategory: category,
		currentSearch: search,
		currentPage: page,
	};
};
