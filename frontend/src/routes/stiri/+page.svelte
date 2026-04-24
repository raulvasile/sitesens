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
			<p>Nu am găsit articole{data.currentCategory ? ' în această categorie' : ''}{data.currentSearch ? ` pentru „${data.currentSearch}"` : ''}.</p>
			<a href="/stiri" class="btn btn-secondary">Vezi toate știrile</a>
		</div>
	{/if}
</div>

<style>
	.stiri-page { padding-block: var(--space-8); }
	.stiri-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-4); margin-bottom: var(--space-6); }
	.stiri-header h1 { font-size: var(--text-3xl); }
	.stiri-search { display: flex; gap: var(--space-2); }
	.stiri-search__input {
		padding: 0.5rem 0.75rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-family: var(--font-body);
		min-width: 180px;
	}
	.stiri-search__input:focus { outline: none; border-color: var(--color-green-dark); }
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
		border-radius: var(--radius-xl);
		overflow: hidden;
		border: 1px solid var(--color-border);
		background: var(--color-white);
		transition: border-color var(--transition-fast);
	}

	.category-pill-wrapper:hover { border-color: var(--color-green-dark); }

	.category-pill {
		padding: 0.375rem 0.875rem;
		border: none;
		background: transparent;
		font-size: var(--text-sm);
		font-family: var(--font-body);
		cursor: pointer;
		transition: all var(--transition-fast);
		color: var(--color-text-muted);
	}

	.category-pill-wrapper:hover .category-pill { color: var(--color-green-dark); }

	.category-pill.active {
		background-color: var(--color-green-dark);
		color: var(--color-white);
	}

	.category-chevron {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		border: none;
		border-left: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.category-chevron:hover { color: var(--color-green-dark); background-color: rgba(0, 56, 39, 0.04); }
	.category-chevron--active { color: var(--color-white); background-color: var(--color-green-dark); border-left-color: rgba(255, 255, 255, 0.2); }
	.category-chevron svg { transition: transform 0.2s ease; }
	.category-group--open .category-chevron svg { transform: rotate(180deg); }

	.category-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		min-width: 220px;
		background: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		padding: var(--space-2);
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.category-dropdown__item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		padding: var(--space-2) var(--space-3);
		border: none;
		border-radius: var(--radius-sm);
		background: transparent;
		font-family: var(--font-body);
		text-align: left;
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.category-dropdown__item:hover { background-color: var(--color-bg); }
	.category-dropdown__item.active { background-color: var(--color-green-leaf); }

	.category-dropdown__label {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-green-dark);
	}

	.category-dropdown__desc {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-weight: 400;
	}

	/* ── Breadcrumb activ ── */
	.category-breadcrumb {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-bottom: var(--space-6);
		font-size: var(--text-sm);
	}

	.category-breadcrumb__item {
		border: none;
		background: transparent;
		padding: 2px 6px;
		color: var(--color-text-muted);
		font-family: var(--font-body);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.category-breadcrumb__item:hover { color: var(--color-green-dark); background-color: var(--color-bg); }

	.category-breadcrumb__item--current {
		color: var(--color-green-dark);
		font-weight: 600;
		cursor: default;
	}

	.category-breadcrumb__sep {
		color: var(--color-text-muted);
		opacity: 0.6;
	}

	/* ── Badge cu Parent › Sub ── */
	.article-card__badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-white);
		padding: 3px 10px;
		border-radius: var(--radius-full);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.article-card__badge-parent {
		opacity: 0.7;
		font-weight: 500;
	}

	.article-card__badge-sep { opacity: 0.6; }
	.search-info { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-6); display: flex; align-items: center; gap: var(--space-3); }
	.search-clear { background: none; border: none; color: var(--color-error); cursor: pointer; font-size: var(--text-sm); font-family: var(--font-body); }
	.articles-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-6); margin-bottom: var(--space-8); }
	@media (min-width: 640px) { .articles-grid { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 1024px) { .articles-grid { grid-template-columns: repeat(3, 1fr); } }
	.article-card {
		display: flex; flex-direction: column; border-radius: var(--radius-md); overflow: hidden;
		background-color: var(--color-white); border: 1px solid var(--color-border);
		transition: all var(--transition-fast); text-decoration: none; color: var(--color-text);
	}
	.article-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--color-green-leaf); color: var(--color-text); }
	.article-card__img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
	.article-card__img--placeholder { background-color: var(--color-skeleton); }
	.article-card__body { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); flex: 1; }
	.article-card__meta { display: flex; align-items: center; gap: var(--space-3); }
	.article-card__date { font-size: var(--text-xs); color: var(--color-text-muted); }
	.article-card__title { font-size: var(--text-lg); font-weight: 600; line-height: 1.3; }
	.article-card__excerpt { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
	.article-card__footer { display: flex; justify-content: space-between; align-items: center; font-size: var(--text-xs); color: var(--color-text-muted); margin-top: auto; padding-top: var(--space-3); border-top: 1px solid var(--color-border); }
	.pagination { display: flex; justify-content: center; gap: var(--space-2); padding-block: var(--space-4); }
	.pagination__btn, .pagination__num {
		padding: 0.5rem 0.75rem; border: 1px solid var(--color-border); background: var(--color-white);
		border-radius: var(--radius-md); font-size: var(--text-sm); cursor: pointer; font-family: var(--font-body); transition: all var(--transition-fast);
	}
	.pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
	.pagination__num:hover { border-color: var(--color-green-dark); }
	.pagination__num.active { background-color: var(--color-green-dark); color: var(--color-white); border-color: var(--color-green-dark); }
	.empty-state { text-align: center; padding: var(--space-16) 0; }
	.empty-state p { color: var(--color-text-muted); margin-bottom: var(--space-4); }
</style>
