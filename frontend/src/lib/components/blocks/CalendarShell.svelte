<script lang="ts">
	import {
		MONTH_NAMES_RO,
		WEEKDAYS_RO_SHORT,
		WEEKDAYS_RO_ABBR,
		formatTime,
		isoDateKey,
	} from '$lib/dates';
	import {
		buildMonthGrid,
		entriesByDay,
		groupByMonth,
		type CalendarEntry,
	} from '$lib/calendar';

	interface Props {
		entries: CalendarEntry[];
		anchorId?: string;
		kicker?: string;
		heading: string;
		subheading?: string;
		defaultView?: 'month' | 'list';
		showViewToggle?: boolean;
		emptyStateText?: string;
		background?: 'paper' | 'cream';
	}

	let {
		entries,
		anchorId,
		kicker,
		heading,
		subheading,
		defaultView = 'month',
		showViewToggle = true,
		emptyStateText = 'Niciun eveniment programat momentan.',
		background = 'paper',
	}: Props = $props();

	let view = $state<'month' | 'list'>(defaultView);

	const today = new Date();
	let cursorYear = $state(today.getFullYear());
	let cursorMonth = $state(today.getMonth());
	let selectedDay = $state<string | null>(null);

	function gotoPrevMonth() {
		if (cursorMonth === 0) { cursorMonth = 11; cursorYear--; }
		else cursorMonth--;
		selectedDay = null;
	}
	function gotoNextMonth() {
		if (cursorMonth === 11) { cursorMonth = 0; cursorYear++; }
		else cursorMonth++;
		selectedDay = null;
	}
	function gotoToday() {
		cursorYear = today.getFullYear();
		cursorMonth = today.getMonth();
		selectedDay = null;
	}

	const byDay = $derived(entriesByDay(entries));
	const monthGrid = $derived(buildMonthGrid(cursorYear, cursorMonth));
	const selectedDayEntries = $derived(selectedDay ? byDay.get(selectedDay) ?? [] : []);
	const todayKey = $derived(isoDateKey(today.getFullYear(), today.getMonth(), today.getDate()));
	const listGroups = $derived(groupByMonth(entries));

	function selectDay(year: number, month0: number, day: number) {
		const key = isoDateKey(year, month0, day);
		selectedDay = selectedDay === key ? null : key;
	}

	function formatDayLong(key: string): string {
		const [y, m, d] = key.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString('ro-RO', {
			weekday: 'long', day: 'numeric', month: 'long',
		});
	}

	function linkAttrs(entry: CalendarEntry) {
		if (!entry.href) return {};
		return entry.external
			? { href: entry.href, target: '_blank', rel: 'noopener noreferrer' }
			: { href: entry.href };
	}
</script>

