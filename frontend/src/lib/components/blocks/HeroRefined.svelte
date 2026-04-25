<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface Props {
		data: {
			background_image: { url: string; alternativeText?: string };
			top_meta_left?: string;
			top_meta_right?: string;
			title: string;
			title_italic_accent?: string;
			description?: string;
			cta_text?: string;
			cta_link?: string;
			cta_secondary_text?: string;
			cta_secondary_link?: string;
		};
	}

	let { data }: Props = $props();
	const photoUrl = $derived(data.background_image ? getStrapiMediaUrl(data.background_image.url) : '');
</script>

<section class="hero-r" aria-label="Hero">
	{#if photoUrl}
		<img
			class="hero-r__bg"
			src={photoUrl}
			alt={data.background_image.alternativeText ?? ''}
			loading="eager"
			decoding="async"
			fetchpriority="high"
		/>
	{/if}
	<div class="hero-r__overlay" aria-hidden="true"></div>

	{#if data.top_meta_left || data.top_meta_right}
		<div class="hero-r__meta">
			<span>{data.top_meta_left ?? ''}</span>
			<span>{data.top_meta_right ?? ''}</span>
		</div>
	{/if}

	<div class="container hero-r__content">
		<div class="hero-r__main">
			<h1 class="hero-r__title">
				<span>{data.title}</span>
				{#if data.title_italic_accent}
					<br />
					<span class="hero-r__title-accent">{data.title_italic_accent}</span>
				{/if}
			</h1>
		</div>

		<aside class="hero-r__aside">
			{#if data.description}
				<p class="hero-r__lead">{data.description}</p>
			{/if}
			{#if data.cta_text || data.cta_secondary_text}
				<div class="hero-r__ctas">
					{#if data.cta_text && data.cta_link}
						<a href={data.cta_link} class="hero-r__btn hero-r__btn--primary">
							{data.cta_text}
							<span aria-hidden="true">→</span>
						</a>
					{/if}
					{#if data.cta_secondary_text && data.cta_secondary_link}
						<a href={data.cta_secondary_link} class="hero-r__btn hero-r__btn--secondary">
							{data.cta_secondary_text}
						</a>
					{/if}
				</div>
			{/if}
		</aside>
	</div>
</section>

<style>
	.hero-r {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-height: clamp(520px, 75dvh, 760px);
		background-color: var(--color-green-deep);
		color: var(--color-cream);
		overflow: hidden;
		isolation: isolate;
	}

	.hero-r__bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
		filter: grayscale(0.18) brightness(0.85);
	}

	.hero-r__overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		/* Strong deep-green wash for legibility + brand identity. The base layer
		   tints the whole image; the gradient adds extra contrast where content
		   sits (top meta and bottom CTAs). */
		background:
			linear-gradient(
				180deg,
				rgba(12, 81, 24, 0.6) 0%,
				rgba(12, 81, 24, 0.35) 40%,
				rgba(10, 31, 16, 0.88) 100%
			),
			rgba(12, 81, 24, 0.35);
	}

	.hero-r__meta {
		position: absolute;
		top: var(--space-5);
		left: var(--space-6);
		right: var(--space-6);
		z-index: 2;
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(245, 241, 232, 0.75);
		flex-wrap: wrap;
	}

	.hero-r__content {
		position: relative;
		z-index: 2;
		padding-top: var(--space-12);
		padding-bottom: var(--space-12);
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		align-items: end;
	}

	@media (min-width: 900px) {
		.hero-r__content {
			/* min-width 0 lets the title shrink instead of forcing the column to
			   grow into the aside (which caused title text overlapping description). */
			grid-template-columns: minmax(0, 1.5fr) minmax(280px, 360px);
			gap: var(--space-16);
			padding-bottom: var(--space-16);
		}
	}

	.hero-r__main {
		min-width: 0;
	}

	.hero-r__title {
		font-family: var(--font-display);
		/* Slightly tamed clamp so the title can't overflow into the right column
		   on narrow desktops; long words still wrap cleanly. */
		font-size: clamp(2.75rem, 8vw, 7rem);
		font-weight: 500;
		line-height: 0.92;
		letter-spacing: -0.02em;
		color: var(--color-cream);
		margin: 0;
		text-transform: uppercase;
		overflow-wrap: break-word;
		hyphens: auto;
	}
	.hero-r__title-accent {
		color: var(--color-lime);
		font-style: italic;
		text-transform: lowercase;
	}

	.hero-r__aside {
		padding-bottom: var(--space-2);
	}

	.hero-r__lead {
		font-family: var(--font-body);
		font-size: clamp(1rem, 1.4vw, 1.125rem);
		line-height: 1.55;
		color: rgba(245, 241, 232, 0.92);
		margin: 0 0 var(--space-6);
	}

	.hero-r__ctas {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.hero-r__btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: 0.875rem 1.5rem;
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		border: 1.5px solid transparent;
		transition: background-color var(--transition-fast), color var(--transition-fast), gap var(--transition-fast);
		cursor: pointer;
	}
	.hero-r__btn--primary {
		background-color: var(--color-lime);
		color: var(--color-ink);
		border-color: var(--color-lime);
	}
	.hero-r__btn--primary:hover {
		background-color: var(--color-cream);
		border-color: var(--color-cream);
		gap: var(--space-3);
	}
	.hero-r__btn--secondary {
		background-color: transparent;
		color: var(--color-cream);
		border-color: var(--color-cream);
	}
	.hero-r__btn--secondary:hover {
		background-color: var(--color-cream);
		color: var(--color-green-deep);
	}
</style>
