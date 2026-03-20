<script lang="ts">
	interface Props {
		data: {
			height?: 'sm' | 'md' | 'lg' | 'xl';
		};
	}

	let { data }: Props = $props();
	const h = data.height ?? 'md';
</script>

<div class="spacer spacer--{h}" aria-hidden="true"></div>

<style>
	.spacer--sm { height: var(--space-4); }
	.spacer--md { height: var(--space-8); }
	.spacer--lg { height: var(--space-16); }
	.spacer--xl { height: var(--space-24, 6rem); }
</style>
