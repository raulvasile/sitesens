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

	interface NextEventBlock {
		label?: string;
		cta_text?: string;
		icon?: string;
		empty_label?: string;
		empty_url?: string;
		hide_when_empty?: boolean;
		_event?: {
			title: string;
			slug: string;
			start_date: string;
			location_name?: string;
			event_type?: string;
		} | null;
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
			next_event?: NextEventBlock | null;
			meta_text?: string;
			chip_text?: string;
			chip_visible?: boolean;
		};
	}

	let { data }: Props = $props();
	const isCompact = $derived(data.variant === 'compact');
	const photoUrl = $derived(data.background_image ? getStrapiMediaUrl(data.background_image.url) : '');

	// Parse words
	const words = $derived.by(() => {
		const raw = data.rotating_words?.words;
		if (!raw) return [] as string[];
		if (Array.isArray(raw)) return raw.filter((w) => typeof w === 'string' && w.trim().length > 0);
		if (typeof raw === 'string') {
			try {
				const parsed = JSON.parse(raw);
				return Array.isArray(parsed) ? parsed : [];
			} catch {
				return raw.split(',').map((s) => s.trim()).filter(Boolean);
			}
		}
		return [];
	});

	const interval = $derived(data.rotating_words?.interval_ms ?? 2500);

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

	onMount(() => {
		if (words.length < 2) return;
		const id = setInterval(() => {
			currentIndex = (currentIndex + 1) % words.length;
		}, interval);
		return () => clearInterval(id);
	});
</script>

