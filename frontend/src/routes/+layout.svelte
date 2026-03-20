<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$components/layout/Navbar.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import Toast from '$components/ui/Toast.svelte';
	import AccessibilityWidget from '$components/ui/AccessibilityWidget.svelte';
	import NavigationProgress from '$components/ui/NavigationProgress.svelte';
	import PreviewBanner from '$lib/components/PreviewBanner.svelte';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';

	interface Props { children: Snippet; data: any; }
	let { children, data }: Props = $props();
	const isPreview = $derived($page.url.searchParams.get('status') === 'draft');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavigationProgress />
<Navbar navigation={data.navigation} />

<main class="main-content">
	{@render children()}
</main>

<Footer />
<PreviewBanner visible={isPreview} />
<Toast />
<AccessibilityWidget />

<style>
	.main-content {
		min-height: calc(100dvh - var(--navbar-height));
		padding-top: var(--navbar-height);
	}
</style>
