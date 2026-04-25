<script lang="ts">
	interface TimelineItem {
		id?: number;
		year: string;
		body: string;
		is_current?: boolean;
		current_label?: string;
	}

	interface Props {
		data: {
			kicker?: string;
			heading: string;
			heading_italic?: string;
			items: TimelineItem[];
			background_color?: 'cream' | 'paper' | 'green-deep' | 'green-dark';
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'cream');
	const items = $derived(data.items ?? []);
</script>

<section class="timeline timeline--{bg}">
	<div class="container">
		{#if data.kicker}
			<div class="timeline__kicker">— {data.kicker}</div>
		{/if}

		<h2 class="timeline__heading">
			<span>{data.heading}</span>
			{#if data.heading_italic}
				<span class="timeline__heading-italic"> {data.heading_italic}</span>
			{/if}
		</h2>

		<ol class="timeline__list">
			{#each items as item (item.id ?? item.year)}
				<li class="timeline__row" class:is-current={item.is_current}>
					<div class="timeline__year">
						<span>{item.year}</span>
						{#if item.is_current && item.current_label}
							<span class="timeline__current">· {item.current_label}</span>
						{/if}
					</div>
					<p class="timeline__body">{item.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.timeline {
		padding-block: var(--space-24);
	}
	.timeline--cream { background-color: var(--color-cream); color: var(--color-ink); }
	.timeline--paper { background-color: var(--color-paper); color: var(--color-ink); }
	.timeline--green-deep { background-color: var(--color-green-deep); color: var(--color-cream); }
	.timeline--green-dark { background-color: var(--color-green-dark); color: var(--color-cream); }

	.timeline__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}

	.timeline__heading {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 5rem);
		line-height: 0.95;
		letter-spacing: -0.02em;
		font-weight: 500;
		margin: 0 0 var(--space-16);
	}
	.timeline__heading-italic {
		font-style: italic;
	}

	.timeline--green-deep .timeline__heading-italic,
	.timeline--green-dark .timeline__heading-italic {
		color: var(--color-lime);
	}

	.timeline__list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.timeline__row {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: var(--space-12);
		padding-block: var(--space-8);
		border-top: 1px solid rgba(12, 81, 24, 0.15);
		align-items: center;
	}

	.timeline--green-deep .timeline__row,
	.timeline--green-dark .timeline__row {
		border-top-color: rgba(245, 241, 232, 0.18);
	}

	.timeline__year {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		line-height: 1;
		font-weight: 500;
		color: var(--color-ink);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.timeline--green-deep .timeline__year,
	.timeline--green-dark .timeline__year {
		color: var(--color-cream);
	}

	.timeline__row.is-current .timeline__year {
		color: var(--color-green-deep);
	}

	.timeline--green-deep .timeline__row.is-current .timeline__year,
	.timeline--green-dark .timeline__row.is-current .timeline__year {
		color: var(--color-lime);
	}

	.timeline__current {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-green-deep);
	}

	.timeline--green-deep .timeline__current,
	.timeline--green-dark .timeline__current {
		color: var(--color-lime);
	}

	.timeline__body {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 1.6vw, 1.375rem);
		line-height: 1.45;
		font-weight: 400;
		max-width: 780px;
		margin: 0;
	}

	@media (max-width: 720px) {
		.timeline__row {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}
	}
</style>
