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
		{#if data.heading}
			<h2 class="upcoming-events__heading">{data.heading}</h2>
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

		{#if data.cta_text && data.cta_link}
			<div class="upcoming-events__cta">
				<a href={data.cta_link} class="btn btn-outline">{data.cta_text} &rarr;</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.upcoming-events { padding-block: var(--space-16); }

	.upcoming-events__heading {
		font-size: var(--text-2xl);
		text-align: center;
		margin-bottom: var(--space-10);
		color: var(--color-green-dark);
	}

	@media (min-width: 768px) {
		.upcoming-events__heading { font-size: var(--text-3xl); }
	}

	.upcoming-events__list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.upcoming-events__row {
		display: grid;
		grid-template-columns: 90px 1fr 52px;
		gap: var(--space-6);
		align-items: center;
		width: 100%;
		padding: var(--space-5) var(--space-6);
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: inherit;
		transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
	}

	.upcoming-events__row:hover {
		border-color: var(--color-brand-neon);
		box-shadow: 0 4px 16px rgba(16, 50, 41, 0.06);
	}

	.upcoming-events__row:hover .upcoming-events__cta-circle {
		background-color: var(--color-green-dark);
		color: var(--color-brand-neon);
		transform: translateX(2px);
	}

	/* ── Date (left column) ── */
	.upcoming-events__date {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding-left: var(--space-4);
		border-left: 3px solid var(--color-brand-neon);
	}

	.upcoming-events__day {
		font-family: var(--font-display);
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		color: var(--color-green-dark);
	}

	.upcoming-events__month {
		font-size: var(--text-xs);
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		margin-top: 4px;
	}

	/* ── Body (middle column) ── */
	.upcoming-events__body {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.upcoming-events__tag {
		display: inline-flex;
		align-self: flex-start;
		align-items: center;
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-green-mid);
		background-color: #D9F2CB;
		padding: 3px 10px;
		border-radius: var(--radius-full);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.upcoming-events__title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-green-dark);
		line-height: 1.3;
	}

	@media (min-width: 768px) {
		.upcoming-events__title { font-size: var(--text-xl); }
	}

	.upcoming-events__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.upcoming-events__location,
	.upcoming-events__time {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	/* ── Circle CTA (right column) ── */
	.upcoming-events__cta-circle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background-color: var(--color-bg);
		color: var(--color-green-dark);
		border: 1px solid var(--color-border);
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
		grid-template-columns: 90px 1fr 52px;
		gap: var(--space-6);
		align-items: center;
		padding: var(--space-5) var(--space-6);
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.skeleton-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.skeleton {
		background: linear-gradient(90deg, var(--color-border) 25%, var(--color-bg) 50%, var(--color-border) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: var(--radius-sm);
	}

	.skeleton--date { width: 70px; height: 60px; border-radius: var(--radius-sm); flex-shrink: 0; }
	.skeleton--tag { height: 18px; }
	.skeleton--text { height: 14px; }
	.skeleton--cta { width: 44px; height: 44px; border-radius: 50%; }

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
