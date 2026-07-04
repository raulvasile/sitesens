import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchStrapi } from '$lib/strapi';
import { getPreviewStatus } from '$lib/server/preview';

export interface TransparencyItem {
	label: string;
	percentage: number;
	description?: string;
}

export interface PresetAmount {
	amount: number;
	label?: string;
}

export interface DonatePageData {
	id: number;
	title: string;
	header_eyebrow?: string;
	description: string | null;
	amounts_kicker?: string;
	amounts_heading?: string;
	preset_amounts_json?: number[];
	amounts?: PresetAmount[];
	custom_amount_label?: string;
	donate_button_text?: string;
	iban?: string;
	bank_name?: string;
	transfer_kicker?: string;
	transfer_heading?: string;
	transfer_notes?: string;
	transparency_kicker?: string;
	transparency_heading?: string;
	transparency?: TransparencyItem[];
	cmf_kicker?: string;
	cmf_text: string | null;
	transparency_items?: TransparencyItem[] | null;
	preset_amounts?: number[];
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	try {
		const res = await fetchStrapi<DonatePageData>('/donate-page', {
			'populate[seo]': 'true',
			'populate[amounts]': 'true',
			'populate[transparency]': 'true',
			...previewParams,
		}, undefined, fetch);
		return { donatePage: res.data };
	} catch (err) {
		const status = (err as { status?: number })?.status;
		throw error(status && status >= 500 ? 503 : 500, 'Nu putem încărca pagina de Donații momentan.');
	}
};
