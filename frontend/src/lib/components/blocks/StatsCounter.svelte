<script lang="ts">
	interface StatItem { number: string; label: string; }
	interface Props { data: { items: StatItem[] }; }
	let { data }: Props = $props();
</script>

<section class="stats">
	<div class="container stats__grid">
		{#each data.items as item}
			<div class="stats__item">
				<span class="stats__number">{item.number}</span>
				<span class="stats__label">{item.label}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	.stats {
		background-color: var(--color-green-dark);
		padding-block: var(--space-16);
	}

	.stats__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
	}

	@media (min-width: 640px) {
		.stats__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 960px) {
		.stats__grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.stats__item {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4) var(--space-6);
		border-left: 1px solid rgba(145, 255, 0, 0.2);
	}

	.stats__item:first-child {
		border-left: none;
	}

	@media (max-width: 959px) {
		.stats__item {
			border-left: none;
			border-top: 1px solid rgba(145, 255, 0, 0.12);
			padding-block: var(--space-6);
		}
		.stats__item:first-child { border-top: none; }
	}

	.stats__number {
		display: block;
		font-family: var(--font-display);
		font-size: clamp(3rem, 6vw, 5.25rem);
		font-weight: 500;
		color: var(--color-lime);
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.stats__label {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(245, 241, 232, 0.8);
	}

	/* mobile-tighten:.stats */
	@media (max-width: 767px) {
		.stats { padding-block: var(--space-10); }
	}
</style>
