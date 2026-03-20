<script lang="ts">
	interface Props {
		visible?: boolean;
	}
	let { visible = false }: Props = $props();
</script>

{#if visible}
	<div class="preview-banner" role="status">
		<span>Mod previzualizare</span>
		<a href={typeof window !== 'undefined' ? window.location.pathname : '/'} class="preview-banner__exit">
			Ieși din preview
		</a>
	</div>
{/if}

<style>
	.preview-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		background-color: #f59e0b;
		color: #000;
		font-size: var(--text-sm);
		font-weight: 600;
		text-align: center;
	}
	.preview-banner__exit {
		padding: 0.25rem 0.75rem;
		background-color: #000;
		color: #fff;
		border-radius: var(--radius-md);
		text-decoration: none;
		font-size: var(--text-xs);
	}
	.preview-banner__exit:hover {
		background-color: #333;
	}
</style>
