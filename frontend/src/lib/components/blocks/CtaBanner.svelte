<script lang="ts">
	interface Props {
		data: {
			title: string;
			description?: string;
			button_text: string;
			button_link: string;
			background_color?: 'green' | 'orange' | 'white';
		};
	}

	let { data }: Props = $props();
</script>

<section class="cta-banner cta-banner--{data.background_color ?? 'orange'}">
	<div class="container cta-banner__inner">
		<div class="cta-banner__text">
			<h2 class="cta-banner__title">{data.title}</h2>
			{#if data.description}
				<p class="cta-banner__desc">{data.description}</p>
			{/if}
		</div>
		<a href={data.button_link} class="btn cta-banner__btn">{data.button_text}</a>
	</div>
</section>

<style>
	.cta-banner { padding-block: var(--space-16); }

	.cta-banner--orange { background-color: var(--color-cream); }
	.cta-banner--green { background-color: var(--color-green-deep); color: var(--color-cream); }
	.cta-banner--white { background-color: var(--color-paper); }

	.cta-banner__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-8);
	}

	.cta-banner__title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		margin-bottom: var(--space-3);
		color: var(--color-ink);
	}

	.cta-banner--green .cta-banner__title { color: var(--color-cream); }

	.cta-banner__desc {
		color: var(--color-ink-soft);
		font-size: var(--text-base);
		max-width: 520px;
	}

	.cta-banner--green .cta-banner__desc { color: rgba(245, 241, 232, 0.75); }

	.cta-banner--orange .cta-banner__btn,
	.cta-banner--white .cta-banner__btn {
		background-color: var(--color-ink);
		color: var(--color-lime);
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.875rem 1.5rem;
		flex-shrink: 0;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}

	.cta-banner--orange .cta-banner__btn:hover,
	.cta-banner--white .cta-banner__btn:hover {
		background-color: var(--color-green-deep);
		color: var(--color-lime);
	}

	.cta-banner--green .cta-banner__btn {
		background-color: var(--color-lime);
		color: var(--color-ink);
		border: 1.5px solid var(--color-lime);
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.875rem 1.5rem;
		flex-shrink: 0;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}

	.cta-banner--green .cta-banner__btn:hover {
		background-color: var(--color-cream);
		color: var(--color-ink);
		border-color: var(--color-cream);
	}

	/* mobile-tighten:.cta-banner */
	@media (max-width: 767px) {
		.cta-banner { padding-block: var(--space-10); }
	}
</style>
