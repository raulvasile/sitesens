<script lang="ts">
	interface ProgramItem { area: string; text: string; }
	interface Props {
		data: {
			items: ProgramItem[];
			show_link?: boolean;
			link_text?: string;
			link_url?: string;
		};
	}
	let { data }: Props = $props();
</script>

<section class="program-points">
	<div class="container">
		<h2 class="program-points__title">Din programul nostru</h2>
		<ul class="program-points__list">
			{#each data.items as item}
				<li class="program-points__item">
					<span class="program-points__area">{item.area}</span>
					<p class="program-points__text">{item.text}</p>
				</li>
			{/each}
		</ul>
		{#if data.show_link !== false}
			<a href={data.link_url ?? '/despre-noi'} class="program-points__link">
				{data.link_text ?? 'Vezi programul complet'} →
			</a>
		{/if}
	</div>
</section>

<style>
	.program-points { padding-block: var(--space-16); background-color: var(--color-white); }

	.program-points__title {
		font-size: var(--text-2xl);
		margin-bottom: var(--space-8);
		text-align: center;
	}

	@media (min-width: 768px) {
		.program-points__title { font-size: var(--text-3xl); }
	}

	.program-points__list {
		list-style: none;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	@media (min-width: 640px) {
		.program-points__list { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 1024px) {
		.program-points__list { grid-template-columns: repeat(3, 1fr); }
	}

	.program-points__item {
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		border-left: 4px solid var(--color-brand-neon);
	}

	.program-points__area {
		display: block;
		font-weight: 600;
		font-size: var(--text-sm);
		color: var(--color-green-dark);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-2);
	}

	.program-points__text {
		font-size: var(--text-base);
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	.program-points__link {
		display: block;
		text-align: center;
		font-weight: 600;
		color: var(--color-green-dark);
		font-size: var(--text-base);
		transition: color var(--transition-fast);
	}

	.program-points__link:hover { color: var(--color-brand-vibrant); }
</style>
