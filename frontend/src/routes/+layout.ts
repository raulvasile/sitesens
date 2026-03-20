import type { LayoutLoad } from './$types';
import { fetchStrapi } from '$lib/strapi';

export interface MenuItem {
	label: string;
	url: string;
	order: number;
	open_in_new_tab: boolean;
	children: { label: string; url: string }[];
}

export interface NavigationData {
	main_menu: MenuItem[];
	cta_text: string;
	cta_link: string;
}

export const load: LayoutLoad = async () => {
	try {
		const res = await fetchStrapi<NavigationData>('/navigation', {
			'populate[main_menu][populate]': 'children',
		});

		const nav = res.data;
		// Sortăm după order
		if (nav?.main_menu) {
			nav.main_menu.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
		}

		return { navigation: nav };
	} catch {
		// Fallback dacă navigația nu e disponibilă
		return {
			navigation: {
				main_menu: [
					{ label: 'Știri', url: '/stiri', order: 1, open_in_new_tab: false, children: [] },
					{ label: 'Despre', url: '/despre-noi', order: 2, open_in_new_tab: false, children: [] },
					{ label: 'Evenimente', url: '/evenimente', order: 3, open_in_new_tab: false, children: [] },
					{ label: 'Contact', url: '/contact', order: 4, open_in_new_tab: false, children: [] },
				],
				cta_text: 'Înscrie-te',
				cta_link: '/inscrie-te',
			} as NavigationData,
		};
	}
};
