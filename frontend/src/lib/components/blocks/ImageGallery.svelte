<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface StrapiMedia {
		url: string;
		alternativeText?: string;
		width?: number;
		height?: number;
		caption?: string;
	}
	interface Props {
		data: {
			images: StrapiMedia[];
			layout?: 'grid' | 'carousel';
			caption?: string;
		};
	}

	let { data }: Props = $props();

	const images = $derived(data.images ?? []);
	const total = $derived(images.length);
	const layout = $derived(data.layout ?? 'grid');

	let carouselIndex = $state(0);
	let trackEl: HTMLDivElement | undefined = $state();
	let touchStartX = 0;
	let touchEndX = 0;

	function prev() {
		if (total <= 1) return;
		carouselIndex = (carouselIndex - 1 + total) % total;
	}
	function next() {
		if (total <= 1) return;
		carouselIndex = (carouselIndex + 1) % total;
	}
	function goTo(i: number) {
		carouselIndex = i;
	}

	function handleKey(e: KeyboardEvent) {
		if (layout !== 'carousel') return;
		if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
		else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
	}

	function handleTouchStart(e: TouchEvent) { touchStartX = e.changedTouches[0].screenX; }
	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		const dx = touchEndX - touchStartX;
		if (Math.abs(dx) < 40) return; // ignore taps
		if (dx > 0) prev(); else next();
	}

	const padIdx = (n: number) => String(n).padStart(2, '0');

	onMount(() => {
		window.addEventListener('keydown', handleKey);
	});
	onDestroy(() => {
		if (typeof window !== 'undefined') window.removeEventListener('keydown', handleKey);
	});
</script>

