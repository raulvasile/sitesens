import type { LayoutLoad } from './$types';

export interface MenuItem {
	label: string;
	url: string;
	order: number;
	open_in_new_tab: boolean;
	children: { label: string; url: string }[];
}

export interface NavigationData {
	main_menu: MenuItem[];
	secondary_menu: MenuItem[];
	logo?: { url: string; alternativeText?: string } | null;
	mobile_extra_links?: { label: string; url: string }[];
	mobile_home_label?: string;
	mobile_language_text?: string;
}

export interface SocialLink {
	platform: string;
	label: string;
	url: string;
}

export interface FooterData {
	logo?: { url: string; alternativeText?: string } | null;
	tagline: string;
	eu_text: string;
	footer_links: { label: string; url: string }[];
	social_links: SocialLink[];
	legal_text: string;
	privacy_link_text: string;
	privacy_link_url: string;
}

/**
 * Universal layout load — consumes server data from +layout.server.ts.
 *
 * The actual Strapi fetches run once on the server (+layout.server.ts) and
 * are serialized into the HTML. SvelteKit reuses this payload across
 * client-side navigation unless invalidated, so we DON'T re-fetch on every
 * page change.
 */
export const load: LayoutLoad = async ({ data }) => {
	const nav = (data as { _serverNav?: NavigationData | null })?._serverNav ?? null;
	const footerRaw = (data as { _serverFooter?: FooterData | null })?._serverFooter ?? null;

	const navigation: NavigationData = nav ?? {
		main_menu: [
			{ label: 'Știri', url: '/stiri', order: 1, open_in_new_tab: false, children: [] },
			{ label: 'Despre', url: '/despre-noi', order: 2, open_in_new_tab: false, children: [] },
			{ label: 'Evenimente', url: '/evenimente', order: 3, open_in_new_tab: false, children: [] },
			{ label: 'Contact', url: '/contact', order: 4, open_in_new_tab: false, children: [] },
		],
		secondary_menu: [
			{ label: 'Înscrie-te', url: '/inscrie-te', order: 1, open_in_new_tab: false, children: [] },
		],
	};

	// Footer
	const footer: FooterData = footerRaw ?? {
		tagline: 'Sănătate · Educație · Natură · Sustenabilitate',
		eu_text: 'Membru al European Greens și al grupului Verzi/ALE din Parlamentul European',
		footer_links: [
			{ label: 'Știri', url: '/stiri' },
			{ label: 'Despre Noi', url: '/despre-noi' },
			{ label: 'Evenimente', url: '/evenimente' },
			{ label: 'Contact', url: '/contact' },
			{ label: 'Donează', url: '/doneaza' },
		],
		social_links: [
			{ platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/cusens' },
			{ platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/cusens' },
			{ platform: 'twitter', label: 'X / Twitter', url: 'https://twitter.com/cusens' },
			{ platform: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@cusens' },
		],
		legal_text: 'Partidul SENS · Mandatar financiar CMF nr. 11240065',
		privacy_link_text: 'Politica de confidențialitate',
		privacy_link_url: '/politica-confidentialitate',
	};

	return { navigation, footer };
};
