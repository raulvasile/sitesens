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
		{#if data.heading}
			<h2 class="latest-articles__heading">{data.heading}</h2>
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
							/>
						{:else}
							<div class="latest-articles__image-placeholder"></div>
						{/if}
						<div class="latest-articles__body">
							<div class="latest-articles__meta">
								<time class="latest-articles__date">{formatDate(article.createdAt)}</time>
								{#if data.show_category !== false && article.category}
									<span
										class="latest-articles__category"
										style="background-color: {article.category.color ?? 'var(--color-green-dark)'}"
									>
										{article.category.name}
									</span>
								{/if}
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

		{#if data.cta_text && data.cta_link}
			<div class="latest-articles__cta">
				<a href={data.cta_link} class="btn btn-outline">{data.cta_text} &rarr;</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.latest-articles { padding-block: var(--space-16); background-color: var(--color-bg); }

	.latest-articles__heading {
		font-size: var(--text-2xl);
		text-align: center;
		margin-bottom: var(--space-10);
		color: var(--color-green-dark);
	}

	@media (min-width: 768px) {
		.latest-articles__heading { font-size: var(--text-3xl); }
	}

	.latest-articles__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
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
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--color-border);
		text-decoration: none;
		color: inherit;
		transition: box-shadow var(--transition-fast), transform var(--transition-fast);
	}

	.latest-articles__card:hover {
		box-shadow: 0 8px 24px rgba(0, 56, 39, 0.08);
		transform: translateY(-2px);
	}

	.latest-articles__card:hover .latest-articles__read-more {
		color: var(--color-brand-vibrant);
	}

	.latest-articles__image {
		width: 100%;
		height: 180px;
		object-fit: cover;
	}

	.latest-articles__image-placeholder {
		width: 100%;
		height: 180px;
		background: linear-gradient(135deg, var(--color-green-dark) 0%, var(--color-green-mid) 100%);
	}

	.latest-articles__body {
		padding: 18px 20px 20px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.latest-articles__meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.latest-articles__date {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.latest-articles__category {
		display: inline-block;
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-white);
		padding: 3px 10px;
		border-radius: var(--radius-full);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		white-space: nowrap;
	}

	.latest-articles__title {
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-green-dark);
		margin-bottom: var(--space-2);
		line-height: 1.4;
	}

	.latest-articles__excerpt {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: var(--space-4);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		flex: 1;
	}

	.latest-articles__read-more {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-green-dark);
		margin-top: auto;
		transition: color var(--transition-fast);
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
		background-color: var(--color-white);
		border-radius: var(--radius-lg);
		overflow: hidden;
		padding: var(--space-5);
	}

	.skeleton {
		background: linear-gradient(90deg, var(--color-border) 25%, var(--color-bg) 50%, var(--color-border) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: var(--radius-sm);
	}

	.skeleton--image { height: 200px; margin-bottom: var(--space-4); border-radius: var(--radius-md); }
	.skeleton--text { height: 14px; margin-bottom: var(--space-2); }

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
