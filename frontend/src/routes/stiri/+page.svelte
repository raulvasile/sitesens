<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getStrapiMediaUrl } from '$lib/strapi';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	let { data } = $props();
	let searchValue = $state(data.currentSearch);
	let openDropdown = $state<string | null>(null);

	const topCategories = $derived(data.categories.filter((c: any) => !c.parent));
	const activeCat = $derived(data.categories.find((c: any) => c.slug === data.currentCategory));
	const activeParentSlug = $derived(activeCat?.parent?.slug ?? activeCat?.slug);
	const activeParent = $derived(
		activeCat?.parent ?? (activeCat && !activeCat.parent ? activeCat : null)
	);
	const activeSub = $derived(activeCat?.parent ? activeCat : null);

	// Map: parent slug → subcategories[]
	const subsByParent = $derived.by(() => {
		const map: Record<string, any[]> = {};
		for (const cat of data.categories) {
			if (cat.parent?.slug) {
				if (!map[cat.parent.slug]) map[cat.parent.slug] = [];
				map[cat.parent.slug].push(cat);
			}
		}
		return map;
	});

	function toggleDropdown(slug: string) {
		openDropdown = openDropdown === slug ? null : slug;
	}

	function handleDocumentClick(e: MouseEvent) {
		if (!openDropdown) return;
		const target = e.target as HTMLElement;
		if (!target.closest('.category-group')) {
			openDropdown = null;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && openDropdown) {
			openDropdown = null;
		}
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.addEventListener('click', handleDocumentClick);
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('click', handleDocumentClick);
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('ro-RO', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
	}

	function setCategory(slug: string) {
		const params = new URLSearchParams($page.url.searchParams);
		if (slug) {
			params.set('categorie', slug);
		} else {
			params.delete('categorie');
		}
		params.delete('page');
		openDropdown = null;
		goto(`/stiri?${params.toString()}`, { replaceState: true });
	}

	function submitSearch(e: SubmitEvent) {
		e.preventDefault();
		const params = new URLSearchParams($page.url.searchParams);
		if (searchValue.trim()) {
			params.set('q', searchValue.trim());
		} else {
			params.delete('q');
		}
		params.delete('page');
		goto(`/stiri?${params.toString()}`, { replaceState: true });
	}

	function goToPage(p: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', String(p));
		goto(`/stiri?${params.toString()}`, { replaceState: true });
	}

	function clearTag() {
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('tag');
		params.delete('page');
		goto(`/stiri?${params.toString()}`, { replaceState: true });
	}
</script>

<SeoHead
	title="Știri"
	description="Ultimele comunicate, analize și acțiuni ale Partidului SENS."
/>

<div class="container stiri-page">
	<Breadcrumb items={[{ label: 'Știri' }]} />

	<header class="stiri-header">
		<h1>Știri</h1>
		<form class="stiri-search" onsubmit={submitSearch}>
			<input
				type="search"
				bind:value={searchValue}
				placeholder="Caută articole..."
				aria-label="Caută articole"
				class="stiri-search__input"
			/>
			<button type="submit" class="btn btn-primary btn-sm">Caută</button>
		</form>
	</header>

	<!-- Filtre categorii cu dropdown pentru subcategorii -->
	<div class="category-filters" aria-label="Filtre categorii">
		<button
			class="category-pill"
			class:active={!data.currentCategory}
			onclick={() => setCategory('')}
		>Toate</button>
		{#each topCategories as cat}
			{@const subs = subsByParent[cat.slug] ?? []}
			{@const hasSubs = subs.length > 0}
			{@const isActive = data.currentCategory === cat.slug || activeCat?.parent?.slug === cat.slug}
			{@const isOpen = openDropdown === cat.slug}
			<div class="category-group" class:category-group--open={isOpen}>
				<div class="category-pill-wrapper">
					<button
						class="category-pill"
						class:active={isActive}
						onclick={() => setCategory(cat.slug)}
						aria-pressed={isActive}
					>{cat.name}</button>
					{#if hasSubs}
						<button
							class="category-chevron"
							class:category-chevron--active={isActive}
							onclick={() => toggleDropdown(cat.slug)}
							aria-expanded={isOpen}
							aria-label={`${isOpen ? 'Închide' : 'Deschide'} subcategoriile pentru ${cat.name}`}
						>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>
					{/if}
				</div>
				{#if hasSubs && isOpen}
					<div class="category-dropdown" role="menu">
						<button
							class="category-dropdown__item"
							class:active={data.currentCategory === cat.slug}
							onclick={() => setCategory(cat.slug)}
							role="menuitem"
						>
							<span class="category-dropdown__label">Toate din {cat.name}</span>
						</button>
						{#each subs as sub}
							<button
								class="category-dropdown__item"
								class:active={data.currentCategory === sub.slug}
								onclick={() => setCategory(sub.slug)}
								role="menuitem"
							>
								<span class="category-dropdown__label">{sub.name}</span>
								{#if sub.description}
									<span class="category-dropdown__desc">{sub.description}</span>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Breadcrumb activ pentru ierarhia selectată -->
	{#if activeParent}
		<nav class="category-breadcrumb" aria-label="Cale curentă">
			<button class="category-breadcrumb__item" onclick={() => setCategory('')}>
				Toate
			</button>
			<span class="category-breadcrumb__sep" aria-hidden="true">›</span>
			<button
				class="category-breadcrumb__item"
				class:category-breadcrumb__item--current={!activeSub}
				onclick={() => setCategory(activeParent.slug)}
			>
				{activeParent.name}
			</button>
			{#if activeSub}
				<span class="category-breadcrumb__sep" aria-hidden="true">›</span>
				<span class="category-breadcrumb__item category-breadcrumb__item--current">
					{activeSub.name}
				</span>
			{/if}
		</nav>
	{/if}

	{#if data.currentTag}
		<p class="search-info">
			Etichetă activă: <strong>#{data.currentTag}</strong>
			<button class="search-clear" onclick={clearTag}>✕ Șterge eticheta</button>
		</p>
	{/if}

	{#if data.currentSearch}
		<p class="search-info">
			Rezultate pentru „<strong>{data.currentSearch}</strong>"
			<button class="search-clear" onclick={() => { searchValue = ''; goto('/stiri', { replaceState: true }); }}>✕ Șterge filtrul</button>
		</p>
	{/if}

	<!-- Grid articole -->
	{#if data.articles.length > 0}
		<div class="articles-grid">
			{#each data.articles as article}
				<a href="/stiri/{article.slug}" class="article-card">
					{#if article.cover_image?.url}
						<img
							src={getStrapiMediaUrl(article.cover_image.url)}
							alt={article.cover_image.alternativeText ?? article.title}
							class="article-card__img"
							loading="lazy"
							decoding="async"
						/>
					{:else}
						<div class="article-card__img article-card__img--placeholder"></div>
					{/if}
					<div class="article-card__body">
						<div class="article-card__meta">
							{#if article.category}
								<span class="article-card__badge" style="background-color: {article.category.color ?? '#003827'}">
									{#if article.category.parent}
										<span class="article-card__badge-parent">{article.category.parent.name}</span>
										<span class="article-card__badge-sep" aria-hidden="true">›</span>
									{/if}
									<span>{article.category.name}</span>
								</span>
							{/if}
							<time class="article-card__date">{formatDate(article.createdAt)}</time>
						</div>
						<h2 class="article-card__title">{article.title}</h2>
						{#if article.excerpt}
							<p class="article-card__excerpt">{article.excerpt}</p>
						{/if}
						<div class="article-card__footer">
							{#if article.author}
								<span class="article-card__author">{article.author.name}</span>
							{/if}
							{#if article.reading_time}
								<span class="article-card__read-time">{article.reading_time} min citire</span>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Paginare -->
		{#if data.pagination.pageCount > 1}
			<nav class="pagination" aria-label="Paginare">
				<button
					class="pagination__btn"
					disabled={data.currentPage <= 1}
					onclick={() => goToPage(data.currentPage - 1)}
				>← Anterior</button>
				{#each Array.from({ length: data.pagination.pageCount }, (_, i) => i + 1) as p}
					<button
						class="pagination__num"
						class:active={p === data.currentPage}
						onclick={() => goToPage(p)}
						aria-current={p === data.currentPage ? 'page' : undefined}
					>{p}</button>
				{/each}
				<button
					class="pagination__btn"
					disabled={data.currentPage >= data.pagination.pageCount}
					onclick={() => goToPage(data.currentPage + 1)}
				>Următor →</button>
			</nav>
		{/if}
	{:else}
		<div class="empty-state">
			<p>Nu am găsit articole{data.currentCategory ? ' în această categorie' : ''}{data.currentTag ? ` cu eticheta „${data.currentTag}"` : ''}{data.currentSearch ? ` pentru „${data.currentSearch}"` : ''}.</p>
			<a href="/stiri" class="btn btn-secondary">Vezi toate știrile</a>
		</div>
	{/if}
</div>

<style>
	.stiri-page {
		padding-block: var(--page-header-pt) var(--space-16);
		background-color: var(--color-paper);
	}
	.stiri-header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
		padding-bottom: var(--page-header-pb);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}
	.stiri-header h1 {
		font-family: var(--font-display);
		font-size: var(--page-title-size);
		font-weight: var(--page-title-weight);
		letter-spacing: var(--page-title-letter-spacing);
		text-transform: uppercase;
		line-height: var(--page-title-line-height);
		color: var(--color-ink);
	}
	.stiri-search { display: flex; gap: var(--space-2); }
	.stiri-search__input {
		padding: 0.625rem 0.875rem;
		border: 1.5px solid var(--color-ink);
		background-color: var(--color-paper);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		min-width: 200px;
	}
	.stiri-search__input:focus {
		outline: none;
		background-color: var(--color-cream);
	}
	.category-filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.category-group { position: relative; }

	.category-pill-wrapper {
		display: inline-flex;
		align-items: stretch;
		overflow: hidden;
		border: 1.5px solid var(--color-ink);
		background: var(--color-paper);
		transition: background-color var(--transition-fast);
	}

	.category-pill-wrapper:hover { background-color: var(--color-cream); }

	.category-pill {
		padding: 0.5rem 0.875rem;
		border: none;
		background: transparent;
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all var(--transition-fast);
		color: var(--color-ink);
	}

	.category-pill.active {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}

	.category-chevron {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		border: none;
		border-left: 1.5px solid var(--color-ink);
		background: transparent;
		color: var(--color-ink);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.category-chevron:hover { background-color: var(--color-lime); }
	.category-chevron--active { color: var(--color-lime); background-color: var(--color-ink); border-left-color: rgba(145, 255, 0, 0.3); }
	.category-chevron svg { transition: transform 0.2s ease; }
	.category-group--open .category-chevron svg { transform: rotate(180deg); }

	.category-dropdown {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		min-width: 240px;
		background: var(--color-paper);
		border: 1.5px solid var(--color-ink);
		padding: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
	}

	.category-dropdown__item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		padding: var(--space-3) var(--space-4);
		border: none;
		border-bottom: 1px solid rgba(12, 81, 24, 0.12);
		background: transparent;
		font-family: var(--font-body);
		text-align: left;
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.category-dropdown__item:last-child { border-bottom: none; }
	.category-dropdown__item:hover { background-color: var(--color-cream); }
	.category-dropdown__item.active { background-color: var(--color-lime); }

	.category-dropdown__label {
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink);
	}

	.category-dropdown__desc {
		font-size: 0.75rem;
		color: var(--color-ink-soft);
		font-weight: 400;
	}

	/* ── Breadcrumb activ ── */
	.category-breadcrumb {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-bottom: var(--space-8);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.category-breadcrumb__item {
		border: none;
		background: transparent;
		padding: 4px 8px;
		color: var(--color-ink-soft);
		font-family: inherit;
		font-size: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.category-breadcrumb__item:hover {
		color: var(--color-ink);
		background-color: var(--color-cream);
	}

	.category-breadcrumb__item--current {
		color: var(--color-ink);
		font-weight: 500;
		cursor: default;
		background-color: var(--color-lime);
	}

	.category-breadcrumb__sep {
		color: var(--color-ink-soft);
		opacity: 0.6;
	}

	/* ── Badge cu Parent › Sub ── */
	.article-card__badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--color-ink) !important;
		background-color: var(--color-lime) !important;
		padding: 3px 10px;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}

	.article-card__badge-parent {
		opacity: 0.6;
		font-weight: 400;
	}

	.article-card__badge-sep { opacity: 0.5; }

	.search-info {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		margin-bottom: var(--space-6);
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.search-clear {
		background: none;
		border: none;
		color: var(--color-error);
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.articles-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		margin-bottom: var(--space-10);
	}
	@media (min-width: 640px) { .articles-grid { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 1024px) { .articles-grid { grid-template-columns: repeat(3, 1fr); } }

	.article-card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-white);
		border: 1px solid rgba(12, 81, 24, 0.12);
		text-decoration: none;
		color: var(--color-ink);
		transition: transform var(--transition-base), box-shadow var(--transition-base);
		overflow: hidden;
	}
	.article-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(10, 31, 16, 0.08);
		color: var(--color-ink);
	}
	.article-card__img {
		width: 100%;
		aspect-ratio: 4/3;
		object-fit: cover;
	}
	.article-card__img--placeholder {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-cream);
	}
	.article-card__body {
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		flex: 1;
	}
	.article-card__meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.article-card__date {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.article-card__title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1.05;
		color: var(--color-ink);
	}
	.article-card__excerpt {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-ink-soft);
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.article-card__footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
		padding-top: var(--space-3);
		border-top: 1px solid rgba(12, 81, 24, 0.12);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}

	.pagination {
		display: flex;
		justify-content: center;
		gap: var(--space-1);
		padding-block: var(--space-8);
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}
	.pagination__btn, .pagination__num {
		padding: 0.5rem 0.875rem;
		border: 1.5px solid var(--color-ink);
		background: transparent;
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.pagination__btn:disabled { opacity: 0.3; cursor: not-allowed; }
	.pagination__num:hover { background-color: var(--color-cream); }
	.pagination__num.active {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}
	.empty-state { text-align: center; padding: var(--space-16) 0; }
	.empty-state p {
		font-family: var(--font-body);
		color: var(--color-ink-soft);
		margin-bottom: var(--space-4);
	}
</style>
