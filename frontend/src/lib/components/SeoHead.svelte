<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface Props {
		title: string;
		description?: string;
		ogImage?: string | null;
		canonicalUrl?: string | null;
		noIndex?: boolean;
		type?: 'website' | 'article';
	}

	let {
		title,
		description = '',
		ogImage = null,
		canonicalUrl = null,
		noIndex = false,
		type = 'website'
	}: Props = $props();

	const siteName = 'Partidul SENS';
	const siteUrl = 'https://partidulsens.ro';
	const fullTitle = $derived(title.includes('SENS') ? title : `${title} — SENS`);
	const ogImgUrl = $derived(ogImage ? getStrapiMediaUrl(ogImage) : `${siteUrl}/og-default.jpg`);
	const canonical = $derived(canonicalUrl ?? (typeof window !== 'undefined' ? window.location.href : ''));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if noIndex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:image" content={ogImgUrl} />
	<meta property="og:site_name" content={siteName} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	<meta property="og:locale" content="ro_RO" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
	<meta name="twitter:image" content={ogImgUrl} />
</svelte:head>