<section class="gallery">
	<div class="container">
		{#if layout === 'carousel' && total > 0}
			<!-- ─────────────── Carousel (Direction C) ─────────────── -->
			<div
				class="gx"
				role="region"
				aria-roledescription="carousel"
				aria-label={data.caption ?? 'Galerie imagini'}
				ontouchstart={handleTouchStart}
				ontouchend={handleTouchEnd}
			>
				<!-- Sliding track: each slide is full-width; the track shifts by 100% per index -->
				<div
					class="gx__track"
					bind:this={trackEl}
					style="transform: translate3d(-{carouselIndex * 100}%, 0, 0);"
				>
					{#each images as img, i}
						<figure
							class="gx__slide"
							aria-hidden={i !== carouselIndex}
							aria-label={`Imaginea ${i + 1} din ${total}`}
						>
							<img
								src={getStrapiMediaUrl(img.url)}
								alt={img.alternativeText ?? ''}
								class="gx__img"
								loading={i === 0 ? 'eager' : 'lazy'}
								decoding="async"
							/>
						</figure>
					{/each}
				</div>

				<!-- Top meta strip: index counter + optional caption of current slide -->
				<div class="gx__meta">
					<span class="gx__counter">{padIdx(carouselIndex + 1)} / {padIdx(total)}</span>
					{#if images[carouselIndex]?.caption || images[carouselIndex]?.alternativeText}
						<span class="gx__cap">
							{images[carouselIndex].caption ?? images[carouselIndex].alternativeText}
						</span>
					{/if}
				</div>

				<!-- Navigation arrows -->
				{#if total > 1}
					<button
						type="button"
						class="gx__nav gx__nav--prev"
						onclick={prev}
						aria-label="Imaginea anterioară"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>
					<button
						type="button"
						class="gx__nav gx__nav--next"
						onclick={next}
						aria-label="Imaginea următoare"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>
				{/if}
			</div>

			<!-- Thumbnail strip below — clickable, with active state -->
			{#if total > 1}
				<div class="gx__thumbs" role="tablist" aria-label="Selectează imagine">
					{#each images as img, i}
						<button
							type="button"
							class="gx__thumb"
							class:active={i === carouselIndex}
							onclick={() => goTo(i)}
							role="tab"
							aria-selected={i === carouselIndex}
							aria-label={`Imaginea ${i + 1}`}
						>
							<img
								src={getStrapiMediaUrl(img.url)}
								alt=""
								loading="lazy"
								decoding="async"
							/>
						</button>
					{/each}
				</div>
			{/if}
		{:else if total > 0}
			<!-- ─────────────── Grid (Direction C) ─────────────── -->
			<div class="gg">
				{#each images as img, i}
					<figure class="gg__item" style={`--i: ${i}`}>
						<img
							src={getStrapiMediaUrl(img.url)}
							alt={img.alternativeText ?? ''}
							class="gg__img"
							loading="lazy"
							decoding="async"
						/>
						{#if img.caption}
							<figcaption class="gg__cap">{img.caption}</figcaption>
						{/if}
					</figure>
				{/each}
			</div>
		{/if}

		{#if data.caption}
			<p class="gallery__caption">— {data.caption}</p>
		{/if}
	</div>
</section>

<style>
	.gallery {
		padding-block: var(--space-12);
		background-color: var(--color-paper);
	}
	@media (min-width: 768px) {
		.gallery { padding-block: var(--space-16); }
	}

	/* ────────────── CAROUSEL ────────────── */
	.gx {
		position: relative;
		overflow: hidden;
		border: 2px solid var(--color-ink);
		background-color: var(--color-ink);
		aspect-ratio: 16 / 9;
		max-height: 75vh;
	}

	.gx__track {
		display: flex;
		width: 100%;
		height: 100%;
		transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform;
	}

	.gx__slide {
		flex: 0 0 100%;
		margin: 0;
		height: 100%;
		display: block;
	}

	.gx__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* Top meta strip — dark gradient over the image */
	.gx__meta {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-5);
		color: var(--color-cream);
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 100%);
		pointer-events: none;
	}
	.gx__counter {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-lime);
		flex-shrink: 0;
	}
	.gx__cap {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-cream);
		opacity: 0.85;
		text-align: right;
		line-height: 1.4;
		max-width: 60%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Navigation arrows — flat squares Direction C */
	.gx__nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: var(--color-ink);
		color: var(--color-lime);
		border: 2px solid var(--color-lime);
		cursor: pointer;
		transition: background-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
	}
	@media (hover: hover) {
		.gx__nav:hover {
			background: var(--color-lime);
			color: var(--color-ink);
		}
	}
	.gx__nav:active { transform: translateY(-50%) scale(0.95); }
	.gx__nav--prev { left: var(--space-4); }
	.gx__nav--next { right: var(--space-4); }

	@media (max-width: 640px) {
		.gx__nav { width: 40px; height: 40px; }
		.gx__nav--prev { left: var(--space-2); }
		.gx__nav--next { right: var(--space-2); }
		.gx__cap { display: none; }
	}

	/* Thumbnail strip */
	.gx__thumbs {
		display: flex;
		gap: 2px;
		margin-top: 2px;
		overflow-x: auto;
		scrollbar-width: thin;
		padding-bottom: 4px;
	}
	.gx__thumb {
		flex: 0 0 96px;
		height: 64px;
		padding: 0;
		border: 2px solid transparent;
		background: var(--color-ink);
		cursor: pointer;
		opacity: 0.55;
		transition: opacity var(--transition-fast), border-color var(--transition-fast);
		-webkit-tap-highlight-color: transparent;
	}
	.gx__thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.gx__thumb:hover { opacity: 0.85; }
	.gx__thumb.active {
		opacity: 1;
		border-color: var(--color-lime);
	}
	@media (max-width: 640px) {
		.gx__thumb { flex: 0 0 72px; height: 48px; }
	}

	/* ────────────── GRID ────────────── */
	.gg {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2px;
		background-color: var(--color-ink);
		border: 2px solid var(--color-ink);
	}
	@media (min-width: 600px) {
		.gg { grid-template-columns: repeat(2, 1fr); }
	}
	@media (min-width: 1024px) {
		.gg { grid-template-columns: repeat(3, 1fr); }
	}

	.gg__item {
		position: relative;
		margin: 0;
		overflow: hidden;
		background-color: var(--color-cream);
		aspect-ratio: 4 / 3;
	}
	.gg__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	@media (hover: hover) {
		.gg__item:hover .gg__img { transform: scale(1.04); }
	}
	.gg__cap {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: var(--space-3) var(--space-4);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-cream);
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
	}

	/* ────────────── Caption (overall) ────────────── */
	.gallery__caption {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
		margin: var(--space-4) 0 0;
		text-align: left;
	}
</style>
