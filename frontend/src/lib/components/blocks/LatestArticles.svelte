<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface Article {
		title: string;
		slug: string;
		excerpt?: string;
		createdAt: string;
		cover_image?: { url: string; alternativeText?: string };
		category?: { name: string; color?: string };
	}

	interface Props {
		data: {
			heading?: string;
			count?: number;
			show_category?: boolean;
			cta_text?: string;
			cta_link?: string;
			_articles?: Article[];
		};
	}

	let { data }: Props = $props();
	const count = data.count ?? 3;
	const articles = $derived(data._articles ?? []);
	const loaded = $derived(data._articles !== undefined);

	function formatDate(iso: string) {
		return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
	}
</script>

<section class="latest-articles">
	<div class="container">
		{#if data.heading || (data.cta_text && data.cta_link)}
			<div class="latest-articles__header">
				{#if data.heading}
					<h2 class="latest-articles__heading">{data.heading}</h2>
				{/if}
				{#if data.cta_text && data.cta_link}
					<a href={data.cta_link} class="latest-articles__header-cta">
						{data.cta_text}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</a>
				{/if}
			</div>
		{/if}

		{#if !loaded}
			<div class="latest-articles__grid">
				{#each Array(count) as _}
					<div class="latest-articles__skeleton">
						<div class="skeleton skeleton--image"></div>
						<div class="skeleton skeleton--text" style="width: 60%"></div>
						<div class="skeleton skeleton--text" style="width: 90%"></div>
						<div class="skeleton skeleton--text" style="width: 40%"></div>
					</div>
				{/each}
			</div>
		{:else if articles.length > 0}
			<div class="latest-articles__grid">
				{#each articles as article}
					<a href="/stiri/{article.slug}" class="latest-articles__card">
						{#if article.cover_image?.url}
							<img
								src={getStrapiMediaUrl(article.cover_image.url)}
								alt={article.cover_image.alternativeText ?? article.title}
								class="latest-articles__image"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="latest-articles__image-placeholder"></div>
						{/if}
						<div class="latest-articles__body">
							<div class="latest-articles__meta">
								{#if data.show_category !== false && article.category}
									<span
										class="latest-articles__category"
										style="background-color: {article.category.color ?? 'var(--color-green-dark)'}"
									>
										{article.category.name}
									</span>
								{/if}
								<time class="latest-articles__date">{formatDate(article.createdAt)}</time>
							</div>
							<h3 class="latest-articles__title">{article.title}</h3>
							{#if article.excerpt}
								<p class="latest-articles__excerpt">{article.excerpt}</p>
							{/if}
							<span class="latest-articles__read-more">Citește tot <span class="arrow-animate">&rarr;</span></span>
						</div>
					</a>
				{/each}
			</div>
		{/if}

	</div>
</section>

<style>
	.latest-articles {
		padding-block: var(--space-20);
		background-color: var(--color-paper);
	}

	.latest-articles__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-6);
		margin-bottom: var(--space-10);
		flex-wrap: wrap;
	}

	.latest-articles__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin: 0;
	}

	.latest-articles__header-cta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		padding-bottom: 6px;
		border-bottom: 1.5px solid var(--color-ink);
		text-decoration: none;
		transition: gap var(--transition-fast), color var(--transition-fast);
	}

	.latest-articles__header-cta:hover {
		gap: var(--space-3);
		color: var(--color-green-deep);
	}

	.latest-articles__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}

	@media (min-width: 640px) {
		.latest-articles__grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 1024px) {
		.latest-articles__grid { grid-template-columns: repeat(3, 1fr); }
	}

	.latest-articles__card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-white);
		border: 1px solid rgba(12, 81, 24, 0.12);
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: transform var(--transition-base), box-shadow var(--transition-base);
	}

	.latest-articles__card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(10, 31, 16, 0.08);
	}

	.latest-articles__card:hover .latest-articles__read-more {
		color: var(--color-green-deep);
		gap: var(--space-3);
	}

	.latest-articles__image {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.latest-articles__image-placeholder {
		width: 100%;
		aspect-ratio: 4 / 3;
		background:
			repeating-linear-gradient(
				135deg,
				rgba(12, 81, 24, 0.08) 0,
				rgba(12, 81, 24, 0.08) 1px,
				transparent 1px,
				transparent 12px
			),
			var(--color-cream);
	}

	.latest-articles__body {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: var(--space-3);
		padding: var(--space-5);
	}

	.latest-articles__meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.latest-articles__date {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}

	.latest-articles__category {
		display: inline-block;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		background-color: var(--color-lime) !important;
		color: var(--color-ink) !important;
		padding: 3px 10px;
		white-space: nowrap;
	}

	.latest-articles__title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		color: var(--color-ink);
		line-height: 1.05;
	}

	.latest-articles__excerpt {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--color-ink-soft);
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		flex: 1;
	}

	.latest-articles__read-more {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		margin-top: var(--space-2);
		transition: gap var(--transition-fast), color var(--transition-fast);
	}

	.latest-articles__read-more .arrow-animate {
		display: inline-block;
		transition: transform 0.2s ease;
	}

	.latest-articles__card:hover .arrow-animate {
		transform: translateX(4px);
	}

	.latest-articles__cta {
		text-align: center;
		margin-top: var(--space-10);
	}

	/* Skeleton loading */
	.latest-articles__skeleton {
		background-color: transparent;
		overflow: hidden;
		padding: 0;
	}

	.skeleton {
		background: linear-gradient(90deg, var(--color-cream) 25%, var(--color-skeleton) 50%, var(--color-cream) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	.skeleton--image { aspect-ratio: 4 / 3; margin-bottom: var(--space-4); }
	.skeleton--text { height: 14px; margin-bottom: var(--space-2); }

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	/* mobile-tighten:.latest-articles */
	@media (max-width: 767px) {
		.latest-articles { padding-block: var(--space-10); }
	}
</style>
