<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getStrapiMediaUrl } from '$lib/strapi';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	let { data } = $props();
	let searchValue = $state(data.currentSearch);

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

	<!-- Filtre categorii -->
	<div class="category-filters" role="tablist" aria-label="Filtre categorii">
		<button
			class="category-pill"
			class:active={!data.currentCategory}
			onclick={() => setCategory('')}
			role="tab"
			aria-selected={!data.currentCategory}
		>Toate</button>
		{#each data.categories as cat}
			<button
				class="category-pill"
				class:active={data.currentCategory === cat.slug}
				onclick={() => setCategory(cat.slug)}
				role="tab"
				aria-selected={data.currentCategory === cat.slug}
			>{cat.name}</button>
		{/each}
	</div>

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
								<span class="badge badge-green">{article.category.name}</span>
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
	.category-filters { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-6); }
	.category-pill {
		padding: 0.375rem 0.875rem;
		border-radius: var(--radius-xl);
		border: 1px solid var(--color-border);
		background: var(--color-white);
		font-size: var(--text-sm);
		font-family: var(--font-body);
		cursor: pointer;
		transition: all var(--transition-fast);
		color: var(--color-text-muted);
	}
	.category-pill:hover { border-color: var(--color-green-dark); color: var(--color-green-dark); }
	.category-pill.active { background-color: var(--color-green-dark); color: var(--color-white); border-color: var(--color-green-dark); }
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
