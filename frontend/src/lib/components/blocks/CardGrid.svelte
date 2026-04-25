<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getIconSvg } from '$lib/icons';
	import { sanitizeSvg } from '$lib/sanitize';
	import { openCard, registerCards, type CardDetail } from '$lib/cardModal';

	interface CardPoint { text: string; }
	interface CardItem {
		id: number;
		icon?: string;
		title: string;
		description?: string;
		points?: CardPoint[];
		link_text?: string;
		link_url?: string;
		image?: { url: string; alternativeText?: string };
		details?: unknown[];
	}
	interface Props {
		data: {
			heading?: string;
			columns?: '2' | '3' | '4';
			cards: CardItem[];
		};
	}

	let { data }: Props = $props();
	const cols = data.columns ?? '3';

	function hasDetails(c: CardItem): boolean {
		return Array.isArray(c.details) && c.details.length > 0;
	}

	function toCardDetail(c: CardItem): CardDetail {
		return {
			id: c.id,
			title: c.title,
			details: c.details ?? [],
			meta: {
				subtitle: c.description,
				image: c.image ? { url: c.image.url, alt: c.image.alternativeText } : null,
			},
		};
	}

	// Register cards that have `details` so deep-links (?card=<id>) resolve.
	let unregister: () => void = () => {};
	$effect(() => {
		unregister();
		const registered = data.cards.filter(hasDetails).map(toCardDetail);
		unregister = registered.length > 0 ? registerCards(registered) : () => {};
	});
	onDestroy(() => unregister());
</script>

