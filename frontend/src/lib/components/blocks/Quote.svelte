<script lang="ts">
	interface Props { data: { text: string; author?: string; role?: string }; }
	let { data }: Props = $props();
</script>

<section class="quote-block">
	<div class="container">
		<blockquote class="quote">
			<p class="quote__text">„{data.text}"</p>
			{#if data.author}
				<footer class="quote__footer">
					<strong>{data.author}</strong>
					{#if data.role}<span class="quote__role">, {data.role}</span>{/if}
				</footer>
			{/if}
		</blockquote>
	</div>
</section>

<style>
	.quote-block { padding-block: var(--space-12); }
	.quote {
		max-width: 720px;
		margin-inline: auto;
		text-align: center;
		border-left: none;
		padding: var(--space-8);
		background-color: var(--color-white);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
		border-top: 4px solid var(--color-green-leaf);
	}
	.quote__text {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--color-green-dark);
		line-height: 1.4;
		margin-bottom: var(--space-4);
	}
	.quote__footer { font-size: var(--text-sm); color: var(--color-text-muted); }
	.quote__role { color: var(--color-text-muted); }
</style>
