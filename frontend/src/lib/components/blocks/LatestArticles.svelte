<script lang="ts">
	import { fetchStrapi, getStrapiMediaUrl } from '$lib/strapi';

	interface Props {
		data: {
			heading?: string;
			count?: number;
			show_category?: boolean;
			cta_text?: string;
			cta_link?: string;
		};
	}

	let { data }: Props = $props();
	const count = data.count ?? 3;

	interface Article {
		title: string;
		slug: string;
		excerpt?: string;
		createdAt: string;
		cover_image?: { url: string; alternativeText?: string };
		category?: { name: string; color?: string };
	}

	let articles = $state<Article[]>([]);
	let loaded = $state(false);

	$effect(() => {
		fetchStrapi<Article[]>('/articles', {
			'pagination[pageSize]': String(count),
			'sort': 'createdAt:desc',
			'populate[cover_image]': '*',
			'populate[category]': '*',
		}).then(res => {
			articles = res.data ?? [];
			loaded = true;
		}).catch(() => { loaded = true; });
	});

	function formatDate(iso: string) {
		return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
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
							{#if data.show_category !== false && article.category}
								<span
									class="latest-articles__category"
									style="background-color: {article.category.color ?? 'var(--color-green-dark)'}"
								>
									{article.category.name}
								</span>
							{/if}
							<h3 class="latest-articles__title">{article.title}</h3>
							{#if article.excerpt}
								<p class="latest-articles__excerpt">{article.excerpt}</p>
							{/if}
							<time class="latest-articles__date">{formatDate(article.createdAt)}</time>
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

	.latest-articles__image {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.latest-articles__image-placeholder {
		width: 100%;
		height: 200px;
		background: linear-gradient(135deg, var(--color-green-dark) 0%, var(--color-green-mid) 100%);
	}

	.latest-articles__body { padding: var(--space-5); }

	.latest-articles__category {
		display: inline-block;
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-white);
		padding: 2px 10px;
		border-radius: var(--radius-full);
		margin-bottom: var(--space-3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.latest-articles__title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-green-dark);
		margin-bottom: var(--space-2);
		line-height: 1.3;
	}

	.latest-articles__excerpt {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
		margin-bottom: var(--space-3);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.latest-articles__date {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
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
