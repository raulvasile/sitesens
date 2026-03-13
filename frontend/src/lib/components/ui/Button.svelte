<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		loading?: boolean;
		class?: string;
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		loading = false,
		class: className = '',
		children,
		onclick
	}: Props = $props();

	const classes = $derived(
		['btn', `btn-${variant}`, size !== 'md' ? `btn-${size}` : '', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if href}
	<a {href} class={classes} aria-disabled={disabled}>
		{#if loading}<span class="btn-spinner" aria-hidden="true"></span>{/if}
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} {disabled} {onclick} aria-busy={loading}>
		{#if loading}<span class="btn-spinner" aria-hidden="true"></span>{/if}
		{@render children()}
	</button>
{/if}

<style>
	.btn-sm {
		font-size: var(--text-xs);
		padding: 0.5rem 1rem;
	}

	.btn-lg {
		font-size: var(--text-base);
		padding: 1rem 2rem;
	}

	.btn-spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
