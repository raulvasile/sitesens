import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';
import { COUNTIES } from '$lib/data/romania-counties';

export interface ChapterListItem {
	id: number;
	name: string;
	slug: string;
	cover_image?: { url: string; alternativeText?: string } | null;
	county?: { name: string; slug?: string } | null;
}

/** Forma pe care o așteaptă RomaniaMap pentru un județ cu filială. */
export interface MapChapter {
	code: string;
	name: string;
	url: string;
	open_in_new_tab: boolean;
}

// county.slug → ISO code (CJ, B, ...) pentru a lega filialele de hartă.
const CODE_BY_COUNTY_SLUG = new Map(COUNTIES.map((c) => [c.slug, c.code]));

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetchStrapi<ChapterListItem[]>('/chapters', {
			'filters[is_active][$eq]': 'true',
			'sort[0]': 'name:asc',
			'pagination[pageSize]': '100',
			'populate[cover_image]': 'true',
			'populate[county]': 'true',
		}, undefined, fetch);

		const chapters = res.data ?? [];

		// Construiește datele pentru hartă: doar filialele care au un județ
		// recunoscut (slug → code). Filialele fără județ apar doar în grilă.
		const mapChapters: MapChapter[] = [];
		for (const ch of chapters) {
			const code = ch.county?.slug ? CODE_BY_COUNTY_SLUG.get(ch.county.slug) : undefined;
			if (!code) continue;
			mapChapters.push({
				code,
				name: ch.name,
				url: `/filiale/${ch.slug}`,
				open_in_new_tab: false,
			});
		}

		return { chapters, mapChapters };
	} catch (err) {
		const status = (err as { status?: number })?.status;
		throw error(status && status >= 500 ? 503 : 500, 'Nu putem încărca filialele momentan.');
	}
};
