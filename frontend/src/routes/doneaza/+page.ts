import type { PageLoad } from './$types';
import { fetchStrapi, getPreviewStatus } from '$lib/strapi';

export interface TransparencyItem {
	label: string;
	percentage: number;
}

export interface DonatePageData {
	id: number;
	title: string;
	description: string | null;
	preset_amounts: number[];
	cmf_text: string | null;
	transparency_items: TransparencyItem[] | null;
	seo: {
		meta_title: string | null;
		meta_description: string | null;
		og_image: { url: string } | null;
		canonical_url: string | null;
		no_index: boolean;
	} | null;
}

export const load: PageLoad = async ({ url, fetch }) => {
	const { params: previewParams } = getPreviewStatus(url);

	try {
		const res = await fetchStrapi<DonatePageData>('/donate-page', {
			populate: 'seo',
			...previewParams,
		}, undefined, fetch);
		return { donatePage: res.data };
	} catch {
		return {
			donatePage: {
				id: 0,
				title: 'Donează pentru SENS',
				description: 'Fiecare leu contează. Donația ta ne ajută să construim o Românie verde, echitabilă și modernă.',
				preset_amounts: [25, 50, 100, 200],
				cmf_text: 'Mandatar financiar CMF nr. 11240065. Donațiile sunt reglementate de Legea 334/2006.',
				transparency_items: [
					{ label: 'Campanii ecologice', percentage: 40 },
					{ label: 'Comunicare și media', percentage: 25 },
					{ label: 'Organizare și evenimente', percentage: 20 },
					{ label: 'Administrare', percentage: 15 },
				],
				seo: null,
			} as DonatePageData,
		};
	}
};
