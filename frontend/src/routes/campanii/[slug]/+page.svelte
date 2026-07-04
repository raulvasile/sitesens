<script lang="ts">
	import DynamicZone from '$lib/components/DynamicZone.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';

	let { data } = $props();
	const c = $derived(data.campaign);
	const articles = $derived(c?.articles ?? []);
	const events = $derived(c?.events ?? []);
	const hasContent = $derived((c?.content?.length ?? 0) > 0);

	const ended = $derived(!!c?.end_date && new Date(c.end_date) < new Date());
	const pct = $derived(
		c?.goal && c.goal > 0 ? Math.min(100, Math.round(((c.progress ?? 0) / c.goal) * 100)) : null
	);

	function formatDate(iso: string) {
		return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
	}
</script>

<SeoHead
	title={c?.seo?.meta_title ?? `${c?.title} — Campanii SENS`}
	description={c?.seo?.meta_description ?? c?.summary ?? undefined}
	ogImage={c?.seo?.og_image?.url ?? c?.cover_image?.url}
	canonicalUrl={c?.seo?.canonical_url}
	noIndex={c?.seo?.no_index ?? false}
/>

<section class="cdetail">
	<div class="container cdetail__head">
		<Breadcrumb items={[{ label: 'Campanii', href: '/campanii' }, { label: c?.title ?? '' }]} />
		<div class="cdetail__meta">
			{#if ended}
				<span class="cdetail__badge cdetail__badge--ended">Încheiată</span>
			{:else}
				<span class="cdetail__badge cdetail__badge--active">Activă</span>
			{/if}
		</div>
		<h1 class="cdetail__title">{c?.title}</h1>
		{#if c?.summary}
			<p class="cdetail__summary">{c.summary}</p>
		{/if}

		{#if pct !== null}
			<div class="cdetail__progress">
				<div class="cdetail__progress-bar" style="width: {pct}%"></div>
			</div>
			<div class="cdetail__progress-label">
				{(c?.progress ?? 0).toLocaleString('ro-RO')} / {c?.goal?.toLocaleString('ro-RO')} ({pct}%)
			</div>
		{/if}

		{#if c?.cta_label && c?.cta_url}
			<a href={c.cta_url} class="cdetail__cta">{c.cta_label}</a>
		{/if}
	</div>

	{#if c?.cover_image?.url}
		<div class="container">
			<img
				src={getStrapiMediaUrl(c.cover_image.url)}
				alt={c.cover_image.alternativeText ?? c.title}
				class="cdetail__cover"
				decoding="async"
			/>
		</div>
	{/if}
</section>

{#if hasContent}
	<DynamicZone content={c?.content ?? []} zebra={true} />
{/if}

{#if events.length > 0}
	<section class="crel crel--cream">
		<div class="container">
			<h2 class="crel__title">Evenimente din campanie</h2>
			<div class="crel__grid">
				{#each events as ev (ev.slug)}
					<a href="/evenimente/{ev.slug}" class="crel__card">
						{#if ev.cover_image?.url}
							<img src={getStrapiMediaUrl(ev.cover_image.url)} alt={ev.cover_image.alternativeText ?? ev.title} class="crel__image" loading="lazy" decoding="async" />
						{:else}
							<div class="crel__image crel__image--ph" aria-hidden="true"></div>
						{/if}
						<div class="crel__body">
							<time class="crel__date">{formatDate(ev.start_date)}</time>
							<h3 class="crel__name">{ev.title}</h3>
							{#if ev.location_name || ev.city}
								<div class="crel__loc">📍 {ev.location_name ?? ev.city}</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if articles.length > 0}
	<section class="crel">
		<div class="container">
			<h2 class="crel__title">Știri din campanie</h2>
			<div class="crel__grid">
				{#each articles as a (a.slug)}
					<a href="/stiri/{a.slug}" class="crel__card">
						{#if a.cover_image?.url}
							<img src={getStrapiMediaUrl(a.cover_image.url)} alt={a.cover_image.alternativeText ?? a.title} class="crel__image" loading="lazy" decoding="async" />
						{:else}
							<div class="crel__image crel__image--ph" aria-hidden="true"></div>
						{/if}
						<div class="crel__body">
							<div class="crel__metarow">
								{#if a.category}
									<span class="crel__cat" style="background-color: {a.category.color ?? 'var(--color-green-dark)'}">{a.category.name}</span>
								{/if}
								<time class="crel__date">{formatDate(a.createdAt)}</time>
							</div>
							<h3 class="crel__name">{a.title}</h3>
							{#if a.excerpt}
								<p class="crel__excerpt">{a.excerpt}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.cdetail__head {
		padding-top: var(--page-header-pt);
		padding-bottom: var(--space-8);
		max-width: 760px;
	}
	.cdetail__meta { margin-top: var(--space-6); }
	.cdetail__badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 10px;
	}
	.cdetail__badge--active { background-color: var(--color-green-deep); color: var(--color-paper); }
	.cdetail__badge--ended { background-color: #d6d6d6; color: var(--color-ink); }

	.cdetail__title {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: var(--space-4) 0 var(--space-5);
	}
	.cdetail__summary {
		font-family: var(--font-body);
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--color-ink-soft);
		margin: 0 0 var(--space-6);
	}

	.cdetail__progress {
		height: 10px;
		background-color: rgba(12, 81, 24, 0.12);
		overflow: hidden;
	}
	.cdetail__progress-bar { height: 100%; background-color: var(--color-green-deep); }
	.cdetail__progress-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-ink-soft);
		margin-top: var(--space-2);
	}

	.cdetail__cta {
		display: inline-block;
		margin-top: var(--space-6);
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background-color: var(--color-green-deep);
		color: var(--color-paper);
		padding: var(--space-4) var(--space-8);
		text-decoration: none;
		transition: background-color var(--transition-fast);
	}
	.cdetail__cta:hover { background-color: var(--color-ink); }

	.cdetail__cover {
		width: 100%;
		max-height: 480px;
		object-fit: cover;
		display: block;
		margin-top: var(--space-6);
	}

	/* Related sections */
	.crel { padding-block: var(--space-16); }
	.crel--cream { background-color: var(--color-cream); }
	.crel__title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3.5vw, 2.75rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--color-ink);
		margin: 0 0 var(--space-8);
	}
	.crel__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
	}
	@media (max-width: 900px) { .crel__grid { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 560px) { .crel__grid { grid-template-columns: 1fr; } }

	.crel__card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-paper);
		border: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: inherit;
		transition: transform var(--transition-base);
	}
	.crel__card:hover { transform: translateY(-4px); }
	.crel__image { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; }
	.crel__image--ph {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-cream);
	}
	.crel__body { padding: var(--space-5); }
	.crel__metarow { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3); flex-wrap: wrap; }
	.crel__cat {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-paper);
		padding: 2px 8px;
	}
	.crel__date { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-ink-soft); opacity: 0.8; }
	.crel__name {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
		line-height: 1.15;
		color: var(--color-ink);
		margin: var(--space-2) 0 0;
	}
	.crel__excerpt { font-family: var(--font-body); font-size: 0.875rem; line-height: 1.5; color: var(--color-ink-soft); margin: var(--space-3) 0 0; }
	.crel__loc { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-green-deep); margin-top: var(--space-2); }

	@media (max-width: 767px) {
		.crel { padding-block: var(--space-10); }
	}
</style>
