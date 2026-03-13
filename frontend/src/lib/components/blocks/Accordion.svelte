<script lang="ts">
	interface AccordionItem { title: string; content: unknown; }
	interface Props {
		data: {
			heading?: string;
			items: AccordionItem[];
		};
	}

	let { data }: Props = $props();
	let openIndex = $state<number | null>(null);

	function toggle(i: number) {
		openIndex = openIndex === i ? null : i;
	}
</script>

<section class="accordion-block">
	<div class="container">
		{#if data.heading}
			<h2 class="accordion-block__heading">{data.heading}</h2>
		{/if}
		<dl class="accordion">
			{#each data.items as item, i}
				<div class="accordion__item" class:open={openIndex === i}>
					<dt>
						<button
							class="accordion__trigger"
							aria-expanded={openIndex === i}
							onclick={() => toggle(i)}
						>
							{item.title}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class:rotated={openIndex === i}>
								<path d="M6 9l6 6 6-6" />
							</svg>
						</button>
					</dt>
					{#if openIndex === i}
						<dd class="accordion__panel">
							<div class="prose">{JSON.stringify(item.content)}</div>
						</dd>
					{/if}
				</div>
			{/each}
		</dl>
	</div>
</section>

<style>
	.accordion-block { padding-block: var(--space-12); }
	.accordion-block__heading { font-size: var(--text-2xl); margin-bottom: var(--space-8); }

	.accordion__item {
		border-bottom: 1px solid var(--color-border);
	}

	.accordion__trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		background: none;
		border: none;
		padding: var(--space-4) 0;
		font-family: var(--font-body);
		font-size: var(--text-base);
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		color: var(--color-text);
		transition: color var(--transition-fast);
	}

	.accordion__trigger:hover { color: var(--color-green-dark); }

	.accordion__trigger svg {
		flex-shrink: 0;
		transition: transform var(--transition-fast);
	}

	.accordion__trigger svg.rotated { transform: rotate(180deg); }

	.accordion__panel {
		padding-bottom: var(--space-4);
		color: var(--color-text-muted);
		font-size: var(--text-base);
		line-height: 1.7;
	}
</style>
