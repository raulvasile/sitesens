<script lang="ts">
	import CalendarShell from './CalendarShell.svelte';
	import type { CalendarBadgeVariant, CalendarEntry } from '$lib/calendar';

	interface RawEntry {
		id: number;
		title: string;
		start_date: string;
		end_date?: string | null;
		description?: string | null;
		location?: string | null;
		url?: string | null;
		category?: string | null;
		accent_color?: CalendarBadgeVariant | null;
	}

	interface Props {
		data: {
			anchor_id?: string;
			kicker?: string;
			heading: string;
			subheading?: string;
			default_view?: 'month' | 'list';
			show_view_toggle?: boolean;
			empty_state_text?: string;
			background_color?: 'paper' | 'cream';
			entries?: RawEntry[];
		};
	}

	let { data }: Props = $props();

	function isExternal(url: string): boolean {
		return /^https?:\/\//i.test(url);
	}

	const entries = $derived<CalendarEntry[]>(
		(data.entries ?? []).map((e) => {
			const meta = e.location ?? e.description ?? null;
			return {
				id: e.id,
				title: e.title,
				start: e.start_date,
				end: e.end_date,
				href: e.url || null,
				external: e.url ? isExternal(e.url) : false,
				badge: e.category || null,
				badgeVariant: e.accent_color ?? 'default',
				meta,
			};
		}),
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
	emptyStateText={data.empty_state_text ?? 'Niciun moment programat momentan.'}
	background={data.background_color ?? 'paper'}
/>
