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

	// Rotate background colors per chapter (Direction C style)
	const palettes = [
		{ bg: 'var(--color-cream)', fg: 'var(--color-green-deep)', num: 'var(--color-green-deep)' },
		{ bg: 'var(--color-green-deep)', fg: 'var(--color-cream)', num: 'var(--color-lime)' },
		{ bg: 'var(--color-lime)', fg: 'var(--color-ink)', num: 'var(--color-ink)' },
		{ bg: 'var(--color-paper)', fg: 'var(--color-green-deep)', num: 'var(--color-green-deep)' },
		{ bg: 'var(--color-rose)', fg: 'var(--color-ink)', num: 'var(--color-ink)' },
		{ bg: 'var(--color-green-dark)', fg: 'var(--color-cream)', num: 'var(--color-lime)' }
	];
</script>

<section class="program-points">
	<div class="container">
		<div class="program-points__header">
			<h2 class="program-points__title">Din programul nostru</h2>
			{#if data.show_link !== false}
				<a href={data.link_url ?? '/despre-noi'} class="program-points__header-cta">
					{data.link_text ?? 'Vezi programul complet'}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</a>
			{/if}
		</div>

		<ul class="program-points__list">
			{#each data.items as item, i}
				{@const p = palettes[i % palettes.length]}
				<li
					class="program-points__item"
					style="background-color: {p.bg}; color: {p.fg};"
				>
					<div class="program-points__item-top">
						<span class="program-points__num" style="color: {p.num};">
							CAP. {String(i + 1).padStart(2, '0')}
						</span>
						<span class="program-points__area">{item.area}</span>
					</div>
					<p class="program-points__text">{item.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.program-points {
		padding-block: var(--space-20);
		background-color: var(--color-paper);
	}

	.program-points__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-6);
		margin-bottom: var(--space-10);
		flex-wrap: wrap;
	}

	.program-points__header-cta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		padding-bottom: 6px;
		border-bottom: 1.5px solid var(--color-ink);
		text-decoration: none;
		transition: gap var(--transition-fast), color var(--transition-fast);
	}

	.program-points__header-cta:hover {
		gap: var(--space-3);
		color: var(--color-green-deep);
	}

	.program-points__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}

	.program-points__title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
	}

	.program-points__list {
		list-style: none;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2px;
		background-color: var(--color-ink);
		border: 2px solid var(--color-ink);
	}

	@media (min-width: 640px) {
		.program-points__list { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 1024px) {
		.program-points__list { grid-template-columns: repeat(3, 1fr); }
	}

	.program-points__item {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-5) var(--space-4);
		min-height: 160px;
		outline: 2px solid transparent;
		outline-offset: -2px;
		transition: transform var(--transition-base), outline-color var(--transition-fast);
	}

	@media (min-width: 768px) {
		.program-points__item {
			gap: var(--space-4);
			padding: var(--space-8) var(--space-6);
			min-height: 220px;
		}
	}

	.program-points__item:hover {
		outline-color: var(--color-ink);
		transform: translateY(-4px);
	}

	.program-points__item-top {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.program-points__num {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.program-points__area {
		font-family: var(--font-display);
		font-size: 1.375rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
	}

	@media (min-width: 768px) {
		.program-points__area { font-size: 2.5rem; }
	}

	.program-points__text {
		font-family: var(--font-body);
		font-size: 0.875rem;
		line-height: 1.4;
		opacity: 0.85;
	}

	@media (min-width: 768px) {
		.program-points__text {
			font-size: 0.9375rem;
			line-height: 1.5;
		}
	}

	.program-points__link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		padding-bottom: 4px;
		border-bottom: 1.5px solid var(--color-ink);
		transition: gap var(--transition-fast), color var(--transition-fast);
	}

	.program-points__link:hover {
		gap: var(--space-4);
		color: var(--color-green-deep);
	}
</style>
