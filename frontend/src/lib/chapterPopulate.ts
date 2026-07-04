/**
 * Populate-ul pentru Dynamic Zone de filială (chapter + chapter-page).
 *
 * Strapi v5: `populate=*` pe un DynamicZone returnează blocurile dar NU
 * deep-populează componentele nested — fiecare tip de bloc are nevoie de
 * populate propriu. NU combina `*` cu chei nested pe același bloc (eroare
 * „Invalid populate parameter"). Vezi CLAUDE.md gotcha #1.
 *
 * Spre deosebire de `/pages`, filialele NU au `sections`, deci toate cheile
 * sunt pe `content` direct.
 */
export function chapterContentPopulate(): Record<string, string> {
	const p: Record<string, string> = {};

	// NOTĂ: `file-list` și `card-grid` NU intră aici — sunt deep-populate mai jos.
	// A le pune și aici (cu `*`) ȘI jos (chei nested) dă „Invalid populate parameter"
	// (Strapi vede două valori pentru `populate`). Vezi CLAUDE.md gotcha #1.
	const SHALLOW_BLOCKS = [
		'hero', 'hero-refined', 'hero-editorial', 'text-block', 'cta-banner',
		'image-gallery', 'accordion', 'quote', 'video-embed', 'stats-counter',
		'program-points', 'newsletter-cta', 'latest-articles', 'upcoming-events',
		'contact-form', 'spacer', 'timeline', 'mission-band', 'team-grid',
		'page-header',
		// Blocuri proprii filialei (scalari simpli — se îmbogățesc server-side).
		'chapter-coordinators', 'chapter-feed', 'chapter-contact',
	];
	for (const t of SHALLOW_BLOCKS) {
		p[`populate[content][on][blocks.${t}][populate]`] = '*';
	}

	// Deep-populate: card-grid (media + points), file-list (media nested).
	p['populate[content][on][blocks.card-grid][populate][cards][populate][image]'] = 'true';
	p['populate[content][on][blocks.card-grid][populate][cards][populate][background_image]'] = 'true';
	p['populate[content][on][blocks.card-grid][populate][cards][populate][points]'] = 'true';
	p['populate[content][on][blocks.file-list][populate][files][populate][file]'] = 'true';

	return p;
}
