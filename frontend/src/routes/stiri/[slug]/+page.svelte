<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import TextBlock from '$components/blocks/TextBlock.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data } = $props();
	const article = $derived(data.article);
	const related = $derived(data.relatedArticles);

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('ro-RO', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
	}

	function shareUrl(platform: string) {
		const url = typeof window !== 'undefined' ? window.location.href : '';
		const title = article.title;
		const map: Record<string, string> = {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
		};
		return map[platform] ?? '#';
	}
</script>

<SeoHead
	title={article.seo?.meta_title ?? article.title}
	description={article.seo?.meta_description ?? article.excerpt ?? ''}
	ogImage={article.seo?.og_image?.url ?? article.cover_image?.url}
	canonicalUrl={article.seo?.canonical_url}
	noIndex={article.seo?.no_index ?? false}
	type="article"
/>

<article class="article-page">
	<!-- Hero cover -->
	{#if article.cover_image?.url}
		<div class="article-hero">
			<img
				src={getStrapiMediaUrl(article.cover_image.url)}
				alt={article.cover_image.alternativeText ?? article.title}
				class="article-hero__img"
			/>
		</div>
	{/if}

	<div class="container article-container">
		<nav aria-label="Breadcrumb" class="breadcrumb">
			<a href="/">Acasă</a> <span>/</span>
			<a href="/stiri">Știri</a> <span>/</span>
			<span>{article.title}</span>
		</nav>

		<!-- Header -->
		<header class="article-header">
			{#if article.category}
				<span class="badge badge-green">{article.category.name}</span>
			{/if}
			<h1 class="article-header__title">{article.title}</h1>
			<div class="article-header__meta">
				{#if article.author}
					<div class="article-author">
						{#if article.author.photo?.url}
							<img
								src={getStrapiMediaUrl(article.author.photo.url)}
								alt={article.author.name}
								class="article-author__photo"
							/>
						{/if}
						<span class="article-author__name">{article.author.name}</span>
					</div>
				{/if}
				<time class="article-header__date">{formatDate(article.createdAt)}</time>
				{#if article.reading_time}
					<span class="article-header__reading">· {article.reading_time} min citire</span>
				{/if}
			</div>
			{#if article.tags?.length}
				<div class="article-tags">
					{#each article.tags as tag}
						<a href="/stiri?q={tag.name}" class="article-tag">#{tag.name}</a>
					{/each}
				</div>
			{/if}
		</header>

		<!-- Body -->
		<div class="article-body">
			{#if article.body}
				<TextBlock data={{ body: article.body, alignment: 'left' }} />
			{/if}
		</div>

		<!-- Share buttons -->
		<aside class="share-bar" aria-label="Distribuie articolul">
			<span class="share-bar__label">Distribuie:</span>
			<a href={shareUrl('facebook')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe Facebook">Facebook</a>
			<a href={shareUrl('twitter')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe X">X</a>
			<a href={shareUrl('linkedin')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe LinkedIn">LinkedIn</a>
			<a href={shareUrl('whatsapp')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe WhatsApp">WhatsApp</a>
		</aside>
	</div>

	<!-- Articole similare -->
	{#if related.length > 0}
		<section class="related-section">
			<div class="container">
				<h2 class="related-section__title">Articole similare</h2>
				<div class="related-grid">
					{#each related as rel}
						<a href="/stiri/{rel.slug}" class="related-card">
							{#if rel.cover_image?.url}
								<img src={getStrapiMediaUrl(rel.cover_image.url)} alt={rel.title} class="related-card__img" loading="lazy" />
							{:else}
								<div class="related-card__img related-card__img--placeholder"></div>
							{/if}
							<div class="related-card__body">
								{#if rel.category}
									<span class="badge badge-green">{rel.category.name}</span>
								{/if}
								<h3>{rel.title}</h3>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</article>

<style>
	.article-page { padding-bottom: var(--space-16); }
	.breadcrumb { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-6); display: flex; gap: var(--space-2); flex-wrap: wrap; }
	.breadcrumb a { color: var(--color-text-muted); }
	.breadcrumb a:hover { color: var(--color-green-dark); }

	.article-hero { width: 100%; max-height: 480px; overflow: hidden; }
	.article-hero__img { width: 100%; height: 100%; object-fit: cover; max-height: 480px; }

	.article-container { max-width: 800px; padding-top: var(--space-8); }

	.article-header { margin-bottom: var(--space-8); }
	.article-header__title { font-size: var(--text-2xl); line-height: 1.2; margin-block: var(--space-4); }
	@media (min-width: 768px) { .article-header__title { font-size: var(--text-4xl); } }

	.article-header__meta { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; color: var(--color-text-muted); font-size: var(--text-sm); }
	.article-author { display: flex; align-items: center; gap: var(--space-2); }
	.article-author__photo { width: 32px; height: 32px; border-radius: var(--radius-full); object-fit: cover; }
	.article-author__name { font-weight: 500; color: var(--color-text); }

	.article-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }
	.article-tag {
		font-size: var(--text-xs);
		color: var(--color-green-dark);
		background-color: var(--color-bg);
		padding: 0.25rem 0.625rem;
		border-radius: var(--radius-xl);
		transition: background-color var(--transition-fast);
	}
	.article-tag:hover { background-color: var(--color-border); }

	.article-body { margin-bottom: var(--space-8); }

	.share-bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
		margin-bottom: var(--space-12);
	}
	.share-bar__label { font-size: var(--text-sm); font-weight: 500; color: var(--color-text-muted); }
	.share-btn {
		font-size: var(--text-sm);
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-md);
		background-color: var(--color-bg);
		color: var(--color-text);
		transition: all var(--transition-fast);
	}
	.share-btn:hover { background-color: var(--color-green-dark); color: var(--color-white); }

	.related-section { padding-block: var(--space-12); background-color: var(--color-bg); }
	.related-section__title { font-size: var(--text-2xl); margin-bottom: var(--space-6); }
	.related-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
	@media (min-width: 768px) { .related-grid { grid-template-columns: repeat(3, 1fr); } }
	.related-card {
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		overflow: hidden;
		transition: box-shadow var(--transition-fast);
		text-decoration: none;
		color: var(--color-text);
	}
	.related-card:hover { box-shadow: var(--shadow-md); color: var(--color-text); }
	.related-card__img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
	.related-card__img--placeholder { background-color: var(--color-skeleton); }
	.related-card__body { padding: var(--space-4); }
	.related-card__body h3 { font-size: var(--text-base); font-weight: 600; margin-top: var(--space-2); line-height: 1.3; }
</style>
