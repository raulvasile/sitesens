<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';
	import { openCard, registerCards, type CardDetail } from '$lib/cardModal';

	interface Member {
		id: number;
		name: string;
		role: string;
		bio?: string;
		photo?: { url: string; alternativeText?: string } | null;
		details?: unknown[];
	}

	interface Props {
		data: {
			kicker?: string;
			heading: string;
			cta_text?: string;
			cta_link?: string;
			mode?: 'leadership' | 'team' | 'all';
			/** @deprecated kept for backwards compat — use `mode` instead. */
			leadership_only?: boolean;
			limit?: number;
			background_color?: 'paper' | 'cream';
			_members?: Member[];
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'paper');
	const members = $derived(data._members ?? []);

	function hasDetails(m: Member): boolean {
		return Array.isArray(m.details) && m.details.length > 0;
	}

	function toCardDetail(m: Member): CardDetail {
		return {
			id: m.id,
			title: m.name,
			details: m.details ?? [],
			meta: {
				kicker: m.role,
				subtitle: m.bio,
				image: m.photo ? { url: m.photo.url, alt: m.photo.alternativeText ?? m.name } : null,
			},
		};
	}

	let unregister: () => void = () => {};
	$effect(() => {
		// Re-register whenever members change (e.g., after a refetch).
		unregister();
		const list = members.filter(hasDetails).map(toCardDetail);
		unregister = list.length > 0 ? registerCards(list) : () => {};
	});
	onDestroy(() => unregister());
</script>

<section class="team team--{bg}">
	<div class="container">
		<header class="team__header">
			<div>
				{#if data.kicker}
					<div class="team__kicker">— {data.kicker}</div>
				{/if}
				<h2 class="team__heading">{data.heading}</h2>
			</div>
			{#if data.cta_text && data.cta_link}
				<a href={data.cta_link} class="team__cta">
					{data.cta_text} <span aria-hidden="true">→</span>
				</a>
			{/if}
		</header>

		{#if members.length === 0}
			<p class="team__empty">Niciun membru disponibil.</p>
		{:else}
			<div class="team__grid">
				{#each members as m (m.id)}
					{@const clickable = hasDetails(m)}
					<article class="team__card" class:team__card--clickable={clickable}>
						{#if clickable}
							<button
								type="button"
								class="team__overlay-btn"
								aria-label={`Vezi detalii: ${m.name}, ${m.role}`}
								aria-haspopup="dialog"
								onclick={() => openCard(toCardDetail(m))}
							></button>
							<span class="team__more" aria-hidden="true">→</span>
						{/if}
						<div class="team__photo-wrap">
							{#if m.photo?.url}
								<img
									src={getStrapiMediaUrl(m.photo.url)}
									alt={m.photo.alternativeText ?? m.name}
									class="team__photo"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div class="team__photo team__photo--placeholder" aria-hidden="true"></div>
							{/if}
						</div>
						<div class="team__info">
							<div class="team__name">{m.name}</div>
							<div class="team__role">{m.role}</div>
							{#if m.bio}
								<p class="team__bio">{m.bio}</p>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.team {
		padding-block: var(--space-24);
	}
	.team--paper { background-color: var(--color-paper); }
	.team--cream { background-color: var(--color-cream); }

	.team__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-6);
		margin-bottom: var(--space-12);
		flex-wrap: wrap;
	}

	.team__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}

	.team__heading {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 5vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0;
	}

	.team__cta {
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		text-decoration: none;
		transition: color var(--transition-fast);
	}
	.team__cta:hover { color: var(--color-green-deep); }

	.team__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
	}
	@media (max-width: 900px) {
		.team__grid { grid-template-columns: repeat(2, 1fr); }
	}
	@media (max-width: 560px) {
		.team__grid { grid-template-columns: 1fr; }
	}

	.team__card {
		position: relative;
		background-color: var(--color-cream);
		border: 1px solid rgba(12, 81, 24, 0.15);
	}
	.team--cream .team__card {
		background-color: var(--color-paper);
	}

	.team__card--clickable {
		cursor: pointer;
		transition: transform var(--transition-base);
	}
	.team__card--clickable:hover {
		transform: translateY(-4px);
	}

	.team__overlay-btn {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
		z-index: 1;
	}
	.team__overlay-btn:focus-visible {
		outline: 2px solid var(--color-lime);
		outline-offset: -4px;
	}

	.team__more {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 28px;
		height: 28px;
		background-color: rgba(245, 241, 232, 0.9);
		color: var(--color-ink);
		font-family: var(--font-display);
		font-size: 1rem;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.7;
		transition: opacity var(--transition-fast), transform var(--transition-fast);
		z-index: 2;
		pointer-events: none;
	}
	.team__card--clickable:hover .team__more {
		opacity: 1;
		transform: translate(2px, -2px);
	}

	.team__photo-wrap {
		aspect-ratio: 4 / 5;
		overflow: hidden;
	}
	.team__photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.team__photo--placeholder {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-paper);
	}

	.team__info {
		padding: var(--space-5);
	}

	.team__name {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-ink);
		line-height: 1.1;
		margin-bottom: var(--space-1);
	}

	.team__role {
		font-family: var(--font-body);
		font-size: 0.875rem;
		color: var(--color-ink-soft);
	}

	.team__bio {
		font-family: var(--font-body);
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: var(--space-3) 0 0;
	}

	.team__empty {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
		opacity: 0.65;
	}

	/* mobile-tighten:.team */
	@media (max-width: 767px) {
		.team { padding-block: var(--space-10); }
	}
</style>
