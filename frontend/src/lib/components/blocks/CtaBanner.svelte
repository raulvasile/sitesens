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
	.cta-banner { padding-block: var(--space-12); }

	.cta-banner--orange { background-color: var(--color-orange-light); }
	.cta-banner--green { background-color: var(--color-green-dark); color: var(--color-white); }
	.cta-banner--white { background-color: var(--color-white); }

	.cta-banner__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-6);
	}

	.cta-banner__title {
		font-size: var(--text-2xl);
		margin-bottom: var(--space-2);
	}

	.cta-banner--green .cta-banner__title { color: var(--color-white); }

	.cta-banner__desc {
		color: var(--color-text-muted);
		font-size: var(--text-base);
	}

	.cta-banner--green .cta-banner__desc { color: rgba(255, 255, 255, 0.75); }

	.cta-banner--orange .cta-banner__btn,
	.cta-banner--white .cta-banner__btn {
		background-color: var(--color-green-dark);
		color: var(--color-white);
		border-color: var(--color-green-dark);
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-lg);
		font-weight: 500;
		flex-shrink: 0;
	}

	.cta-banner--green .cta-banner__btn {
		background-color: var(--color-brand-neon);
		color: var(--color-green-dark);
		border-color: var(--color-brand-neon);
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-lg);
		font-weight: 500;
		flex-shrink: 0;
	}
</style>
