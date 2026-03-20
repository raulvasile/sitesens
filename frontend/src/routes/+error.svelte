<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	let retrying = $state(false);

	async function retry() {
		retrying = true;
		await invalidateAll();
		retrying = false;
	}
</script>

<svelte:head>
	<title>
		{$page.status === 404 ? 'Pagina nu a fost găsită' : 'Eroare'} — SENS
	</title>
</svelte:head>

<div class="container error-page">
	<div class="error-page__content">
		<span class="error-page__code">{$page.status}</span>
		{#if $page.status === 404}
			<h1>Pagina nu a fost găsită</h1>
			<p>Ne pare rău, dar pagina pe care o cauți nu există sau a fost mutată.</p>
		{:else if $page.status === 503}
			<h1>Serviciu temporar indisponibil</h1>
			<p>{$page.error?.message ?? 'Serverul nu este disponibil momentan. Încearcă din nou în câteva momente.'}</p>
		{:else}
			<h1>A apărut o eroare</h1>
			<p>{$page.error?.message ?? 'Ne pare rău, ceva nu a funcționat corect. Încearcă din nou mai târziu.'}</p>
		{/if}
		<div class="error-page__actions">
			{#if $page.status !== 404}
				<button class="btn btn-primary" onclick={retry} disabled={retrying}>
					{retrying ? 'Se reîncearcă...' : 'Reîncearcă'}
				</button>
			{/if}
			<a href="/" class="btn btn-secondary">Pagina principală</a>
		</div>
	</div>
</div>

<style>
	.error-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 60vh;
		text-align: center;
	}
	.error-page__content {
		max-width: 480px;
	}
	.error-page__code {
		display: block;
		font-size: 5rem;
		font-weight: 800;
		color: var(--color-green-leaf);
		line-height: 1;
		margin-bottom: var(--space-4);
		font-family: var(--font-display);
	}
	.error-page h1 {
		font-size: var(--text-2xl);
		margin-bottom: var(--space-3);
	}
	.error-page p {
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: var(--space-8);
	}
	.error-page__actions {
		display: flex;
		justify-content: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
</style>
