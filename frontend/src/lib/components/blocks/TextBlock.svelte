<script lang="ts">
	import { sanitizeHtml } from '$lib/sanitize';
	import { renderStrapiBlocks } from '$lib/strapiBlocks';

	interface Props {
		data: {
			body: unknown;
			alignment?: 'left' | 'center' | 'right';
		};
	}

	let { data }: Props = $props();
</script>

<section class="text-block text-align-{data.alignment ?? 'left'}">
	<div class="container">
		<div class="text-block__content prose">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html sanitizeHtml(renderStrapiBlocks(data.body))}
		</div>
	</div>
</section>

<style>
	.text-block { padding-block: var(--space-12); background-color: var(--color-paper); }

	.text-align-center .text-block__content { margin-inline: auto; text-align: center; }
	.text-align-right .text-block__content { text-align: right; }

	.prose {
		max-width: 72ch;
		font-family: var(--font-body);
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--color-ink);
	}
	@media (min-width: 1024px) {
		/* Desktop: fill the full container width (matches other blocks like
		   Hero, CardGrid). Bump font slightly for readability at this width. */
		.prose { max-width: none; font-size: 1.1875rem; }
	}

	:global(.prose h2) {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		margin-block: var(--space-10) var(--space-4);
	}
	:global(.prose h3) {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: -0.005em;
		text-transform: uppercase;
		margin-block: var(--space-6) var(--space-3);
	}
	:global(.prose p) { margin-bottom: var(--space-4); }
	:global(.prose ul, .prose ol) { padding-left: var(--space-6); margin-bottom: var(--space-4); }
	:global(.prose li) { margin-bottom: var(--space-2); }
	:global(.prose blockquote) {
		border-left: 4px solid var(--color-lime);
		padding-left: var(--space-5);
		color: var(--color-ink-soft);
		font-family: var(--font-display);
		font-size: 1.25rem;
		margin-block: var(--space-6);
	}
	:global(.prose code) {
		background-color: var(--color-cream);
		padding: 0.1em 0.4em;
		font-family: var(--font-mono);
		font-size: 0.9em;
	}
	:global(.prose a) {
		color: var(--color-green-deep);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
