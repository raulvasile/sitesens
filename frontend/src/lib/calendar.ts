/**
 * Normalized shape consumed by CalendarShell. Both the events-driven
 * `<Calendar>` block and the manual `<CalendarCustom>` block map their
 * domain data to this type so they can share the same UI.
 */

import { isoDateKey, MONTH_NAMES_RO } from './dates';

export type CalendarBadgeVariant = 'default' | 'lime' | 'cream' | 'rose';

export interface CalendarEntry {
	/** Stable React-style key (event id, component id, etc.). */
	id: string | number;
	title: string;
	/** ISO datetime string. */
	start: string;
	/** ISO datetime string. Optional. */
	end?: string | null;
	/** Where to navigate on click; if absent, the row is non-clickable. */
	href?: string | null;
	/** Open the link in a new tab (external URLs). */
	external?: boolean;
	/** Short chip label (event type, category etc.). */
	badge?: string | null;
	/** Visual style for the chip. */
	badgeVariant?: CalendarBadgeVariant;
	/** Secondary line under the title (city, location, short description). */
	meta?: string | null;
}

/** Group entries by ISO YYYY-MM-DD of `start`. Insertion order preserved. */
export function entriesByDay(entries: CalendarEntry[]): Map<string, CalendarEntry[]> {
	const map = new Map<string, CalendarEntry[]>();
	for (const e of entries) {
		const d = new Date(e.start);
		const key = isoDateKey(d.getFullYear(), d.getMonth(), d.getDate());
		const arr = map.get(key) ?? [];
		arr.push(e);
		map.set(key, arr);
	}
	return map;
}

/** Group entries by year-month with a Romanian display label. */
export function groupByMonth(entries: CalendarEntry[]): Array<{ label: string; entries: CalendarEntry[] }> {
	const groups = new Map<string, { label: string; entries: CalendarEntry[] }>();
	for (const e of entries) {
		const d = new Date(e.start);
		const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
		const label = `${MONTH_NAMES_RO[d.getMonth()]} ${d.getFullYear()}`;
		if (!groups.has(key)) groups.set(key, { label, entries: [] });
		groups.get(key)!.entries.push(e);
	}
	return [...groups.values()];
}

/**
 * Build the 6-week (42-cell) grid layout for a given month, with leading
 * days from the previous month and trailing days from the next so each
 * cell has a known year/month/day.
 */
export interface MonthCell {
	day: number;
	month0: number;
	year: number;
	isCurrentMonth: boolean;
}

export function buildMonthGrid(year: number, month0: number): MonthCell[] {
	const lastOfMonth = new Date(year, month0 + 1, 0);
	// Monday-first week: shift JS Sunday-first values.
	const firstWeekdayJs = new Date(year, month0, 1).getDay();
	const startPad = firstWeekdayJs === 0 ? 6 : firstWeekdayJs - 1;

	const cells: MonthCell[] = [];

	const prevMonthLastDay = new Date(year, month0, 0).getDate();
	for (let i = startPad - 1; i >= 0; i--) {
		const d = prevMonthLastDay - i;
		const m = month0 === 0 ? 11 : month0 - 1;
		const y = month0 === 0 ? year - 1 : year;
		cells.push({ day: d, month0: m, year: y, isCurrentMonth: false });
	}
	for (let d = 1; d <= lastOfMonth.getDate(); d++) {
		cells.push({ day: d, month0, year, isCurrentMonth: true });
	}
	// Pad to 6 full weeks (42 cells) so the grid height stays stable across months.
	const totalCells = Math.ceil(cells.length / 7) * 7;
	let nextDay = 1;
	while (cells.length < Math.max(totalCells, 35)) {
		const m = month0 === 11 ? 0 : month0 + 1;
		const y = month0 === 11 ? year + 1 : year;
		cells.push({ day: nextDay, month0: m, year: y, isCurrentMonth: false });
		nextDay++;
	}
	return cells;
}
