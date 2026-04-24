<script lang="ts">
	import { getIconSvg } from '$lib/icons';
	import { sanitizeSvg } from '$lib/sanitize';

	interface CardPoint { text: string; }
	interface CardItem {
		icon?: string;
		title: string;
		description?: string;
		points?: CardPoint[];
		link_text?: string;
		link_url?: string;
		image?: { url: string; alternativeText?: string };
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
</script>

<section class="card-grid">
	<div class="container">
		{#if data.heading}
			<h2 class="card-grid__heading">{data.heading}</h2>
		{/if}
		<div class="card-grid__grid card-grid--cols-{cols}">
			{#each data.cards as card, i}
				{@const total = String(data.cards.length).padStart(2, '0')}
				{@const idx = String(i + 1).padStart(2, '0')}
				{@const abbr = card.title.slice(0, 3).toUpperCase()}
				<article class="card-grid__card" style={`--card-index: ${i}`}>
					<div class="card-grid__kicker">
						<span>{idx} / {total}</span>
						<span>{abbr}</span>
					</div>

					<span class="card-grid__letter" aria-hidden="true">{card.title.charAt(0)}</span>

					{#if card.image?.url}
						<img
							src={card.image.url.startsWith('http') ? card.image.url : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${card.image.url}`}
							alt={card.image.alternativeText ?? card.title}
							class="card-grid__image"
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

					{#if card.link_text && card.link_url}
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
		padding-block: var(--space-20);
		background-color: var(--color-paper);
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
		padding: 24px 20px;
		min-height: 220px;
		display: flex;
		flex-direction: column;
		transition: transform var(--transition-base), outline-offset var(--transition-base);
		overflow: hidden;
		outline: 2px solid transparent;
		outline-offset: -2px;
	}

	@media (min-width: 768px) {
		.card-grid__card {
			padding: 40px 28px;
			min-height: 360px;
		}
	}

	.card-grid__card:hover {
		outline-color: var(--color-ink);
		outline-offset: -2px;
		transform: translateY(-4px);
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

	/* Mono kicker row (0X / 04  ·  ABB) — design C style */
	.card-grid__kicker {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: currentColor;
		opacity: 0.6;
		margin-bottom: var(--space-2);
	}

	.card-grid__letter {
		display: block;
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 5rem; /* 80px — mobile */
		line-height: 0.85;
		color: currentColor;
		letter-spacing: -0.02em;
		text-transform: uppercase;
		margin-top: auto;
		margin-bottom: var(--space-3);
	}

	@media (min-width: 768px) {
		.card-grid__letter {
			font-size: 13.75rem; /* 220px */
			margin-bottom: var(--space-4);
		}
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
		margin-top: var(--space-3);
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
		font-size: 1.375rem; /* 22px */
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1.1;
		color: currentColor;
		margin-bottom: 10px;
	}

	.card-grid__desc {
		font-family: var(--font-body);
		font-size: 0.875rem; /* 14px */
		line-height: 1.4;
		opacity: 0.85;
		margin-bottom: var(--space-4);
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
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: currentColor;
		transition: gap var(--transition-fast);
	}

	.card-grid__link:hover { gap: var(--space-4); color: currentColor; }

	.card-grid__link .arrow-animate {
		display: inline-block;
	}
</style>
