<script lang="ts">
	interface Props {
		data: {
			eyebrow?: string;
			meta?: string;
			title: string;
			title_italic?: string;
			lead?: string;
			continuation?: string;
			continuation_highlight?: string;
			background_color?: 'paper' | 'cream';
		};
	}

	let { data }: Props = $props();
	const bg = $derived(data.background_color ?? 'paper');
</script>

<section class="page-header page-header--{bg}">
	<div class="container">
		{#if data.eyebrow || data.meta}
			<div class="page-header__bar">
				<span class="page-header__eyebrow">{data.eyebrow ?? ''}</span>
				<span class="page-header__meta">{data.meta ?? ''}</span>
			</div>
		{/if}

		<h1 class="page-header__title">
			<span>{data.title}</span>
			{#if data.title_italic}
				<span class="page-header__title-italic"> {data.title_italic}</span>
			{/if}
		</h1>

		{#if data.lead}
			<p class="page-header__lead">{data.lead}</p>
		{/if}

		{#if data.continuation}
			<h2 class="page-header__continuation">
				{#if data.continuation_highlight}
					{data.continuation}
					<span class="page-header__highlight">{data.continuation_highlight}</span>
				{:else}
					{data.continuation}
				{/if}
			</h2>
		{/if}
	</div>
</section>

<style>
	.page-header {
		padding: var(--space-16) 0 var(--space-20);
	}
	.page-header--paper { background-color: var(--color-paper); color: var(--color-ink); }
	.page-header--cream { background-color: var(--color-cream); color: var(--color-ink); }

	.page-header__bar {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-10);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.6;
		flex-wrap: wrap;
	}

	.page-header__title {
		font-family: var(--font-display);
		font-size: clamp(3rem, 9vw, 8rem);
		line-height: 0.92;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0;
		max-width: 1200px;
	}
	.page-header__title-italic {
		font-style: italic;
		color: var(--color-green-deep);
	}

	.page-header__lead {
		font-family: var(--font-body);
		font-size: clamp(1.0625rem, 1.5vw, 1.25rem);
		line-height: 1.5;
		margin: var(--space-8) 0 0;
		max-width: 640px;
		color: var(--color-ink-soft);
	}

	.page-header__continuation {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 8vw, 7rem);
		line-height: 0.92;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--color-ink);
		margin: var(--space-6) 0 0;
		max-width: 1200px;
	}

	.page-header__highlight {
		display: inline-block;
		background-color: var(--color-lime);
		color: var(--color-ink);
		padding: 0 0.4em;
		transform: rotate(-1deg);
	}
</style>
