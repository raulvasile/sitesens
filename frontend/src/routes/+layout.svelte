<script lang="ts">
	// Self-hosted fonts — subset latin + latin-ext (acoperă diacriticele românești ș ț).
	// Smaller payload than the default `XXX.css` which includes cyrillic + vietnamese.
	import '@fontsource/oswald/latin-300.css';
	import '@fontsource/oswald/latin-400.css';
	import '@fontsource/oswald/latin-500.css';
	import '@fontsource/oswald/latin-ext-300.css';
	import '@fontsource/oswald/latin-ext-400.css';
	import '@fontsource/oswald/latin-ext-500.css';
	import '@fontsource/league-spartan/latin-300.css';
	import '@fontsource/league-spartan/latin-400.css';
	import '@fontsource/league-spartan/latin-500.css';
	import '@fontsource/league-spartan/latin-600.css';
	import '@fontsource/league-spartan/latin-700.css';
	import '@fontsource/league-spartan/latin-ext-400.css';
	import '@fontsource/league-spartan/latin-ext-500.css';
	import '@fontsource/jetbrains-mono/latin-400.css';
	import '@fontsource/jetbrains-mono/latin-500.css';
	import '@fontsource/jetbrains-mono/latin-ext-400.css';

	// Preload critical above-the-fold fonts (high-priority, parallel to HTML).
	// Vite gives these stable URLs with hashed filenames.
	import oswaldLatin400 from '@fontsource/oswald/files/oswald-latin-400-normal.woff2?url';
	import oswaldLatin500 from '@fontsource/oswald/files/oswald-latin-500-normal.woff2?url';
	import oswaldLatinExt400 from '@fontsource/oswald/files/oswald-latin-ext-400-normal.woff2?url';
	import oswaldLatinExt500 from '@fontsource/oswald/files/oswald-latin-ext-500-normal.woff2?url';
	import leagueSpartanLatin400 from '@fontsource/league-spartan/files/league-spartan-latin-400-normal.woff2?url';
	import leagueSpartanLatinExt400 from '@fontsource/league-spartan/files/league-spartan-latin-ext-400-normal.woff2?url';
	import jetbrainsLatin400 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url';

	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$components/layout/Navbar.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import Toast from '$components/ui/Toast.svelte';
	import AccessibilityWidget from '$components/ui/AccessibilityWidget.svelte';
	import NavigationProgress from '$components/ui/NavigationProgress.svelte';
	import CardModal from '$components/ui/CardModal.svelte';
	import BackToTop from '$components/ui/BackToTop.svelte';
	import PreviewBanner from '$lib/components/PreviewBanner.svelte';
	import Analytics from '$lib/components/Analytics.svelte';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import type { Snippet } from 'svelte';

	interface Props { children: Snippet; data: any; }
	let { children, data }: Props = $props();
	const isPreview = $derived($page.url.searchParams.get('status') === 'draft');

	// SvelteKit's client router doesn't auto-scroll to URL hashes (it preserves
	// scroll position across navigations). After every navigation, if the URL
	// has a #anchor, look up the matching DOM id and scroll there. The two-rAF
	// wait ensures the new route's DOM is mounted and the layout has settled.
	afterNavigate(() => {
		if (typeof window === 'undefined') return;
		const hash = window.location.hash;
		if (!hash || hash.length < 2) return;
		const id = decodeURIComponent(hash.slice(1));
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const el = document.getElementById(id);
				if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Preload above-the-fold fonts so they arrive before the first paint
	     (no FOUT). `font-display: swap` would otherwise show fallback briefly. -->
	<link rel="preload" href={oswaldLatin500} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={oswaldLatin400} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={oswaldLatinExt500} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={oswaldLatinExt400} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={leagueSpartanLatin400} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={leagueSpartanLatinExt400} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={jetbrainsLatin400} as="font" type="font/woff2" crossorigin="anonymous" />

	{#if data.themeCss}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<style id="site-theme-overrides">${data.themeCss}</style>`}
	{/if}
</svelte:head>

<NavigationProgress />
<Navbar navigation={data.navigation} />

<div class="page-wrapper">
	<main class="main-content">
		{@render children()}
	</main>

	<Footer footer={data.footer} navigation={data.navigation} />
</div>

<PreviewBanner visible={isPreview} />
<Toast />
<CardModal />
<BackToTop />
<AccessibilityWidget />
<Analytics />

<style>
	.page-wrapper {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: space-between;
		min-height: 100dvh;
		padding-top: var(--navbar-height);
	}

	.main-content {
		flex: 1;
	}
</style>
