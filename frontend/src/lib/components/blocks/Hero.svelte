<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import { onMount } from 'svelte';

	interface RotatingWords {
		words: string[] | string;
		interval_ms?: number;
		highlight?: boolean;
	}
	interface FeaturedLink {
		label: string;
		title: string;
		url: string;
		icon?: string;
		auto_next_event?: boolean;
	}

	interface Props {
		data: {
			title: string;
			subtitle?: string;
			cta_text?: string;
			cta_link?: string;
			cta_secondary_text?: string;
			cta_secondary_link?: string;
			background_image?: { url: string; alternativeText?: string } | null;
			variant?: 'default' | 'compact';
			breadcrumb?: { label: string; href?: string }[];
			rotating_words?: RotatingWords | null;
			featured_link?: FeaturedLink | null;
		};
	}

	let { data }: Props = $props();
	const isCompact = $derived(data.variant === 'compact');

	// Parse words (can arrive as array or JSON-stringified array)
	const words = $derived.by(() => {
		const raw = data.rotating_words?.words;
		if (!raw) return [] as string[];
		if (Array.isArray(raw)) return raw.filter((w) => typeof w === 'string' && w.trim().length > 0);
		if (typeof raw === 'string') {
			try {
				const parsed = JSON.parse(raw);
				return Array.isArray(parsed) ? parsed : [];
			} catch {
				// comma-separated fallback
				return raw.split(',').map((s) => s.trim()).filter(Boolean);
			}
		}
		return [];
	});

	const interval = $derived(data.rotating_words?.interval_ms ?? 2500);
	const highlight = $derived(data.rotating_words?.highlight ?? true);

	// Split the title around {{rotating}} placeholder
	const titleParts = $derived.by(() => {
		const title = data.title ?? '';
		if (words.length === 0 || !title.includes('{{rotating}}')) {
			return { before: title, after: '', hasPlaceholder: false };
		}
		const [before, after] = title.split('{{rotating}}');
		return { before, after: after ?? '', hasPlaceholder: true };
	});

	let currentIndex = $state(0);
	let prevIndex = $state(0);

	onMount(() => {
		if (words.length < 2) return;
		const id = setInterval(() => {
			prevIndex = currentIndex;
			currentIndex = (currentIndex + 1) % words.length;
		}, interval);
		return () => clearInterval(id);
	});
</script>

<section
	class="hero"
	class:hero--compact={isCompact}
	style={data.background_image
		? `--hero-bg: url('${getStrapiMediaUrl(data.background_image.url)}')`
		: ''}
