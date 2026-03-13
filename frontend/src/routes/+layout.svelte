<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$components/layout/Navbar.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import Toast from '$components/ui/Toast.svelte';
	import AccessibilityWidget from '$components/ui/AccessibilityWidget.svelte';
	import type { Snippet } from 'svelte';

	interface Props { children: Snippet; }
	let { children }: Props = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar />

<main class="main-content">
	{@render children()}
</main>

<Footer />
<Toast />
<AccessibilityWidget />

<style>
	.main-content {
		min-height: calc(100dvh - var(--navbar-height));
		padding-top: var(--navbar-height);
	}
</style>
