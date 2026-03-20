<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const events = $derived(data.events);
	const pagination = $derived(data.pagination);
	const activeTab = $derived(data.activeTab);
	const activeType = $derived(data.activeType);

	const eventTypes = [
		{ value: '', label: 'Toate' },
		{ value: 'dezbatere', label: 'Dezbatere' },
		{ value: 'actiune', label: 'Acțiune' },
		{ value: 'mars', label: 'Marș' },
		{ value: 'online', label: 'Online' }
	];

	function badgeClass(type: string) {
		const map: Record<string, string> = {
			dezbatere: 'badge-green',
			actiune: 'badge-orange',
			mars: 'badge-green',
			online: 'badge-muted'
		};
		return map[type] || 'badge-muted';
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('ro-RO', {
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

	function buildUrl(params: Record<string, string>) {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([k, v]) => {
			if (v) searchParams.set(k, v);
		});
		const qs = searchParams.toString();
		return `/evenimente${qs ? '?' + qs : ''}`;
	}
</script>

<SeoHead
	title="Evenimente"
	description="Evenimente ale Partidului SENS — dezbateri, acțiuni, marșuri, întâlniri online."
/>

<div class="container page-header">
	<nav aria-label="Breadcrumb" class="breadcrumb">
		<a href="/">Acasă</a> / <span>Evenimente</span>
	</nav>
	<h1>Evenimente</h1>
</div>

<div class="container events-page">
	<!-- ═══════ TABS ═══════ -->
	<div class="tabs-row">
		<div class="tabs">
			<a
				href={buildUrl({ tab: 'viitoare', type: activeType })}
				class="tab"
				class:tab--active={activeTab === 'viitoare'}
			>
				Viitoare
			</a>
			<a
				href={buildUrl({ tab: 'trecute', type: activeType })}
				class="tab"
				class:tab--active={activeTab === 'trecute'}
			>
				Trecute
			</a>
		</div>

		<!-- ═══════ FILTRE TIP ═══════ -->
		<div class="type-filters">
			{#each eventTypes as et}
				<a
					href={buildUrl({ tab: activeTab, type: et.value })}
					class="pill"
					class:pill--active={activeType === et.value}
				>
					{et.label}
				</a>
			{/each}
		</div>
	</div>

	<!-- ═══════ GRID ═══════ -->
	{#if events.length > 0}
		<div class="events-grid">
			{#each events as event}
				<a href="/evenimente/{event.slug}" class="event-card">
					{#if event.cover_image?.url}
						<img
							src={getStrapiMediaUrl(event.cover_image.url)}
							alt={event.cover_image.alternativeText ?? event.title}
							class="event-card__img"
							loading="lazy"
						/>
					{:else}
						<div class="event-card__img event-card__img--placeholder">
							<div class="event-card__date-overlay">
								<span class="event-card__day">{new Date(event.start_date).getDate()}</span>
								<span class="event-card__month">
									{new Date(event.start_date).toLocaleDateString('ro-RO', { month: 'short' }).toUpperCase()}
								</span>
							</div>
						</div>
					{/if}
					<div class="event-card__body">
						<div class="event-card__meta">
							<span class="badge {badgeClass(event.event_type)}">{event.event_type}</span>
							{#if !event.registration_open && activeTab === 'viitoare'}
								<span class="badge badge-muted">Înscrieri închise</span>
							{/if}
						</div>
						<h3 class="event-card__title">{event.title}</h3>
						<div class="event-card__info">
							<span class="event-card__date-text">
								📅 {formatDate(event.start_date)} · {formatTime(event.start_date)}
							</span>
							{#if event.location_name}
								<span class="event-card__location">📍 {event.location_name}</span>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- ═══════ PAGINARE ═══════ -->
		{#if pagination.pageCount > 1}
			<nav class="pagination" aria-label="Paginare evenimente">
				{#each Array(pagination.pageCount) as _, i}
					<a
						href={buildUrl({ tab: activeTab, type: activeType, page: String(i + 1) })}
						class="pagination__btn"
						class:pagination__btn--active={pagination.page === i + 1}
						aria-current={pagination.page === i + 1 ? 'page' : undefined}
					>
						{i + 1}
					</a>
				{/each}
			</nav>
		{/if}
	{:else}
		<div class="empty-state">
			<p>
				{#if activeTab === 'viitoare'}
					Nu sunt evenimente viitoare programate momentan.
				{:else}
					Nu am găsit evenimente trecute.
				{/if}
			</p>
		</div>
	{/if}
</div>

<style>
	.events-page {
		padding-block: var(--space-6) var(--space-16);
	}

	/* ── Tabs & Filters ── */
	.tabs-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}
	.tabs {
		display: flex;
		gap: var(--space-1);
		background-color: var(--color-bg);
		border-radius: var(--radius-lg);
		padding: 4px;
	}
	.tab {
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-muted);
		text-decoration: none;
		transition: all var(--transition-fast);
	}
	.tab:hover { color: var(--color-green-dark); }
	.tab--active {
		background-color: var(--color-white);
		color: var(--color-green-dark);
		box-shadow: var(--shadow-sm);
	}

	.type-filters {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	.pill {
		padding: 0.375rem 0.875rem;
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-muted);
		background-color: var(--color-bg);
		text-decoration: none;
		transition: all var(--transition-fast);
	}
	.pill:hover { color: var(--color-green-dark); background-color: var(--color-white); }
	.pill--active {
		background-color: var(--color-green-dark);
		color: var(--color-white);
	}

	/* ── Grid ── */
	.events-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}
	@media (min-width: 640px) { .events-grid { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 1024px) { .events-grid { grid-template-columns: repeat(3, 1fr); } }

	/* ── Card ── */
	.event-card {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-md);
		overflow: hidden;
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		text-decoration: none;
		color: var(--color-text);
		transition: all var(--transition-fast);
	}
	.event-card:hover {
		border-color: var(--color-green-leaf);
		box-shadow: var(--shadow-md);
		transform: translateY(-3px);
		color: var(--color-text);
	}
	.event-card__img {
		width: 100%;
		aspect-ratio: 16/9;
		object-fit: cover;
	}
	.event-card__img--placeholder {
		background: linear-gradient(135deg, var(--color-green-dark) 0%, var(--color-green-mid) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.event-card__date-overlay {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--color-white);
	}
	.event-card__day {
		font-size: var(--text-3xl);
		font-weight: 700;
		line-height: 1;
	}
	.event-card__month {
		font-size: var(--text-sm);
		font-weight: 600;
		text-transform: uppercase;
	}
	.event-card__body {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		flex: 1;
	}
	.event-card__meta {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	.event-card__title {
		font-size: var(--text-base);
		font-weight: 600;
		line-height: 1.4;
	}
	.event-card__info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		margin-top: auto;
	}
	.event-card__date-text,
	.event-card__location {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	/* ── Pagination ── */
	.pagination {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
		margin-top: var(--space-10);
	}
	.pagination__btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-decoration: none;
		background-color: var(--color-bg);
		transition: all var(--transition-fast);
	}
	.pagination__btn:hover { background-color: var(--color-white); color: var(--color-green-dark); }
	.pagination__btn--active {
		background-color: var(--color-green-dark);
		color: var(--color-white);
	}

	/* ── Empty ── */
	.empty-state {
		text-align: center;
		padding: var(--space-16) var(--space-4);
		color: var(--color-text-muted);
		font-size: var(--text-lg);
	}
</style>
