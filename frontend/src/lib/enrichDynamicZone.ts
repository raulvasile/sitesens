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

		// Hero with auto_next_event: auto-fill featured_link with the next upcoming event
		if (block.__component === 'blocks.hero') {
			const featured = block.featured_link as { auto_next_event?: boolean; url?: string; title?: string; label?: string; icon?: string } | null | undefined;
			if (featured?.auto_next_event) {
				try {
					const now = new Date().toISOString();
					const res = await fetchStrapi<Array<{ title: string; slug: string; start_date: string }>>('/events', {
						'filters[start_date][$gte]': now,
						'sort[0]': 'start_date:asc',
						'pagination[pageSize]': '1',
					}, undefined, fetchFn);
					const next = res.data?.[0];
					if (next) {
						const date = new Date(next.start_date);
						const dateLabel = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long' }).format(date);
						enriched[i] = {
							...block,
							featured_link: {
								...featured,
								label: featured.label || `Următorul eveniment · ${dateLabel}`,
								title: featured.title || next.title,
								url: featured.url || `/evenimente/${next.slug}`,
								icon: featured.icon || '📅',
							},
						};
					} else {
						// No upcoming event — remove the featured_link so nothing renders
						enriched[i] = { ...block, featured_link: null };
					}
				} catch {
					// keep original values
				}
			}
		}
	}

	return enriched;
}
