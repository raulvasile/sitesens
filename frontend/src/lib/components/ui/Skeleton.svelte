<script lang="ts">
	interface Props {
		variant?: 'text' | 'title' | 'image' | 'card' | 'circle';
		width?: string;
		height?: string;
		count?: number;
	}

	let {
		variant = 'text',
		width = '100%',
		height,
		count = 1
	}: Props = $props();

	const defaultHeights: Record<string, string> = {
		text: '1rem',
		title: '2rem',
		image: '200px',
		card: '280px',
		circle: '48px'
	};

	const h = height ?? defaultHeights[variant] ?? '1rem';
</script>

{#each Array(count) as _}
	<div
		class="skeleton skeleton--{variant}"
		style="width: {variant === 'circle' ? h : width}; height: {h};"
		aria-hidden="true"
	></div>
{/each}

<style>
	.skeleton {
		background: linear-gradient(90deg, var(--color-skeleton, #e8ece6) 25%, #f0f4ee 50%, var(--color-skeleton, #e8ece6) 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s ease-in-out infinite;
		border-radius: var(--radius-md);
	}
	.skeleton--text {
		border-radius: var(--radius-sm, 4px);
		margin-bottom: var(--space-2);
	}
	.skeleton--text:last-child {
		width: 70% !important;
	}
	.skeleton--title {
		border-radius: var(--radius-sm, 4px);
		margin-bottom: var(--space-4);
	}
	.skeleton--image {
		border-radius: var(--radius-md);
	}
	.skeleton--card {
		border-radius: var(--radius-md);
	}
	.skeleton--circle {
		border-radius: 50%;
	}

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>
