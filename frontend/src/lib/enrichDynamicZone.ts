import { fetchStrapi } from '$lib/strapi';

type Block = { __component: string; [key: string]: unknown };

/** Mirrors the `max: 200` constraint on `blocks.calendar.limit` in Strapi. */
const MAX_CALENDAR_EVENTS = 200;

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

		if (block.__component === 'blocks.team-grid') {
			const limit = (block.limit as number) ?? 6;
			// Backwards compat: old `leadership_only` boolean → new `mode` enum.
			let mode = (block.mode as string) ?? null;
			if (!mode) {
				mode = (block.leadership_only as boolean) === false ? 'all' : 'leadership';
			}
			try {
				// No `fields[]` filter — we need all scalar fields (including
				// `details` which is a rich text `blocks` type). `populate[photo]`
				// just adds the media relation on top.
				const params: Record<string, string> = {
					'pagination[pageSize]': String(limit),
					'sort[0]': 'display_order:asc',
					'sort[1]': 'name:asc',
					'populate[photo]': 'true',
				};
				if (mode === 'leadership') {
					params['filters[is_leadership][$eq]'] = 'true';
				} else if (mode === 'team') {
					params['filters[is_leadership][$eq]'] = 'false';
				}
				// mode === 'all' → no filter
				const res = await fetchStrapi<unknown[]>('/team-members', params, undefined, fetchFn);
				enriched[i] = { ...block, _members: res.data ?? [] };
			} catch {
				enriched[i] = { ...block, _members: [] };
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

		if (block.__component === 'blocks.calendar') {
			const limit = (block.limit as number) ?? 50;
			const includePast = (block.include_past_events as boolean) ?? false;
			const filterType = block.filter_event_type as string | null;
			const params: Record<string, string> = {
				'sort[0]': 'start_date:asc',
				'pagination[pageSize]': String(Math.min(limit, MAX_CALENDAR_EVENTS)),
				'populate[cover_image]': 'true',
			};
			if (!includePast) {
				params['filters[start_date][$gte]'] = new Date().toISOString();
			}
			if (filterType) {
				params['filters[event_type][$eq]'] = filterType;
			}
			try {
				const res = await fetchStrapi<unknown[]>('/events', params, undefined, fetchFn);
				enriched[i] = { ...block, _events: res.data ?? [] };
			} catch {
				enriched[i] = { ...block, _events: [] };
			}
		}

		// Hero: populate next_event + legacy featured_link with auto_next_event
		if (block.__component === 'blocks.hero') {
			// Fetch the next upcoming event once (shared between next_event and featured_link)
			const needsNextEvent =
				!!(block.next_event as unknown) ||
				!!((block.featured_link as { auto_next_event?: boolean } | null | undefined)?.auto_next_event);

			let nextEvent: { title: string; slug: string; start_date: string; location_name?: string; event_type?: string } | null = null;
			if (needsNextEvent) {
				try {
					const now = new Date().toISOString();
					const res = await fetchStrapi<Array<{ title: string; slug: string; start_date: string; location_name?: string; event_type?: string }>>('/events', {
						'filters[start_date][$gte]': now,
						'sort[0]': 'start_date:asc',
						'pagination[pageSize]': '1',
					}, undefined, fetchFn);
					nextEvent = res.data?.[0] ?? null;
				} catch {
					nextEvent = null;
				}
			}

			let updated = block;

			// New-style: next_event component attaches _event
			if (block.next_event) {
				updated = { ...updated, next_event: { ...(block.next_event as object), _event: nextEvent } };
			}

			// Legacy: featured_link with auto_next_event
			const featured = block.featured_link as { auto_next_event?: boolean; url?: string; title?: string; label?: string; icon?: string } | null | undefined;
			if (featured?.auto_next_event) {
				if (nextEvent) {
					const date = new Date(nextEvent.start_date);
					const dateLabel = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long' }).format(date);
					updated = {
						...updated,
						featured_link: {
							...featured,
							label: featured.label || `Următorul eveniment · ${dateLabel}`,
							title: featured.title || nextEvent.title,
							url: featured.url || `/evenimente/${nextEvent.slug}`,
							icon: featured.icon || '📅',
						},
					};
				} else {
					updated = { ...updated, featured_link: null };
				}
			}

			enriched[i] = updated;
		}
	}

	return enriched;
}
