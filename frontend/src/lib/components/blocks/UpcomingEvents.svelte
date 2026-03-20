<script lang="ts">
	import { fetchStrapi, getStrapiMediaUrl } from '$lib/strapi';

	interface Props {
		data: {
			heading?: string;
			count?: number;
			cta_text?: string;
			cta_link?: string;
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

	interface StrapiEvent {
		title: string;
		slug: string;
		start_date: string;
		end_date?: string;
		location_name?: string;
		event_type: string;
		cover_image?: { url: string; alternativeText?: string };
	}

	let events = $state<StrapiEvent[]>([]);
	let loaded = $state(false);

	$effect(() => {
		const now = new Date().toISOString();
		fetchStrapi<StrapiEvent[]>('/events', {
			'filters[start_date][$gte]': now,
			'sort': 'start_date:asc',
			'pagination[pageSize]': String(count),
			'populate[cover_image]': '*',
		}).then(res => {
			events = res.data ?? [];
			loaded = true;
		}).catch(() => { loaded = true; });
	});

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
			<div class="upcoming-events__grid">
				{#each Array(count) as _}
					<div class="upcoming-events__skeleton">
						<div class="skeleton skeleton--date-block"></div>
						<div class="skeleton skeleton--text" style="width: 70%"></div>
						<div class="skeleton skeleton--text" style="width: 50%"></div>
					</div>
				{/each}
			</div>
		{:else if events.length > 0}
			<div class="upcoming-events__grid">
				{#each events as event}
					{@const d = formatEventDate(event.start_date)}
					<a href="/evenimente/{event.slug}" class="upcoming-events__card">
						<div class="upcoming-events__date-block">
							<span class="upcoming-events__day">{d.day}</span>
							<span class="upcoming-events__month">{d.month}</span>
						</div>
						<div class="upcoming-events__info">
							<span class="upcoming-events__type">{eventTypeLabels[event.event_type] ?? event.event_type}</span>
							<h3 class="upcoming-events__title">{event.title}</h3>
							{#if event.location_name}
								<p class="upcoming-events__location">📍 {event.location_name}</p>
							{/if}
							<p class="upcoming-events__time">🕐 {d.time}</p>
						</div>
					</a>
				{/each}
			</div>
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

	.upcoming-events__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}

	@media (min-width: 768px) {
		.upcoming-events__grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 1024px) {
		.upcoming-events__grid { grid-template-columns: repeat(3, 1fr); }
	}

	.upcoming-events__card {
		display: flex;
		gap: var(--space-4);
		background-color: var(--color-white);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		border: 1px solid var(--color-border);
		text-decoration: none;
		color: inherit;
		transition: box-shadow var(--transition-fast), transform var(--transition-fast);
	}

	.upcoming-events__card:hover {
		box-shadow: 0 8px 24px rgba(0, 56, 39, 0.08);
		transform: translateY(-2px);
	}

	.upcoming-events__date-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 64px;
		height: 64px;
		background-color: var(--color-green-dark);
		border-radius: var(--radius-md);
		color: var(--color-white);
		flex-shrink: 0;
	}

	.upcoming-events__day {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 700;
		line-height: 1;
	}

	.upcoming-events__month {
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.05em;
	}

	.upcoming-events__info { flex: 1; min-width: 0; }

	.upcoming-events__type {
		display: inline-block;
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-green-leaf);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-1);
	}

	.upcoming-events__title {
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-green-dark);
		line-height: 1.3;
		margin-bottom: var(--space-2);
	}

	.upcoming-events__location,
	.upcoming-events__time {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.4;
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

	/* Skeleton */
	.upcoming-events__skeleton {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-5);
		background-color: var(--color-white);
		border-radius: var(--radius-lg);
	}

	.skeleton {
		background: linear-gradient(90deg, var(--color-border) 25%, var(--color-bg) 50%, var(--color-border) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: var(--radius-sm);
	}

	.skeleton--date-block { width: 64px; height: 64px; border-radius: var(--radius-md); flex-shrink: 0; }
	.skeleton--text { height: 14px; margin-bottom: var(--space-2); }

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
