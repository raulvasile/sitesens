<script lang="ts">
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data } = $props();
	const page = $derived(data.page);
</script>

<SeoHead
	title={page.seo?.meta_title ?? page.title}
	description={page.seo?.meta_description ?? ''}
	ogImage={page.seo?.og_image?.url}
	canonicalUrl={page.seo?.canonical_url}
	noIndex={page.seo?.no_index ?? false}
/>

<DynamicZone content={page.content ?? []} />
