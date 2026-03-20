<script lang="ts">
	import { page as pageState } from '$app/state';
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data } = $props();
	const page = $derived(data.page);
	const sections = $derived(
		(page.sections ?? [])
			.slice()
			.sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
	);
	const hasTabs = $derived(sections.length > 0);

	/** Map of tab slugs to section indices (for deep-linking via ?tab=xxx) */
	const tabSlugMap = $derived.by(() => {
		const map: Record<string, number> = {};
		sections.forEach((s: any, i: number) => {
			const slug = s.title
				?.toLowerCase()
				.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '')
				.split('-')[0]; // First word as key: "Misiune & Viziune" → "misiune"
			if (slug) map[slug] = i;
		});
		return map;
	});

	/** Resolve tab index from URL ?tab= param or loader initialTab */
	const resolvedTab = $derived.by(() => {
		// Use $app/state for live URL reactivity, fallback to loader data
		const tabParam = pageState.url?.searchParams.get('tab') ?? data.initialTab;
		if (tabParam) {
			const idx = tabSlugMap[tabParam];
			if (idx !== undefined) return idx;
		}
		return 0;
	});

	let activeTab = $state(0);

	// Sync activeTab whenever URL param changes
	$effect(() => {
		activeTab = resolvedTab;
	});
</script>

<SeoHead
	title={page.seo?.meta_title ?? page.title}
	description={page.seo?.meta_description ?? ''}
	ogImage={page.seo?.og_image?.url}
	canonicalUrl={page.seo?.canonical_url}
	noIndex={page.seo?.no_index ?? false}
/>

{#if hasTabs}
	<!-- Pagina are secțiuni → afișare cu tab-uri -->
	{#if page.content?.length}
		<DynamicZone content={page.content} />
	{/if}

	<div class="container tabbed-page">
		<nav class="tab-nav" role="tablist">
			{#each sections as section, i}
				<button
					class="tab-nav__btn"
					class:active={activeTab === i}
					onclick={() => (activeTab = i)}
					role="tab"
					aria-selected={activeTab === i}
				>{section.title}</button>
			{/each}
		</nav>

		<div class="tab-content" role="tabpanel">
			<DynamicZone content={sections[activeTab]?.content ?? []} />
		</div>
	</div>
{:else}
	<!-- Pagina simplă → Dynamic Zone direct -->
	<DynamicZone content={page.content ?? []} />
{/if}

<style>
	.tabbed-page {
		padding-block: var(--space-8);
	}

	.tab-nav {
		display: flex;
		gap: var(--space-1);
		border-bottom: 2px solid var(--color-border);
		margin-bottom: var(--space-8);
		overflow-x: auto;
	}

	.tab-nav__btn {
		padding: var(--space-3) var(--space-4);
		border: none;
		background: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-muted);
		white-space: nowrap;
		border-bottom: 3px solid transparent;
		margin-bottom: -2px;
		transition: all var(--transition-fast);
	}

	.tab-nav__btn:hover {
		color: var(--color-green-dark);
	}

	.tab-nav__btn.active {
		color: var(--color-green-dark);
		border-bottom-color: var(--color-brand-neon);
	}

	.tab-content {
		padding-bottom: var(--space-8);
	}
</style>
