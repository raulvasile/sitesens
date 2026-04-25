/**
 * Render Strapi v5 "blocks" rich-text JSON to HTML.
 *
 * Used by anything that stores rich text as a `blocks` field (e.g.
 * accordion items, text-block bodies, event descriptions). The output
 * MUST be passed through `sanitizeHtml` before being inserted with
 * `{@html ...}` — this renderer escapes text but trusts its own tag
 * structure, not external sanitization.
 */
import { sanitizeUrl } from './sanitize';

type Node = Record<string, unknown>;

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function renderInline(children: unknown): string {
	if (!Array.isArray(children)) return '';
	return children
		.map((child) => {
			const c = child as Node;
			if (c.type === 'link') {
				const href = sanitizeUrl(c.url as string);
				if (!href) return renderInline(c.children);
				return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${renderInline(c.children)}</a>`;
			}
			let text = escapeHtml((c.text as string) ?? '');
			if (c.bold) text = `<strong>${text}</strong>`;
			if (c.italic) text = `<em>${text}</em>`;
			if (c.underline) text = `<u>${text}</u>`;
			if (c.code) text = `<code>${text}</code>`;
			return text;
		})
		.join('');
}

function renderBlock(block: Node): string {
	switch (block.type) {
		case 'paragraph':
			return `<p>${renderInline(block.children)}</p>`;
		case 'heading': {
			const level = Math.min(Math.max(Number(block.level) || 2, 1), 6);
			return `<h${level}>${renderInline(block.children)}</h${level}>`;
		}
		case 'list': {
			const tag = block.format === 'ordered' ? 'ol' : 'ul';
			const items = (block.children as unknown[])
				.map((li) => `<li>${renderInline((li as Node).children)}</li>`)
				.join('');
			return `<${tag}>${items}</${tag}>`;
		}
		case 'quote':
			return `<blockquote>${renderInline(block.children)}</blockquote>`;
		case 'code':
			return `<pre><code>${escapeHtml(((block.children as unknown[])?.[0] as Node)?.text as string ?? '')}</code></pre>`;
		default:
			return '';
	}
}

/** Render an array of Strapi v5 block nodes to a single HTML string. */
export function renderStrapiBlocks(blocks: unknown): string {
	if (!Array.isArray(blocks)) return '';
	return blocks.map((b) => renderBlock(b as Node)).join('');
}
