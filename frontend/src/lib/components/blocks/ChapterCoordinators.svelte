<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface Member {
		id: number;
		name: string;
		role?: string;
		bio?: string;
		photo?: { url: string; alternativeText?: string } | null;
	}

	interface Coordinator {
		id?: number;
		locality?: string;
		local_role?: string;
		member?: Member | null;
	}

	interface Props {
		data: {
			kicker?: string;
			heading?: string;
			background_color?: 'paper' | 'cream';
			_coordinators?: Coordinator[];
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'paper');
	const coordinators = $derived((data._coordinators ?? []).filter((c) => c.member));
</script>

<section class="coord coord--{bg}">
	<div class="container">
		{#if data.kicker || data.heading}
			<header class="coord__header">
				{#if data.kicker}
					<div class="coord__kicker">— {data.kicker}</div>
				{/if}
				{#if data.heading}
					<h2 class="coord__heading">{data.heading}</h2>
				{/if}
			</header>
		{/if}

		{#if coordinators.length === 0}
			<p class="coord__empty">Niciun coordonator disponibil momentan.</p>
		{:else}
			<div class="coord__grid">
				{#each coordinators as c (c.id ?? c.member?.id)}
					{@const m = c.member!}
					<article class="coord__card">
						<div class="coord__photo-wrap">
							{#if m.photo?.url}
								<img
									src={getStrapiMediaUrl(m.photo.url)}
									alt={m.photo.alternativeText ?? m.name}
									class="coord__photo"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div class="coord__photo coord__photo--placeholder" aria-hidden="true"></div>
							{/if}
						</div>
						<div class="coord__info">
							<div class="coord__name">{m.name}</div>
							{#if c.local_role || m.role}
								<div class="coord__role">{c.local_role ?? m.role}</div>
							{/if}
							{#if c.locality}
								<div class="coord__locality">
									<span aria-hidden="true">📍</span> {c.locality}
								</div>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.coord {
		padding-block: var(--space-24);
	}
	.coord--paper { background-color: var(--color-paper); }
	.coord--cream { background-color: var(--color-cream); }

	.coord__header {
		margin-bottom: var(--space-12);
	}
	.coord__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}
	.coord__heading {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 5vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0;
	}

	.coord__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
	}
	@media (max-width: 900px) {
		.coord__grid { grid-template-columns: repeat(2, 1fr); }
	}
	@media (max-width: 560px) {
		.coord__grid { grid-template-columns: 1fr; }
	}

	.coord__card {
		background-color: var(--color-cream);
		border: 1px solid rgba(12, 81, 24, 0.15);
	}
	.coord--cream .coord__card {
		background-color: var(--color-paper);
	}

	.coord__photo-wrap {
		aspect-ratio: 4 / 5;
		overflow: hidden;
	}
	.coord__photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.coord__photo--placeholder {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-paper);
	}

	.coord__info {
		padding: var(--space-5);
	}
	.coord__name {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-ink);
		line-height: 1.1;
		margin-bottom: var(--space-1);
	}
	.coord__role {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--color-ink-soft);
	}
	.coord__locality {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		color: var(--color-green-deep);
		margin-top: var(--space-2);
	}

	.coord__empty {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
		opacity: 0.65;
	}

	@media (max-width: 767px) {
		.coord { padding-block: var(--space-10); }
	}
</style>
