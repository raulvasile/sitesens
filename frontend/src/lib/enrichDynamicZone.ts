import { fetchStrapi } from '$lib/strapi';

type Block = { __component: string; [key: string]: unknown };

/**
 * Îmbogățește blocurile din Dynamic Zone cu date server-side.
 * Ex: latest-articles primește articolele, upcoming-events primește evenimentele.
 */
export async function enrichDynamicZone(content: Block[], fetchFn: typeof fetch = fetch): Promise<Block[]> {
	const enriched = [...content];

	for (let i = 0; i < enriched.length; i++) {
		const block = enriched[i];

		if (block.__component === 'blocks.latest-articles') {
			const count = (block.count as number) ?? 3;
			try {
				const res = await fetchStrapi<unknown[]>('/articles', {
					'pagination[pageSize]': String(count),
					'sort[0]': 'createdAt:desc',
					'populate[cover_image]': 'true',
					'populate[category]': 'true',
				}, undefined, fetchFn);
				enriched[i] = { ...block, _articles: res.data ?? [] };
			} catch {
				enriched[i] = { ...block, _articles: [] };
			}
		}

		if (block.__component === 'blocks.upcoming-events') {
			const count = (block.count as number) ?? 3;
			const now = new Date().toISOString();
			try {
				const res = await fetchStrapi<unknown[]>('/events', {
					'filters[start_date][$gte]': now,
					'sort[0]': 'start_date:asc',
					'pagination[pageSize]': String(count),
					'populate[cover_image]': 'true',
				}, undefined, fetchFn);
				enriched[i] = { ...block, _events: res.data ?? [] };
			} catch {
				enriched[i] = { ...block, _events: [] };
			}
		}
	}

	return enriched;
}
