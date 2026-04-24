<script lang="ts">
	import { getStrapiMediaUrl } from '$lib/strapi';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let typeDropdownOpen = $state(false);

	function closeDropdowns() {
		typeDropdownOpen = false;
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		function handler(e: MouseEvent) {
			if (!typeDropdownOpen) return;
			const target = e.target as HTMLElement;
			if (!target.closest('.type-dropdown')) typeDropdownOpen = false;
		}
		function escHandler(e: KeyboardEvent) {
			if (e.key === 'Escape') typeDropdownOpen = false;
		}
		document.addEventListener('click', handler);
		document.addEventListener('keydown', escHandler);
		return () => {
			document.removeEventListener('click', handler);
			document.removeEventListener('keydown', escHandler);
		};
	});

	const events = $derived(data.events);
	const featured = $derived(data.featured);
	const pageCfg = $derived(data.page);
	const pagination = $derived(data.pagination);
	const activeTab = $derived(data.activeTab);
	const activeType = $derived(data.activeType);

	// Events in list show ALL events (featured included — highlighted separately above)
	const listEvents = $derived(events);

	const eventTypeLabels: Record<string, string> = {
		dezbatere: 'DEZBATERE',
		actiune: 'ACȚIUNE',
		mars: 'MARȘ',
		online: 'ONLINE',
	};

	const eventTypes = [
		{ value: '', label: pageCfg?.filter_all_label ?? 'Toate' },
		{ value: 'dezbatere', label: 'Dezbatere' },
		{ value: 'actiune', label: 'Acțiune' },
		{ value: 'mars', label: 'Marș' },
		{ value: 'online', label: 'Online' },
	];

	function formatDay(dateStr: string): string {
		return String(new Date(dateStr).getDate()).padStart(2, '0');
	}
	function formatMonth(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('ro-RO', { month: 'short' }).toUpperCase().replace('.', '');
	}
	function formatYear(dateStr: string): string {
		return String(new Date(dateStr).getFullYear());
	}
	function formatTime(dateStr: string): string {
		return new Date(dateStr).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
	}
	function formatInterval(start: string, end?: string | null): string {
		const s = formatTime(start);
		if (!end) return s;
		return `${s} – ${formatTime(end)}`;
	}
	function spotsText(event: { spots_taken?: number | null; max_participants?: number | null }): string | null {
		if (event.max_participants == null) return null;
		const taken = event.spots_taken ?? 0;
		const tpl = pageCfg?.spots_template ?? '{taken} / {max} locuri';
		return tpl.replace('{taken}', String(taken)).replace('{max}', String(event.max_participants));
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
	title={pageCfg?.seo?.meta_title ?? pageCfg?.title ?? 'Evenimente'}
	description={pageCfg?.seo?.meta_description ?? pageCfg?.lead ?? 'Evenimente ale Partidului SENS.'}
/>

<div class="container page-header">
	<Breadcrumb items={[{ label: 'Evenimente' }]} />
	<h1 class="page-header__title">
		{pageCfg?.title ?? 'Ne vedem'}{#if pageCfg?.title_italic}
			<span class="page-header__title-italic"> {pageCfg.title_italic}</span>
		{/if}
	</h1>
	{#if pageCfg?.lead}
		<p class="page-header__lead">{pageCfg.lead}</p>
	{/if}
</div>

<!-- ═══════ FEATURED EVENT (always visible) ═══════ -->
{#if featured}
	<section class="featured container">
		<div class="featured__inner">
			<div class="featured__photo">
				{#if featured.cover_image?.url}
					<img
						src={getStrapiMediaUrl(featured.cover_image.url)}
						alt={featured.cover_image.alternativeText ?? featured.title}
					/>
				{:else}
					<div class="featured__photo-placeholder photo-placeholder photo-placeholder--dark">
						· {featured.title} ·
					</div>
				{/if}
			</div>

			<div class="featured__content">
				<div class="featured__chips">
					<span class="chip">{eventTypeLabels[featured.event_type] ?? featured.event_type}</span>
					{#if featured.is_featured}
						<span class="chip chip-outline featured__chip-light">{pageCfg?.featured_label ?? 'FEATURED'}</span>
					{/if}
				</div>

				<div class="featured__date">
					<span class="featured__day">{formatDay(featured.start_date)}</span>
					<span class="featured__month">{formatMonth(featured.start_date)} {formatYear(featured.start_date)}</span>
				</div>

				<h2 class="featured__title">{featured.title}</h2>

				<div class="featured__info">
					<div class="featured__info-col">
						<div class="featured__info-label">{pageCfg?.location_label ?? 'Locație'}</div>
						<div class="featured__info-value">
							{featured.venue ?? featured.location_name ?? '—'}
							{#if featured.city}<br/>{featured.city}{/if}
						</div>
					</div>
					<div class="featured__info-col">
						<div class="featured__info-label">{pageCfg?.interval_label ?? 'Interval'}</div>
						<div class="featured__info-value">{formatInterval(featured.start_date, featured.end_date)}</div>
						{#if spotsText(featured)}
							<div class="featured__spots">{spotsText(featured)}</div>
						{/if}
					</div>
				</div>

				<div class="featured__ctas">
					<a href={featured.registration_url ?? `/evenimente/${featured.slug}`} class="btn btn-lime">
						{pageCfg?.featured_cta_primary ?? 'Rezervă loc'}
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</a>
					<a href="/evenimente/{featured.slug}" class="btn btn-outline-cream">
						{pageCfg?.featured_cta_secondary ?? '+ Adaugă în calendar'}
					</a>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- ═══════ FILTERS ═══════ -->
<div class="container filters">
	<div class="filters__tabs">
		<a
			href={buildUrl({ tab: 'viitoare', type: activeType })}
			class="filter-pill"
			class:filter-pill--active={activeTab === 'viitoare'}
		>Viitoare</a>
		<a
			href={buildUrl({ tab: 'trecute', type: activeType })}
			class="filter-pill"
			class:filter-pill--active={activeTab === 'trecute'}
		>Trecute</a>
	</div>

	{#snippet currentTypeLabel()}
		{eventTypes.find((et) => et.value === activeType)?.label ?? 'Tip eveniment'}
	{/snippet}

	<div class="type-dropdown">
		<button
			class="filter-pill filter-pill--dropdown"
			class:filter-pill--active={!!activeType}
			aria-expanded={typeDropdownOpen}
			aria-haspopup="menu"
			onclick={(e) => { e.stopPropagation(); typeDropdownOpen = !typeDropdownOpen; }}
		>
			Tip eveniment{activeType ? `: ${eventTypes.find((et) => et.value === activeType)?.label ?? ''}` : ''}
			<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>
		{#if typeDropdownOpen}
			<div class="type-dropdown__menu" role="menu">
				{#each eventTypes as et}
					<a
						href={buildUrl({ tab: activeTab, type: et.value })}
						class="type-dropdown__item"
						class:type-dropdown__item--active={activeType === et.value}
						role="menuitem"
						onclick={closeDropdowns}
					>{et.label}</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- ═══════ EVENT LIST (horizontal rows) ═══════ -->
{#key activeTab + activeType}
<div class="container events-list-wrapper" in:fade={{ duration: 280, delay: 80 }}>
	{#if listEvents.length > 0}
		<ul class="events-list">
			{#each listEvents as event}
				<li>
					<a href="/evenimente/{event.slug}" class="event-row">
						<div class="event-row__date">
							<span class="event-row__day">{formatDay(event.start_date)}</span>
							<span class="event-row__month">{formatMonth(event.start_date)}</span>
						</div>
						<span class="chip chip-outline event-row__tag">
							{eventTypeLabels[event.event_type] ?? event.event_type}
						</span>
						<div class="event-row__info">
							<div class="event-row__title">{event.title}</div>
							<div class="event-row__meta">
								{#if event.city}{event.city.toUpperCase()}{:else if event.location_name}{event.location_name.toUpperCase()}{/if}
								{#if event.venue} · {event.venue}{/if}
							</div>
						</div>
						<div class="event-row__time">{formatTime(event.start_date)}</div>
						<span class="event-row__cta">
							{pageCfg?.list_reserve_cta ?? 'Rezervă'}
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
								<line x1="5" y1="12" x2="19" y2="12" />
								<polyline points="12 5 19 12 12 19" />
							</svg>
						</span>
					</a>
				</li>
			{/each}
		</ul>

		{#if pagination.pageCount > 1}
			<nav class="pagination" aria-label="Paginare evenimente">
				{#each Array(pagination.pageCount) as _, i}
					<a
						href={buildUrl({ tab: activeTab, type: activeType, page: String(i + 1) })}
						class="pagination__btn"
						class:pagination__btn--active={pagination.page === i + 1}
						aria-current={pagination.page === i + 1 ? 'page' : undefined}
					>{i + 1}</a>
				{/each}
			</nav>
		{/if}
	{:else if !featured}
		<div class="empty-state">
			<p>{pageCfg?.empty_state ?? 'Nu sunt evenimente programate momentan.'}</p>
		</div>
	{/if}
</div>
{/key}

<!-- ═══════ HOST YOUR EVENT ═══════ -->
{#if pageCfg?.host_section_visible !== false && pageCfg?.host_section_title}
	<section class="host">
		<div class="container host__inner">
			<div>
				<div class="host__kicker">— {pageCfg.host_section_kicker ?? 'Filiale'}</div>
				<h2 class="host__title">{pageCfg.host_section_title}</h2>
			</div>
			<div class="host__right">
				{#if pageCfg.host_section_body}
					<p class="host__body">{pageCfg.host_section_body}</p>
				{/if}
				{#if pageCfg.host_section_cta}
					<a href={pageCfg.host_section_url ?? '/contact'} class="host__cta">
						{pageCfg.host_section_cta}
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</a>
				{/if}
			</div>
		</div>
	</section>
{/if}

<style>
	/* ── Page header ── */
	.page-header {
		padding-block: var(--space-10) var(--space-8);
	}
	.page-header__title {
		margin-top: var(--space-5);
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 7vw + 1rem, 8.25rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 0.95;
		color: var(--color-ink);
		max-width: 1200px;
		text-transform: none;
	}
	.page-header__title-italic {
		color: var(--color-green-deep);
		font-style: italic;
		font-weight: 400;
	}
	.page-header__lead {
		font-family: var(--font-body);
		font-size: clamp(1rem, 1vw + 0.75rem, 1.25rem);
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin-top: var(--space-6);
		max-width: 640px;
	}

	/* ── Featured event ── */
	.featured {
		padding-bottom: var(--space-12);
	}
	.featured__inner {
		display: grid;
		grid-template-columns: 1fr;
		background-color: var(--color-green-deep);
		color: var(--color-cream);
		min-height: 440px;
	}
	@media (min-width: 960px) {
		.featured__inner {
			grid-template-columns: 1.4fr 1fr;
		}
	}
	.featured__photo {
		min-height: 260px;
		background-color: var(--color-green-dark);
		overflow: hidden;
	}
	.featured__photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		min-height: 260px;
	}
	.featured__photo-placeholder {
		min-height: 260px;
		color: rgba(245, 241, 232, 0.5);
	}

	.featured__content {
		padding: var(--space-8);
		display: flex;
		flex-direction: column;
	}
	@media (min-width: 960px) {
		.featured__content { padding: 48px; }
		.featured__photo, .featured__photo img { min-height: 440px; }
	}

	.featured__chips {
		display: flex;
		gap: 10px;
		margin-bottom: var(--space-6);
		flex-wrap: wrap;
	}
	.featured__chip-light {
		color: var(--color-cream);
		border-color: rgba(245, 241, 232, 0.4);
	}

	.featured__date {
		font-family: var(--font-display);
		line-height: 1;
		margin-bottom: var(--space-3);
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex-wrap: wrap;
	}
	.featured__day {
		font-size: clamp(3rem, 7vw, 4.5rem);
		color: var(--color-lime);
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.featured__month {
		font-family: var(--font-display);
		font-size: 1.25rem;
		opacity: 0.75;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.featured__title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 3vw + 0.5rem, 2.75rem);
		line-height: 1.05;
		font-weight: 500;
		letter-spacing: -0.01em;
		margin-bottom: var(--space-5);
		color: var(--color-cream);
	}

	.featured__info {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
		padding-top: var(--space-5);
		margin-bottom: var(--space-8);
		border-top: 1px solid rgba(145, 255, 0, 0.2);
	}
	.featured__info-label {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(245, 241, 232, 0.55);
		margin-bottom: 4px;
	}
	.featured__info-value {
		font-size: 0.9375rem;
		line-height: 1.4;
	}
	.featured__spots {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.08em;
		color: var(--color-lime);
		margin-top: 6px;
	}

	.featured__ctas {
		display: flex;
		gap: var(--space-3);
		margin-top: auto;
		flex-wrap: wrap;
	}

	/* ── Filters ── */
	.filters {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
		padding-bottom: var(--space-6);
	}
	.filters__tabs {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.filter-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		border: 1.5px solid rgba(12, 81, 24, 0.3);
		background: transparent;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		text-decoration: none;
		transition: all var(--transition-fast);
		cursor: pointer;
	}
	.filter-pill:hover,
	.filter-pill:active {
		background-color: var(--color-cream);
		color: var(--color-ink);
	}
	.filter-pill--active,
	.filter-pill--active:hover,
	.filter-pill--active:active {
		background-color: var(--color-green-deep);
		color: var(--color-lime);
		border-color: var(--color-green-deep);
	}

	/* Dropdown — tip eveniment */
	.type-dropdown {
		position: relative;
	}
	.filter-pill--dropdown {
		border: 1.5px solid rgba(12, 81, 24, 0.3);
	}
	.filter-pill--dropdown svg {
		transition: transform var(--transition-fast);
	}
	.filter-pill--dropdown[aria-expanded="true"] svg {
		transform: rotate(180deg);
	}

	.type-dropdown__menu {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		min-width: 200px;
		background-color: var(--color-paper);
		border: 1.5px solid var(--color-ink);
		display: flex;
		flex-direction: column;
		z-index: 10;
		animation: dropdown-in 0.18s cubic-bezier(0.2, 0.7, 0.3, 1);
	}

	@keyframes dropdown-in {
		from { opacity: 0; transform: translateY(-4px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.type-dropdown__item {
		padding: 10px 14px;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		text-decoration: none;
		border-bottom: 1px solid rgba(12, 81, 24, 0.12);
		transition: background-color var(--transition-fast);
	}
	.type-dropdown__item:last-child {
		border-bottom: none;
	}
	.type-dropdown__item:hover {
		background-color: var(--color-cream);
	}
	.type-dropdown__item--active {
		background-color: var(--color-lime);
	}

	/* ── Events list ── */
	.events-list-wrapper {
		padding-bottom: var(--space-16);
	}
	.events-list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid rgba(12, 81, 24, 0.15);
	}
	.events-list li {
		border-bottom: 1px solid rgba(12, 81, 24, 0.15);
	}

	.event-row {
		display: grid;
		grid-template-columns: 100px 1fr auto;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-5) 0;
		text-decoration: none;
		color: var(--color-ink);
		transition: padding var(--transition-fast), background-color var(--transition-fast);
	}
	.event-row:hover {
		padding-left: 12px;
		background-color: var(--color-cream);
	}

	.event-row__date {
		font-family: var(--font-display);
		line-height: 1;
		display: flex;
		align-items: baseline;
		gap: 6px;
	}
	.event-row__day {
		font-size: clamp(1.75rem, 3vw, 2.75rem);
		color: var(--color-green-deep);
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.event-row__month {
		font-family: var(--font-display);
		font-size: 0.875rem;
		opacity: 0.7;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.event-row__tag {
		display: none;
	}

	.event-row__info {
		min-width: 0;
	}
	.event-row__title {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 500;
		letter-spacing: -0.005em;
		line-height: 1.15;
		margin-bottom: 4px;
		color: var(--color-ink);
	}
	.event-row__meta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.8;
	}

	.event-row__time {
		display: none;
	}

	.event-row__cta {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.event-row:hover .event-row__cta {
		color: var(--color-green-deep);
	}

	/* Desktop layout: 5 columns */
	@media (min-width: 960px) {
		.event-row {
			grid-template-columns: 120px 140px 1fr 140px 120px;
			padding: 28px 0;
		}
		.event-row__tag {
			display: inline-flex;
			justify-self: start;
			align-self: center;
		}
		.event-row__title {
			font-size: 1.375rem;
			margin-bottom: 4px;
		}
		.event-row__time {
			display: block;
			font-family: var(--font-mono);
			font-size: 0.8125rem;
			opacity: 0.7;
		}
		.event-row__cta {
			justify-self: end;
		}
	}

	/* ── Pagination ── */
	.pagination {
		display: flex;
		justify-content: center;
		gap: var(--space-1);
		padding-top: var(--space-8);
	}
	.pagination__btn {
		min-width: 40px;
		height: 40px;
		padding-inline: var(--space-3);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1.5px solid var(--color-ink);
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		color: var(--color-ink);
		text-decoration: none;
		background-color: transparent;
		transition: all var(--transition-fast);
	}
	.pagination__btn:hover { background-color: var(--color-cream); }
	.pagination__btn--active {
		background-color: var(--color-ink);
		color: var(--color-lime);
	}

	/* ── Empty ── */
	.empty-state {
		text-align: center;
		padding: var(--space-16) var(--space-4);
		color: var(--color-ink-soft);
		font-family: var(--font-body);
		font-size: var(--text-lg);
	}

	/* ── Host section (lime band) ── */
	.host {
		background-color: var(--color-lime);
		color: var(--color-ink);
		padding-block: var(--space-16);
		border-block: 2px solid var(--color-ink);
	}
	.host__inner {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		align-items: center;
	}
	@media (min-width: 960px) {
		.host__inner { grid-template-columns: 2fr 1fr; gap: var(--space-12); }
	}
	.host__kicker {
		font-family: var(--font-display);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.7;
		margin-bottom: var(--space-3);
	}
	.host__title {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 4rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
		color: var(--color-ink);
	}
	.host__body {
		font-size: var(--text-base);
		line-height: 1.5;
		opacity: 0.85;
		margin-bottom: var(--space-6);
	}
	.host__cta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		background-color: var(--color-ink);
		color: var(--color-lime);
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.875rem 1.5rem;
		text-decoration: none;
		border: 1.5px solid var(--color-ink);
		transition: gap var(--transition-fast), background-color var(--transition-fast);
	}
	.host__cta:hover {
		gap: var(--space-3);
		background-color: var(--color-green-deep);
		color: var(--color-lime);
	}
</style>
