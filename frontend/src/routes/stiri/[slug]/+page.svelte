<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	let { data } = $props();
	const article = $derived(data.article);
	/** Prefer the new dynamic zone (`content`); fall back to legacy `body`. */
	const hasContent = $derived(Array.isArray(article.content) && article.content.length > 0);
	const related = $derived(data.relatedArticles);

	function formatDateLong(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('ro-RO', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
	}

	function formatDateShort(dateStr: string) {
		return new Date(dateStr)
			.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })
			.replace('.', '')
			.toUpperCase();
	}

	function shareUrl(platform: string) {
		const url = typeof window !== 'undefined' ? window.location.href : '';
		const title = article.title;
		const map: Record<string, string> = {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
			email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
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
	<div class="article-shell">
		<!-- Breadcrumb: Acasă > Știri > [Titlu] -->
		<Breadcrumb items={[
			{ label: 'Știri', href: '/stiri' },
			{ label: article.title }
		]} />

		<!-- Categorie + meta sus (etichetele se mută la finalul articolului) -->
		<div class="article-chips">
			{#if article.category}
				<a href="/stiri?categorie={article.category.slug}" class="chip chip--filled">{article.category.name}</a>
			{/if}
			{#if article.reading_time}
				<span class="chip-meta">{article.reading_time} MIN CITIRE</span>
			{/if}
		</div>

		<!-- Title -->
		<h1 class="article-title">{article.title}</h1>

		<!-- Lead / excerpt -->
		{#if article.excerpt}
			<p class="article-lead">{article.excerpt}</p>
		{/if}

		<!-- Author (left) and full date (right), aligned on a single baseline -->
		<div class="article-byline">
			{#if article.author}
				<div class="article-author">
					{#if article.author.photo?.url}
						<img
							src={getStrapiMediaUrl(article.author.photo.url)}
							alt={article.author.name}
							class="article-author__photo"
							loading="lazy"
							decoding="async"
							width="32"
							height="32"
						/>
					{/if}
					<span class="article-author__name">{article.author.name}</span>
				</div>
			{/if}
			<time class="article-byline__date">{formatDateLong(article.createdAt)}</time>
		</div>

		<!-- Cover image after title -->
		{#if article.cover_image?.url}
			<figure class="article-figure">
				<Image
					src={getStrapiMediaUrl(article.cover_image.url)}
					alt={article.cover_image.alternativeText ?? article.title}
					aspectRatio="16/9"
					priority={true}
					class="article-figure__img"
				/>
				{#if article.cover_image.caption || article.cover_image.alternativeText}
					<figcaption class="article-figure__caption">
						{article.cover_image.caption ?? article.cover_image.alternativeText}
					</figcaption>
				{/if}
			</figure>
		{/if}

		<!-- Featured stat callout (optional) -->
		{#if article.featured_stat}
			<aside class="article-stat">
				<div class="article-stat__main">
					<div class="article-stat__value">{article.featured_stat.value}</div>
					<div class="article-stat__label">{article.featured_stat.label}</div>
				</div>
				{#if article.featured_stat.context}
					<p class="article-stat__context">{article.featured_stat.context}</p>
				{/if}
			</aside>
		{/if}

		<!-- Body — Dynamic Zone (`content`) -->
		{#if hasContent}
			<div class="article-body article-body--zone">
				<DynamicZone content={article.content} />
			</div>
		{/if}

		<!-- Etichete (la final, după conținut) -->
		{#if article.tags?.length}
			<aside class="article-tags" aria-label="Etichete">
				<span class="article-tags__label">— Etichete</span>
				<div class="article-tags__list">
					{#each article.tags as tag}
						<a href="/stiri?tag={tag.slug}" class="chip chip--outline">{tag.name}</a>
					{/each}
				</div>
			</aside>
		{/if}

		<!-- Share row -->
		<aside class="share-bar" aria-label="Distribuie articolul">
			<span class="share-bar__label">Distribuie ↗</span>
			<div class="share-bar__buttons">
				<a href={shareUrl('facebook')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe Facebook">
					<SocialIcon platform="facebook" size={18} />
				</a>
				<a href={shareUrl('twitter')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe X">
					<SocialIcon platform="x" size={18} />
				</a>
				<a href={shareUrl('linkedin')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe LinkedIn">
					<SocialIcon platform="linkedin" size={18} />
				</a>
				<a href={shareUrl('whatsapp')} target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share pe WhatsApp">
					<SocialIcon platform="whatsapp" size={18} />
				</a>
				<a href={shareUrl('email')} class="share-btn" aria-label="Share pe email">
					<SocialIcon platform="email" size={18} />
				</a>
			</div>
		</aside>
	</div>

	<!-- Articole similare -->
	{#if related.length > 0}
		<section class="related-section">
			<div class="container">
				<h2 class="related-section__title">Alte știri</h2>
				<div class="related-grid">
					{#each related as rel}
						<article class="related-card">
							<div class="related-card__meta">
								{#if rel.category}
									<span class="chip chip--outline">{rel.category.name}</span>
								{/if}
								<span class="related-card__date">{formatDateShort(rel.createdAt)}</span>
							</div>
							<h3 class="related-card__title">
								<a href="/stiri/{rel.slug}">{rel.title}</a>
							</h3>
							<a href="/stiri/{rel.slug}" class="related-card__link">Citește →</a>
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</article>

<style>
	.article-page {
		background-color: var(--color-paper);
		padding-bottom: var(--space-16);
	}

	.article-shell {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-12) var(--space-6) var(--space-16);
	}

	/* Chips row */
	.article-chips {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-bottom: var(--space-6);
	}

	.chip {
		display: inline-flex;
		align-items: center;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 5px 12px;
		line-height: 1.4;
		text-decoration: none;
		border: 1.5px solid transparent;
		transition: all var(--transition-fast);
	}
	.chip--filled {
		background-color: var(--color-green-deep);
		color: var(--color-lime);
	}
	.chip--outline {
		background-color: transparent;
		color: var(--color-ink);
		border-color: rgba(12, 81, 24, 0.4);
	}
	a.chip--outline:hover {
		background-color: var(--color-ink);
		color: var(--color-lime);
		border-color: var(--color-ink);
	}

	.chip-meta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.65;
		margin-left: auto;
	}

	/* Title */
	.article-title {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 6vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 var(--space-6);
	}

	/* Lead */
	.article-lead {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 1.7vw, 1.375rem);
		line-height: 1.5;
		font-weight: 400;
		color: var(--color-ink-soft);
		margin: 0 0 var(--space-8);
		max-width: 760px;
	}

	/* Byline */
	.article-byline {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		flex-wrap: wrap;
		margin-bottom: var(--space-10);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}
	.article-author {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	.article-author__photo {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-full);
		object-fit: cover;
	}
	.article-author__name {
		font-family: var(--font-display);
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--color-ink);
		line-height: 1;
	}
	.article-byline__date {
		font-family: var(--font-display);
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		line-height: 1;
		text-transform: none;
		color: var(--color-ink);
	}

	/* Figure */
	.article-figure {
		margin: 0 0 var(--space-12);
	}
	:global(.article-figure__img) {
		width: 100%;
		max-height: 520px;
		border: 1px solid rgba(12, 81, 24, 0.15);
	}
	.article-figure__caption {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
		margin-top: var(--space-3);
	}

	/* Featured stat callout */
	.article-stat {
		display: grid;
		grid-template-columns: 1fr 1.8fr;
		gap: var(--space-12);
		padding: var(--space-8) 0;
		margin: var(--space-4) 0 var(--space-10);
		border-top: 2px solid var(--color-ink);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
		align-items: center;
	}
	.article-stat__value {
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 8vw, 6rem);
		line-height: 0.9;
		font-weight: 500;
		color: var(--color-green-deep);
		letter-spacing: -0.02em;
	}
	.article-stat__label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
		margin-top: var(--space-2);
	}
	.article-stat__context {
		font-family: var(--font-display);
		font-size: clamp(1rem, 1.4vw, 1.125rem);
		line-height: 1.55;
		font-weight: 400;
		color: var(--color-ink);
		margin: 0;
	}
	@media (max-width: 720px) {
		.article-stat {
			grid-template-columns: 1fr;
			gap: var(--space-4);
		}
	}

	/* Body */
	.article-body {
		max-width: 720px;
		margin-bottom: var(--space-12);
	}
	/* Dynamic Zone variant — let blocks (galleries, video, stats) breathe full
	   width; their internal `.container` keeps the prose readable on text. */
	.article-body--zone {
		max-width: none;
	}
	.article-body--zone :global(section) {
		padding-block: var(--space-8);
	}
	.article-body--zone :global(section .container) {
		padding-inline: 0;
		max-width: none;
	}
	.article-body--zone :global(.text-block .prose) {
		max-width: 72ch;
	}
	.article-body :global(p) {
		font-size: 1.125rem;
		line-height: 1.7;
		margin-bottom: var(--space-6);
	}
	.article-body :global(h2),
	.article-body :global(h3) {
		font-family: var(--font-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		margin-top: var(--space-10);
		margin-bottom: var(--space-4);
	}
	.article-body :global(h2) { font-size: clamp(1.75rem, 3vw, 2.25rem); line-height: 1.1; }
	.article-body :global(h3) { font-size: clamp(1.375rem, 2.2vw, 1.75rem); line-height: 1.15; }
	.article-body :global(ul),
	.article-body :global(ol) {
		font-size: 1.125rem;
		line-height: 1.7;
		padding-left: 1.5rem;
		margin-bottom: var(--space-6);
	}
	.article-body :global(li) { margin-bottom: var(--space-3); }
	.article-body :global(blockquote) {
		border-left: 3px solid var(--color-lime);
		padding-left: var(--space-4);
		margin: var(--space-6) 0;
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: 1.5;
		color: var(--color-ink);
	}

	/* Tags (la final, după body) */
	.article-tags {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-6) 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
		margin-top: var(--space-8);
	}
	.article-tags__label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
	}
	.article-tags__list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	/* Share */
	.share-bar {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-6) 0 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}
	.share-bar__label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
	}
	.share-bar__buttons {
		display: flex;
		gap: var(--space-2);
	}
	.share-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border: 1.5px solid var(--color-ink);
		background-color: transparent;
		color: var(--color-ink);
		text-decoration: none;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}
	.share-btn:hover {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}

	/* Related */
	.related-section {
		padding-block: var(--space-16);
		background-color: var(--color-cream);
		border-top: 1px solid rgba(12, 81, 24, 0.15);
		margin-top: var(--space-16);
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
	.related-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}
	@media (min-width: 768px) {
		.related-grid { grid-template-columns: repeat(3, 1fr); }
	}
	.related-card {
		background-color: var(--color-paper);
		border: 1px solid rgba(12, 81, 24, 0.12);
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.related-card__meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.related-card__date {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
	}
	.related-card__title {
		font-family: var(--font-display);
		font-size: 1.375rem;
		line-height: 1.15;
		font-weight: 500;
		margin: 0;
	}
	.related-card__title a {
		color: var(--color-ink);
		text-decoration: none;
	}
	.related-card__title a:hover { color: var(--color-green-deep); }
	.related-card__link {
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink);
		text-decoration: none;
		margin-top: auto;
		transition: color var(--transition-fast);
	}
	.related-card__link:hover { color: var(--color-green-deep); }
</style>
