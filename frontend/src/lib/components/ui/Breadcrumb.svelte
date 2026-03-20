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
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--space-6);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.breadcrumb__link {
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.breadcrumb__link:hover {
		color: var(--color-green-dark);
	}

	.breadcrumb__sep {
		color: var(--color-text-muted);
		opacity: 0.5;
		user-select: none;
	}

	.breadcrumb__current {
		color: var(--color-text);
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 280px;
	}

	/* Light variant — for dark backgrounds (hero sections) */
	.breadcrumb--light {
		color: rgba(255, 255, 255, 0.7);
	}

	.breadcrumb--light .breadcrumb__link {
		color: rgba(255, 255, 255, 0.7);
	}

	.breadcrumb--light .breadcrumb__link:hover {
		color: var(--color-white);
	}

	.breadcrumb--light .breadcrumb__sep {
		color: rgba(255, 255, 255, 0.4);
	}

	.breadcrumb--light .breadcrumb__current {
		color: var(--color-white);
	}
</style>
