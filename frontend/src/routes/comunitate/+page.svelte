<script lang="ts">
	import { onMount } from 'svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import { sanitizeSvg } from '$lib/sanitize';

	let { data } = $props();
	const page = $derived(data.page);
	const platforms = $derived(page?.platforms ?? []);
	const features = $derived(page?.features ?? []);

	function embedFallback(platformName: string): string {
		const tpl = page?.embed_fallback_text ?? 'Deschide pe {platform}';
		return tpl.replace('{platform}', platformName);
	}

	function platformKey(name: string): string {
		return (name ?? '').trim().toLowerCase();
	}

	/** Extract TikTok username (@handle without the @) from a profile URL. */
	function tiktokUsername(url: string): string | null {
		const m = url.match(/tiktok\.com\/@([A-Za-z0-9._-]+)/);
		return m ? m[1] : null;
	}

	/**
	 * Decide which embed strategy a platform supports:
	 *  - 'tiktok-blockquote': TikTok official creator embed (blockquote + embed.js)
	 *  - 'iframe': generic iframe via `embed_url` set in CMS
	 *  - 'none': platform card only (Facebook closed embeds for 3rd party domains)
	 */
	type EmbedKind = 'tiktok-blockquote' | 'iframe' | 'none';

	function embedKind(p: { name: string; url: string; embed_url?: string }): EmbedKind {
		const key = platformKey(p.name);
		if (key === 'facebook' || key === 'fb') return 'none';
		if (key === 'tiktok') {
			return tiktokUsername(p.url) ? 'tiktok-blockquote' : 'none';
		}
		return p.embed_url ? 'iframe' : 'none';
	}

	const embeddablePlatforms = $derived(
		platforms.map((p: any) => ({ ...p, _kind: embedKind(p) })).filter((p: any) => p._kind !== 'none')
	);

	const hasTikTok = $derived(embeddablePlatforms.some((p: any) => p._kind === 'tiktok-blockquote'));

	/**
	 * Load TikTok's embed.js exactly once and re-trigger parsing on
	 * subsequent client-side navigations (the script auto-parses any
	 * <blockquote class="tiktok-embed"> it finds in the DOM).
	 */
	onMount(() => {
		if (!hasTikTok) return;
		const SRC = 'https://www.tiktok.com/embed.js';
		const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
		if (existing) {
			// Re-load: removing & re-adding triggers fresh parsing of new blockquotes.
			existing.remove();
		}
		const s = document.createElement('script');
		s.async = true;
		s.src = SRC;
		document.body.appendChild(s);
	});
</script>

<SeoHead
	title={page?.seo?.meta_title ?? page?.title ?? 'Comunitate'}
	description={page?.seo?.meta_description ?? page?.subtitle ?? 'Urmărește activitatea SENS pe rețelele sociale.'}
/>

