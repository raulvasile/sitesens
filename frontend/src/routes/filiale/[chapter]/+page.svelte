<script lang="ts">
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	let { data } = $props();
	const chapter = $derived(data.chapter);
</script>

<SeoHead
	title={chapter?.seo?.meta_title ?? `${chapter?.name} — Filiale SENS`}
	description={chapter?.seo?.meta_description ?? `Filiala SENS ${chapter?.name}. Echipă, știri și evenimente locale.`}
	ogImage={chapter?.seo?.og_image?.url ?? chapter?.cover_image?.url}
	canonicalUrl={chapter?.seo?.canonical_url}
	noIndex={chapter?.seo?.no_index ?? false}
/>

<div class="container chapter-breadcrumb">
	<Breadcrumb
		items={[{ label: 'Filiale', href: '/filiale' }, { label: chapter?.name ?? '' }]}
	/>
</div>

<DynamicZone content={chapter?.content ?? []} zebra={true} />

<style>
	.chapter-breadcrumb {
		padding-top: var(--page-header-pt);
		padding-bottom: var(--space-4);
	}
</style>
