import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';

export const load: PageLoad = async ({ url }) => {
	const { params: previewParams } = getPreviewStatus(url);

	const [pageRes, teamRes] = await Promise.all([
		fetchStrapi('/pages', {
			'filters[slug][$eq]': 'despre-noi',
			'populate[content][populate]': '*',
			'populate[seo]': 'true',
			...previewParams,
		}).catch(() => ({ data: [] })),
		fetchStrapi('/team-members', {
			'populate': '*',
			'sort[0]': 'display_order:asc',
		}).catch(() => ({ data: [] })),
	]);

	const pages = (pageRes as any).data;
	return {
		page: Array.isArray(pages) && pages.length > 0 ? pages[0] : null,
		teamMembers: (teamRes as any).data ?? [],
	};
};