<div class="container page-header">
	<Breadcrumb items={[{ label: page?.title ?? 'Comunitate' }]} />
	<h1>{page?.title ?? 'Comunitate'}</h1>
	{#if page?.subtitle}
		<p class="page-subtitle">{page.subtitle}</p>
	{/if}
</div>

<div class="container social-page">
	<div class="social-cards">
		{#each platforms as platform}
			<a
				href={platform.url}
				target="_blank"
				rel="noopener noreferrer"
				class="social-card"
				style="--card-color: {platform.color ?? 'var(--color-green-deep)'}"
			>
				{#if platform.icon_svg}
					<div class="social-card__icon-wrap">
						{@html sanitizeSvg(platform.icon_svg)}
					</div>
				{/if}
				<div class="social-card__info">
					<h2>{platform.name}</h2>
					{#if platform.handle}<span class="social-card__handle">{platform.handle}</span>{/if}
					{#if platform.description}<p>{platform.description}</p>{/if}
				</div>
				<span class="social-card__cta">
					{platform.follow_cta ?? 'Urmărește'}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M7 17L17 7M17 7H7M17 7V17" />
					</svg>
				</span>
			</a>
		{/each}
	</div>

	{#if embeddablePlatforms.length > 0}
		<section class="social-feeds">
			<h2>{page?.posts_heading ?? 'Ultimele postări'}</h2>
			<div class="social-feeds__grid">
				{#each embeddablePlatforms as platform}
					<div class="social-feeds__column">
						<h3 style="--card-color: {platform.color ?? 'var(--color-green-deep)'}">
							{platform.name}
						</h3>
						<div class="social-feeds__embed">
							{#if platform._kind === 'tiktok-blockquote'}
								{@const username = tiktokUsername(platform.url)}
								{#if username}
									<blockquote
										class="tiktok-embed"
										cite={`https://www.tiktok.com/@${username}`}
										data-unique-id={username}
										data-embed-from="embed_page"
										data-embed-type="creator"
										style="max-width:780px; min-width:288px;"
									>
										<section>
											<a target="_blank" rel="noopener noreferrer" href={`https://www.tiktok.com/@${username}?refer=creator_embed`}>
												@{username}
											</a>
										</section>
									</blockquote>
								{/if}
							{:else if platform._kind === 'iframe'}
								<iframe
									src={platform.embed_url}
									width="500"
									style="border:none;overflow:hidden"
									scrolling="no"
									frameborder="0"
									title={`Feed ${platform.name}`}
									loading="lazy"
								></iframe>
							{/if}
						</div>
						<p class="social-feeds__fallback">
							Nu se încarcă? <a href={platform.url} target="_blank" rel="noopener noreferrer">{embedFallback(platform.name)}</a>
						</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if features.length > 0}
		<section class="social-why">
			<h2>{page?.features_heading ?? 'De ce să ne urmărești?'}</h2>
			<div class="social-why__grid">
				{#each features as f}
					<div class="social-why__item">
						{#if f.emoji}<span class="social-why__emoji">{f.emoji}</span>{/if}
						<h3>{f.title}</h3>
						<p>{f.description}</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.page-header {
		padding-block: var(--space-10) var(--space-4);
	}
	.page-header h1 {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 5rem);
		font-weight: 500;
		letter-spacing: -0.015em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin-top: var(--space-5);
	}
	.page-subtitle {
		color: var(--color-ink-soft);
		font-size: var(--text-lg);
		max-width: 640px;
		margin-top: var(--space-4);
	}

	.social-page {
		padding-bottom: var(--space-16);
	}

	/* Cards grid */
	.social-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
		margin-bottom: var(--space-12);
	}
	@media (min-width: 768px) {
		.social-cards { grid-template-columns: repeat(3, 1fr); }
	}

	.social-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-8) var(--space-6);
		background: transparent;
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: var(--color-ink);
		transition: padding-left var(--transition-fast), background-color var(--transition-fast);
		position: relative;
	}
	@media (min-width: 768px) {
		.social-card:not(:last-child) {
			border-right: 1px solid rgba(12, 81, 24, 0.15);
		}
	}
	.social-card:hover {
		background-color: var(--color-cream);
		padding-left: calc(var(--space-6) + 6px);
	}

	.social-card__icon-wrap {
		width: 48px;
		height: 48px;
		background: var(--card-color);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.social-card__icon-wrap :global(svg) {
		width: 24px;
		height: 24px;
	}

	.social-card__info h2 {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: -0.005em;
		text-transform: uppercase;
		color: var(--color-ink);
		margin: 0;
	}
	.social-card__handle {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: var(--card-color);
	}
	.social-card__info p {
		font-size: 0.9375rem;
		color: var(--color-ink-soft);
		margin: var(--space-2) 0 0;
		line-height: 1.5;
	}

	.social-card__cta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		margin-top: auto;
		padding-top: var(--space-4);
		border-top: 1px solid rgba(12, 81, 24, 0.08);
	}
	.social-card:hover .social-card__cta svg {
		transform: translate(2px, -2px);
	}
	.social-card__cta svg {
		transition: var(--transition-fast);
	}

	/* Feeds section */
	.social-feeds {
		margin-bottom: var(--space-16);
	}
	.social-feeds > h2 {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		color: var(--color-ink);
		margin-bottom: var(--space-8);
	}
	.social-feeds__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}
	@media (min-width: 768px) {
		.social-feeds__grid { grid-template-columns: repeat(2, 1fr); }
	}
	.social-feeds__column h3 {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 1.25rem;
		text-transform: uppercase;
		color: var(--card-color, var(--color-ink));
		margin-bottom: var(--space-3);
	}
	.social-feeds__embed {
		--embed-height: 500px;
		/* Hard cap so neither Instagram nor TikTok can overflow.
		   Both embeds set their own inline heights from JS, but the
		   container clips them to the same visual height. */
		height: var(--embed-height);
		max-height: var(--embed-height);
		overflow: hidden;
		background: white;
		border: 1.5px solid var(--color-ink);
		display: block;
		width: 100%;
	}
	.social-feeds__embed iframe {
		display: block;
		width: 100% !important;
		height: 100% !important;
		max-width: 100%;
		border: none;
	}
	/* TikTok wraps its embed in <blockquote class="tiktok-embed"> which then
	   becomes an iframe via embed.js. Make both fill the container. */
	.social-feeds__embed :global(.tiktok-embed),
	.social-feeds__embed :global(.tiktok-embed iframe) {
		width: 100% !important;
		max-width: 100% !important;
		min-width: 0 !important;
		height: 100% !important;
		max-height: 100% !important;
		margin: 0 !important;
	}
	.social-feeds__fallback {
		margin-top: var(--space-3);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.social-feeds__fallback a {
		color: var(--color-green-deep);
		text-decoration: underline;
	}

	/* Why section */
	.social-why {
		padding: var(--space-12) var(--space-8);
		background: var(--color-cream);
		border: 1.5px solid var(--color-ink);
	}
	.social-why h2 {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		color: var(--color-ink);
		margin-bottom: var(--space-8);
	}
	.social-why__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}
	@media (min-width: 768px) {
		.social-why__grid { grid-template-columns: repeat(3, 1fr); }
	}
	.social-why__emoji {
		font-size: 2rem;
		display: block;
		margin-bottom: var(--space-3);
	}
	.social-why__item h3 {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 500;
		text-transform: uppercase;
		color: var(--color-ink);
		margin-bottom: var(--space-2);
	}
	.social-why__item p {
		font-size: 0.9375rem;
		color: var(--color-ink-soft);
		line-height: 1.5;
	}
</style>
