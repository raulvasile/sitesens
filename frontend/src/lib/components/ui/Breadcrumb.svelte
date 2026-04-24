<script lang="ts">
	/**
	 * Reusable breadcrumb component.
	 *
	 * Usage:
	 *   <Breadcrumb items={[
	 *     { label: 'Știri', href: '/stiri' },
	 *     { label: article.title }
	 *   ]} />
	 *
	 * Props:
	 *   items — array of crumbs (last one has no href = current page)
	 *   light — light variant for dark backgrounds (white text)
	 */
	interface Crumb {
		label: string;
		href?: string;
	}

	interface Props {
		items: Crumb[];
		light?: boolean;
	}

	let { items, light = false }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="breadcrumb" class:breadcrumb--light={light}>
	<a href="/" class="breadcrumb__link">Acasă</a>
	{#each items as crumb, i}
		<span class="breadcrumb__sep" aria-hidden="true">/</span>
		{#if crumb.href}
			<a href={crumb.href} class="breadcrumb__link">{crumb.label}</a>
		{:else}
			<span class="breadcrumb__current" aria-current="page">{crumb.label}</span>
		{/if}
	{/each}
</nav>

<style>
	.breadcrumb {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
		margin-bottom: var(--space-6);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.breadcrumb__link {
		color: var(--color-ink-soft);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.breadcrumb__link:hover {
		color: var(--color-ink);
	}

	.breadcrumb__sep {
		color: var(--color-ink-soft);
		opacity: 0.5;
		user-select: none;
	}

	.breadcrumb__current {
		color: var(--color-ink);
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 280px;
	}

	/* Light variant — for dark backgrounds (hero sections) */
	.breadcrumb--light {
		color: rgba(245, 241, 232, 0.7);
	}

	.breadcrumb--light .breadcrumb__link {
		color: rgba(245, 241, 232, 0.7);
	}

	.breadcrumb--light .breadcrumb__link:hover {
		color: var(--color-lime);
	}

	.breadcrumb--light .breadcrumb__sep {
		color: rgba(245, 241, 232, 0.4);
	}

	.breadcrumb--light .breadcrumb__current {
		color: var(--color-cream);
	}
</style>
