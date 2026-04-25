<script lang="ts">
	import { SOCIAL_ICONS, platformKey, type SocialPlatform } from '$lib/socialIcons';

	interface Props {
		platform: string;
		size?: number;
	}

	let { platform, size = 20 }: Props = $props();

	const key = $derived(platformKey(platform));
	const def = $derived<{ label: string; path: string } | null>(key ? SOCIAL_ICONS[key as SocialPlatform] : null);
</script>

{#if def}
	<svg
		viewBox="0 0 24 24"
		width={size}
		height={size}
		fill="currentColor"
		role="img"
		aria-label={def.label}
	>
		<path d={def.path} />
	</svg>
{/if}
