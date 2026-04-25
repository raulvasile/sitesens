<script lang="ts">
	import { sanitizeHtml } from '$lib/sanitize';
	import { renderStrapiBlocks } from '$lib/strapiBlocks';

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
							<span>{item.title}</span>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class:rotated={openIndex === i} aria-hidden="true">
								<path d="M6 9l6 6 6-6" />
							</svg>
						</button>
					</dt>
					{#if openIndex === i}
						<dd class="accordion__panel">
							<div class="accordion__content">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html sanitizeHtml(renderStrapiBlocks(item.content))}
							</div>
						</dd>
					{/if}
				</div>
			{/each}
		</dl>
	</div>
</section>

<style>
	.accordion-block {
		padding-block: var(--space-12);
		background-color: var(--color-paper);
	}
	@media (min-width: 768px) {
		.accordion-block { padding-block: var(--space-20); }
	}

	.accordion-block__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin: 0 0 var(--space-8);
	}

	.accordion {
		border-top: 2px solid var(--color-ink);
	}

	.accordion__item {
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}

	.accordion__trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		background: none;
		border: none;
		padding: var(--space-5) 0;
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 2vw, 1.375rem);
		font-weight: 500;
		letter-spacing: -0.005em;
		cursor: pointer;
		text-align: left;
		color: var(--color-ink);
		transition: color var(--transition-fast), padding-inline var(--transition-fast);
	}

	@media (hover: hover) {
		.accordion__trigger:hover {
			color: var(--color-green-deep);
			padding-inline: var(--space-3);
		}
	}

	.accordion__item.open .accordion__trigger {
		color: var(--color-green-deep);
	}

	.accordion__trigger svg {
		flex-shrink: 0;
		color: var(--color-green-deep);
		transition: transform var(--transition-fast);
	}

	.accordion__trigger svg.rotated {
		transform: rotate(180deg);
	}

	.accordion__panel {
		padding: 0 0 var(--space-5);
		margin: 0;
	}

	.accordion__content {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-ink-soft);
		max-width: 72ch;
	}

	.accordion__content :global(p) { margin: 0 0 var(--space-3); }
	.accordion__content :global(p:last-child) { margin-bottom: 0; }
	.accordion__content :global(ul),
	.accordion__content :global(ol) { padding-left: var(--space-6); margin: 0 0 var(--space-3); }
	.accordion__content :global(li) { margin-bottom: var(--space-2); }
	.accordion__content :global(a) {
		color: var(--color-green-deep);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.accordion__content :global(strong) { color: var(--color-ink); }
	.accordion__content :global(blockquote) {
		border-left: 3px solid var(--color-lime);
		padding-left: var(--space-4);
		margin: var(--space-3) 0;
		font-family: var(--font-display);
		font-size: 1.125rem;
		color: var(--color-ink);
	}
</style>
