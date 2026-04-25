<script lang="ts">
	import { page as pageState } from '$app/state';
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

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

	/**
	 * Resolve tab index from URL hash (#slug) — preferred — or legacy ?tab=
	 * query param — kept for backwards compatibility with old links.
	 */
	const resolvedTab = $derived.by(() => {
		const hash = pageState.url?.hash?.replace(/^#/, '') ?? '';
		const tabParam = hash || pageState.url?.searchParams.get('tab') || data.initialTab;
		if (tabParam) {
			const idx = tabSlugMap[tabParam];
			if (idx !== undefined) return idx;
		}
		return 0;
	});

	let activeTab = $state(0);

	// Sync activeTab whenever URL hash/param changes
	$effect(() => {
		activeTab = resolvedTab;
	});

	/**
	 * Reverse lookup: index → slug, used to update the URL hash on tab click
	 * without a full navigation (history.replaceState — preserves scroll).
	 */
	const slugForIndex = $derived.by(() => {
		const reverse: Record<number, string> = {};
		for (const [slug, idx] of Object.entries(tabSlugMap)) reverse[idx] = slug;
		return reverse;
	});

	function selectTab(i: number) {
		activeTab = i;
		if (typeof window === 'undefined') return;
		const slug = slugForIndex[i];
		if (!slug) return;
		const url = new URL(window.location.href);
		url.hash = slug;
		// Strip the legacy ?tab= param so the new hash-based URL is canonical.
		url.searchParams.delete('tab');
		window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
	}
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
	<div class="container page-breadcrumb">
		<Breadcrumb items={[{ label: page.title }]} />
	</div>

	{#if page.content?.length}
		<DynamicZone content={page.content} />
	{/if}

	<div class="container tabbed-page">
		<nav class="tab-nav" role="tablist">
			{#each sections as section, i}
				<button
					class="tab-nav__btn"
					class:active={activeTab === i}
					onclick={() => selectTab(i)}
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
	<div class="container page-breadcrumb">
		<Breadcrumb items={[{ label: page.title }]} />
	</div>
	<DynamicZone content={page.content ?? []} />
{/if}

<style>
	.page-breadcrumb {
		/* Match the spacing other top-level pages use for their breadcrumb
		   (see /comunitate, /contact: padding-block var(--space-10) var(--space-4)). */
		padding-top: var(--space-10);
		padding-bottom: var(--space-4);
	}

	.tabbed-page {
		padding-block: var(--space-8);
	}

	.tab-nav {
		display: flex;
		gap: 0;
		border-bottom: 1.5px solid var(--color-ink);
		margin-bottom: var(--space-8);
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.tab-nav::-webkit-scrollbar {
		display: none;
	}

	.tab-nav__btn {
		padding: var(--space-3) var(--space-5);
		border: none;
		background: none;
		cursor: pointer;
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		white-space: nowrap;
		border-bottom: 2px solid transparent;
		margin-bottom: -1.5px;
		transition: all var(--transition-fast);
		line-height: 1.4;
	}

	.tab-nav__btn:hover {
		color: var(--color-ink);
	}

	.tab-nav__btn.active {
		color: var(--color-ink);
		border-bottom-color: var(--color-lime);
	}

	.tab-content {
		padding-bottom: var(--space-8);
	}
</style>
