<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import TextBlock from '$lib/components/blocks/TextBlock.svelte';

	let { data } = $props();
	const page = $derived(data.page);
</script>

<SeoHead
	title={page?.seo?.meta_title ?? page?.title ?? 'Politica de confidențialitate'}
	description={page?.seo?.meta_description ?? page?.subtitle ?? 'Politica de confidențialitate a Partidului SENS.'}
/>

<div class="container page-header">
	<Breadcrumb items={[{ label: page?.title ?? 'Politica de confidențialitate' }]} />
	<h1>{page?.title ?? 'Politica de confidențialitate'}</h1>
	{#if page?.subtitle}
		<p class="page-subtitle">{page.subtitle}</p>
	{/if}
	{#if page?.cmf_text || page?.last_updated}
		<p class="page-meta">
			{#if page?.cmf_text}{page.cmf_text}{/if}
			{#if page?.last_updated} · Ultima actualizare: {new Date(page.last_updated).toLocaleDateString('ro-RO')}{/if}
		</p>
	{/if}
</div>

{#if page?.content}
	<TextBlock data={{ body: page.content, alignment: 'left' }} />
{/if}

<style>
	.page-header {
		padding-block: var(--page-header-pt) var(--page-header-pb);
		max-width: 880px;
		margin: 0 auto;
	}
	.page-header h1 {
		font-family: var(--font-display);
		font-size: var(--page-title-size);
		font-weight: var(--page-title-weight);
		letter-spacing: var(--page-title-letter-spacing);
		line-height: var(--page-title-line-height);
		text-transform: uppercase;
		color: var(--color-ink);
		margin-top: var(--space-5);
	}
	.page-subtitle {
		font-size: var(--text-lg);
		color: var(--color-ink-soft);
		margin-top: var(--space-4);
		max-width: 600px;
	}
	.page-meta {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		margin-top: var(--space-3);
	}
</style>
