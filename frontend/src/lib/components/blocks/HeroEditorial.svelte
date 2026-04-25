<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface Direction {
		id?: number;
		code: string;
		name: string;
		body: string;
	}

	interface Props {
		data: {
			top_meta_left?: string;
			top_meta_center?: string;
			top_meta_right?: string;
			title: string;
			title_emphasis?: string;
			manifesto_kicker?: string;
			manifesto_lead?: string;
			cta_text?: string;
			cta_link?: string;
			cta_secondary_text?: string;
			cta_secondary_link?: string;
			directions_kicker?: string;
			directions?: Direction[];
			pull_quote_text?: string;
			pull_quote_author_name?: string;
			pull_quote_author_meta?: string;
			pull_quote_author_photo?: { url: string; alternativeText?: string } | null;
		};
	}

	let { data }: Props = $props();

	const directions = $derived(data.directions ?? []);
	const photoUrl = $derived(
		data.pull_quote_author_photo ? getStrapiMediaUrl(data.pull_quote_author_photo.url) : ''
	);
</script>

<section class="hero-e" aria-label="Hero">
	<div class="container">
		{#if data.top_meta_left || data.top_meta_center || data.top_meta_right}
			<div class="hero-e__topmeta">
				<span class="hero-e__topmeta-left">{data.top_meta_left ?? ''}</span>
				<span class="hero-e__topmeta-center">{data.top_meta_center ?? ''}</span>
				<span class="hero-e__topmeta-right">{data.top_meta_right ?? ''}</span>
			</div>
		{/if}

		<h1 class="hero-e__title">
			<span>{data.title}</span>
			{#if data.title_emphasis}
				{' '}
				<span class="hero-e__title-emphasis">{data.title_emphasis}</span>
			{/if}
		</h1>

		<div class="hero-e__grid">
			<!-- Lead + CTAs -->
			<div class="hero-e__lead-col">
				{#if data.manifesto_kicker}
					<div class="hero-e__kicker">— {data.manifesto_kicker}</div>
				{/if}
				{#if data.manifesto_lead}
					<p class="hero-e__lead">{data.manifesto_lead}</p>
				{/if}
				{#if data.cta_text || data.cta_secondary_text}
					<div class="hero-e__ctas">
						{#if data.cta_text && data.cta_link}
							<a href={data.cta_link} class="hero-e__btn hero-e__btn--primary">
								{data.cta_text}
								<span aria-hidden="true">→</span>
							</a>
						{/if}
						{#if data.cta_secondary_text && data.cta_secondary_link}
							<a href={data.cta_secondary_link} class="hero-e__btn hero-e__btn--secondary">
								{data.cta_secondary_text}
							</a>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Directions list -->
			{#if directions.length > 0}
				<div class="hero-e__dirs-col">
					{#if data.directions_kicker}
						<div class="hero-e__dirs-kicker">— {data.directions_kicker}</div>
					{/if}
					<ol class="hero-e__dirs">
						{#each directions as d (d.id ?? d.code)}
							<li class="hero-e__dir">
								<span class="hero-e__dir-code">{d.code}</span>
								<div>
									<div class="hero-e__dir-name">{d.name}</div>
									<div class="hero-e__dir-body">{d.body}</div>
								</div>
							</li>
						{/each}
					</ol>
				</div>
			{/if}

			<!-- Pull quote -->
			{#if data.pull_quote_text}
				<aside class="hero-e__quote">
					<div class="hero-e__quote-mark" aria-hidden="true">"</div>
					<p class="hero-e__quote-text">{data.pull_quote_text}</p>
					{#if data.pull_quote_author_name}
						<div class="hero-e__quote-author">
							{#if photoUrl}
								<img
									src={photoUrl}
									alt={data.pull_quote_author_photo?.alternativeText ?? data.pull_quote_author_name}
									class="hero-e__quote-photo"
									loading="lazy"
									decoding="async"
								/>
							{/if}
							<div>
								<div class="hero-e__quote-name">{data.pull_quote_author_name}</div>
								{#if data.pull_quote_author_meta}
									<div class="hero-e__quote-meta">{data.pull_quote_author_meta}</div>
								{/if}
							</div>
						</div>
					{/if}
				</aside>
			{/if}
		</div>
	</div>
</section>

<style>
	.hero-e {
		background-color: var(--color-cream);
		color: var(--color-ink);
		padding-block: var(--space-10) var(--space-16);
	}

	.hero-e__topmeta {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.55;
		padding-bottom: var(--space-4);
		margin-bottom: var(--space-12);
		border-bottom: 1px solid rgba(12, 81, 24, 0.2);
		gap: var(--space-3);
	}
	.hero-e__topmeta-center { text-align: center; }
	.hero-e__topmeta-right { text-align: right; }

	.hero-e__title {
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 13vw, 12rem);
		font-weight: 500;
		line-height: 0.88;
		letter-spacing: -0.025em;
		color: var(--color-ink);
		margin: 0 0 var(--space-12);
		text-transform: uppercase;
	}
	.hero-e__title-emphasis {
		display: inline-block;
		background-color: var(--color-lime);
		color: var(--color-ink);
		padding: 0 0.18em;
		font-style: italic;
		text-transform: none;
		transform: rotate(-1.5deg) translateY(-0.04em);
	}

	.hero-e__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		padding-top: var(--space-7);
		border-top: 1px solid rgba(12, 81, 24, 0.2);
	}
	@media (min-width: 900px) {
		.hero-e__grid {
			grid-template-columns: 1.3fr 1fr 1fr;
			gap: var(--space-12);
		}
	}

	/* Lead column */
	.hero-e__kicker,
	.hero-e__dirs-kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
		margin-bottom: var(--space-3);
	}
	.hero-e__lead {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 1.7vw, 1.375rem);
		font-weight: 400;
		line-height: 1.35;
		color: var(--color-ink);
		margin: 0 0 var(--space-6);
	}
	.hero-e__ctas {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
	.hero-e__btn {
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
		border: 1.5px solid var(--color-ink);
		transition: background-color var(--transition-fast), color var(--transition-fast), gap var(--transition-fast);
		cursor: pointer;
	}
	.hero-e__btn--primary {
		background-color: var(--color-green-deep);
		color: var(--color-cream);
		border-color: var(--color-green-deep);
	}
	.hero-e__btn--primary:hover {
		background-color: var(--color-ink);
		border-color: var(--color-ink);
		gap: var(--space-3);
	}
	.hero-e__btn--secondary {
		background-color: transparent;
		color: var(--color-ink);
	}
	.hero-e__btn--secondary:hover {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}

	/* Directions list */
	.hero-e__dirs {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.hero-e__dir {
		display: grid;
		grid-template-columns: 32px 1fr;
		gap: var(--space-3);
		padding-block: var(--space-3);
		border-bottom: 1px solid rgba(12, 81, 24, 0.12);
	}
	.hero-e__dir:last-child { border-bottom: none; }
	.hero-e__dir-code {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		opacity: 0.55;
		padding-top: 4px;
	}
	.hero-e__dir-name {
		font-family: var(--font-display);
		font-size: 0.875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
	}
	.hero-e__dir-body {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin-top: 2px;
	}

	/* Pull quote — tilted card */
	.hero-e__quote {
		background-color: var(--color-green-deep);
		color: var(--color-cream);
		padding: var(--space-6) var(--space-5);
		align-self: flex-start;
		transform: rotate(1.2deg);
	}
	@media (min-width: 900px) {
		.hero-e__quote { margin-top: var(--space-2); }
	}
	.hero-e__quote-mark {
		font-family: var(--font-display);
		font-size: 4.5rem;
		line-height: 0.7;
		color: var(--color-lime);
	}
	.hero-e__quote-text {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 1.6vw, 1.375rem);
		line-height: 1.25;
		margin: var(--space-3) 0 var(--space-5);
	}
	.hero-e__quote-author {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding-top: var(--space-4);
		border-top: 1px solid rgba(145, 255, 0, 0.25);
	}
	.hero-e__quote-photo {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}
	.hero-e__quote-name {
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 500;
	}
	.hero-e__quote-meta {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(245, 241, 232, 0.65);
		margin-top: 2px;
	}
</style>
