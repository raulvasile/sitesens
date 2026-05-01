/**
 * Romanian date formatting utilities. All consumers (Calendar, UpcomingEvents,
 * evenimente list/detail pages) share these to keep month/weekday spelling
 * consistent across the site.
 */

/** Full month names — used in headings ("Ianuarie 2026"). */
export const MONTH_NAMES_RO = [
	'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
	'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
] as const;

/** 3-letter abbreviations — used in event cards and date stamps. */
export const MONTH_ABBR_RO = [
	'IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN',
	'IUL', 'AUG', 'SEP', 'OCT', 'NOI', 'DEC',
] as const;

/** 1–2 letter weekday header for calendar grid (Monday-first). */
export const WEEKDAYS_RO_SHORT = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'] as const;

/**
 * 3-letter weekday for date stamps (Sunday-first to match `Date.getDay()`).
 * Index directly with `date.getDay()`.
 */
export const WEEKDAYS_RO_ABBR = ['DUM', 'LUN', 'MAR', 'MIE', 'JOI', 'VIN', 'SÂM'] as const;

/** "14:30" — 24h time, ro-RO. */
export function formatTime(iso: string): string {
	return new Date(iso).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
}

/** "luni, 28 aprilie 2026". */
export function formatDateLong(iso: string): string {
	return new Date(iso).toLocaleDateString('ro-RO', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

/** Split an ISO string into zero-padded day, abbreviated month, full year. */
export function dayParts(iso: string): { day: string; month: string; year: number } {
	const d = new Date(iso);
	return {
		day: String(d.getDate()).padStart(2, '0'),
		month: MONTH_ABBR_RO[d.getMonth()],
		year: d.getFullYear(),
	};
}

/** ISO date key "YYYY-MM-DD" — useful as Map key for grouping events by day. */
export function isoDateKey(year: number, month0: number, day: number): string {
	return `${year}-${String(month0 + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
