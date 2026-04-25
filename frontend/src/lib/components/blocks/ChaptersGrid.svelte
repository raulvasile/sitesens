<script lang="ts">
	interface ChapterItem {
		id?: number;
		name: string;
		code?: string;
		url?: string;
	}

	interface Props {
		data: {
			kicker?: string;
			heading: string;
			cta_text?: string;
			cta_link?: string;
			items: ChapterItem[];
			background_color?: 'green-dark' | 'green-deep' | 'ink';
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'green-dark');
	const items = $derived(data.items ?? []);
</script>

<section class="chapters chapters--{bg}">
	<div class="container">
		<header class="chapters__header">
			<div>
				{#if data.kicker}
					<div class="chapters__kicker">— {data.kicker}</div>
				{/if}
				<h2 class="chapters__heading">{data.heading}</h2>
			</div>
			{#if data.cta_text && data.cta_link}
				<a href={data.cta_link} class="chapters__cta">
					{data.cta_text} <span aria-hidden="true">→</span>
				</a>
			{/if}
		</header>

		<div class="chapters__grid">
			{#each items as item, i (item.id ?? item.name)}
				{@const code = (item.code ?? `FIL.${String(i + 1).padStart(2, '0')}`).toUpperCase()}
				{#if item.url}
					<a class="chapters__cell" href={item.url}>
						<div class="chapters__code">{code}</div>
						<div class="chapters__name">{item.name}</div>
					</a>
				{:else}
					<div class="chapters__cell chapters__cell--static">
						<div class="chapters__code">{code}</div>
						<div class="chapters__name">{item.name}</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<style>
	.chapters {
		padding-block: var(--space-24);
	}
	.chapters--green-dark { background-color: var(--color-green-dark); color: var(--color-cream); }
	.chapters--green-deep { background-color: var(--color-green-deep); color: var(--color-cream); }
	.chapters--ink { background-color: var(--color-ink); color: var(--color-cream); }

	.chapters__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-6);
		margin-bottom: var(--space-10);
		flex-wrap: wrap;
	}

	.chapters__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}

	.chapters__heading {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 5vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		margin: 0;
	}

	.chapters__cta {
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-lime);
		text-decoration: none;
		transition: opacity var(--transition-fast);
	}
	.chapters__cta:hover { opacity: 0.75; }

	.chapters__grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 2px;
		background-color: rgba(145, 255, 0, 0.15);
	}

	@media (max-width: 1100px) {
		.chapters__grid { grid-template-columns: repeat(4, 1fr); }
	}
	@media (max-width: 720px) {
		.chapters__grid { grid-template-columns: repeat(2, 1fr); }
	}

	.chapters__cell {
		background-color: var(--color-green-dark);
		padding: var(--space-5) var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		text-decoration: none;
		color: inherit;
		transition: background-color var(--transition-fast);
	}
	.chapters--green-deep .chapters__cell { background-color: var(--color-green-deep); }
	.chapters--ink .chapters__cell { background-color: var(--color-ink); }

	.chapters__cell:hover { background-color: var(--color-green-deep); }
	.chapters--green-deep .chapters__cell:hover { background-color: var(--color-green-dark); }
	.chapters--ink .chapters__cell:hover { background-color: var(--color-green-deep); }

	.chapters__code {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.14em;
		opacity: 0.5;
	}

	.chapters__name {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-lime);
		line-height: 1.1;
	}

	/* mobile-tighten:.chapters */
	@media (max-width: 767px) {
		.chapters { padding-block: var(--space-10); }
	}
</style>
