<script lang="ts">
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data } = $props();
	const hp = $derived(data.homepage);
</script>

<SeoHead
	title={hp?.seo?.meta_title ?? 'SENS — Sănătate · Educație · Natură · Sustenabilitate'}
	description={hp?.seo?.meta_description ?? 'Partidul SENS — O Românie verde, echitabilă și modernă.'}
	ogImage={hp?.seo?.og_image?.url}
	canonicalUrl={hp?.seo?.canonical_url}
	noIndex={hp?.seo?.no_index ?? false}
/>

<DynamicZone content={hp?.content ?? []} />
