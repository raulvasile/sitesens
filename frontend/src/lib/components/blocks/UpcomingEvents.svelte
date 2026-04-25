<script lang="ts">
	interface StrapiEvent {
		title: string;
		slug: string;
		start_date: string;
		end_date?: string;
		location_name?: string;
		venue?: string;
		city?: string;
		event_type: string;
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

	const MONTH_RO = ['IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN', 'IUL', 'AUG', 'SEP', 'OCT', 'NOI', 'DEC'];
	function formatDay(iso: string) { return String(new Date(iso).getDate()).padStart(2, '0'); }
	function formatMonth(iso: string) { return MONTH_RO[new Date(iso).getMonth()]; }
	function formatTime(iso: string) {
		return new Date(iso).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
	}

	function metaLine(ev: StrapiEvent): string {
		const type = eventTypeLabels[ev.event_type] ?? ev.event_type;
		const place = ev.city ? ev.city.toUpperCase() : ev.location_name?.toUpperCase();
		const parts = [type.toUpperCase(), place, ev.venue].filter(Boolean);
		return parts.join(' · ');
	}
</script>

<section class="ue">
	<div class="container">
		{#if data.heading || (data.cta_text && data.cta_link)}
			<header class="ue__header">
				{#if data.heading}
					<h2 class="ue__heading">{data.heading}</h2>
				{/if}
				{#if data.cta_text && data.cta_link}
					<a href={data.cta_link} class="ue__header-cta">
						{data.cta_text}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</a>
				{/if}
			</header>
		{/if}

		{#if !loaded}
			<ul class="ue__list">
				{#each Array(count) as _}
					<li class="ue__skel-row">
						<div class="ue__skel ue__skel--date"></div>
						<div class="ue__skel ue__skel--chip"></div>
						<div class="ue__skel-info">
							<div class="ue__skel ue__skel--text" style="width: 70%"></div>
							<div class="ue__skel ue__skel--text" style="width: 45%"></div>
						</div>
						<div class="ue__skel ue__skel--time"></div>
						<div class="ue__skel ue__skel--cta"></div>
					</li>
				{/each}
			</ul>
		{:else if events.length > 0}
			<ul class="ue__list">
				{#each events as event}
					<li>
						<a href="/evenimente/{event.slug}" class="ue__row">
							<div class="ue__date">
								<span class="ue__day">{formatDay(event.start_date)}</span>
								<span class="ue__month">{formatMonth(event.start_date)}</span>
							</div>
							<span class="ue__chip">
								{eventTypeLabels[event.event_type] ?? event.event_type}
							</span>
							<div class="ue__info">
								<div class="ue__title">{event.title}</div>
								<div class="ue__meta">{metaLine(event)}</div>
							</div>
							<div class="ue__time">{formatTime(event.start_date)}</div>
							<span class="ue__cta">
								Rezervă
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
									<line x1="5" y1="12" x2="19" y2="12" />
									<polyline points="12 5 19 12 12 19" />
								</svg>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="ue__empty">Nu sunt evenimente programate momentan.</p>
		{/if}
	</div>
</section>

<style>
	.ue {
		padding-block: var(--space-20);
		background-color: var(--color-paper);
	}

	.ue__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-6);
		margin-bottom: var(--space-10);
		flex-wrap: wrap;
	}
	.ue__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin: 0;
	}
	.ue__header-cta {
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
	@media (hover: hover) {
		.ue__header-cta:hover { gap: var(--space-3); color: var(--color-green-deep); }
	}

	.ue__list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}
	.ue__list li { border-bottom: 1px solid rgba(12, 81, 24, 0.15); }

	/* Mirror /evenimente row layout: date · chip · title+meta · time · cta */
	.ue__row {
		display: grid;
		grid-template-columns: 90px 130px 1fr auto auto;
		gap: var(--space-5);
		align-items: center;
		padding: var(--space-5) 0;
		text-decoration: none;
		color: inherit;
		transition: padding-inline var(--transition-fast), background-color var(--transition-fast);
	}
	@media (hover: hover) {
		.ue__row:hover {
			background-color: var(--color-cream);
			padding-inline: var(--space-3);
		}
	}

	.ue__date {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.ue__day {
		font-family: var(--font-display);
		font-size: 2rem;
		line-height: 1;
		font-weight: 500;
		color: var(--color-green-deep);
		letter-spacing: -0.01em;
	}
	.ue__month {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		color: var(--color-ink-soft);
		margin-top: 4px;
	}

	.ue__chip {
		display: inline-flex;
		align-items: center;
		justify-self: start;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 5px 12px;
		border: 1.5px solid rgba(12, 81, 24, 0.4);
		color: var(--color-ink);
		background: transparent;
	}

	.ue__info { min-width: 0; }
	.ue__title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
		color: var(--color-ink);
		line-height: 1.15;
	}
	.ue__meta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
		margin-top: 4px;
	}

	.ue__time {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-ink-soft);
	}

	.ue__cta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink);
	}

	.ue__empty {
		text-align: center;
		color: var(--color-ink-soft);
		font-style: italic;
		padding: var(--space-8);
	}

	/* ── Mobile: compact stacked layout ── */
	@media (max-width: 767px) {
		.ue { padding-block: var(--space-10); }
		.ue__header { margin-bottom: var(--space-6); }

		.ue__row {
			grid-template-columns: 56px 1fr;
			grid-template-areas:
				'date    chip'
				'date    title'
				'date    meta'
				'time    cta';
			gap: var(--space-2) var(--space-4);
			padding: var(--space-4) 0;
			align-items: start;
		}
		.ue__date { grid-area: date; }
		.ue__day { font-size: 1.625rem; }
		.ue__chip {
			grid-area: chip;
			font-size: 0.625rem;
			padding: 3px 9px;
			justify-self: start;
		}
		.ue__info { grid-area: auto; display: contents; }
		.ue__title {
			grid-area: title;
			font-size: 1rem;
			line-height: 1.2;
		}
		.ue__meta {
			grid-area: meta;
			font-size: 0.625rem;
			margin-top: 0;
		}
		.ue__time {
			grid-area: time;
			font-size: 0.6875rem;
			color: var(--color-ink);
		}
		.ue__cta {
			grid-area: cta;
			justify-self: end;
		}
	}

	/* ── Skeleton ── */
	.ue__skel-row {
		display: grid;
		grid-template-columns: 90px 130px 1fr auto auto;
		gap: var(--space-5);
		align-items: center;
		padding: var(--space-5) 0;
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}
	.ue__skel-info { display: flex; flex-direction: column; gap: var(--space-2); min-width: 0; }
	.ue__skel {
		background: linear-gradient(90deg, var(--color-cream) 25%, var(--color-skeleton) 50%, var(--color-cream) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}
	.ue__skel--date { width: 70px; height: 44px; }
	.ue__skel--chip { width: 90px; height: 18px; }
	.ue__skel--text { height: 14px; }
	.ue__skel--time { width: 50px; height: 14px; }
	.ue__skel--cta { width: 80px; height: 14px; }

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
