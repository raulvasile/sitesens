<script lang="ts">
	interface Props {
		title?: string;
		message?: string;
		retryHref?: string;
	}

	let {
		title = 'A apărut o eroare',
		message = 'Nu am putut încărca conținutul. Încearcă din nou mai târziu.',
		retryHref
	}: Props = $props();
</script>

<div class="error-state">
	<div class="error-state__icon">⚠️</div>
	<h2 class="error-state__title">{title}</h2>
	<p class="error-state__message">{message}</p>
	<div class="error-state__actions">
		{#if retryHref}
			<a href={retryHref} class="btn btn-primary">Reîncearcă</a>
		{/if}
		<a href="/" class="btn btn-secondary">Acasă</a>
	</div>
</div>

<style>
	.error-state {
		text-align: center;
		padding: var(--space-16) var(--space-4);
		max-width: 480px;
		margin: 0 auto;
	}
	.error-state__icon {
		font-size: 3rem;
		margin-bottom: var(--space-4);
	}
	.error-state__title {
		font-size: var(--text-xl);
		color: var(--color-green-dark);
		margin-bottom: var(--space-3);
	}
	.error-state__message {
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: var(--space-6);
	}
	.error-state__actions {
		display: flex;
		justify-content: center;
		gap: var(--space-3);
	}
</style>
