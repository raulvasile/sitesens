<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	interface Props {
		/** 'news' | 'event' | 'team' */
		variant?: 'news' | 'event' | 'team';
	}

	let { variant = 'news' }: Props = $props();
</script>

{#if variant === 'news'}
	<div class="card-skeleton card-skeleton--news" aria-hidden="true">
		<Skeleton variant="image" height="180px" />
		<div class="card-skeleton__body">
			<Skeleton variant="text" width="60px" height="1.25rem" />
			<Skeleton variant="title" width="90%" />
			<Skeleton variant="text" count={2} />
			<Skeleton variant="text" width="80px" height="0.75rem" />
		</div>
	</div>
{:else if variant === 'event'}
	<div class="card-skeleton card-skeleton--event" aria-hidden="true">
		<Skeleton variant="card" width="56px" height="56px" />
		<div class="card-skeleton__body">
			<Skeleton variant="text" width="60px" height="1.25rem" />
			<Skeleton variant="title" width="85%" height="1.25rem" />
			<Skeleton variant="text" width="120px" height="0.75rem" />
		</div>
	</div>
{:else if variant === 'team'}
	<div class="card-skeleton card-skeleton--team" aria-hidden="true">
		<Skeleton variant="circle" height="96px" />
		<Skeleton variant="title" width="70%" height="1.25rem" />
		<Skeleton variant="text" width="50%" height="0.875rem" />
		<Skeleton variant="text" count={2} />
	</div>
{/if}

<style>
	.card-skeleton--news {
		border-radius: var(--radius-md);
		overflow: hidden;
		background-color: var(--color-bg);
	}

	.card-skeleton--news .card-skeleton__body {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.card-skeleton--event {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-4);
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.card-skeleton--event .card-skeleton__body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.card-skeleton--team {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-6);
		background-color: var(--color-bg);
		border-radius: var(--radius-md);
		text-align: center;
	}
</style>
