import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';
import { getPreviewStatus } from '$lib/server/preview';
import { enrichDynamicZone, type ChapterContext } from '$lib/enrichDynamicZone';
import { chapterContentPopulate } from '$lib/chapterPopulate';

export interface ChapterPageData {
	id: number;
	title: string;
	slug: string;
	content: Array<{ __component: string; [key: string]: unknown }>;
	chapter?: {
		name: string;
		slug: string;
		is_active?: boolean;
		email?: string | null;
		phone?: string | null;
		address?: string | null;
		social_links?: Array<{ platform: string; url: string }>;
		county?: { name: string; slug?: string } | null;
		coordinators?: unknown[];
	} | null;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageServerLoad = async ({ params, url, fetch }) => {
	const { isPreview, params: previewParams } = getPreviewStatus(url);

	let res;
	try {
		res = await fetchStrapi<ChapterPageData[]>('/chapter-pages', {
			'filters[slug][$eq]': params.page,
			'filters[chapter][slug][$eq]': params.chapter,
			...chapterContentPopulate(),
			'populate[seo][populate]': '*',
			'populate[chapter][populate][county]': 'true',
			'populate[chapter][populate][social_links]': 'true',
			'populate[chapter][populate][coordinators][populate][member][populate][photo]': 'true',
			...previewParams,
		}, undefined, fetch);
	} catch (err) {
		const status = (err as { status?: number })?.status;
		const message = (err as { message?: string })?.message ?? 'unknown';
		console.error(`[/filiale/${params.chapter}/${params.page}] Strapi fetch failed (${status ?? '?'}): ${message}`);
		throw error(status && status >= 500 ? 503 : 500, 'Pagina nu poate fi încărcată momentan.');
	}

	const page = res.data?.[0];
	if (!page) {
		throw error(404, 'Pagina nu a fost găsită');
	}
	// Filială inactivă → sub-paginile ei nu sunt accesibile (exceptând preview).
	if (page.chapter?.is_active === false && !isPreview) {
		throw error(404, 'Pagina nu a fost găsită');
	}

	const chapterCtx: ChapterContext = {
		countySlug: page.chapter?.county?.slug ?? null,
		coordinators: page.chapter?.coordinators ?? [],
		contact: {
			name: page.chapter?.name,
			email: page.chapter?.email ?? null,
			phone: page.chapter?.phone ?? null,
			address: page.chapter?.address ?? null,
			social_links: page.chapter?.social_links ?? [],
		},
	};

	if (page.content) {
		page.content = await enrichDynamicZone(page.content, fetch, chapterCtx);
	}

	return { page };
};