<section class="cal cal--{background}" id={anchorId || undefined}>
	<div class="container">
		<header class="cal__head">
			<div>
				{#if kicker}<div class="cal__kicker">— {kicker}</div>{/if}
				<h2 class="cal__heading">{heading}</h2>
				{#if subheading}<p class="cal__sub">{subheading}</p>{/if}
			</div>
			{#if showViewToggle}
				<div class="cal__toggle" role="tablist" aria-label="Vizualizare calendar">
					<button
						type="button"
						role="tab"
						aria-selected={view === 'month'}
						class="cal__toggle-btn"
						class:active={view === 'month'}
						onclick={() => (view = 'month')}
					>Lună</button>
					<button
						type="button"
						role="tab"
						aria-selected={view === 'list'}
						class="cal__toggle-btn"
						class:active={view === 'list'}
						onclick={() => (view = 'list')}
					>Listă</button>
				</div>
			{/if}
		</header>

		{#if entries.length === 0}
			<p class="cal__empty">{emptyStateText}</p>
		{:else if view === 'month'}
			<div class="cal__nav">
				<button type="button" class="cal__nav-btn" onclick={gotoPrevMonth} aria-label="Luna anterioară">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
				</button>
				<h3 class="cal__nav-label">
					<span>{MONTH_NAMES_RO[cursorMonth]}</span>
					<span class="cal__nav-year">{cursorYear}</span>
				</h3>
				<button type="button" class="cal__nav-btn" onclick={gotoNextMonth} aria-label="Luna următoare">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
				</button>
				{#if cursorMonth !== today.getMonth() || cursorYear !== today.getFullYear()}
					<button type="button" class="cal__today-btn" onclick={gotoToday}>Astăzi</button>
				{/if}
			</div>

			<div class="cal__grid" role="grid">
				{#each WEEKDAYS_RO_SHORT as wd}
					<div class="cal__weekday" role="columnheader">{wd}</div>
				{/each}
				{#each monthGrid as cell}
					{@const key = isoDateKey(cell.year, cell.month0, cell.day)}
					{@const dayItems = byDay.get(key) ?? []}
					{@const hasItems = dayItems.length > 0}
					{@const isToday = key === todayKey}
					{@const isSelected = key === selectedDay}
					<button
						type="button"
						class="cal__cell"
						class:cal__cell--out={!cell.isCurrentMonth}
						class:cal__cell--today={isToday}
						class:cal__cell--has={hasItems}
						class:cal__cell--sel={isSelected}
						disabled={!hasItems}
						onclick={() => hasItems && selectDay(cell.year, cell.month0, cell.day)}
						aria-label={hasItems
							? `${cell.day} ${MONTH_NAMES_RO[cell.month0]} — ${dayItems.length} ${dayItems.length === 1 ? 'intrare' : 'intrări'}`
							: `${cell.day} ${MONTH_NAMES_RO[cell.month0]}`}
					>
						<span class="cal__cell-num">{cell.day}</span>
						{#if hasItems}
							<span class="cal__cell-dot" aria-hidden="true">{dayItems.length}</span>
						{/if}
					</button>
				{/each}
			</div>

			{#if selectedDay && selectedDayEntries.length > 0}
				<div class="cal__day-events">
					<div class="cal__day-events-head">{formatDayLong(selectedDay)}</div>
					<ul class="cal__day-events-list">
						{#each selectedDayEntries as entry}
							{@const tag = entry.href ? 'a' : 'div'}
							<li>
								<svelte:element this={tag} class="cal__day-event" {...linkAttrs(entry)}>
									<time class="cal__day-event-time">
										{formatTime(entry.start)}{#if entry.end} – {formatTime(entry.end)}{/if}
									</time>
									<span class="cal__day-event-title">{entry.title}</span>
									<span class="cal__day-event-meta">
										{#if entry.badge}
											<span class="cal__chip cal__chip--{entry.badgeVariant ?? 'default'}">{entry.badge}</span>
										{/if}
										{#if entry.meta}{entry.badge ? '·' : ''} {entry.meta}{/if}
									</span>
								</svelte:element>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{:else}
			<div class="cal__list">
				{#each listGroups as group}
					<section class="cal__list-group">
						<h3 class="cal__list-month">{group.label}</h3>
						<ul class="cal__list-events">
							{#each group.entries as entry}
								{@const d = new Date(entry.start)}
								{@const tag = entry.href ? 'a' : 'div'}
								<li>
									<svelte:element this={tag} class="cal__list-event" {...linkAttrs(entry)}>
										<div class="cal__list-date">
											<span class="cal__list-day">{d.getDate()}</span>
											<span class="cal__list-weekday">{WEEKDAYS_RO_ABBR[d.getDay()]}</span>
										</div>
										<div class="cal__list-body">
											{#if entry.badge}
												<span class="cal__chip cal__chip--{entry.badgeVariant ?? 'default'}">{entry.badge}</span>
											{/if}
											<span class="cal__list-title">{entry.title}</span>
											<span class="cal__list-meta">
												{formatTime(entry.start)}{#if entry.end} – {formatTime(entry.end)}{/if}
												{#if entry.meta} · {entry.meta}{/if}
											</span>
										</div>
										{#if entry.href}
											<span class="cal__list-arrow" aria-hidden="true">→</span>
										{/if}
									</svelte:element>
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.cal { padding-block: var(--space-12); }
	@media (min-width: 768px) { .cal { padding-block: var(--space-16); } }
	.cal--paper { background-color: var(--color-paper); }
	.cal--cream { background-color: var(--color-cream); }

	.cal__head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-6);
		margin-bottom: var(--space-8);
		flex-wrap: wrap;
	}
	.cal__kicker {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.7;
		margin-bottom: var(--space-2);
	}
	.cal__heading {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 3rem);
		font-weight: 500;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		line-height: 1;
		color: var(--color-ink);
		margin: 0;
	}
	.cal__sub {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
		margin: var(--space-3) 0 0;
		max-width: 60ch;
	}

	.cal__toggle {
		display: inline-flex;
		border: 2px solid var(--color-ink);
		flex-shrink: 0;
	}
	.cal__toggle-btn {
		padding: 0.5rem 1.1rem;
		background: transparent;
		border: none;
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink);
		cursor: pointer;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}
	.cal__toggle-btn + .cal__toggle-btn { border-left: 2px solid var(--color-ink); }
	.cal__toggle-btn.active {
		background: var(--color-ink);
		color: var(--color-lime);
	}
	@media (hover: hover) {
		.cal__toggle-btn:not(.active):hover { background: var(--color-cream); }
	}

	.cal__empty {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-ink-soft);
		opacity: 0.7;
		text-align: center;
		padding: var(--space-8);
		border: 2px dashed rgba(12, 81, 24, 0.2);
	}

	.cal__nav {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-5);
	}
	.cal__nav-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: transparent;
		border: 2px solid var(--color-ink);
		color: var(--color-ink);
		cursor: pointer;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}
	@media (hover: hover) {
		.cal__nav-btn:hover { background: var(--color-ink); color: var(--color-lime); }
	}
	.cal__nav-label {
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 2vw, 1.625rem);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: -0.01em;
		color: var(--color-ink);
		margin: 0;
		display: inline-flex;
		gap: var(--space-2);
		align-items: baseline;
	}
	.cal__nav-year {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		letter-spacing: 0.14em;
		opacity: 0.6;
	}
	.cal__today-btn {
		margin-left: auto;
		padding: 0.4rem 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		background: transparent;
		border: 1px solid rgba(12, 81, 24, 0.4);
		color: var(--color-ink-soft);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.cal__today-btn:hover { border-color: var(--color-ink); color: var(--color-ink); }

	.cal__grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
		background-color: var(--color-ink);
		border: 2px solid var(--color-ink);
	}
	.cal__weekday {
		background: var(--color-ink);
		color: var(--color-cream);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 8px 6px;
		text-align: center;
		border-bottom: 1px solid rgba(252, 246, 232, 0.15);
	}
	.cal__cell {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-1);
		min-height: 76px;
		padding: 8px 8px 6px;
		background: var(--color-paper);
		border: none;
		text-align: left;
		font-family: inherit;
		color: var(--color-ink);
		cursor: default;
		transition: background-color var(--transition-fast);
	}
	.cal--cream .cal__cell { background: var(--color-cream); }

	@media (max-width: 640px) {
		.cal__cell { min-height: 56px; padding: 4px; }
	}

	.cal__cell--out { color: var(--color-ink-soft); opacity: 0.4; }
	.cal__cell--today .cal__cell-num {
		color: var(--color-green-deep);
		font-weight: 700;
	}
	.cal__cell--has {
		cursor: pointer;
		font-weight: 500;
	}
	@media (hover: hover) {
		.cal__cell--has:hover { background: var(--color-cream); }
		.cal--cream .cal__cell--has:hover { background: var(--color-paper); }
	}
	.cal__cell--sel {
		background: var(--color-lime) !important;
		color: var(--color-ink);
	}
	.cal__cell--sel .cal__cell-num,
	.cal__cell--sel .cal__cell-dot { color: var(--color-ink); }

	.cal__cell-num {
		font-family: var(--font-display);
		font-size: 1rem;
		line-height: 1;
	}
	@media (max-width: 640px) {
		.cal__cell-num { font-size: 0.875rem; }
	}
	.cal__cell-dot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		background: var(--color-green-deep);
		color: var(--color-lime);
		font-family: var(--font-mono);
		font-size: 0.625rem;
		font-weight: 500;
		align-self: flex-end;
	}

	.cal__day-events {
		margin-top: var(--space-5);
		padding: var(--space-5);
		background: var(--color-cream);
		border-left: 3px solid var(--color-lime);
	}
	.cal--cream .cal__day-events { background: var(--color-paper); }
	.cal__day-events-head {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		margin-bottom: var(--space-3);
	}
	.cal__day-events-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-3); }
	.cal__day-event {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 4px var(--space-4);
		align-items: baseline;
		padding: var(--space-3) 0;
		border-top: 1px solid rgba(12, 81, 24, 0.1);
		text-decoration: none;
		color: var(--color-ink);
		transition: padding-left var(--transition-fast);
	}
	.cal__day-event:first-child { border-top: none; padding-top: 0; }
	@media (hover: hover) {
		a.cal__day-event:hover { padding-left: var(--space-2); }
	}
	.cal__day-event-time {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		letter-spacing: 0.04em;
		color: var(--color-green-deep);
		grid-row: 1;
	}
	.cal__day-event-title {
		font-family: var(--font-display);
		font-size: 1.0625rem;
		font-weight: 500;
		line-height: 1.2;
		grid-row: 1;
	}
	.cal__day-event-meta {
		grid-column: 2;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		opacity: 0.75;
		display: inline-flex;
		gap: var(--space-2);
		align-items: center;
	}

	/* ── Chip variants ── */
	.cal__chip {
		display: inline-flex;
		align-items: center;
		padding: 2px 8px;
		font-family: var(--font-display);
		font-size: 0.625rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		line-height: 1.4;
		flex-shrink: 0;
	}
	.cal__chip--default { background: var(--color-green-deep); color: var(--color-lime); }
	.cal__chip--lime { background: var(--color-lime); color: var(--color-ink); }
	.cal__chip--cream { background: var(--color-cream); color: var(--color-ink); border: 1px solid var(--color-ink); }
	.cal__chip--rose { background: #ffd6e0; color: var(--color-ink); }

	.cal__list { display: flex; flex-direction: column; gap: var(--space-8); }
	.cal__list-month {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		padding-bottom: var(--space-2);
		border-bottom: 2px solid var(--color-ink);
		margin: 0 0 var(--space-4);
	}
	.cal__list-events { list-style: none; padding: 0; margin: 0; }
	.cal__list-event {
		display: grid;
		grid-template-columns: 64px 1fr auto;
		gap: var(--space-4);
		align-items: center;
		padding: var(--space-4) 0;
		border-bottom: 1px solid rgba(12, 81, 24, 0.12);
		text-decoration: none;
		color: var(--color-ink);
		transition: padding-left var(--transition-fast);
	}
	@media (hover: hover) {
		a.cal__list-event:hover { padding-left: var(--space-3); }
		a.cal__list-event:hover .cal__list-arrow { color: var(--color-green-deep); transform: translateX(4px); }
	}
	.cal__list-date {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		line-height: 1;
	}
	.cal__list-day {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 500;
		color: var(--color-green-deep);
		letter-spacing: -0.02em;
	}
	.cal__list-weekday {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.14em;
		color: var(--color-ink-soft);
		margin-top: 4px;
	}
	.cal__list-body {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
	.cal__list-body .cal__chip { align-self: flex-start; }
	.cal__list-title {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 500;
		line-height: 1.2;
		color: var(--color-ink);
	}
	.cal__list-meta {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		color: var(--color-ink-soft);
		opacity: 0.8;
	}
	.cal__list-arrow {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--color-ink-soft);
		opacity: 0.5;
		transition: color var(--transition-fast), transform var(--transition-fast);
	}

	@media (max-width: 480px) {
		.cal__list-event { grid-template-columns: 56px 1fr; }
		.cal__list-arrow { display: none; }
	}
</style>
