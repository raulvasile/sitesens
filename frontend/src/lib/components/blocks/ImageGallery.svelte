<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface StrapiMedia { url: string; alternativeText?: string; width?: number; height?: number; }
	interface Props {
		data: {
			images: StrapiMedia[];
			layout?: 'grid' | 'carousel';
			caption?: string;
		};
	}

	let { data }: Props = $props();
	let carouselIndex = $state(0);

	function prev() { carouselIndex = (carouselIndex - 1 + data.images.length) % data.images.length; }
	function next() { carouselIndex = (carouselIndex + 1) % data.images.length; }
</script>

<section class="gallery-block">
	<div class="container">
		{#if data.layout === 'carousel'}
			<div class="carousel">
				<img
					src={getStrapiMediaUrl(data.images[carouselIndex]?.url)}
					alt={data.images[carouselIndex]?.alternativeText ?? ''}
					class="carousel__img"
				/>
				<button class="carousel__btn carousel__btn--prev" onclick={prev} aria-label="Anterior">‹</button>
				<button class="carousel__btn carousel__btn--next" onclick={next} aria-label="Următor">›</button>
				<div class="carousel__dots">
					{#each data.images as _, i}
						<button
							class="carousel__dot"
							class:active={i === carouselIndex}
							onclick={() => (carouselIndex = i)}
							aria-label={`Imaginea ${i + 1}`}
						></button>
					{/each}
				</div>
			</div>
		{:else}
			<div class="gallery-grid">
				{#each data.images as img}
					<img
						src={getStrapiMediaUrl(img.url)}
						alt={img.alternativeText ?? ''}
						class="gallery-grid__img"
						loading="lazy"
					/>
				{/each}
			</div>
		{/if}
		{#if data.caption}
			<p class="gallery-caption">{data.caption}</p>
		{/if}
	</div>
</section>

<style>
	.gallery-block { padding-block: var(--space-12); }

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.gallery-grid__img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: var(--radius-md);
	}

	.carousel {
		position: relative;
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.carousel__img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	.carousel__btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-full);
		cursor: pointer;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color var(--transition-fast);
	}

	.carousel__btn:hover { background-color: rgba(0, 0, 0, 0.75); }
	.carousel__btn--prev { left: var(--space-3); }
	.carousel__btn--next { right: var(--space-3); }

	.carousel__dots {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background-color: rgba(0, 0, 0, 0.3);
	}

	.carousel__dot {
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		background-color: rgba(255, 255, 255, 0.5);
		border: none;
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.carousel__dot.active { background-color: var(--color-white); }

	.gallery-caption {
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-3);
	}
</style>
