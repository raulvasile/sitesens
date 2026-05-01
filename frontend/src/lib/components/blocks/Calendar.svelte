<script lang="ts">
	import CalendarShell from './CalendarShell.svelte';
	import { eventTypeLabel, type EventType } from '$lib/events';
	import type { CalendarEntry } from '$lib/calendar';

	interface CalendarEvent {
		id: number;
		title: string;
		slug: string;
		start_date: string;
		end_date: string | null;
		event_type: EventType;
		venue?: string | null;
		location_name?: string | null;
		city?: string | null;
	}

	interface Props {
		data: {
			anchor_id?: string;
			kicker?: string;
			heading: string;
			subheading?: string;
			default_view?: 'month' | 'list';
			show_view_toggle?: boolean;
			include_past_events?: boolean;
			limit?: number;
			filter_event_type?: EventType | null;
			empty_state_text?: string;
			background_color?: 'paper' | 'cream';
			_events?: CalendarEvent[];
		};
	}

	let { data }: Props = $props();

	const entries = $derived<CalendarEntry[]>(
		(data._events ?? []).map((ev) => ({
			id: ev.id,
			title: ev.title,
			start: ev.start_date,
			end: ev.end_date,
			href: `/evenimente/${ev.slug}`,
			badge: eventTypeLabel(ev.event_type),
			meta: ev.city ?? null,
		})),
	);
</script>

<CalendarShell
	{entries}
	anchorId={data.anchor_id}
	kicker={data.kicker}
	heading={data.heading}
	subheading={data.subheading}
	defaultView={data.default_view}
	showViewToggle={data.show_view_toggle !== false}
	emptyStateText={data.empty_state_text ?? 'Niciun eveniment programat momentan.'}
	background={data.background_color ?? 'paper'}
/>
