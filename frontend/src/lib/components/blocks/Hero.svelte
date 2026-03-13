<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface Props {
		data: {
			title: string;
			subtitle?: string;
			cta_text?: string;
			cta_link?: string;
			cta_secondary_text?: string;
			cta_secondary_link?: string;
			background_image?: { url: string; alternativeText?: string } | null;
		};
	}

	let { data }: Props = $props();
</script>

<section
	class="hero"
	style={data.background_image
		? `--hero-bg: url('${getStrapiMediaUrl(data.background_image.url)}')`
		: ''}
>
	<div class="hero__overlay"></div>
	<div class="container hero__content">
		<h1 class="hero__title">{data.title}</h1>
		{#if data.subtitle}
			<p class="hero__subtitle">{data.subtitle}</p>
		{/if}
		{#if data.cta_text || data.cta_secondary_text}
			<div class="hero__ctas">
				{#if data.cta_text && data.cta_link}
					<a href={data.cta_link} class="btn btn-primary btn-lg">{data.cta_text}</a>
				{/if}
				{#if data.cta_secondary_text && data.cta_secondary_link}
					<a href={data.cta_secondary_link} class="btn btn-secondary btn-lg hero__cta-secondary">
						{data.cta_secondary_text}
					</a>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-color: var(--color-green-dark);
		background-image: var(--hero-bg);
		background-size: cover;
		background-position: center;
		padding-block: var(--space-24);
		padding-top: calc(var(--navbar-height) + var(--space-16));
	}

	.hero__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(0, 56, 39, 0.85) 0%,
			rgba(0, 75, 36, 0.70) 100%
		);
	}

	.hero__content {
		position: relative;
		z-index: 1;
		color: var(--color-white);
		max-width: 720px;
	}

	.hero__title {
		font-size: var(--text-3xl);
		font-weight: 700;
		line-height: 1.15;
		margin-bottom: var(--space-6);
	}

	@media (min-width: 768px) {
		.hero__title { font-size: var(--text-5xl); }
	}

	.hero__subtitle {
		font-size: var(--text-lg);
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.85);
		margin-bottom: var(--space-8);
		max-width: 560px;
	}

	.hero__ctas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.hero__cta-secondary {
		border-color: rgba(255, 255, 255, 0.6);
		color: var(--color-white);
	}

	.hero__cta-secondary:hover {
		background-color: rgba(255, 255, 255, 0.15);
		border-color: var(--color-white);
		color: var(--color-white);
	}
</style>
