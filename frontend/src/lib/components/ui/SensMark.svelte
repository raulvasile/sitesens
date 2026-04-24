<script lang="ts">
	interface Props {
		size?: number;
		label?: string;
	}

	let { size = 18, label = 'SENS' }: Props = $props();
</script>

<span
	class="sens-mark"
	style="font-size: {size}px;"
	aria-label={label}
>
	<span>{label}</span>
</span>
