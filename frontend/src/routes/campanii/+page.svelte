<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';

	let { data } = $props();
	const campaigns = $derived(data.campaigns ?? []);
	const status = $derived(data.currentStatus ?? 'active');

	const tabs = [
		{ key: 'active', label: 'Active' },
		{ key: 'ended', label: 'Încheiate' },
		{ key: 'all', label: 'Toate' }
	];

	function isEnded(c: { end_date?: string | null }): boolean {
		return !!c.end_date && new Date(c.end_date) < new Date();
	}
	function pct(c: { goal?: number | null; progress?: number | null }): number | null {
		if (!c.goal || c.goal <= 0) return null;
		return Math.min(100, Math.round(((c.progress ?? 0) / c.goal) * 100));
	}
</script>

<SeoHead
	title="Campanii — SENS"
	description="Campaniile SENS: inițiative, acțiuni și mobilizări la nivel local și național."
/>

<section class="camp camp--intro">
	<div class="container">
		<Breadcrumb items={[{ label: 'Campanii' }]} />
		<header class="camp__header">
			<div class="camp__kicker">— Implică-te</div>
			<h1 class="camp__heading">Campanii</h1>
			<p class="camp__intro">
				Inițiativele prin care schimbăm lucrurile, împreună. Alătură-te unei campanii active.
			</p>
		</header>

		<nav class="camp__tabs" aria-label="Filtrează campaniile">
			{#each tabs as t (t.key)}
				<a
					href={t.key === 'active' ? '/campanii' : `/campanii?status=${t.key}`}
					class="camp__tab"
					class:camp__tab--active={status === t.key}
					aria-current={status === t.key ? 'page' : undefined}
				>{t.label}</a>
			{/each}
		</nav>
	</div>
</section>

<section class="camp camp--list">
	<div class="container">
		{#if campaigns.length === 0}
			<p class="camp__empty">Nu există campanii în această categorie momentan.</p>
		{:else}
			<div class="camp__grid">
				{#each campaigns as c (c.slug)}
					{@const p = pct(c)}
					<a href="/campanii/{c.slug}" class="camp__card">
						{#if c.cover_image?.url}
							<img
								src={getStrapiMediaUrl(c.cover_image.url)}
								alt={c.cover_image.alternativeText ?? c.title}
								class="camp__image"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="camp__image camp__image--placeholder" aria-hidden="true"></div>
						{/if}
						<div class="camp__body">
							{#if isEnded(c)}
								<span class="camp__badge camp__badge--ended">Încheiată</span>
							{:else}
								<span class="camp__badge camp__badge--active">Activă</span>
							{/if}
							<h2 class="camp__title">{c.title}</h2>
							{#if c.summary}
								<p class="camp__summary">{c.summary}</p>
							{/if}
							{#if p !== null}
								<div class="camp__progress">
									<div class="camp__progress-bar" style="width: {p}%"></div>
								</div>
								<div class="camp__progress-label">
									{(c.progress ?? 0).toLocaleString('ro-RO')} / {c.goal?.toLocaleString('ro-RO')} ({p}%)
								</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.camp--intro { padding-block: var(--page-header-pt) var(--space-6); }
	.camp--list { padding-block: var(--space-4) var(--space-24); }

	.camp__header {
		max-width: 640px;
		margin-top: var(--space-6);
	}
	.camp__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}
	.camp__heading {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 var(--space-5);
	}
	.camp__intro {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--color-ink-soft);
		margin: 0;
	}

	.camp__tabs {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-8);
		flex-wrap: wrap;
	}
	.camp__tab {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: var(--space-2) var(--space-4);
		border: 1px solid rgba(12, 81, 24, 0.25);
		color: var(--color-ink);
		text-decoration: none;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}
	.camp__tab:hover { background-color: var(--color-cream); }
	.camp__tab--active {
		background-color: var(--color-green-deep);
		color: var(--color-paper);
		border-color: var(--color-green-deep);
	}

	.camp__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
	}
	@media (max-width: 900px) { .camp__grid { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 560px) { .camp__grid { grid-template-columns: 1fr; } }

	.camp__card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-cream);
		border: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: inherit;
		transition: transform var(--transition-base);
	}
	.camp__card:hover { transform: translateY(-4px); }

	.camp__image {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		display: block;
	}
	.camp__image--placeholder {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-paper);
	}

	.camp__body { padding: var(--space-5); }
	.camp__badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 2px 8px;
		margin-bottom: var(--space-3);
	}
	.camp__badge--active { background-color: var(--color-green-deep); color: var(--color-paper); }
	.camp__badge--ended { background-color: #d6d6d6; color: var(--color-ink); }

	.camp__title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		line-height: 1.1;
		color: var(--color-ink);
		margin: 0 0 var(--space-2);
	}
	.camp__summary {
		font-family: var(--font-body);
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: 0 0 var(--space-4);
	}

	.camp__progress {
		height: 8px;
		background-color: rgba(12, 81, 24, 0.12);
		overflow: hidden;
	}
	.camp__progress-bar { height: 100%; background-color: var(--color-green-deep); }
	.camp__progress-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-ink-soft);
		margin-top: var(--space-2);
	}

	.camp__empty {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
		opacity: 0.65;
	}

	@media (max-width: 767px) {
		.camp--list { padding-block: var(--space-2) var(--space-10); }
	}
</style>
