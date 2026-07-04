<script lang="ts">
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	let { data } = $props();
	const page = $derived(data.page);
	const chapter = $derived(page?.chapter);
</script>

<SeoHead
	title={page?.seo?.meta_title ?? `${page?.title} — ${chapter?.name ?? 'Filiale SENS'}`}
	description={page?.seo?.meta_description ?? undefined}
	ogImage={page?.seo?.og_image?.url}
	canonicalUrl={page?.seo?.canonical_url}
	noIndex={page?.seo?.no_index ?? false}
/>

<div class="container chapter-breadcrumb">
	<Breadcrumb
		items={[
			{ label: 'Filiale', href: '/filiale' },
			{ label: chapter?.name ?? '', href: chapter?.slug ? `/filiale/${chapter.slug}` : undefined },
			{ label: page?.title ?? '' }
		]}
	/>
</div>

<DynamicZone content={page?.content ?? []} zebra={true} />

<style>
	.chapter-breadcrumb {
		padding-top: var(--page-header-pt);
		padding-bottom: var(--space-4);
	}
</style>
