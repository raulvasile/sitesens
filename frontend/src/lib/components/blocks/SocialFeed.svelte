<script lang="ts">
	import { onMount } from 'svelte';
	import { sanitizeSvg } from '$lib/sanitize';

	interface SocialPlatform {
		name: string;
		handle?: string;
		url: string;
		description?: string;
		color?: string;
		embed_url?: string;
		icon_svg?: string;
		follow_cta?: string;
		order?: number;
	}

	interface Props {
		data: {
			title?: string;
			subtitle?: string;
			platforms?: SocialPlatform[];
			show_embeds?: boolean;
			posts_heading?: string;
			embed_fallback_text?: string;
			variant?: 'full' | 'compact';
		};
	}

	let { data }: Props = $props();

	const title = $derived(data.title || 'Urmărește-ne');
	const isCompact = $derived(data.variant === 'compact');
	const showEmbeds = $derived(data.show_embeds === true);

	const platforms = $derived(
		[...(data.platforms ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
	);

	function platformKey(name: string): string {
		return (name ?? '').trim().toLowerCase();
	}

	function tiktokUsername(url: string): string | null {
		const m = url.match(/tiktok\.com\/@([A-Za-z0-9._-]+)/);
		return m ? m[1] : null;
	}

	type EmbedKind = 'tiktok-blockquote' | 'iframe' | 'none';

	function embedKind(p: SocialPlatform): EmbedKind {
		const key = platformKey(p.name);
		if (key === 'facebook' || key === 'fb') return 'none';
		if (key === 'tiktok') return tiktokUsername(p.url) ? 'tiktok-blockquote' : 'none';
		return p.embed_url ? 'iframe' : 'none';
	}

	const embedPlatforms = $derived(
		platforms.map((p) => ({ ...p, _kind: embedKind(p) })).filter((p) => p._kind !== 'none')
	);

	const hasTikTok = $derived(embedPlatforms.some((p) => p._kind === 'tiktok-blockquote'));

	function embedFallback(platformName: string): string {
		const tpl = data.embed_fallback_text ?? 'Deschide pe {platform}';
		return tpl.replace('{platform}', platformName);
	}

	onMount(() => {
		if (!hasTikTok || !showEmbeds) return;
		const SRC = 'https://www.tiktok.com/embed.js';
		const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
		if (existing) existing.remove();
		const s = document.createElement('script');
		s.async = true;
		s.src = SRC;
		document.body.appendChild(s);
	});
</script>

{#if platforms.length > 0}
<section class="social-feed" class:social-feed--compact={isCompact}>
	<div class="container">
		<div class="social-feed__header">
			<h2>{title}</h2>
			{#if data.subtitle}
				<p>{data.subtitle}</p>
			{/if}
		</div>

		<div class="social-feed__cards">
			{#each platforms as platform}
				<a
					href={platform.url}
					target="_blank"
					rel="noopener noreferrer"
					class="social-feed__card"
					style="--card-color: {platform.color ?? 'var(--color-green-deep)'}"
				>
					{#if platform.icon_svg}
						<div class="social-feed__card-icon">
							{@html sanitizeSvg(platform.icon_svg)}
						</div>
					{/if}
					<div class="social-feed__card-info">
						<strong>{platform.name}</strong>
						{#if platform.handle}
							<span class="social-feed__card-handle">{platform.handle}</span>
						{/if}
						{#if platform.description && !isCompact}
							<p>{platform.description}</p>
						{/if}
					</div>
					<span class="social-feed__card-cta">
						{platform.follow_cta ?? 'Urmărește'}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M7 17L17 7M17 7H7M17 7V17" />
						</svg>
					</span>
				</a>
			{/each}
		</div>

		{#if showEmbeds && embedPlatforms.length > 0}
			<div class="social-feed__embeds">
				<h3>{data.posts_heading ?? 'Ultimele postări'}</h3>
				<div class="social-feed__embeds-grid">
					{#each embedPlatforms as platform}
						<div class="social-feed__embed">
							<h4 style="--card-color: {platform.color ?? 'var(--color-green-deep)'}">
								{platform.name}
							</h4>
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
						<p class="social-feed__embed-fallback">
							Nu se încarcă? <a href={platform.url} target="_blank" rel="noopener noreferrer">{embedFallback(platform.name)}</a>
						</p>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>
{/if}

<style>
	.social-feed {
		padding: var(--space-16) 0;
		background-color: var(--color-paper);
		color: var(--color-ink);
	}
	.social-feed--compact {
		padding: var(--space-10) 0;
	}

	.social-feed__header {
		margin-bottom: var(--space-10);
	}
	.social-feed__header h2 {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin-bottom: var(--space-3);
	}
	.social-feed__header p {
		color: var(--color-ink-soft);
		font-size: var(--text-base);
		max-width: 640px;
	}

	.social-feed__cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}

	@media (min-width: 768px) {
		.social-feed__cards {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.social-feed__card {
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
		.social-feed__card:not(:last-child) {
			border-right: 1px solid rgba(12, 81, 24, 0.15);
		}
	}

	.social-feed__card:hover {
		background-color: var(--color-cream);
		padding-left: calc(var(--space-6) + 6px);
	}

	.social-feed__card-icon {
		width: 48px;
		height: 48px;
		background: var(--card-color);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.social-feed__card-icon :global(svg) {
		width: 24px;
		height: 24px;
	}

	.social-feed__card-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.social-feed__card-info strong {
		display: block;
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: -0.005em;
		text-transform: uppercase;
		color: var(--color-ink);
	}
	.social-feed__card-handle {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: var(--card-color);
	}
	.social-feed__card-info p {
		font-size: 0.9375rem;
		color: var(--color-ink-soft);
		margin: var(--space-2) 0 0;
		line-height: 1.5;
	}

	.social-feed__card-cta {
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
		white-space: nowrap;
	}
	.social-feed__card:hover .social-feed__card-cta svg {
		transform: translate(2px, -2px);
	}
	.social-feed__card-cta svg {
		transition: var(--transition-fast);
	}

	/* ── Embeds (optional) ── */
	.social-feed__embeds {
		margin-top: var(--space-12);
	}
	.social-feed__embeds h3 {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		color: var(--color-ink);
		margin-bottom: var(--space-6);
	}
	.social-feed__embeds-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}
	@media (min-width: 768px) {
		.social-feed__embeds-grid { grid-template-columns: repeat(2, 1fr); }
	}
	.social-feed__embed h4 {
		font-family: var(--font-display);
		font-size: 1.125rem;
		text-transform: uppercase;
		color: var(--card-color);
		margin-bottom: var(--space-3);
	}
	.social-feed__embed {
		--embed-height: 500px;
		height: var(--embed-height);
		max-height: var(--embed-height);
		overflow: hidden;
		background: white;
		border: 1.5px solid var(--color-ink);
		display: block;
		width: 100%;
	}
	.social-feed__embed iframe {
		display: block;
		width: 100% !important;
		height: 100% !important;
		max-width: 100%;
		border: none;
	}
	.social-feed__embed :global(.tiktok-embed),
	.social-feed__embed :global(.tiktok-embed iframe) {
		width: 100% !important;
		max-width: 100% !important;
		min-width: 0 !important;
		height: 100% !important;
		max-height: 100% !important;
		margin: 0 !important;
	}
	.social-feed__embed-fallback {
		margin-top: var(--space-3);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.social-feed__embed-fallback a {
		color: var(--color-green-deep);
		text-decoration: underline;
	}
</style>
