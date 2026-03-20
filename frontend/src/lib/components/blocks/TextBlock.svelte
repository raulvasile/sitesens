<script lang="ts">
	import { sanitizeHtml, sanitizeUrl } from '$lib/sanitize';

	interface Props {
		data: {
			body: unknown;
			alignment?: 'left' | 'center' | 'right';
		};
	}

	let { data }: Props = $props();

	// Strapi Blocks renderer simplu — suportă paragraphs, headings, lists
	function renderBlocks(blocks: unknown): string {
		if (!Array.isArray(blocks)) return '';
		return blocks.map(renderBlock).join('');
	}

	function renderBlock(block: Record<string, unknown>): string {
		switch (block.type) {
			case 'paragraph':
				return `<p>${renderInline(block.children as unknown[])}</p>`;
			case 'heading': {
				const level = Math.min(Math.max(Number(block.level) || 2, 1), 6);
				return `<h${level}>${renderInline(block.children as unknown[])}</h${level}>`;
			}
			case 'list': {
				const tag = block.format === 'ordered' ? 'ol' : 'ul';
				return `<${tag}>${(block.children as unknown[]).map((item) => `<li>${renderInline((item as Record<string, unknown>).children as unknown[])}</li>`).join('')}</${tag}>`;
			}
			case 'quote':
				return `<blockquote>${renderInline(block.children as unknown[])}</blockquote>`;
			default:
				return '';
		}
	}

	function escapeHtml(str: string): string {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function renderInline(children: unknown[]): string {
		if (!Array.isArray(children)) return '';
		return children
			.map((child) => {
				const c = child as Record<string, unknown>;
				if (c.type === 'link') {
					const href = sanitizeUrl(c.url as string);
					if (!href) return renderInline(c.children as unknown[]);
					return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${renderInline(c.children as unknown[])}</a>`;
				}
				let text = escapeHtml(c.text as string || '');
				if (c.bold) text = `<strong>${text}</strong>`;
				if (c.italic) text = `<em>${text}</em>`;
				if (c.underline) text = `<u>${text}</u>`;
				if (c.code) text = `<code>${text}</code>`;
				return text;
			})
			.join('');
	}
</script>

<section class="text-block text-align-{data.alignment ?? 'left'}">
	<div class="container">
		<div class="text-block__content prose">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html sanitizeHtml(renderBlocks(data.body))}
		</div>
	</div>
</section>

<style>
	.text-block { padding-block: var(--space-12); }

	.text-align-center .text-block__content { margin-inline: auto; text-align: center; }
	.text-align-right .text-block__content { text-align: right; }

	.prose {
		max-width: 72ch;
		font-size: var(--text-base);
		line-height: 1.8;
	}

	:global(.prose h2) { font-size: var(--text-2xl); margin-block: var(--space-8) var(--space-4); }
	:global(.prose h3) { font-size: var(--text-xl); margin-block: var(--space-6) var(--space-3); }
	:global(.prose p) { margin-bottom: var(--space-4); }
	:global(.prose ul, .prose ol) { padding-left: var(--space-6); margin-bottom: var(--space-4); }
	:global(.prose li) { margin-bottom: var(--space-2); }
	:global(.prose blockquote) {
		border-left: 4px solid var(--color-green-leaf);
		padding-left: var(--space-4);
		color: var(--color-text-muted);
		font-style: italic;
		margin-block: var(--space-6);
	}
	:global(.prose code) {
		background-color: var(--color-bg);
		padding: 0.1em 0.4em;
		border-radius: var(--radius-sm);
		font-size: 0.9em;
	}
	:global(.prose a) { color: var(--color-green-dark); text-decoration: underline; }
</style>
