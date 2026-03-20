<script lang="ts">
	import { getIconSvg } from '$lib/icons';

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
			{#each data.cards as card}
				<article class="card-grid__card">
					{#if card.icon}
						{@const svg = getIconSvg(card.icon)}
						{#if svg}
							<span class="card-grid__icon card-grid__icon--svg">
								{@html svg}
							</span>
						{:else}
							<!-- Fallback: render raw text (emoji or unknown key) -->
							<span class="card-grid__icon">{card.icon}</span>
						{/if}
					{/if}
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
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.card-grid { padding-block: var(--space-16); }

	.card-grid__heading {
		font-size: var(--text-2xl);
		text-align: center;
		margin-bottom: var(--space-10);
		padding-bottom: var(--space-8);
		color: var(--color-green-dark);
	}

	@media (min-width: 768px) {
		.card-grid__heading { font-size: var(--text-3xl); }
	}

	.card-grid__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
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
		background-color: var(--color-white);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		transition: box-shadow var(--transition-fast), transform var(--transition-fast);
	}

	.card-grid__card:hover {
		box-shadow: 0 8px 24px rgba(0, 56, 39, 0.08);
		transform: translateY(-2px);
	}

	.card-grid__icon {
		display: block;
		font-size: 2.5rem;
		margin-bottom: var(--space-4);
	}

	.card-grid__icon--svg {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		background-color: var(--color-green-dark);
		color: var(--color-white);
		font-size: unset;
	}

	.card-grid__icon--svg :global(svg) {
		width: 24px;
		height: 24px;
	}

	.card-grid__image {
		width: 100%;
		height: 160px;
		object-fit: cover;
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	.card-grid__title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-green-dark);
		margin-bottom: var(--space-2);
	}

	.card-grid__desc {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: var(--space-3);
	}

	.card-grid__points {
		list-style: none;
		margin-bottom: var(--space-4);
	}

	.card-grid__points li {
		position: relative;
		padding-left: var(--space-5);
		font-size: var(--text-sm);
		color: var(--color-text);
		line-height: 1.8;
	}

	.card-grid__points li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color-green-leaf);
		font-weight: 700;
	}

	.card-grid__link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: 600;
		font-size: var(--text-sm);
		color: var(--color-green-dark);
		transition: color var(--transition-fast);
	}

	.card-grid__link:hover { color: var(--color-green-leaf); }

	.card-grid__link .arrow-animate {
		display: inline-block;
		transition: transform 0.2s ease;
	}

	.card-grid__link:hover .arrow-animate {
		transform: translateX(4px);
	}
</style>
