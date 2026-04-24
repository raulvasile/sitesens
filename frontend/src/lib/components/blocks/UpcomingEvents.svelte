<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';

	interface StrapiEvent {
		title: string;
		slug: string;
		start_date: string;
		end_date?: string;
		location_name?: string;
		event_type: string;
		cover_image?: { url: string; alternativeText?: string };
	}

	interface Props {
		data: {
			heading?: string;
			count?: number;
			cta_text?: string;
			cta_link?: string;
			_events?: StrapiEvent[];
		};
	}

	let { data }: Props = $props();
	const count = data.count ?? 3;

	const eventTypeLabels: Record<string, string> = {
		dezbatere: 'Dezbatere',
		actiune: 'Acțiune',
		mars: 'Marș',
		online: 'Online',
	};

	const events = $derived(data._events ?? []);
	const loaded = $derived(data._events !== undefined);

	function formatEventDate(iso: string) {
		const d = new Date(iso);
		return {
			day: d.getDate().toString().padStart(2, '0'),
			month: new Intl.DateTimeFormat('ro-RO', { month: 'short' }).format(d).toUpperCase(),
			time: new Intl.DateTimeFormat('ro-RO', { hour: '2-digit', minute: '2-digit' }).format(d),
		};
	}
</script>

<section class="upcoming-events">
	<div class="container">
		{#if data.heading || (data.cta_text && data.cta_link)}
			<div class="upcoming-events__header">
				{#if data.heading}
					<h2 class="upcoming-events__heading">{data.heading}</h2>
				{/if}
				{#if data.cta_text && data.cta_link}
					<a href={data.cta_link} class="upcoming-events__header-cta">
						{data.cta_text}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</a>
				{/if}
			</div>
		{/if}

		{#if !loaded}
			<div class="upcoming-events__list">
				{#each Array(count) as _}
					<div class="upcoming-events__skeleton">
						<div class="skeleton skeleton--date"></div>
						<div class="skeleton-body">
							<div class="skeleton skeleton--tag" style="width: 90px"></div>
							<div class="skeleton skeleton--text" style="width: 75%"></div>
							<div class="skeleton skeleton--text" style="width: 50%"></div>
						</div>
						<div class="skeleton skeleton--cta"></div>
					</div>
				{/each}
			</div>
		{:else if events.length > 0}
			<ul class="upcoming-events__list">
				{#each events as event}
					{@const d = formatEventDate(event.start_date)}
					<li>
						<a href="/evenimente/{event.slug}" class="upcoming-events__row">
							<div class="upcoming-events__date">
								<span class="upcoming-events__day">{d.day}</span>
								<span class="upcoming-events__month">{d.month}</span>
							</div>

							<div class="upcoming-events__body">
								<span class="upcoming-events__tag">
									{eventTypeLabels[event.event_type] ?? event.event_type}
								</span>
								<h3 class="upcoming-events__title">{event.title}</h3>
								<div class="upcoming-events__meta">
									{#if event.location_name}
										<span class="upcoming-events__location">
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
												<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
												<circle cx="12" cy="9" r="2.5" />
											</svg>
											{event.location_name}
										</span>
									{/if}
									<span class="upcoming-events__time">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
											<circle cx="12" cy="12" r="9" />
											<path d="M12 7v5l3 2" />
										</svg>
										{d.time}
									</span>
								</div>
							</div>

							<span class="upcoming-events__cta-circle" aria-hidden="true">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<line x1="5" y1="12" x2="19" y2="12" />
									<polyline points="12 5 19 12 12 19" />
								</svg>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="upcoming-events__empty">Nu sunt evenimente programate momentan.</p>
		{/if}

	</div>
</section>

<style>
	.upcoming-events {
		padding-block: var(--space-20);
		background-color: var(--color-paper);
	}

	.upcoming-events__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-6);
		margin-bottom: var(--space-10);
		flex-wrap: wrap;
	}

	.upcoming-events__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin: 0;
	}

	.upcoming-events__header-cta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		padding-bottom: 6px;
		border-bottom: 1.5px solid var(--color-ink);
		text-decoration: none;
		transition: gap var(--transition-fast), color var(--transition-fast);
	}

	.upcoming-events__header-cta:hover {
		gap: var(--space-3);
		color: var(--color-green-deep);
	}

	.upcoming-events__list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}

	.upcoming-events__list li {
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}

	.upcoming-events__row {
		display: grid;
		grid-template-columns: 100px 1fr auto;
		gap: var(--space-6);
		align-items: center;
		width: 100%;
		padding: var(--space-5) var(--space-4);
		background-color: transparent;
		text-decoration: none;
		color: inherit;
		transition: padding-left var(--transition-fast), background-color var(--transition-fast);
	}

	.upcoming-events__row:hover {
		background-color: var(--color-cream);
		padding-left: var(--space-6);
	}

	.upcoming-events__row:hover .upcoming-events__cta-circle {
		background-color: var(--color-ink);
		color: var(--color-lime);
		transform: translateX(2px);
	}

	/* ── Date (first column) ── */
	.upcoming-events__date {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}

	.upcoming-events__day {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 500;
		line-height: 1;
		color: var(--color-ink);
		letter-spacing: -0.01em;
	}

	.upcoming-events__month {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		color: var(--color-ink-soft);
		margin-top: 4px;
	}

	/* ── Body (title + location) ── */
	.upcoming-events__body {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.upcoming-events__tag {
		display: inline-flex;
		align-self: flex-start;
		align-items: center;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--color-ink);
		background-color: var(--color-lime);
		padding: 3px 10px;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}

	.upcoming-events__title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
		color: var(--color-ink);
		line-height: 1.1;
		letter-spacing: -0.005em;
		text-transform: uppercase;
	}

	.upcoming-events__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		color: var(--color-ink-soft);
		text-transform: uppercase;
	}

	.upcoming-events__location,
	.upcoming-events__time {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	/* ── Circle CTA ── */
	.upcoming-events__cta-circle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background-color: transparent;
		color: var(--color-ink);
		border: 1.5px solid var(--color-ink);
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}

	/* ── Responsive: stack on small screens ── */
	@media (max-width: 639px) {
		.upcoming-events__row {
			grid-template-columns: 70px 1fr;
			grid-template-rows: auto auto;
			gap: var(--space-3) var(--space-4);
			padding: var(--space-4);
		}

		.upcoming-events__cta-circle {
			grid-column: 2;
			justify-self: flex-start;
			width: 38px;
			height: 38px;
		}

		.upcoming-events__body {
			grid-column: 2;
		}

		.upcoming-events__date {
			grid-row: 1 / span 2;
		}

		.upcoming-events__day { font-size: 2rem; }
		.upcoming-events__title { font-size: var(--text-base); }
	}

	.upcoming-events__empty {
		text-align: center;
		color: var(--color-text-muted);
		font-style: italic;
		padding: var(--space-8);
	}

	.upcoming-events__cta {
		text-align: center;
		margin-top: var(--space-10);
	}

	/* ── Skeleton ── */
	.upcoming-events__skeleton {
		display: grid;
		grid-template-columns: 100px 1fr 44px;
		gap: var(--space-6);
		align-items: center;
		padding: var(--space-5) var(--space-4);
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}

	.skeleton-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.skeleton {
		background: linear-gradient(90deg, var(--color-cream) 25%, var(--color-skeleton) 50%, var(--color-cream) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	.skeleton--date { width: 80px; height: 44px; flex-shrink: 0; }
	.skeleton--tag { height: 18px; }
	.skeleton--text { height: 14px; }
	.skeleton--cta { width: 44px; height: 44px; border-radius: 50%; }

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
