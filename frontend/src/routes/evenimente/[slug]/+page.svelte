<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const event = $derived(data.event);
	const isPast = $derived(data.isPast);

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('ro-RO', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatTime(dateStr: string) {
		return new Date(dateStr).toLocaleTimeString('ro-RO', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function badgeClass(type: string) {
		const map: Record<string, string> = {
			dezbatere: 'badge-green',
			actiune: 'badge-orange',
			mars: 'badge-green',
			online: 'badge-muted'
		};
		return map[type] || 'badge-muted';
	}

	function typeLabel(type: string) {
		const map: Record<string, string> = {
			dezbatere: 'Dezbatere',
			actiune: 'Acțiune',
			mars: 'Marș',
			online: 'Online'
		};
		return map[type] || type;
	}

	// Simple Strapi Blocks renderer
	function renderBlocks(blocks: unknown): string {
		if (!Array.isArray(blocks)) return '';
		return blocks.map(renderBlock).join('');
	}

	function renderBlock(block: Record<string, unknown>): string {
		switch (block.type) {
			case 'paragraph':
				return `<p>${renderInline(block.children as unknown[])}</p>`;
			case 'heading': {
				const level = block.level ?? 2;
				return `<h${level}>${renderInline(block.children as unknown[])}</h${level}>`;
			}
			case 'list': {
				const tag = block.format === 'ordered' ? 'ol' : 'ul';
				const items = (block.children as unknown[])
					.map((li: any) => `<li>${renderInline(li.children)}</li>`)
					.join('');
				return `<${tag}>${items}</${tag}>`;
			}
			case 'quote':
				return `<blockquote>${renderInline(block.children as unknown[])}</blockquote>`;
			default:
				return '';
		}
	}

	function renderInline(children: unknown[]): string {
		if (!Array.isArray(children)) return '';
		return children
			.map((child: any) => {
				let text: string = child.text ?? '';
				if (child.bold) text = `<strong>${text}</strong>`;
				if (child.italic) text = `<em>${text}</em>`;
				if (child.underline) text = `<u>${text}</u>`;
				if (child.type === 'link') {
					return `<a href="${child.url}" target="_blank" rel="noopener">${renderInline(child.children)}</a>`;
				}
				return text;
			})
			.join('');
	}

	function generateICalUrl(ev: typeof event) {
		const start = new Date(ev.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
		const end = ev.end_date
			? new Date(ev.end_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
			: start;
		const params = new URLSearchParams({
			action: 'TEMPLATE',
			text: ev.title,
			dates: `${start}/${end}`,
			location: ev.location_name ?? '',
			details: `Eveniment Partidul SENS`
		});
		return `https://calendar.google.com/calendar/render?${params.toString()}`;
	}
</script>

<SeoHead
	title={event.seo?.meta_title ?? event.title}
	description={event.seo?.meta_description ?? `${event.title} — eveniment Partidul SENS`}
/>

<!-- ═══════ HERO ═══════ -->
<section
	class="event-hero"
	style={event.cover_image?.url ? `--bg: url('${getStrapiMediaUrl(event.cover_image.url)}')` : ''}
>
	<div class="event-hero__overlay"></div>
	<div class="container event-hero__content">
		<nav aria-label="Breadcrumb" class="breadcrumb breadcrumb--light">
			<a href="/">Acasă</a> / <a href="/evenimente">Evenimente</a> / <span>{event.title}</span>
		</nav>
		<div class="event-hero__badges">
			<span class="badge {badgeClass(event.event_type)}">{typeLabel(event.event_type)}</span>
			{#if isPast}
				<span class="badge badge-muted">Încheiat</span>
			{/if}
		</div>
		<h1 class="event-hero__title">{event.title}</h1>
	</div>
</section>

<div class="container event-layout">
	<!-- ═══════ CONȚINUT ═══════ -->
	<main class="event-content">
		{#if event.description}
			<div class="rich-text">
				{@html renderBlocks(event.description)}
			</div>
		{/if}

		<!-- Social posts (for past events) -->
		{#if isPast && event.social_posts?.length}
			<section class="social-posts">
				<h2>Postări social media</h2>
				<div class="social-posts__grid">
					{#each event.social_posts as post}
						<a href={post.url} target="_blank" rel="noopener" class="social-post-link">
							<span class="social-post-link__platform">{post.platform}</span>
							<span>Vezi postarea →</span>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</main>

	<!-- ═══════ SIDEBAR INFO ═══════ -->
	<aside class="event-sidebar">
		<div class="info-box">
			<h2>Detalii eveniment</h2>

			<div class="info-row">
				<span class="info-icon">📅</span>
				<div>
					<strong>Data</strong>
					<p>{formatDate(event.start_date)}</p>
				</div>
			</div>

			<div class="info-row">
				<span class="info-icon">🕒</span>
				<div>
					<strong>Ora</strong>
					<p>
						{formatTime(event.start_date)}
						{#if event.end_date}
							— {formatTime(event.end_date)}
						{/if}
					</p>
				</div>
			</div>

			{#if event.location_name}
				<div class="info-row">
					<span class="info-icon">📍</span>
					<div>
						<strong>Locație</strong>
						<p>{event.location_name}</p>
					</div>
				</div>
			{/if}

			{#if event.max_participants}
				<div class="info-row">
					<span class="info-icon">👥</span>
					<div>
						<strong>Capacitate</strong>
						<p>{event.max_participants} participanți</p>
					</div>
				</div>
			{/if}

			{#if !isPast}
				<div class="info-actions">
					{#if event.registration_open}
						<a href="/inscrie-te?event={event.slug}" class="btn btn-primary btn-block">
							Înscrie-te
						</a>
					{:else}
						<button class="btn btn-muted btn-block" disabled>
							Înscrieri închise
						</button>
					{/if}
					<a
						href={generateICalUrl(event)}
						target="_blank"
						rel="noopener"
						class="btn btn-secondary btn-block"
					>
						📅 Adaugă în calendar
					</a>
				</div>
			{/if}
		</div>

		<!-- Share -->
		<div class="share-box">
			<h3>Distribuie evenimentul</h3>
			<div class="share-icons">
				<a
					href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(`https://partidulsens.ro/evenimente/${event.slug}`)}"
					target="_blank"
					rel="noopener"
					aria-label="Distribuie pe Facebook"
					class="share-btn"
				>FB</a>
				<a
					href="https://twitter.com/intent/tweet?url={encodeURIComponent(`https://partidulsens.ro/evenimente/${event.slug}`)}&text={encodeURIComponent(event.title)}"
					target="_blank"
					rel="noopener"
					aria-label="Distribuie pe X"
					class="share-btn"
				>X</a>
				<a
					href="https://api.whatsapp.com/send?text={encodeURIComponent(`${event.title} https://partidulsens.ro/evenimente/${event.slug}`)}"
					target="_blank"
					rel="noopener"
					aria-label="Distribuie pe WhatsApp"
					class="share-btn"
				>WA</a>
			</div>
		</div>
	</aside>
</div>

<style>
	/* ── Hero ── */
	.event-hero {
		position: relative;
		min-height: 340px;
		display: flex;
		align-items: flex-end;
		background-color: var(--color-green-dark);
		background-image: var(--bg);
		background-size: cover;
		background-position: center;
		padding-block: var(--space-16) var(--space-10);
		margin-top: calc(-1 * var(--navbar-height));
		padding-top: calc(var(--navbar-height) + var(--space-8));
	}
	.event-hero__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 56, 39, 0.92) 0%, rgba(0, 56, 39, 0.5) 100%);
	}
	.event-hero__content {
		position: relative;
		z-index: 1;
		color: var(--color-white);
	}
	.breadcrumb--light a { color: rgba(255, 255, 255, 0.7); }
	.breadcrumb--light a:hover { color: var(--color-white); }
	.breadcrumb--light span { color: var(--color-white); }
	.event-hero__badges {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		margin-top: var(--space-4);
	}
	.event-hero__title {
		font-size: var(--text-2xl);
		line-height: 1.2;
	}
	@media (min-width: 768px) {
		.event-hero__title { font-size: var(--text-4xl); }
	}

	/* ── Layout ── */
	.event-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		padding-block: var(--space-10) var(--space-16);
	}
	@media (min-width: 768px) {
		.event-layout { grid-template-columns: 1fr 340px; }
	}

	/* ── Content ── */
	.event-content {
		min-width: 0;
	}
	.rich-text :global(p) {
		margin-bottom: var(--space-4);
		line-height: 1.7;
		color: var(--color-text);
	}
	.rich-text :global(h2) {
		font-size: var(--text-xl);
		margin-top: var(--space-8);
		margin-bottom: var(--space-4);
		color: var(--color-green-dark);
	}
	.rich-text :global(ul),
	.rich-text :global(ol) {
		padding-left: 1.5rem;
		margin-bottom: var(--space-4);
	}
	.rich-text :global(li) {
		margin-bottom: var(--space-2);
		line-height: 1.6;
	}
	.rich-text :global(blockquote) {
		border-left: 4px solid var(--color-green-leaf);
		padding-left: var(--space-4);
		margin-block: var(--space-6);
		color: var(--color-text-muted);
		font-style: italic;
	}

	/* ── Social posts ── */
	.social-posts {
		margin-top: var(--space-10);
	}
	.social-posts h2 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-4);
		color: var(--color-green-dark);
	}
	.social-posts__grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.social-post-link {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--color-text);
		transition: all var(--transition-fast);
	}
	.social-post-link:hover {
		background-color: var(--color-white);
		box-shadow: var(--shadow-sm);
		color: var(--color-green-dark);
	}
	.social-post-link__platform {
		font-weight: 600;
		text-transform: capitalize;
	}

	/* ── Sidebar ── */
	.info-box {
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		margin-bottom: var(--space-6);
	}
	.info-box h2 {
		font-size: var(--text-lg);
		color: var(--color-green-dark);
		margin-bottom: var(--space-5);
	}
	.info-row {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		margin-bottom: var(--space-4);
	}
	.info-icon {
		font-size: var(--text-lg);
		flex-shrink: 0;
		margin-top: 2px;
	}
	.info-row strong {
		display: block;
		font-size: var(--text-sm);
		color: var(--color-text);
		margin-bottom: 2px;
	}
	.info-row p {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
	.info-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-top: var(--space-6);
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-border);
	}
	.btn-block { width: 100%; text-align: center; }
	.btn-muted {
		background-color: var(--color-bg);
		color: var(--color-text-muted);
		border: 1px solid var(--color-border);
		cursor: not-allowed;
	}

	/* ── Share ── */
	.share-box {
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		padding: var(--space-6);
	}
	.share-box h3 {
		font-size: var(--text-base);
		color: var(--color-green-dark);
		margin-bottom: var(--space-4);
	}
	.share-icons {
		display: flex;
		gap: var(--space-3);
	}
	.share-btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		background-color: var(--color-white);
		color: var(--color-text-muted);
		font-weight: 700;
		font-size: var(--text-xs);
		text-decoration: none;
		transition: all var(--transition-fast);
	}
	.share-btn:hover {
		background-color: var(--color-green-dark);
		color: var(--color-white);
	}
</style>
