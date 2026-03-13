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
	.stats { padding-block: var(--space-12); }
	.stats__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: var(--space-8);
		text-align: center;
	}
	.stats__number {
		display: block;
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 700;
		color: var(--color-green-dark);
	}
	.stats__label {
		display: block;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-2);
	}
</style>