>
	<div class="hero__overlay"></div>
	<div class="container hero__content">
		{#if data.breadcrumb?.length}
			<Breadcrumb light items={data.breadcrumb} />
		{/if}
		<h1 class="hero__title">
			{#if titleParts.hasPlaceholder}
				{titleParts.before}<span
					class="hero__rotating"
					class:hero__rotating--highlight={highlight}
					aria-live="polite"
					style={`--hero-rotation-duration: ${Math.min(interval, 600)}ms`}
				>
					{#key currentIndex}
						<span class="hero__rotating-word">{words[currentIndex]}</span>
					{/key}
					<!-- sr-only fallback listing all words for SEO/accessibility -->
					<span class="sr-only">{words.join(', ')}</span>
				</span>{titleParts.after}
			{:else}
				{data.title}
			{/if}
		</h1>
		{#if data.subtitle}
			<p class="hero__subtitle">{data.subtitle}</p>
		{/if}
		{#if data.cta_text || data.cta_secondary_text}
			<div class="hero__ctas">
				{#if data.cta_text && data.cta_link}
					<a href={data.cta_link} class="btn btn-primary btn-lg">{data.cta_text}</a>
				{/if}
				{#if data.cta_secondary_text && data.cta_secondary_link}
					<a href={data.cta_secondary_link} class="btn btn-secondary btn-lg hero__cta-secondary">
						{data.cta_secondary_text}
					</a>
				{/if}
			</div>
		{/if}
		{#if data.featured_link}
			<a href={data.featured_link.url} class="hero__featured">
				<span class="hero__featured-label">
					{#if data.featured_link.icon}<span class="hero__featured-icon">{data.featured_link.icon}</span>{/if}
					{data.featured_link.label}
				</span>
				<span class="hero__featured-title">{data.featured_link.title}</span>
				<span class="hero__featured-arrow" aria-hidden="true">→</span>
			</a>
		{/if}
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-color: var(--color-green-dark);
		background-image: var(--hero-bg);
		background-size: cover;
		background-position: center;
		padding-block: var(--space-24);
		padding-top: calc(var(--navbar-height) + var(--space-16));
	}

	.hero--compact {
		min-height: 40vh;
		padding-block: var(--space-12);
		padding-top: calc(var(--navbar-height) + var(--space-10));
	}

	.hero--compact .hero__title {
		font-size: var(--text-2xl);
		margin-bottom: var(--space-3);
	}

	.hero--compact .hero__subtitle {
		font-size: var(--text-base);
		margin-bottom: var(--space-4);
	}

	@media (min-width: 768px) {
		.hero--compact .hero__title { font-size: var(--text-3xl); }
	}

	.hero__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(16, 50, 41, 0.90) 0%,
			rgba(12, 81, 24, 0.75) 100%
		);
	}

	.hero__content {
		position: relative;
		z-index: 1;
		color: var(--color-white);
		max-width: 720px;
	}

	.hero__title {
		font-size: var(--text-3xl);
		font-weight: 700;
		line-height: 1.15;
		margin-bottom: var(--space-6);
	}

	@media (min-width: 768px) {
		.hero__title { font-size: var(--text-5xl); }
	}

	.hero__subtitle {
		font-size: var(--text-lg);
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.85);
		margin-bottom: var(--space-8);
		max-width: 560px;
	}

	.hero__ctas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.hero__cta-secondary {
		border-color: rgba(255, 255, 255, 0.6);
		color: var(--color-white);
	}

	.hero__cta-secondary:hover {
		background-color: rgba(255, 255, 255, 0.15);
		border-color: var(--color-white);
		color: var(--color-white);
	}

	/* ── Rotating words ── */
	.hero__rotating {
		display: inline-block;
		position: relative;
		overflow: hidden;
		vertical-align: bottom;
		line-height: 1.1;
		min-height: 1.1em;
	}

	.hero__rotating--highlight {
		color: var(--color-brand-neon);
	}

	.hero__rotating-word {
		display: inline-block;
		animation: heroWordFlip var(--hero-rotation-duration, 450ms) cubic-bezier(0.2, 0.7, 0.3, 1);
	}

	@keyframes heroWordFlip {
		0% {
			transform: translateY(100%);
			opacity: 0;
		}
		60% {
			opacity: 1;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero__rotating-word { animation: none; }
	}

	/* ── Featured link card ── */
	.hero__featured {
		display: inline-grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		column-gap: var(--space-4);
		row-gap: 2px;
		align-items: center;
		margin-top: var(--space-8);
		padding: var(--space-4) var(--space-6);
		background-color: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: var(--radius-lg);
		color: var(--color-white);
		text-decoration: none;
		transition: background-color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
		backdrop-filter: blur(8px);
	}

	.hero__featured:hover {
		background-color: rgba(255, 255, 255, 0.15);
		border-color: rgba(145, 255, 0, 0.5);
		transform: translateY(-2px);
	}

	.hero__featured-label {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-brand-neon);
		grid-column: 1;
	}

	.hero__featured-icon {
		font-size: var(--text-sm);
	}

	.hero__featured-title {
		font-size: var(--text-base);
		font-weight: 600;
		line-height: 1.4;
		grid-column: 1;
	}

	.hero__featured-arrow {
		grid-column: 2;
		grid-row: 1 / span 2;
		font-size: var(--text-xl);
		color: var(--color-brand-neon);
		transition: transform var(--transition-fast);
	}

	.hero__featured:hover .hero__featured-arrow {
		transform: translateX(4px);
	}
</style>