<section class="card-grid">
	<div class="container">
		{#if data.heading}
			<h2 class="card-grid__heading">{data.heading}</h2>
		{/if}
		<div class="card-grid__grid card-grid--cols-{cols}">
			{#each data.cards as card, i}
				{@const clickable = hasDetails(card)}
				<article class="card-grid__card" class:card-grid__card--clickable={clickable} style={`--card-index: ${i}`}>
					{#if clickable}
						<button
							type="button"
							class="card-grid__overlay-btn"
							aria-label={`Vezi detalii: ${card.title}`}
							aria-haspopup="dialog"
							onclick={() => openCard(toCardDetail(card))}
						></button>
						<span class="card-grid__more" aria-hidden="true">→</span>
					{/if}

					{#if card.image?.url}
						<img
							src={card.image.url.startsWith('http') ? card.image.url : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${card.image.url}`}
							alt={card.image.alternativeText ?? card.title}
							class="card-grid__image"
							loading="lazy"
							decoding="async"
						/>
					{/if}

					<h3 class="card-grid__title">{card.title}</h3>

					{#if card.description}
						<p class="card-grid__desc">{card.description}</p>
					{/if}

					{#if card.points?.length}
						<ul class="card-grid__points">
							{#each card.points as point}
								<li>{point.text}</li>
							{/each}
						</ul>
					{/if}

					{#if !clickable && card.link_text && card.link_url}
						<a href={card.link_url} class="card-grid__link">
							{card.link_text}
							<span class="arrow-animate">&rarr;</span>
						</a>
					{:else if card.icon}
						{@const svg = getIconSvg(card.icon)}
						{#if svg}
							<span class="card-grid__icon card-grid__icon--svg">
								{@html sanitizeSvg(svg)}
							</span>
						{:else}
							<span class="card-grid__icon">{card.icon}</span>
						{/if}
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.card-grid {
		padding-block: var(--space-12);
		background-color: var(--color-paper);
	}
	@media (min-width: 768px) {
		.card-grid { padding-block: var(--space-20); }
	}

	.card-grid__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		margin-bottom: var(--space-10);
		color: var(--color-ink);
		text-align: left;
	}

	.card-grid__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2px;
		background-color: var(--color-ink);
		border: 2px solid var(--color-ink);
	}

	@media (min-width: 640px) {
		.card-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
		.card-grid--cols-3 { grid-template-columns: repeat(2, 1fr); }
		.card-grid--cols-4 { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 1024px) {
		.card-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
		.card-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }
	}

	.card-grid__card {
		position: relative;
		padding: 18px 16px;
		min-height: 160px;
		display: flex;
		flex-direction: column;
		transition: transform var(--transition-base), outline-offset var(--transition-base);
		overflow: hidden;
		outline: 2px solid transparent;
		outline-offset: -2px;
	}

	.card-grid__card--clickable {
		cursor: pointer;
	}

	/* Overlay button covers the whole card so any click anywhere triggers the
	   modal. It sits below the visible link/icon (z-index 0 vs 1) so internal
	   focusable elements still work, but for now `details` cards have no
	   internal links so this is the simplest robust pattern. */
	.card-grid__overlay-btn {
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
	.card-grid__overlay-btn:focus-visible {
		outline: 2px solid var(--color-lime);
		outline-offset: -4px;
	}

	.card-grid__more {
		position: absolute;
		top: 16px;
		right: 16px;
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: 1;
		color: currentColor;
		opacity: 0.5;
		transition: transform var(--transition-fast), opacity var(--transition-fast);
		z-index: 2;
		pointer-events: none;
	}
	@media (hover: hover) {
		.card-grid__card--clickable:hover .card-grid__more {
			transform: translate(2px, -2px);
			opacity: 1;
		}
		.card-grid__card:hover {
			outline-color: var(--color-ink);
			outline-offset: -2px;
			transform: translateY(-4px);
		}
	}
	/* Touch / no-hover devices: trigger the visual nudge only on real tap (active). */
	.card-grid__card--clickable:active .card-grid__more {
		transform: translate(2px, -2px);
		opacity: 1;
	}
	.card-grid__card:active {
		outline-color: var(--color-ink);
		outline-offset: -2px;
	}

	@media (min-width: 768px) {
		.card-grid__card {
			padding: 40px 28px;
			min-height: 360px;
		}
	}

	/* Direction C rotation: cream / lime / green-deep / green-dark */
	.card-grid__card:nth-child(4n+1) {
		background-color: var(--color-cream);
		color: var(--color-green-deep);
	}
	.card-grid__card:nth-child(4n+2) {
		background-color: var(--color-lime);
		color: var(--color-ink);
	}
	.card-grid__card:nth-child(4n+3) {
		background-color: var(--color-green-deep);
		color: var(--color-cream);
	}
	.card-grid__card:nth-child(4n+4) {
		background-color: var(--color-green-dark);
		color: var(--color-cream);
	}

	.card-grid__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(10, 31, 16, 0.08);
		color: currentColor;
		font-size: 1.125rem;
		flex-shrink: 0;
		/* Pin icon to the bottom of the card (cards have min-height set). */
		margin-top: auto;
	}

	.card-grid__card:nth-child(4n+3) .card-grid__icon,
	.card-grid__card:nth-child(4n+4) .card-grid__icon {
		background-color: rgba(145, 255, 0, 0.2);
	}

	.card-grid__icon--svg {
		background-color: currentColor;
	}

	.card-grid__icon--svg :global(svg) {
		width: 20px;
		height: 20px;
	}

	.card-grid__card:nth-child(4n+3) .card-grid__icon--svg :global(svg),
	.card-grid__card:nth-child(4n+4) .card-grid__icon--svg :global(svg) {
		color: var(--color-green-deep);
	}

	.card-grid__card:nth-child(4n+1) .card-grid__icon--svg :global(svg),
	.card-grid__card:nth-child(4n+2) .card-grid__icon--svg :global(svg) {
		color: var(--color-cream);
	}

	.card-grid__image {
		width: 100%;
		height: 160px;
		object-fit: cover;
		margin-bottom: var(--space-4);
	}

	.card-grid__title {
		font-family: var(--font-display);
		font-size: 1.75rem; /* 28px mobile */
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1.05;
		color: currentColor;
		margin-bottom: var(--space-3);
	}

	.card-grid__desc {
		font-family: var(--font-body);
		font-size: 0.8125rem; /* 13px mobile */
		line-height: 1.5;
		opacity: 0.85;
		margin-bottom: var(--space-3);
	}
	@media (min-width: 768px) {
		.card-grid__title { font-size: 2rem; line-height: 1.05; margin-bottom: var(--space-4); }
		.card-grid__desc { font-size: 0.875rem; margin-bottom: var(--space-4); }
	}

	.card-grid__points {
		list-style: none;
		margin-bottom: var(--space-4);
	}

	.card-grid__points li {
		position: relative;
		padding-left: var(--space-5);
		font-size: 0.9375rem;
		color: currentColor;
		line-height: 1.5;
		opacity: 0.9;
	}

	.card-grid__points li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: currentColor;
		font-weight: 500;
	}

	.card-grid__link {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: currentColor;
		/* Pin link to the bottom of the card. */
		margin-top: auto;
		transition: gap var(--transition-fast);
	}

	.card-grid__link:hover { gap: var(--space-4); color: currentColor; }

	.card-grid__link .arrow-animate {
		display: inline-block;
	}
</style>
