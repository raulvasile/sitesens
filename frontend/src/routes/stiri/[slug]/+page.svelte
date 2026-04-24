<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import TextBlock from '$components/blocks/TextBlock.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

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
		<Breadcrumb items={[
			{ label: 'Știri', href: '/stiri' },
			{ label: article.title }
		]} />

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
	.article-page { padding-bottom: var(--space-16); background-color: var(--color-paper); }
	.article-hero { width: 100%; max-height: 480px; overflow: hidden; }
	.article-hero__img { width: 100%; height: 100%; object-fit: cover; max-height: 480px; }

	.article-container { max-width: 800px; padding-top: var(--space-10); }

	.article-header { margin-bottom: var(--space-10); padding-bottom: var(--space-6); border-bottom: 1px solid rgba(12, 81, 24, 0.15); }
	.article-header__title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 5vw, 4rem);
		font-weight: 500;
		letter-spacing: -0.015em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin-block: var(--space-4);
	}

	.article-header__meta {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		flex-wrap: wrap;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.article-author { display: flex; align-items: center; gap: var(--space-2); }
	.article-author__photo { width: 36px; height: 36px; border-radius: var(--radius-full); object-fit: cover; }
	.article-author__name { color: var(--color-ink); }

	.article-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-4); }
	.article-tag {
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink);
		background-color: var(--color-cream);
		padding: 3px 10px;
		transition: background-color var(--transition-fast);
	}
	.article-tag:hover { background-color: var(--color-lime); }

	.article-body { margin-bottom: var(--space-10); }

	.share-bar {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4) 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
		margin-bottom: var(--space-12);
	}
	.share-bar__label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.share-btn {
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.375rem 0.75rem;
		border: 1.5px solid var(--color-ink);
		background-color: transparent;
		color: var(--color-ink);
		transition: all var(--transition-fast);
	}
	.share-btn:hover { background-color: var(--color-ink); color: var(--color-lime); }

	.related-section {
		padding-block: var(--space-16);
		background-color: var(--color-cream);
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}
	.related-section__title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		margin-bottom: var(--space-8);
		color: var(--color-ink);
	}
	.related-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-8); }
	@media (min-width: 768px) { .related-grid { grid-template-columns: repeat(3, 1fr); } }
	.related-card {
		background-color: transparent;
		text-decoration: none;
		color: var(--color-ink);
		transition: transform var(--transition-base);
	}
	.related-card:hover { transform: translateY(-4px); color: var(--color-ink); }
	.related-card__img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
	.related-card__img--placeholder {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-paper);
	}
	.related-card__body { padding: var(--space-4) 0; display: flex; flex-direction: column; gap: var(--space-2); }
	.related-card__body h3 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
		letter-spacing: -0.005em;
		text-transform: uppercase;
		line-height: 1.1;
		color: var(--color-ink);
	}
</style>
