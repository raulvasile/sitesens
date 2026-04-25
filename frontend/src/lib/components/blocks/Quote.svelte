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
	.quote-block {
		padding-block: var(--space-16);
		background-color: var(--color-paper);
	}
	.quote {
		max-width: 800px;
		margin-inline: auto;
		text-align: left;
		padding: var(--space-8) var(--space-4);
		border-left: 4px solid var(--color-lime);
	}
	.quote__text {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 2.5vw, 2.25rem);
		font-weight: 400;
		color: var(--color-ink);
		line-height: 1.1;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		margin-bottom: var(--space-5);
	}
	.quote__footer {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}
	.quote__footer strong {
		font-weight: 500;
		color: var(--color-ink);
	}
	.quote__role { color: var(--color-ink-soft); }

	/* mobile-tighten:.quote-block */
	@media (max-width: 767px) {
		.quote-block { padding-block: var(--space-10); }
	}
</style>
