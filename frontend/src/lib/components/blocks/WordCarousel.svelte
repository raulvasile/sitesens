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
	const bg = $derived(data.background_color ?? 'lime');
	const separator = $derived(data.separator ?? '✦');
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
		padding-block: var(--space-5);
		border-block: 1px solid rgba(12, 81, 24, 0.15);
	}

	.word-carousel--green {
		background-color: var(--color-green-deep);
		border-color: rgba(145, 255, 0, 0.15);
	}
	.word-carousel--dark {
		background-color: var(--color-ink);
		border-color: rgba(145, 255, 0, 0.15);
	}
	.word-carousel--white {
		background-color: var(--color-cream);
	}
	.word-carousel--lime {
		background-color: var(--color-lime);
		border-block: 1px solid rgba(12, 81, 24, 0.1);
	}

	.word-carousel__track {
		display: inline-flex;
		align-items: center;
		gap: var(--space-10);
		white-space: nowrap;
		animation: wordCarouselScroll var(--carousel-duration, 40s) linear infinite;
		will-change: transform;
	}

	.word-carousel:hover .word-carousel__track {
		animation-play-state: paused;
	}

	.word-carousel__item {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-cream);
		text-decoration: none;
		padding-inline: var(--space-2);
		transition: color var(--transition-fast);
	}

	.word-carousel--white .word-carousel__item {
		color: var(--color-ink);
	}

	.word-carousel--lime .word-carousel__item {
		color: var(--color-ink);
	}

	a.word-carousel__item:hover {
		color: var(--color-lime);
	}

	.word-carousel--white a.word-carousel__item:hover,
	.word-carousel--lime a.word-carousel__item:hover {
		color: var(--color-green-deep);
	}

	.word-carousel__item--highlight {
		color: var(--color-lime);
	}

	.word-carousel__sep {
		color: var(--color-lime);
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.word-carousel--white .word-carousel__sep,
	.word-carousel--lime .word-carousel__sep {
		color: var(--color-green-deep);
		opacity: 0.5;
	}

	@keyframes wordCarouselScroll {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}

	@media (min-width: 768px) {
		.word-carousel__item {
			font-size: 1.375rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.word-carousel__track {
			animation: none;
		}
	}
</style>
