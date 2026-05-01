/**
 * Event-type metadata shared between event listing, detail page, calendar
 * block and upcoming events block. Keep in sync with the `event_type` enum
 * in `strapi/src/api/event/content-types/event/schema.json`.
 *
 * Labels are TitleCase — chips that need uppercase use `text-transform: uppercase`
 * in CSS so this is the canonical form.
 */

export type EventType = 'dezbatere' | 'actiune' | 'mars' | 'online';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
	dezbatere: 'Dezbatere',
	actiune: 'Acțiune',
	mars: 'Marș',
	online: 'Online',
};

/** Lookup helper that falls back to the raw key if a future type slips in. */
export function eventTypeLabel(type: string | null | undefined): string {
	if (!type) return '';
	return EVENT_TYPE_LABELS[type as EventType] ?? type;
}
