<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import RomaniaMap from '$lib/components/blocks/RomaniaMap.svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';

	let { data } = $props();
	const chapters = $derived(data.chapters ?? []);
	const mapChapters = $derived(data.mapChapters ?? []);
</script>

<SeoHead
	title="Filiale — SENS"
	description="Filialele teritoriale SENS din toată țara. Găsește filiala din județul tău."
/>

<section class="chapters chapters--intro">
	<div class="container">
		<Breadcrumb items={[{ label: 'Filiale' }]} />
		<header class="chapters__header">
			<div class="chapters__kicker">— Organizare teritorială</div>
			<h1 class="chapters__heading">Filiale SENS</h1>
			<p class="chapters__intro">
				Suntem prezenți în toată țara. Alege filiala din județul tău pentru știri,
				evenimente și echipa locală.
			</p>
		</header>
	</div>
</section>

{#if mapChapters.length > 0}
	<RomaniaMap
		data={{
			heading: 'Filialele noastre pe hartă',
			subheading: 'Județele evidențiate au o filială activă. Apasă pentru a deschide pagina filialei.',
			chapters: mapChapters,
			background_color: 'cream'
		}}
	/>
{/if}

<section class="chapters">
	<div class="container">
		<h2 class="chapters__list-title">Toate filialele</h2>
		{#if chapters.length === 0}
			<p class="chapters__empty">Momentan nu există filiale active publicate.</p>
		{:else}
			<div class="chapters__grid">
				{#each chapters as ch (ch.slug)}
					<a href="/filiale/{ch.slug}" class="chapters__card">
						{#if ch.cover_image?.url}
							<img
								src={getStrapiMediaUrl(ch.cover_image.url)}
								alt={ch.cover_image.alternativeText ?? ch.name}
								class="chapters__image"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="chapters__image chapters__image--placeholder" aria-hidden="true"></div>
						{/if}
						<div class="chapters__body">
							{#if ch.county?.name}
								<div class="chapters__county">{ch.county.name}</div>
							{/if}
							<h3 class="chapters__name">{ch.name}</h3>
							<span class="chapters__link">Vezi filiala <span aria-hidden="true">→</span></span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.chapters {
		padding-block: var(--space-16) var(--space-24);
	}
	.chapters--intro {
		padding-block: var(--page-header-pt) var(--space-8);
	}
	.chapters__header {
		max-width: 640px;
		margin-top: var(--space-6);
		margin-bottom: 0;
	}
	.chapters__list-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3.5vw, 2.75rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
		color: var(--color-ink);
		margin: 0 0 var(--space-8);
	}
	.chapters__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}
	.chapters__heading {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 var(--space-5);
	}
	.chapters__intro {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--color-ink-soft);
		margin: 0;
	}

	.chapters__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
	}
	@media (max-width: 900px) { .chapters__grid { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 560px) { .chapters__grid { grid-template-columns: 1fr; } }

	.chapters__card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-cream);
		border: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: inherit;
		transition: transform var(--transition-base);
	}
	.chapters__card:hover { transform: translateY(-4px); }

	.chapters__image {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		display: block;
	}
	.chapters__image--placeholder {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-paper);
	}

	.chapters__body { padding: var(--space-5); }
	.chapters__county {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-green-deep);
		margin-bottom: var(--space-2);
	}
	.chapters__name {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 500;
		line-height: 1.05;
		color: var(--color-ink);
		margin: 0 0 var(--space-4);
	}
	.chapters__link {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-ink);
	}

	.chapters__empty {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
		opacity: 0.65;
	}

	@media (max-width: 767px) {
		.chapters { padding-block: var(--space-8) var(--space-10); }
	}
</style>