<section class="hero" class:hero--compact={isCompact}>
	<div class="container hero__inner">
		{#if data.breadcrumb?.length}
			<Breadcrumb items={data.breadcrumb} />
		{/if}

		<div class="hero__grid">
			<!-- LEFT: text -->
			<div class="hero__left">
				{#if data.meta_text}
					<div class="hero__meta">
						<span class="hero__live">
							<span class="hero__live-dot" aria-hidden="true"></span>
							<span>{data.meta_text}</span>
						</span>
					</div>
				{/if}

				<h1 class="hero__title">
					{#if titleParts.hasPlaceholder}
						{titleParts.before}<span
							class="hero__rotating"
							aria-live="polite"
						>
							<!-- Sizer: cuvântul cel mai lung — vizibil doar pentru a ține lățimea stabilă -->
							<span class="hero__rotating-sizer" aria-hidden="true">
								{#each words as w}
									<span class="hero__rotating-sizer-item">{w}</span>
								{/each}
							</span>
							<!-- Cuvinte absolute cu fade crossover — una e activă la un moment dat -->
							{#each words as w, i}
								<span
									class="hero__rotating-word"
									class:hero__rotating-word--active={i === currentIndex}
									aria-hidden={i !== currentIndex}
								>{w}</span>
							{/each}
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
							<a href={data.cta_secondary_link} class="btn btn-outline-ink btn-lg">
								{data.cta_secondary_text}
							</a>
						{/if}
					</div>
				{/if}
			</div>

			<!-- RIGHT: photo cu floating callout card -->
			{#if !isCompact}
				<div class="hero__right">
					<div class="hero__photo">
						{#if photoUrl}
							<img src={photoUrl} alt={data.background_image?.alternativeText ?? ''} />
							<div class="hero__photo-wash" aria-hidden="true"></div>
						{:else}
							<div class="hero__photo-placeholder photo-placeholder photo-placeholder--dark">
								· foto echipă SENS ·
							</div>
						{/if}
						{#if data.chip_visible && data.chip_text}
							<span class="hero__chip">{data.chip_text}</span>
						{/if}
					</div>

					{#if data.next_event?._event}
						{@const ev = data.next_event._event}
						{@const evDate = new Date(ev.start_date)}
						{@const dateLabel = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long' }).format(evDate)}
						<a href="/evenimente/{ev.slug}" class="hero__floating">
							<span class="hero__floating-label">
								{#if data.next_event.icon}
									<span class="hero__floating-icon" aria-hidden="true">{data.next_event.icon}</span>
								{/if}
								{data.next_event.label ?? 'Următorul eveniment'} · {dateLabel}
							</span>
							<span class="hero__floating-title">{ev.title}</span>
							{#if ev.location_name}
								<span class="hero__floating-meta">{ev.location_name}</span>
							{/if}
							<span class="hero__floating-arrow" aria-hidden="true">→</span>
						</a>
					{:else if data.next_event && !data.next_event.hide_when_empty && data.next_event.empty_label}
						<a href={data.next_event.empty_url ?? '/evenimente'} class="hero__floating">
							<span class="hero__floating-label">
								{#if data.next_event.icon}
									<span class="hero__floating-icon" aria-hidden="true">{data.next_event.icon}</span>
								{/if}
								{data.next_event.empty_label}
							</span>
							<span class="hero__floating-arrow" aria-hidden="true">→</span>
						</a>
					{:else if data.featured_link}
						<a href={data.featured_link.url} class="hero__floating">
							<span class="hero__floating-label">
								{#if data.featured_link.icon}
									<span class="hero__floating-icon" aria-hidden="true">{data.featured_link.icon}</span>
								{/if}
								{data.featured_link.label}
							</span>
							<span class="hero__floating-title">{data.featured_link.title}</span>
							<span class="hero__floating-arrow" aria-hidden="true">→</span>
						</a>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		background-color: var(--color-paper);
		padding-block: calc(var(--navbar-height) + var(--space-2)) var(--space-12);
		overflow: hidden;
	}

	.hero--compact {
		padding-block: calc(var(--navbar-height) + var(--space-2)) var(--space-8);
	}

	.hero__inner {
		position: relative;
	}

	.hero__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		align-items: center;
	}

	@media (min-width: 960px) {
		.hero__grid {
			grid-template-columns: 1.15fr 1fr;
			gap: var(--space-16);
		}
	}

	/* ── LEFT column ── */
	.hero__left {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.hero__meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.hero__live {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}

	.hero__live-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background-color: var(--color-lime);
		box-shadow: 0 0 0 0 rgba(145, 255, 0, 0.6);
		animation: hero-pulse 2s infinite;
	}

	@keyframes hero-pulse {
		0%, 100% { box-shadow: 0 0 0 0 rgba(145, 255, 0, 0.6); }
		50% { box-shadow: 0 0 0 8px rgba(145, 255, 0, 0); }
	}

	.hero__title {
		font-family: var(--font-display);
		font-weight: 500;
		letter-spacing: -0.015em;
		line-height: 1.05;
		color: var(--color-ink);
		font-size: clamp(2.75rem, 7vw + 1rem, 7.25rem);
		text-transform: uppercase;
	}

	.hero--compact .hero__title {
		font-size: clamp(2rem, 5vw + 0.5rem, 4rem);
	}

	.hero__subtitle {
		font-family: var(--font-body);
		font-size: clamp(1rem, 1vw + 0.75rem, 1.1875rem);
		line-height: 1.5;
		color: var(--color-ink-soft);
		max-width: 500px;
	}

	.hero__ctas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-2);
	}

	/* ── Rotating words as lime accent box with stable layout ── */
	.hero__rotating {
		display: inline-block;
		position: relative;
		vertical-align: baseline;
		line-height: inherit;
		background-color: var(--color-lime);
		padding: 0 0.15em;
		transform: rotate(-1deg);
		/* Reserve vertical space to fit a single word without cropping italic descenders */
	}

	/* Sizer: renderează toate cuvintele stacked, invizibil, pentru a ține lățimea
	   egală cu cel mai lung cuvânt și înălțimea cu un rând. */
	.hero__rotating-sizer {
		display: inline-grid;
		grid-template-columns: 1fr;
		visibility: hidden;
		pointer-events: none;
		font-style: italic;
	}

	.hero__rotating-sizer-item {
		grid-column: 1;
		grid-row: 1;
		white-space: nowrap;
	}

	/* Cuvintele reale — absolut poziționate peste sizer. Doar cel activ e vizibil.
	   Fade cross-over continuu cu slide-up subtil. */
	.hero__rotating-word {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-inline: 0.15em;
		color: var(--color-ink);
		font-style: italic;
		opacity: 0;
		transform: translateY(0.35em);
		transition: opacity 600ms cubic-bezier(0.3, 0, 0.3, 1),
			transform 700ms cubic-bezier(0.3, 0, 0.3, 1);
		white-space: nowrap;
		will-change: transform, opacity;
	}

	.hero__rotating-word--active {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.hero__rotating-word {
			transition: opacity 150ms ease;
			transform: none;
		}
	}

	/* ── RIGHT: photo + floating card ── */
	.hero__right {
		position: relative;
		min-height: 400px;
	}

	.hero__photo {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 5;
		background-color: var(--color-green-deep);
		overflow: hidden;
	}

	.hero__photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero__photo-wash {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				180deg,
				rgba(10, 31, 16, 0.0) 40%,
				rgba(10, 31, 16, 0.55) 100%
			);
		pointer-events: none;
	}

	.hero__photo-placeholder {
		width: 100%;
		height: 100%;
		min-height: 400px;
	}

	.hero__chip {
		position: absolute;
		top: var(--space-4);
		right: var(--space-4);
		background-color: var(--color-lime);
		color: var(--color-ink);
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 0.375rem 0.75rem;
		transform: rotate(2deg);
	}

	.hero__floating {
		position: absolute;
		left: -20px;
		bottom: 32px;
		width: 260px;
		max-width: 80%;
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		column-gap: var(--space-3);
		row-gap: var(--space-1);
		padding: var(--space-4) var(--space-5);
		background-color: var(--color-cream);
		color: var(--color-ink);
		border: 1.5px solid var(--color-ink);
		box-shadow: 8px 8px 0 var(--color-lime);
		transform: rotate(-1.5deg);
		text-decoration: none;
		transition: transform var(--transition-base), box-shadow var(--transition-base);
	}

	.hero__floating:hover {
		transform: rotate(0deg) translateY(-2px);
		box-shadow: 10px 10px 0 var(--color-lime);
	}

	.hero__floating-label {
		grid-column: 1;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}

	.hero__floating-title {
		grid-column: 1;
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 500;
		line-height: 1.15;
		letter-spacing: -0.005em;
		color: var(--color-ink);
	}

	.hero__floating-meta {
		grid-column: 1;
		font-family: var(--font-body);
		font-size: 0.75rem;
		color: var(--color-ink-soft);
		opacity: 0.8;
		margin-top: 4px;
	}

	.hero__floating-arrow {
		grid-column: 2;
		grid-row: 1 / -1;
		font-size: 1.25rem;
		color: var(--color-green-deep);
		transition: transform var(--transition-fast);
		align-self: center;
	}

	.hero__floating:hover .hero__floating-arrow {
		transform: translateX(4px);
	}

	@media (max-width: 959px) {
		.hero__right {
			min-height: 360px;
		}

		.hero__photo {
			aspect-ratio: 4 / 3;
		}

		.hero__floating {
			left: 0;
			bottom: -24px;
			width: auto;
			max-width: calc(100% - 48px);
			margin-inline: auto;
			right: 0;
		}
	}
</style>
