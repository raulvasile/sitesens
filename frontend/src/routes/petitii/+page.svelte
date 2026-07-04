<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';

	let { data } = $props();
	const petitions = $derived(data.petitions ?? []);
	const status = $derived(data.currentStatus ?? 'open');

	const tabs = [
		{ key: 'open', label: 'Active' },
		{ key: 'closed', label: 'Închise' },
		{ key: 'all', label: 'Toate' }
	];
</script>

<SeoHead
	title="Petiții — SENS"
	description="Petițiile SENS. Semnează și susține cauzele în care credem."
/>

<section class="pet pet--intro">
	<div class="container">
		<Breadcrumb items={[{ label: 'Petiții' }]} />
		<header class="pet__header">
			<div class="pet__kicker">— Vocea ta contează</div>
			<h1 class="pet__heading">Petiții</h1>
			<p class="pet__intro">Semnează petițiile noastre și ajută-ne să facem auzită vocea comunității.</p>
		</header>

		<nav class="pet__tabs" aria-label="Filtrează petițiile">
			{#each tabs as t (t.key)}
				<a
					href={t.key === 'open' ? '/petitii' : `/petitii?status=${t.key}`}
					class="pet__tab"
					class:pet__tab--active={status === t.key}
					aria-current={status === t.key ? 'page' : undefined}
				>{t.label}</a>
			{/each}
		</nav>
	</div>
</section>

<section class="pet pet--list">
	<div class="container">
		{#if petitions.length === 0}
			<p class="pet__empty">Nu există petiții în această categorie momentan.</p>
		{:else}
			<div class="pet__grid">
				{#each petitions as p (p.slug)}
					<a href="/petitii/{p.slug}" class="pet__card">
						{#if p.cover_image?.url}
							<img src={getStrapiMediaUrl(p.cover_image.url)} alt={p.cover_image.alternativeText ?? p.title} class="pet__image" loading="lazy" decoding="async" />
						{:else}
							<div class="pet__image pet__image--ph" aria-hidden="true"></div>
						{/if}
						<div class="pet__body">
							{#if p.petition_status === 'closed'}
								<span class="pet__badge pet__badge--closed">Închisă</span>
							{:else}
								<span class="pet__badge pet__badge--open">Activă</span>
							{/if}
							<h2 class="pet__title">{p.title}</h2>
							{#if p.summary}
								<p class="pet__summary">{p.summary}</p>
							{/if}
							<span class="pet__link">Vezi petiția <span aria-hidden="true">→</span></span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.pet--intro { padding-block: var(--page-header-pt) var(--space-6); }
	.pet--list { padding-block: var(--space-4) var(--space-24); }

	.pet__header { max-width: 640px; margin-top: var(--space-6); }
	.pet__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}
	.pet__heading {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 var(--space-5);
	}
	.pet__intro {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--color-ink-soft);
		margin: 0;
	}

	.pet__tabs { display: flex; gap: var(--space-2); margin-top: var(--space-8); flex-wrap: wrap; }
	.pet__tab {
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
	.pet__tab:hover { background-color: var(--color-cream); }
	.pet__tab--active {
		background-color: var(--color-green-deep);
		color: var(--color-paper);
		border-color: var(--color-green-deep);
	}

	.pet__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
	@media (max-width: 900px) { .pet__grid { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 560px) { .pet__grid { grid-template-columns: 1fr; } }

	.pet__card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-cream);
		border: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: inherit;
		transition: transform var(--transition-base);
	}
	.pet__card:hover { transform: translateY(-4px); }
	.pet__image { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; }
	.pet__image--ph {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-paper);
	}
	.pet__body { padding: var(--space-5); }
	.pet__badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 2px 8px;
		margin-bottom: var(--space-3);
	}
	.pet__badge--open { background-color: var(--color-green-deep); color: var(--color-paper); }
	.pet__badge--closed { background-color: #d6d6d6; color: var(--color-ink); }
	.pet__title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		line-height: 1.1;
		color: var(--color-ink);
		margin: 0 0 var(--space-2);
	}
	.pet__summary {
		font-family: var(--font-body);
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: 0 0 var(--space-4);
	}
	.pet__link {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-ink);
	}
	.pet__empty {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
		opacity: 0.65;
	}

	@media (max-width: 767px) {
		.pet--list { padding-block: var(--space-2) var(--space-10); }
	}
</style>
