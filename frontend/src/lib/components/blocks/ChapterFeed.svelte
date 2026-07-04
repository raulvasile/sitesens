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

	interface EventItem {
		title: string;
		slug: string;
		start_date: string;
		location_name?: string;
		city?: string;
		cover_image?: { url: string; alternativeText?: string };
	}

	interface Props {
		data: {
			kicker?: string;
			heading?: string;
			show?: 'articles' | 'events' | 'both';
			background_color?: 'paper' | 'cream';
			_articles?: Article[];
			_events?: EventItem[];
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'cream');
	const show = $derived(data.show ?? 'both');
	const articles = $derived(data._articles ?? []);
	const events = $derived(data._events ?? []);
	const showArticles = $derived((show === 'articles' || show === 'both') && articles.length > 0);
	const showEvents = $derived((show === 'events' || show === 'both') && events.length > 0);
	const isEmpty = $derived(!showArticles && !showEvents);

	function formatDate(iso: string) {
		return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
	}
</script>

<section class="feed feed--{bg}">
	<div class="container">
		{#if data.kicker || data.heading}
			<header class="feed__header">
				{#if data.kicker}
					<div class="feed__kicker">— {data.kicker}</div>
				{/if}
				{#if data.heading}
					<h2 class="feed__heading">{data.heading}</h2>
				{/if}
			</header>
		{/if}

		{#if isEmpty}
			<p class="feed__empty">Momentan nu sunt știri sau evenimente locale.</p>
		{/if}

		{#if showEvents}
			<div class="feed__group">
				<h3 class="feed__group-title">Evenimente locale</h3>
				<div class="feed__grid">
					{#each events as ev (ev.slug)}
						<a href="/evenimente/{ev.slug}" class="feed__card">
							{#if ev.cover_image?.url}
								<img
									src={getStrapiMediaUrl(ev.cover_image.url)}
									alt={ev.cover_image.alternativeText ?? ev.title}
									class="feed__image"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div class="feed__image feed__image--placeholder" aria-hidden="true"></div>
							{/if}
							<div class="feed__body">
								<time class="feed__date">{formatDate(ev.start_date)}</time>
								<h4 class="feed__title">{ev.title}</h4>
								{#if ev.location_name || ev.city}
									<div class="feed__loc">📍 {ev.location_name ?? ev.city}</div>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		{#if showArticles}
			<div class="feed__group">
				<h3 class="feed__group-title">Știri locale</h3>
				<div class="feed__grid">
					{#each articles as a (a.slug)}
						<a href="/stiri/{a.slug}" class="feed__card">
							{#if a.cover_image?.url}
								<img
									src={getStrapiMediaUrl(a.cover_image.url)}
									alt={a.cover_image.alternativeText ?? a.title}
									class="feed__image"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div class="feed__image feed__image--placeholder" aria-hidden="true"></div>
							{/if}
							<div class="feed__body">
								<div class="feed__meta">
									{#if a.category}
										<span class="feed__category" style="background-color: {a.category.color ?? 'var(--color-green-dark)'}">
											{a.category.name}
										</span>
									{/if}
									<time class="feed__date">{formatDate(a.createdAt)}</time>
								</div>
								<h4 class="feed__title">{a.title}</h4>
								{#if a.excerpt}
									<p class="feed__excerpt">{a.excerpt}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.feed {
		padding-block: var(--space-24);
	}
	.feed--paper { background-color: var(--color-paper); }
	.feed--cream { background-color: var(--color-cream); }

	.feed__header { margin-bottom: var(--space-10); }
	.feed__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}
	.feed__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4.5vw, 4rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0;
	}

	.feed__group + .feed__group { margin-top: var(--space-12); }
	.feed__group-title {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		margin: 0 0 var(--space-6);
	}

	.feed__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
	}
	@media (max-width: 900px) { .feed__grid { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 560px) { .feed__grid { grid-template-columns: 1fr; } }

	.feed__card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-paper);
		border: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: inherit;
		transition: transform var(--transition-base);
	}
	.feed--cream .feed__card { background-color: var(--color-paper); }
	.feed__card:hover { transform: translateY(-4px); }

	.feed__image {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		display: block;
	}
	.feed__image--placeholder {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-cream);
	}

	.feed__body { padding: var(--space-5); }
	.feed__meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
		flex-wrap: wrap;
	}
	.feed__category {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-paper);
		padding: 2px 8px;
	}
	.feed__date {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-ink-soft);
		opacity: 0.8;
	}
	.feed__title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
		line-height: 1.15;
		color: var(--color-ink);
		margin: var(--space-2) 0 0;
	}
	.feed__excerpt {
		font-family: var(--font-body);
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: var(--space-3) 0 0;
	}
	.feed__loc {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-green-deep);
		margin-top: var(--space-2);
	}

	.feed__empty {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
		opacity: 0.65;
	}

	@media (max-width: 767px) {
		.feed { padding-block: var(--space-10); }
	}
</style>
