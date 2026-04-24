<script lang="ts">
	interface CarouselItem {
		text: string;
		url?: string;
		highlight?: boolean;
	}

	interface Props {
		data: {
			items: CarouselItem[];
			speed_seconds?: number;
			background_color?: 'green' | 'dark' | 'white' | 'lime';
			separator?: string;
		};
	}

	let { data }: Props = $props();

	const speed = $derived(data.speed_seconds ?? 30);
	const bg = $derived(data.background_color ?? 'green');
	const separator = $derived(data.separator ?? '•');
	const items = $derived(data.items ?? []);

	// Seamless infinite marquee: build a "base copy" that's long enough to span a wide
	// viewport, then duplicate it EXACTLY TWICE. The CSS keyframe scrolls from 0 to -50%,
	// which moves the track by exactly one base copy — landing on the start of the
	// identical second copy, so the loop restart is invisible.
	const MIN_ITEMS_PER_COPY = 12; // heuristic: enough to cover ultrawide screens
	const baseCopy = $derived.by(() => {
		if (items.length === 0) return [] as typeof items;
		const repeats = Math.max(1, Math.ceil(MIN_ITEMS_PER_COPY / items.length));
		return Array.from({ length: repeats }, () => items).flat();
	});
	const baseLen = $derived(baseCopy.length);
	const repeated = $derived([...baseCopy, ...baseCopy]);
</script>

{#if items.length > 0}
	<section class="word-carousel word-carousel--{bg}" aria-label="Carusel cuvinte">
		<div
			class="word-carousel__track"
			style={`--carousel-duration: ${speed}s`}
			aria-hidden="false"
		>
			{#each repeated as item, i}
				{@const isDuplicate = i >= baseLen}
				{#if item.url}
					<a
						href={item.url}
						class="word-carousel__item"
						class:word-carousel__item--highlight={item.highlight}
						aria-hidden={isDuplicate ? 'true' : undefined}
						tabindex={isDuplicate ? -1 : 0}
					>
						{item.text}
					</a>
				{:else}
					<span
						class="word-carousel__item"
						class:word-carousel__item--highlight={item.highlight}
						aria-hidden={isDuplicate ? 'true' : undefined}
					>
						{item.text}
					</span>
				{/if}
				<span class="word-carousel__sep" aria-hidden="true">{separator}</span>
			{/each}
		</div>
	</section>
{/if}

<style>
	.word-carousel {
		position: relative;
		overflow: hidden;
		width: 100%;
		padding-block: var(--space-4);
	}

	.word-carousel--green { background-color: var(--color-green-dark); }
	.word-carousel--dark { background-color: #0A221C; }
	.word-carousel--white { background-color: var(--color-white); border-block: 1px solid var(--color-border); }
	.word-carousel--lime { background-color: var(--color-brand-neon); }

	.word-carousel__track {
		display: inline-flex;
		align-items: center;
		gap: var(--space-12);
		white-space: nowrap;
		animation: wordCarouselScroll var(--carousel-duration, 30s) linear infinite;
		will-change: transform;
	}

	.word-carousel:hover .word-carousel__track {
		animation-play-state: paused;
	}

	.word-carousel__item {
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-style: italic;
		font-weight: 400;
		letter-spacing: 0.02em;
		color: var(--color-white);
		text-decoration: none;
		padding-inline: var(--space-4);
		transition: color var(--transition-fast);
	}

	.word-carousel--white .word-carousel__item {
		color: var(--color-green-dark);
	}

	.word-carousel--lime .word-carousel__item {
		color: var(--color-green-dark);
	}

	a.word-carousel__item:hover {
		color: var(--color-brand-neon);
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.word-carousel--white a.word-carousel__item:hover,
	.word-carousel--lime a.word-carousel__item:hover {
		color: var(--color-green-mid);
	}

	.word-carousel__item--highlight {
		color: var(--color-brand-neon);
	}

	.word-carousel__sep {
		color: var(--color-brand-neon);
		font-size: var(--text-sm);
		opacity: 0.6;
	}

	.word-carousel--white .word-carousel__sep,
	.word-carousel--lime .word-carousel__sep {
		color: var(--color-green-mid);
	}

	@keyframes wordCarouselScroll {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}

	@media (min-width: 768px) {
		.word-carousel__item {
			font-size: var(--text-base);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.word-carousel__track {
			animation: none;
		}
	}
</style>
