<!-- Catch-all route pentru paginile din Strapi Page collection (Dynamic Zone) -->
<script lang="ts">
	import DynamicZone from '$components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import type { StrapiPage } from './+page';

	interface Props {
		data: { page: StrapiPage | null };
	}
	let { data }: Props = $props();
</script>

{#if data.page}
	<SeoHead
		title={data.page.attributes?.seo?.meta_title ?? data.page.attributes?.title ?? 'SENS'}
		description={data.page.attributes?.seo?.meta_description ?? ''}
		ogImage={data.page.attributes?.seo?.og_image?.url}
		canonicalUrl={data.page.attributes?.seo?.canonical_url}
		noIndex={data.page.attributes?.seo?.no_index ?? false}
	/>
{/if}

{#if data.page}
	<DynamicZone content={data.page.attributes.content ?? []} />
{:else}
	<div class="container page-header">
		<h1>Pagina nu a fost găsită</h1>
		<a href="/" class="btn btn-primary">Înapoi la pagina principală</a>
	</div>
{/if}

<style>
	.page-header { padding-block: var(--space-16); }
</style>
