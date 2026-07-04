import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';
import { getPreviewStatus } from '$lib/server/preview';
import { enrichDynamicZone, type ChapterContext } from '$lib/enrichDynamicZone';
import { chapterContentPopulate } from '$lib/chapterPopulate';

export interface ChapterData {
	id: number;
	name: string;
	slug: string;
	content: Array<{ __component: string; [key: string]: unknown }>;
	cover_image?: { url: string; alternativeText?: string } | null;
	email?: string | null;
	phone?: string | null;
	address?: string | null;
	is_active?: boolean;
	social_links?: Array<{ platform: string; url: string }>;
	county?: { name: string; slug?: string } | null;
	coordinators?: Array<{
		id?: number;
		locality?: string;
		local_role?: string;
		member?: { id: number; name: string; role?: string; photo?: { url: string } | null } | null;
	}>;
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
		res = await fetchStrapi<ChapterData[]>('/chapters', {
			'filters[slug][$eq]': params.chapter,
			...chapterContentPopulate(),
			'populate[cover_image]': 'true',
			'populate[county]': 'true',
			'populate[social_links]': 'true',
			'populate[coordinators][populate][member][populate][photo]': 'true',
			'populate[seo][populate]': '*',
			...previewParams,
		}, undefined, fetch);
	} catch (err) {
		const status = (err as { status?: number })?.status;
		const message = (err as { message?: string })?.message ?? 'unknown';
		console.error(`[/filiale/${params.chapter}] Strapi fetch failed (${status ?? '?'}): ${message}`);
		throw error(status && status >= 500 ? 503 : 500, 'Filiala nu poate fi încărcată momentan.');
	}

	const chapter = res.data?.[0];
	if (!chapter) {
		throw error(404, 'Filiala nu a fost găsită');
	}
	// is_active false → ascunsă, exceptând modul preview (draftAndPublish acoperă draft-urile).
	if (chapter.is_active === false && !isPreview) {
		throw error(404, 'Filiala nu a fost găsită');
	}

	const chapterCtx: ChapterContext = {
		countySlug: chapter.county?.slug ?? null,
		coordinators: chapter.coordinators ?? [],
		contact: {
			name: chapter.name,
			email: chapter.email ?? null,
			phone: chapter.phone ?? null,
			address: chapter.address ?? null,
			social_links: chapter.social_links ?? [],
		},
	};

	if (chapter.content) {
		chapter.content = await enrichDynamicZone(chapter.content, fetch, chapterCtx);
	}

	return { chapter };
};
