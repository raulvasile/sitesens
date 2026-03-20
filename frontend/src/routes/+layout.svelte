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

<div class="page-wrapper">
	<main class="main-content">
		{@render children()}
	</main>

	<Footer footer={data.footer} navigation={data.navigation} />
</div>

<PreviewBanner visible={isPreview} />
<Toast />
<AccessibilityWidget />

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
