<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface Campaign {
		title: string;
		slug: string;
		summary?: string;
		cover_image?: { url: string; alternativeText?: string } | null;
		start_date?: string | null;
		end_date?: string | null;
		goal?: number | null;
		progress?: number | null;
	}

	interface Props {
		data: {
			kicker?: string;
			heading?: string;
			cta_text?: string;
			cta_link?: string;
			background_color?: 'paper' | 'cream';
			_campaigns?: Campaign[];
		};
	}

	let { data }: Props = $props();

	const bg = $derived(data.background_color ?? 'paper');
	const campaigns = $derived(data._campaigns ?? []);

	function isEnded(c: Campaign): boolean {
		return !!c.end_date && new Date(c.end_date) < new Date();
	}

	function pct(c: Campaign): number | null {
		if (!c.goal || c.goal <= 0) return null;
		return Math.min(100, Math.round(((c.progress ?? 0) / c.goal) * 100));
	}
</script>

<section class="fcamp fcamp--{bg}">
	<div class="container">
		{#if data.kicker || data.heading || (data.cta_text && data.cta_link)}
			<header class="fcamp__header">
				<div>
					{#if data.kicker}
						<div class="fcamp__kicker">— {data.kicker}</div>
					{/if}
					{#if data.heading}
						<h2 class="fcamp__heading">{data.heading}</h2>
					{/if}
				</div>
				{#if data.cta_text && data.cta_link}
					<a href={data.cta_link} class="fcamp__cta">
						{data.cta_text} <span aria-hidden="true">→</span>
					</a>
				{/if}
			</header>
		{/if}

		{#if campaigns.length === 0}
			<p class="fcamp__empty">Momentan nu sunt campanii active.</p>
		{:else}
			<div class="fcamp__grid">
				{#each campaigns as c (c.slug)}
					{@const p = pct(c)}
					<a href="/campanii/{c.slug}" class="fcamp__card">
						{#if c.cover_image?.url}
							<img
								src={getStrapiMediaUrl(c.cover_image.url)}
								alt={c.cover_image.alternativeText ?? c.title}
								class="fcamp__image"
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<div class="fcamp__image fcamp__image--placeholder" aria-hidden="true"></div>
						{/if}
						<div class="fcamp__body">
							{#if isEnded(c)}
								<span class="fcamp__badge fcamp__badge--ended">Încheiată</span>
							{:else}
								<span class="fcamp__badge fcamp__badge--active">Activă</span>
							{/if}
							<h3 class="fcamp__title">{c.title}</h3>
							{#if c.summary}
								<p class="fcamp__summary">{c.summary}</p>
							{/if}
							{#if p !== null}
								<div class="fcamp__progress">
									<div class="fcamp__progress-bar" style="width: {p}%"></div>
								</div>
								<div class="fcamp__progress-label">
									{(c.progress ?? 0).toLocaleString('ro-RO')} / {c.goal?.toLocaleString('ro-RO')} ({p}%)
								</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.fcamp {
		padding-block: var(--space-24);
	}
	.fcamp--paper { background-color: var(--color-paper); }
	.fcamp--cream { background-color: var(--color-cream); }

	.fcamp__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-6);
		margin-bottom: var(--space-12);
		flex-wrap: wrap;
	}
	.fcamp__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.55;
		margin-bottom: var(--space-4);
	}
	.fcamp__heading {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 5vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0;
	}
	.fcamp__cta {
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		text-decoration: none;
		transition: color var(--transition-fast);
	}
	.fcamp__cta:hover { color: var(--color-green-deep); }

	.fcamp__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
	}
	@media (max-width: 900px) { .fcamp__grid { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 560px) { .fcamp__grid { grid-template-columns: 1fr; } }

	.fcamp__card {
		display: flex;
		flex-direction: column;
		background-color: var(--color-cream);
		border: 1px solid rgba(12, 81, 24, 0.15);
		text-decoration: none;
		color: inherit;
		transition: transform var(--transition-base);
	}
	.fcamp--cream .fcamp__card { background-color: var(--color-paper); }
	.fcamp__card:hover { transform: translateY(-4px); }

	.fcamp__image {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		display: block;
	}
	.fcamp__image--placeholder {
		background:
			repeating-linear-gradient(135deg, rgba(12, 81, 24, 0.08) 0, rgba(12, 81, 24, 0.08) 1px, transparent 1px, transparent 12px),
			var(--color-paper);
	}

	.fcamp__body { padding: var(--space-5); }
	.fcamp__badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 2px 8px;
		margin-bottom: var(--space-3);
	}
	.fcamp__badge--active { background-color: var(--color-green-deep); color: var(--color-paper); }
	.fcamp__badge--ended { background-color: #d6d6d6; color: var(--color-ink); }

	.fcamp__title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 500;
		line-height: 1.1;
		color: var(--color-ink);
		margin: 0 0 var(--space-2);
	}
	.fcamp__summary {
		font-family: var(--font-body);
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: 0 0 var(--space-4);
	}

	.fcamp__progress {
		height: 8px;
		background-color: rgba(12, 81, 24, 0.12);
		overflow: hidden;
	}
	.fcamp__progress-bar {
		height: 100%;
		background-color: var(--color-green-deep);
	}
	.fcamp__progress-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-ink-soft);
		margin-top: var(--space-2);
	}

	.fcamp__empty {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
		opacity: 0.65;
	}

	@media (max-width: 767px) {
		.fcamp { padding-block: var(--space-10); }
	}
</style>
